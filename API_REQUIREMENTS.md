# API Requirements - CommandCentered

**Purpose:** Track external API integrations needed as features are built
**Updated:** As each phase completes
**Integration Priority:** Phase 14 (Testing & Polish) or earlier if critical

---

## 📋 API Integration Checklist

### Phase 0: Lead Generation (Apollo.ai)
- [ ] **Apollo.ai API**
  - Purpose: Lead search and enrichment (Lead Finder page)
  - Required: API key
  - Endpoints: `/people/search`, `/organizations/search`
  - Pricing: $99/month (included in cost estimate)
  - Priority: HIGH (Phase 12)
  - Status: Not integrated (stub with mock data)

### Phase 6: Communications (Mailgun)
- [ ] **Mailgun API**
  - Purpose: Transactional email sending
  - Required: API key, domain verification
  - Endpoints: `/messages`, `/events` (webhooks)
  - Pricing: $35/month (included in cost estimate)
  - Priority: HIGH (Phase 6)
  - Status: Not integrated (log emails to console)

### Phase 7: Files (Vimeo)
- [ ] **Vimeo API**
  - Purpose: Livestream event creation and management
  - Required: Access token, pro/premium account
  - Endpoints: `/me/live_events`, `/videos/{id}/embed`
  - Pricing: TBD (depends on plan)
  - Priority: MEDIUM (Phase 7)
  - Status: Not integrated (mock livestream data)

### Phase 7: Files (Google Drive)
- [ ] **Google Drive API**
  - Purpose: Direct upload links for operators
  - Required: Service account credentials, OAuth setup
  - Endpoints: `/files`, `/permissions`
  - Pricing: Free (within limits)
  - Priority: HIGH (Phase 7)
  - Status: Not integrated (generate placeholder links)

### Phase 6: Communications (Telegram)
- [ ] **Telegram Bot API**
  - Purpose: Auto-create event groups with operators
  - Required: Bot token (via @BotFather)
  - Endpoints: `/createGroup`, `/inviteUser`
  - Pricing: Free
  - Priority: MEDIUM (Phase 6)
  - Status: Not integrated (log group creation)

### Phase 13: Campaigns (Email Tracking)
- [ ] **Mailgun Webhooks**
  - Purpose: Track email opens, clicks, replies
  - Required: Webhook endpoint, signature verification
  - Events: `opened`, `clicked`, `replied`
  - Priority: HIGH (Phase 13)
  - Status: Not integrated (simulate events)

---

## 🔑 Required Environment Variables

### Add to Vercel when integrating:

```env
# Apollo.ai (Phase 12)
APOLLO_API_KEY="[API_KEY]"

# Mailgun (Phase 6, 13)
MAILGUN_API_KEY="[API_KEY]"
MAILGUN_DOMAIN="[DOMAIN]"
MAILGUN_WEBHOOK_SIGNING_KEY="[KEY]"

# Vimeo (Phase 7)
VIMEO_ACCESS_TOKEN="[TOKEN]"

# Google Drive (Phase 7)
GOOGLE_DRIVE_SERVICE_ACCOUNT="[JSON_CREDENTIALS]"

# Telegram (Phase 6)
TELEGRAM_BOT_TOKEN="[TOKEN]"
```

---

## 📝 Integration Notes

*(Add notes as APIs are integrated)*

### Example Note Format:
```
## Apollo.ai - Integrated ✅
- Date: [Date]
- Commit: [Hash]
- Testing: Mock data replaced with live API
- Rate limits: 500 requests/month
- Error handling: Fallback to cached results
```

---

**Status:** Placeholder created - APIs will be documented as phases complete
**Next Update:** After Phase 0 setup complete
