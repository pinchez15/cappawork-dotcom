# Bonsai

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/nate-cappaworkcos-projects/v0-bonsai)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/zW5qow9Rwn4)

## Overview

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## Deployment

Your project is live at:

**[https://vercel.com/nate-cappaworkcos-projects/v0-bonsai](https://vercel.com/nate-cappaworkcos-projects/v0-bonsai)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/zW5qow9Rwn4](https://v0.dev/chat/projects/zW5qow9Rwn4)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository


## To do
# CappaWork Launch Checklist

## 🚀 Final Launch Steps

### Content Updates (Complete Before Deployment)
- [ ] **Update Calendly link** - Replace with correct booking URL
- [ ] **Update work portfolio screenshots** - Replace placeholder images with actual live screenshots
- [ ] **Update work portfolio link** - Change to live version URL
- [ ] **Final content review** - Proofread all copy and links

### Deployment to Vercel
- [ ] Connect GitHub repository to Vercel
- [ ] Deploy initial version
- [ ] Test all functionality on Vercel staging URL
- [ ] Add `cappawork.com` as custom domain in Vercel dashboard
- [ ] **Record Vercel DNS requirements** (save the IP and CNAME values provided)
- [ ] Test contact form works on Vercel staging URL

### Pre-Launch Testing
- [ ] Test website on desktop, tablet, and mobile
- [ ] Verify all links work correctly
- [ ] Test contact form sends emails to correct address
- [ ] Check page load speed and performance
- [ ] Verify portfolio links and screenshots display correctly

## 🌐 Domain Transfer Process

### DNS Backup (CRITICAL - Do First)
- [ ] **Screenshot current Shopify DNS settings** and save to project folder
- [ ] Document current A record: `23.227.38.73` (Shopify IP)
- [ ] Document current www CNAME: `shops.myshopify.com`
- [ ] Note any MX records for email (keep these)

### Launch Day DNS Switch
**When ready to go live:**
- [ ] Log into Shopify Admin → Settings → Domains → cappawork.com → Advanced settings
- [ ] **Update A record:** Change `@` from `23.227.38.73` to Vercel's provided IP
- [ ] **Update www CNAME:** Change from `shops.myshopify.com` to your Vercel app URL
- [ ] **Keep existing MX records** (if you have email setup)
- [ ] **Remove unnecessary CNAMEs** (Shopify-specific domain keys can be deleted)

### Post-Launch Verification
- [ ] Wait 2-24 hours for DNS propagation
- [ ] Test `cappawork.com` loads new site
- [ ] Test `www.cappawork.com` also works
- [ ] Use DNS checker (whatsmydns.net) to verify global propagation
- [ ] Test contact form on live domain
- [ ] Monitor for any issues first 48 hours

### Complete Domain Transfer to Namecheap
**After site is stable (can be done later):**
- [ ] Contact Shopify support to unlock domain
- [ ] Request EPP/authorization code from Shopify
- [ ] Log into Namecheap account (where workportfolio.io is hosted)
- [ ] Initiate domain transfer with EPP code
- [ ] Pay transfer fee (includes 1-year renewal)
- [ ] Wait 5-7 days for transfer completion
- [ ] Update DNS at Namecheap to point to Vercel (same settings as Shopify)

## 📋 Launch Day Checklist

### Final Pre-Flight Check
- [ ] All content updates completed
- [ ] Site deployed and tested on Vercel
- [ ] DNS records ready to switch
- [ ] Backup of current DNS settings saved
- [ ] Contact form tested and working

### Go Live Sequence
1. [ ] Update DNS records in Shopify
2. [ ] Announce on social media (optional)
3. [ ] Monitor DNS propagation
4. [ ] Test live site functionality
5. [ ] Celebrate! 🎉

## 🔧 Technical Details

### Current DNS (Shopify)
```
A Record: @ → 23.227.38.73
CNAME: www → shops.myshopify.com
```

### New DNS (Vercel)
```
A Record: @ → [VERCEL_IP_FROM_DASHBOARD]
CNAME: www → [YOUR_APP].vercel.app
```

## 📞 Emergency Contacts
- **Shopify Support:** Available in admin dashboard
- **Vercel Support:** docs.vercel.com
- **Namecheap Support:** Available in account dashboard

## 🔄 Rollback Plan
If issues arise after DNS switch:
1. Revert A record back to `23.227.38.73`
2. Revert www CNAME back to `shops.myshopify.com`
3. Wait for DNS to propagate back (2-24 hours)

## ✅ Success Metrics
- [ ] cappawork.com loads new landing page
- [ ] Contact form successfully sends emails
- [ ] Site loads quickly on all devices
- [ ] All portfolio links and images work correctly
- [ ] No broken links or missing content

---

**Next Action:** Complete content updates, then deploy to Vercel!