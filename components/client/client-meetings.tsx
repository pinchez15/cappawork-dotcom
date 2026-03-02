"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Calendar,
  Video,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Check,
  Loader2,
} from "lucide-react";
import {
  fetchEventTypes,
  fetchAvailableTimes,
  bookMeetingAction,
} from "@/server/actions/meetings";
import { toast } from "sonner";

interface Meeting {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  location_url: string | null;
  status: string;
  invitee_name: string | null;
  invitee_email: string | null;
  event_type_name: string | null;
  calendly_cancel_url: string | null;
}

interface EventType {
  uri: string;
  name: string;
  slug: string;
  duration: number;
  description_plain: string | null;
  active: boolean;
  color: string;
}

interface AvailableTime {
  status: string;
  start_time: string;
  invitees_remaining: number;
}

interface ClientMeetingsProps {
  projectId: string;
  meetings: Meeting[];
  currentUserName?: string;
  currentUserEmail?: string;
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDateHeading(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

type BookingStep = "select-type" | "select-time" | "confirm" | "done";

export function ClientMeetings({
  projectId,
  meetings,
  currentUserName = "",
  currentUserEmail = "",
}: ClientMeetingsProps) {
  const [pastOpen, setPastOpen] = useState(false);

  // Booking flow state
  const [bookingStep, setBookingStep] = useState<BookingStep>("select-type");
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [selectedType, setSelectedType] = useState<EventType | null>(null);
  const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const [isLoadingTypes, setIsLoadingTypes] = useState(false);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const now = new Date();
  const upcoming = meetings
    .filter((m) => m.status === "scheduled" && new Date(m.start_time) >= now)
    .sort(
      (a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );
  const past = meetings
    .filter((m) => m.status !== "scheduled" || new Date(m.start_time) < now)
    .sort(
      (a, b) =>
        new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
    );

  // Load event types on mount
  useEffect(() => {
    loadEventTypes();
  }, []);

  async function loadEventTypes() {
    setIsLoadingTypes(true);
    try {
      const types = await fetchEventTypes();
      setEventTypes(types);
    } catch (err: any) {
      toast.error("Failed to load meeting types");
    } finally {
      setIsLoadingTypes(false);
    }
  }

  async function loadAvailableTimes(eventType: EventType, start: Date) {
    setIsLoadingTimes(true);
    try {
      const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
      const times = await fetchAvailableTimes(
        eventType.uri,
        start.toISOString(),
        end.toISOString()
      );
      setAvailableTimes(times.filter((t) => t.status === "available"));
    } catch (err: any) {
      toast.error("Failed to load available times");
    } finally {
      setIsLoadingTimes(false);
    }
  }

  function handleSelectType(eventType: EventType) {
    setSelectedType(eventType);
    setBookingStep("select-time");
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    setWeekStart(start);
    loadAvailableTimes(eventType, start);
  }

  function handleWeekNav(direction: "prev" | "next") {
    const newStart = new Date(weekStart);
    newStart.setDate(newStart.getDate() + (direction === "next" ? 7 : -7));
    // Don't go into the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (newStart < today) return;
    setWeekStart(newStart);
    if (selectedType) {
      loadAvailableTimes(selectedType, newStart);
    }
  }

  function handleSelectTime(startTime: string) {
    setSelectedTime(startTime);
    setBookingStep("confirm");
  }

  async function handleConfirmBooking() {
    if (!selectedType || !selectedTime) return;

    setIsBooking(true);
    try {
      await bookMeetingAction({
        projectId,
        eventTypeUri: selectedType.uri,
        startTime: selectedTime,
        inviteeName: currentUserName,
        inviteeEmail: currentUserEmail,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      toast.success("Meeting booked!");
      setBookingStep("done");
    } catch (err: any) {
      toast.error(err.message || "Failed to book meeting");
    } finally {
      setIsBooking(false);
    }
  }

  function resetBooking() {
    setBookingStep("select-type");
    setSelectedType(null);
    setSelectedTime(null);
    setAvailableTimes([]);
  }

  // Group available times by date
  const timesByDate = availableTimes.reduce<Record<string, AvailableTime[]>>(
    (acc, slot) => {
      const dateKey = new Date(slot.start_time).toDateString();
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(slot);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-6">
      {/* Upcoming Meetings */}
      <div>
        <h2 className="text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Meetings
        </h2>

        {upcoming.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Calendar className="h-8 w-8 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-500">No upcoming meetings</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {upcoming.map((m) => (
              <Card key={m.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-stone-900">
                        {m.title}
                      </h3>
                      <p className="text-sm text-stone-500 mt-1">
                        {formatDateTime(m.start_time)} —{" "}
                        {formatTime(m.end_time)}
                      </p>
                      {m.event_type_name && (
                        <Badge variant="secondary" className="mt-2 text-xs">
                          {m.event_type_name}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {m.location_url && (
                        <a
                          href={m.location_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Video className="h-4 w-4 mr-1" />
                            Join
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Book a Meeting */}
      <Card>
        <CardHeader>
          <CardTitle>Book a Meeting</CardTitle>
          <CardDescription>
            Schedule a time to connect with the CappaWork team
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Step 1: Select Event Type */}
          {bookingStep === "select-type" && (
            <div>
              {isLoadingTypes ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
                </div>
              ) : eventTypes.length === 0 ? (
                <p className="text-sm text-stone-500 py-4">
                  No meeting types available at this time.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {eventTypes.map((et) => (
                    <button
                      key={et.uri}
                      onClick={() => handleSelectType(et)}
                      className="flex items-start gap-3 p-4 border rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-colors text-left"
                    >
                      <div
                        className="w-2 h-2 rounded-full mt-2 shrink-0"
                        style={{ backgroundColor: et.color || "#3b82f6" }}
                      />
                      <div>
                        <div className="font-medium text-stone-900">
                          {et.name}
                        </div>
                        <div className="text-sm text-stone-500 flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" />
                          {et.duration} min
                        </div>
                        {et.description_plain && (
                          <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                            {et.description_plain}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Select Time */}
          {bookingStep === "select-time" && selectedType && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={resetBooking}
                  className="text-sm text-stone-500 hover:text-stone-700 flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
                <div className="text-sm font-medium">
                  {selectedType.name} — {selectedType.duration} min
                </div>
                <div />
              </div>

              {/* Week navigation */}
              <div className="flex items-center justify-between mb-4 px-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleWeekNav("prev")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">
                  {weekStart.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  —{" "}
                  {new Date(
                    weekStart.getTime() + 6 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleWeekNav("next")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {isLoadingTimes ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
                </div>
              ) : Object.keys(timesByDate).length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-stone-500">
                    No available times this week
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleWeekNav("next")}
                  >
                    Check next week
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {Object.entries(timesByDate).map(([dateKey, slots]) => (
                    <div key={dateKey}>
                      <div className="text-sm font-medium text-stone-700 mb-2">
                        {formatDateHeading(slots[0].start_time)}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {slots.map((slot) => (
                          <Button
                            key={slot.start_time}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelectTime(slot.start_time)}
                            className="text-sm"
                          >
                            {formatTime(slot.start_time)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Confirm */}
          {bookingStep === "confirm" && selectedType && selectedTime && (
            <div className="space-y-4">
              <button
                onClick={() => setBookingStep("select-time")}
                className="text-sm text-stone-500 hover:text-stone-700 flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>

              <div className="p-4 border rounded-lg space-y-2">
                <div className="font-medium text-stone-900">
                  {selectedType.name}
                </div>
                <div className="text-sm text-stone-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {selectedType.duration} minutes
                </div>
                <div className="text-sm text-stone-500 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDateTime(selectedTime)}
                </div>
              </div>

              <Button
                onClick={handleConfirmBooking}
                disabled={isBooking}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isBooking ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Check className="h-4 w-4 mr-2" />
                )}
                Confirm Booking
              </Button>
            </div>
          )}

          {/* Step 4: Done */}
          {bookingStep === "done" && (
            <div className="text-center py-6 space-y-3">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div className="font-medium text-stone-900">Meeting Booked!</div>
              <p className="text-sm text-stone-500">
                You&apos;ll receive a calendar invite at {currentUserEmail}
              </p>
              <Button variant="outline" onClick={resetBooking}>
                Book Another
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Past Meetings */}
      {past.length > 0 && (
        <Collapsible open={pastOpen} onOpenChange={setPastOpen}>
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 transition-colors w-full">
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  pastOpen ? "rotate-180" : ""
                }`}
              />
              Past Meetings ({past.length})
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-2 mt-3">
              {past.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between py-3 px-4 border rounded-lg"
                >
                  <div>
                    <div className="text-sm font-medium text-stone-700">
                      {m.title}
                    </div>
                    <div className="text-xs text-stone-500">
                      {formatDateTime(m.start_time)}
                    </div>
                  </div>
                  <Badge
                    className={
                      m.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : m.status === "cancelled"
                        ? "bg-stone-100 text-stone-500"
                        : "bg-blue-100 text-blue-800"
                    }
                  >
                    {m.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
