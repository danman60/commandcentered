# CommandCentered Interview Script - Vision & Requirements

**Purpose:** Clarify vision, priorities, and key decisions for CommandCentered development
**Format:** Voice recording during drive - answer questions out loud, transcribe later
**Duration:** ~45-60 minutes

---

## SECTION 1: VISION & BUSINESS MODEL (10 minutes)

### Big Picture:
1. **What's the core problem CommandCentered solves?**
   - In one sentence, what pain point does this eliminate for StreamStage?
   - What would happen if you kept using your current system for another year?

2. **Who are the primary users and what do they care about most?**
   - You (operations manager) - what's your #1 daily frustration?
   - Operators - what do they need most from this system?
   - Clients - what visibility/features would make them happier?

3. **Success metrics - how will you know this is working?**
   - Time saved per week?
   - Reduced errors/conflicts?
   - Faster client response time?
   - Better operator utilization?

4. **Revenue model for CommandCentered itself:**
   - Is this internal-only, or could you sell this to other production companies?
   - If sellable, what would pricing look like? (per event, per user, flat monthly?)
   - Would you want multi-tenant from day 1, or add that later?

---

## SECTION 2: WORKFLOW PRIORITIES (15 minutes)

### Phase Sequencing:
5. **Looking at the 4 phases (Registration, Scheduling, Execution, Delivery), which order should we build them?**
   - Current plan: Registration → Scheduling → Execution → Delivery
   - Does this match your actual workflow?
   - Could we launch with just 1-2 phases and still get value?

6. **What's the MINIMUM you need to replace your current spreadsheets?**
   - Which specific pain point, if solved, would save you the most time RIGHT NOW?
   - Could you run StreamStage with JUST that feature + spreadsheets for everything else?

### Critical Workflows:
7. **Walk me through a typical event from inquiry to delivery:**
   - Start: "Client reaches out via..."
   - Then: [describe each step]
   - End: "We deliver files via..."
   - Where are the biggest bottlenecks or manual work?

8. **Operator scheduling - what's the current process?**
   - How do you know who's available?
   - How do you assign operators to events?
   - How do they get their assignments?
   - What causes the most confusion or double-bookings?

9. **Equipment management - what's the biggest challenge?**
   - Do you track individual items or just kits?
   - How do you know what gear is where?
   - What happens when equipment conflicts arise?
   - Are kits always the same, or customized per event?

---

## SECTION 3: CLIENT EXPERIENCE (10 minutes)

### Client Portal:
10. **Should clients have a login, or just receive emails?**
   - If login: what should they see? (invoice status, delivery downloads, upcoming events?)
   - If email-only: what's the minimum they need in those emails?

11. **Questionnaire workflow - how detailed should this be?**
   - Who sends the questionnaire? (manual or automatic?)
   - What happens if client doesn't respond? (reminders? escalation?)
   - Can questionnaires be customized per event type?

12. **Proposal/Contract workflow - what's working vs. broken now?**
   - Current tool: [what are you using?]
   - What's annoying about it?
   - Should proposals be generated from templates, or fully custom each time?
   - Do you need e-signature integration, or just PDF + email?

13. **Payment workflow - what's the ideal experience?**
   - Stripe only, or also e-transfer, cash, check?
   - Payment milestones: deposit → balance, or more complex?
   - Should system send automatic payment reminders?

---

## SECTION 4: OPERATOR EXPERIENCE (10 minutes)

### Operator Portal:
14. **What do operators need to see when they log in?**
   - Upcoming assignments?
   - Equipment assigned to them?
   - Event details/questionnaires?
   - Ability to upload footage after event?

15. **Operator availability - how should this work?**
   - Operators set their own availability, or you assign them?
   - Recurring availability (like "always free Saturdays") or week-by-week?
   - How far in advance do you schedule?

16. **Operator communication - what's the current pain point?**
   - How do you send gig sheets now?
   - What info do operators need before showing up?
   - Should there be in-app chat, or is Telegram enough?

17. **Operator performance tracking - do you need this?**
   - Track hours worked, events completed, client ratings?
   - Use this for payment calculations or just awareness?
   - Any other metrics that matter?

---

## SECTION 5: INTEGRATIONS & AUTOMATION (10 minutes)

### Current Tools:
18. **What tools are you using now that CommandCentered needs to integrate with?**
   - Google Drive (for deliverables) - required or optional?
   - Stripe (for payments) - required or optional?
   - Mailgun (for emails) - or would you use something else?
   - Telegram (for notifications) - critical or nice-to-have?
   - Any others? (calendar apps, accounting software, etc.)

19. **Email automation - what should trigger automatic emails?**
   - Contract signed → send questionnaire?
   - 7 days before event → send reminder to client?
   - Payment overdue → send reminder?
   - Event completed → request feedback?
   - What else?

20. **Telegram bot - what's the vision here?**
   - Create group per event automatically?
   - Who should be in each group? (you, operators, client?)
   - What notifications should go to Telegram vs. email?

21. **AI features - what would be most useful?**
   - Voice commands for common tasks? ("Assign John to Saturday's event")
   - Auto-generate proposals from past events?
   - Smart scheduling suggestions based on operator availability?
   - Something else?

---

## SECTION 6: DATA & REPORTING (5 minutes)

### Reports & Analytics:
22. **What reports do you need weekly/monthly?**
   - Revenue by client, event type, month?
   - Operator utilization (hours worked per operator)?
   - Equipment usage (most-used gear)?
   - Overdue invoices or unsigned contracts?

23. **Historical data - how much do you need to see?**
   - Past events: last 6 months? 1 year? All time?
   - Is there old data from spreadsheets to import?
   - Or start fresh with new system?

---

## SECTION 7: TECHNICAL DECISIONS (5 minutes)

### Deployment & Access:
24. **Who needs access to this system?**
   - Just you?
   - You + operators?
   - You + operators + clients?
   - Any other team members (editors, admin staff)?

25. **Mobile vs. Desktop - what's more important?**
   - Will you mostly use this at your desk, or on-the-go?
   - Do operators need mobile access, or just desktop?
   - Should there be a mobile app, or is mobile web enough?

26. **Offline capability - do you need this?**
   - Will you ever use this system without internet?
   - Do operators need to access gig sheets offline at venues?

27. **Security & privacy - any special concerns?**
   - Client data sensitivity?
   - Operator personal info?
   - Payment/financial data protection?
   - Any compliance requirements (GDPR, etc.)?

---

## SECTION 8: CUSTOMIZATION & FLEXIBILITY (5 minutes)

### Customization:
28. **Service types - how standardized are your offerings?**
   - Same packages for every client (e.g., "Dance Recital Standard")?
   - Fully custom every time?
   - Mix of standard + custom add-ons?

29. **Pricing - how much does it vary?**
   - Fixed prices per service type?
   - Custom pricing per client?
   - Tiered pricing based on event size?

30. **What needs to be customizable vs. standardized?**
   - Email templates - customize or use same for all?
   - Contract terms - standard or custom per client?
   - Questionnaire questions - standard or custom per event type?

---

## SECTION 9: TIMELINE & SCOPE (5 minutes)

### Launch Plan:
31. **When do you want to start using this?**
   - Specific date or event coming up?
   - What's driving the timeline?
   - Any flexibility if features take longer?

32. **What's the MINIMUM viable system you could launch with?**
   - If you could only have 3 features on day 1, what would they be?
   - What can wait for version 2?

33. **Training & onboarding - what do you need?**
   - Just you learning it, or train operators too?
   - Video tutorials, written docs, or hands-on training?
   - Ongoing support needs?

---

## SECTION 10: OPEN QUESTIONS (5 minutes)

### Wildcard:
34. **What did I NOT ask about that's important?**
   - Any features you expected but weren't mentioned?
   - Any concerns about the system?
   - Any "dream features" if anything were possible?

35. **What are you most excited about with CommandCentered?**
   - What will make you say "this was worth building"?

36. **What are you most worried about?**
   - Complexity?
   - Time to build?
   - Cost?
   - Adoption by operators/clients?
   - Something else?

---

## POST-INTERVIEW ACTIONS

After your drive, transcribe or summarize your answers and we'll:
1. **Update priorities** based on your responses
2. **Revise the spec** to match your actual workflow
3. **Create a phased launch plan** with your minimum viable features
4. **Update mockups** if any major changes needed
5. **Build a development roadmap** with realistic timeline

---

## QUICK REFERENCE: KEY DECISION POINTS

**Critical to answer:**
- Q6: What's the MINIMUM to replace spreadsheets?
- Q32: What 3 features MUST be in version 1?
- Q7: Walk through typical event workflow (where are bottlenecks?)
- Q18: Which integrations are REQUIRED vs. nice-to-have?

**Can decide later:**
- Q4: Revenue model (internal vs. product)
- Q26: Offline capability
- Q21: AI features

---

**RECORDING TIP:** Use your phone's voice recorder app. Answer questions naturally like you're explaining to a colleague. Don't worry about being perfect - raw thoughts are most valuable!
