/**
 * Google Meet → CappaWork discovery pass.
 *
 * Runs as you in Apps Script every 15 minutes. Finds your Meet calls that ended in the last
 * 48 hours with a finished native transcript, keeps the ones whose calendar title matches
 * TITLE_PATTERN, and posts the transcript to /api/webhooks/discovery-transcript. The site
 * matches the lead by attendee email domain and starts the post-call job.
 *
 * Uses the Meet REST API transcript entries rather than the Google Doc: each entry carries
 * its speaker and start time, so every quote gets a real timestamp.
 *
 * Setup (once):
 *  1. script.google.com → New project. Paste this file and appsscript.json (Project Settings →
 *     "Show appsscript.json manifest file in editor").
 *  2. Link a standard Google Cloud project (Project Settings → Google Cloud Platform project),
 *     with the Google Meet REST API and Google Calendar API enabled and an Internal OAuth
 *     consent screen. Apps Script's default project can't enable the Meet API.
 *  3. Project Settings → Script properties:
 *       WEBHOOK_URL      https://cappawork.com/api/webhooks/discovery-transcript
 *       WEBHOOK_SECRET   same value as DISCOVERY_WEBHOOK_SECRET on Vercel
 *       TITLE_PATTERN    optional regex for calendar titles, default "discovery"
 *       NOTIFY_EMAIL     optional; where to send "couldn't match a lead" notes (default: you)
 *  4. Run setup() once and approve the scopes. Run syncTranscripts() to test.
 */

const LOOKBACK_HOURS = 48;
const DONE_TTL_DAYS = 30;
const MEET = 'https://meet.googleapis.com/v2/';
const CALENDAR = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

function setup() {
  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === 'syncTranscripts')
    .forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('syncTranscripts').timeBased().everyMinutes(15).create();
  Logger.log('Trigger set: syncTranscripts every 15 minutes.');
}

function syncTranscripts() {
  const props = PropertiesService.getScriptProperties();
  const url = props.getProperty('WEBHOOK_URL');
  const secret = props.getProperty('WEBHOOK_SECRET');
  if (!url || !secret) throw new Error('Set WEBHOOK_URL and WEBHOOK_SECRET in Script properties.');
  const titlePattern = new RegExp(props.getProperty('TITLE_PATTERN') || 'discovery', 'i');

  pruneDone_(props);

  const since = new Date(Date.now() - LOOKBACK_HOURS * 3600 * 1000).toISOString();
  const records = meetList_('conferenceRecords?filter=' + encodeURIComponent('end_time>="' + since + '"'), 'conferenceRecords');

  records.forEach((record) => {
    const transcripts = meetList_(record.name + '/transcripts', 'transcripts').filter((t) => t.state === 'FILE_GENERATED');

    transcripts.forEach((transcript) => {
      const doneKey = 'done:' + transcript.name;
      if (props.getProperty(doneKey)) return;

      const event = findCalendarEvent_(record);
      const title = (event && event.summary) || '';
      if (!titlePattern.test(title)) {
        props.setProperty(doneKey, String(Date.now())); // not a discovery call
        return;
      }

      const attendees = ((event && event.attendees) || [])
        .filter((a) => !a.self && !a.resource && a.email)
        .map((a) => a.email);

      const res = UrlFetchApp.fetch(url, {
        method: 'post',
        contentType: 'application/json',
        headers: { Authorization: 'Bearer ' + secret },
        muteHttpExceptions: true,
        payload: JSON.stringify({
          source: 'google_meet',
          source_ref: transcript.name,
          meeting_title: title,
          meeting_started_at: record.startTime,
          attendee_emails: attendees,
          transcript: formatTranscript_(record, transcript, title),
        }),
      });

      const code = res.getResponseCode();
      if (code === 200 || code === 202) {
        props.setProperty(doneKey, String(Date.now()));
        Logger.log('Queued: ' + title + ' → ' + res.getContentText());
      } else if (code === 404) {
        props.setProperty(doneKey, String(Date.now()));
        notifyUnmatched_(props, title, record, attendees, transcript);
      } else {
        // Left undone, so the next run retries.
        Logger.log('Failed (' + code + ') for ' + title + ': ' + res.getContentText());
      }
    });
  });
}

// ─── Meet ───────────────────────────────────────────────────────────────────

function meetGet_(path) {
  const res = UrlFetchApp.fetch(MEET + path, {
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
    muteHttpExceptions: true,
  });
  if (res.getResponseCode() !== 200) {
    throw new Error('Meet API ' + res.getResponseCode() + ' on ' + path + ': ' + res.getContentText());
  }
  return JSON.parse(res.getContentText());
}

function meetList_(path, key) {
  const out = [];
  let token = '';
  do {
    const sep = path.indexOf('?') === -1 ? '?' : '&';
    const page = meetGet_(path + sep + 'pageSize=100' + (token ? '&pageToken=' + encodeURIComponent(token) : ''));
    (page[key] || []).forEach((item) => out.push(item));
    token = page.nextPageToken || '';
  } while (token);
  return out;
}

function formatTranscript_(record, transcript, title) {
  const start = new Date(record.startTime).getTime();
  const names = {};
  const speaker = (participant) => {
    if (!names[participant]) {
      const p = meetGet_(participant);
      const who = p.signedinUser || p.anonymousUser || p.phoneUser || {};
      names[participant] = who.displayName || 'Unknown speaker';
    }
    return names[participant];
  };

  // Merge back-to-back entries from the same speaker; keep the first timestamp.
  const lines = [];
  let last = null;
  meetList_(transcript.name + '/entries', 'transcriptEntries').forEach((e) => {
    const name = speaker(e.participant);
    if (last && last.name === name) {
      last.text += ' ' + e.text;
      return;
    }
    last = { at: clock_(new Date(e.startTime).getTime() - start), name: name, text: e.text };
    lines.push(last);
  });

  const header = ['Meeting: ' + title, 'Date: ' + record.startTime, ''];
  return header.concat(lines.map((l) => '[' + l.at + '] ' + l.name + ': ' + l.text)).join('\n');
}

function clock_(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const pad = (n) => String(n).padStart(2, '0');
  return pad(Math.floor(s / 3600)) + ':' + pad(Math.floor((s % 3600) / 60)) + ':' + pad(s % 60);
}

// ─── Calendar ───────────────────────────────────────────────────────────────

function findCalendarEvent_(record) {
  const space = meetGet_(record.space);
  const code = space.meetingCode;
  const start = new Date(record.startTime).getTime();
  const end = new Date(record.endTime || record.startTime).getTime();
  const query = [
    'timeMin=' + encodeURIComponent(new Date(start - 2 * 3600 * 1000).toISOString()),
    'timeMax=' + encodeURIComponent(new Date(end + 3600 * 1000).toISOString()),
    'singleEvents=true',
    'maxResults=50',
  ].join('&');

  const res = UrlFetchApp.fetch(CALENDAR + '?' + query, {
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
    muteHttpExceptions: true,
  });
  if (res.getResponseCode() !== 200) {
    throw new Error('Calendar API ' + res.getResponseCode() + ': ' + res.getContentText());
  }
  const items = JSON.parse(res.getContentText()).items || [];
  return (
    items.find((ev) => {
      const conf = ev.conferenceData || {};
      return conf.conferenceId === code || (ev.hangoutLink || '').indexOf(code) !== -1;
    }) || null
  );
}

// ─── Housekeeping ───────────────────────────────────────────────────────────

function notifyUnmatched_(props, title, record, attendees, transcript) {
  const to = props.getProperty('NOTIFY_EMAIL') || Session.getEffectiveUser().getEmail();
  const doc = transcript.docsDestination && transcript.docsDestination.exportUri;
  MailApp.sendEmail(
    to,
    'Transcript not matched to a CRM lead: ' + title,
    [
      'No CRM account matched these attendees, so the discovery pass did not run.',
      '',
      'Meeting: ' + title,
      'Started: ' + record.startTime,
      'Attendees: ' + (attendees.join(', ') || 'none on the calendar event'),
      doc ? 'Transcript: ' + doc : '',
      '',
      'Set the account domain in the CRM, or paste the transcript into the Discovery tab.',
    ].join('\n')
  );
}

function pruneDone_(props) {
  const cutoff = Date.now() - DONE_TTL_DAYS * 86400 * 1000;
  const all = props.getProperties();
  Object.keys(all).forEach((k) => {
    if (k.indexOf('done:') === 0 && Number(all[k]) < cutoff) props.deleteProperty(k);
  });
}
