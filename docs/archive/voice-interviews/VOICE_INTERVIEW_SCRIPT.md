# CommandCentered Voice Interview Script
## For ChatGPT Voice Mode - Long Drive Session

**Instructions for ChatGPT Voice:**
"You're going to interview me about my CommandCentered project to gather all remaining decisions. I'm Daniel, building a business management system for my videography company StreamStage. The system has two parts: CommandCentered for internal operations and StreamStage for client-facing. We're about to lock the database schema with 47 tables across 3 phases. Ask me these questions one at a time, wait for my complete answer, then move to the next. If I say something unclear, ask follow-up questions. Let's start."

---

## PART 1: CRITICAL SCHEMA DECISIONS (10 minutes)

### Context Setting
"Daniel, let's start with some critical database schema decisions that are blocking implementation. I'll give you quick context for each one."

### Question 1: Operator Skills Storage
"For tracking operator skills like videography and photography proficiency, you have two options. Option 1 is storing them as columns directly on the operators table - simple but inflexible. Option 2 is having separate tables for operator_skills and skill_definitions - more complex but allows adding new skills without schema changes.

Your Phase 2 videography business needs 4 core skills, but you might expand to other services. Which approach do you prefer and why?"

### Question 2: Personal Gear Naming
"Your operators own personal equipment they bring to gigs. The schema inconsistently calls this 'operator_gear' in some places and 'operator_equipment' in others. Your company gear is already called 'gear' not 'equipment'.

Should we standardize on 'operator_gear' to match, or 'operator_equipment' for distinction?"

### Question 3: Hotel Tracking Architecture
"For multi-day events requiring hotels, you have conflicting approaches in the specs. Option 1 adds hotel fields to the events table - simple, one hotel per event. Option 2 creates a separate operator_hotels table - complex, tracks individual operator accommodations.

Given that you typically book one Airbnb for the whole crew, which approach makes more sense?"

### Question 4: Proposal Expiration Logic
"Your schema has an expires_at field on proposals, suggesting they expire after 30 days. But in your business decisions document, you said 'proposals don't expire' because you don't want to lose interested clients to arbitrary deadlines.

Should I remove the expires_at field entirely, or keep it but never use it for future flexibility?"

### Question 5: Event Creation Trigger
"Originally, the spec said an event gets created when a contract is signed AND first payment is received. But you later decided that signing alone should trigger event creation, with payments tracked separately.

Can you confirm: Should events be created immediately when contracts are signed, regardless of payment status?"

---

## PART 2: BUSINESS LOGIC & WORKFLOWS (15 minutes)

### Question 6: Payment Processing Automation
"Let's talk about payment workflows. Your payment_schedules table could support automated charging - like automatically charging the final payment on the event date. Or it could be purely informational - showing when payments are due but requiring manual processing.

How automated do you want payment collection to be? Would you ever want the system to automatically charge cards, or should it always require manual action?"

### Question 7: Client Questionnaire Timing
"After a contract is signed, when should client questionnaires be sent? Option 1: Immediately upon contract signing. Option 2: After first payment received. Option 3: Manually triggered by you. Option 4: X days before the event automatically.

What's your preferred workflow and why?"

### Question 8: Lead Assignment Rules
"When new leads come in from your website, how should they be assigned? Option 1: Always to you. Option 2: Round-robin between team members. Option 3: Based on lead type or service requested. Option 4: Unassigned until manually claimed.

How do you want to handle lead distribution?"

### Question 9: Proposal Builder Pricing Rules
"Your Proposal Builder Builder needs pricing logic. Should it support: Tiered pricing based on quantity? Percentage discounts for bundles? Time-based pricing like rush fees? Early bird discounts? Seasonal pricing?

Which pricing rules are essential for MVP versus nice-to-have later?"

### Question 10: Contract Template System
"For generating contracts from accepted proposals, do you want: Option 1: One universal contract template with variable sections. Option 2: Different templates for different service types. Option 3: Fully custom contracts each time.

How much contract standardization versus customization do you need?"

---

## PART 3: INTEGRATION ARCHITECTURE (10 minutes)

### Question 11: Google Drive Folder Structure
"When creating Google Drive folders for projects, what's your preferred structure? Should it be: 'Client Name - Event Type - Date' or 'Date - Client Name - Event Type' or something else?

And should there be automatic subfolder creation for raw footage, edits, finals, and client deliveries?"

### Question 12: Email Communication Tracking
"Your system tracks client emails. Should it: Option 1: Only track emails sent from the system. Option 2: Also import replies into the system. Option 3: Full two-way sync with your email.

How much email integration do you actually need?"

### Question 13: Stripe Payment Methods
"Which Stripe payment methods should be supported? Just credit cards? ACH bank transfers? Payment links? Invoices? Buy now pay later options?

What payment methods do your dance studio clients typically prefer?"

### Question 14: SignWell Integration Depth
"For e-signatures with SignWell, do you need: Basic signature collection only? Multiple signers with routing? Signature fields in specific locations? Initial fields? Date fields? Custom fields for dancer counts or venue addresses?

How complex are your signature requirements?"

### Question 15: Alert Notification Channels
"For system alerts like new leads or payments, where should notifications go? Just in-app dashboard? Email immediately? Email digest? SMS for critical alerts? Slack integration?

What's your ideal notification setup considering you want to minimize context switching?"

---

## PART 4: USER INTERFACE & EXPERIENCE (10 minutes)

### Question 16: Proposal Builder UI Approach
"For the Proposal Builder Builder interface where you create proposal templates, do you prefer: Option 1: Drag-and-drop visual builder like Squarespace. Option 2: Form-based configuration with live preview. Option 3: Code-based with YAML or JSON editing.

What matches your technical comfort and speed needs?"

### Question 17: Mobile Requirements
"How important is mobile access? Do you need: Full mobile responsiveness for all features? Mobile-optimized views for specific workflows like checking assignments? Native mobile app eventually? Or is desktop-first acceptable since this is back-office software?

What's your actual mobile usage pattern?"

### Question 18: Client Portal Features
"For the StreamStage client portal, what features should clients access? Just view and sign contracts? Download deliverables? Pay invoices? Submit questionnaires? View project status? Communicate with you?

What level of client self-service do you want?"

### Question 19: Dashboard Priorities
"For your CommandCentered dashboard, what are the 5 most important things to see at a glance? Revenue metrics? Upcoming events? Lead pipeline? Overdue payments? Equipment availability? Operator scheduling conflicts?

What drives your daily decisions?"

### Question 20: Bulk Operations
"Which bulk operations are critical? Bulk importing leads from CSV? Bulk assigning operators to shifts? Bulk invoicing? Bulk email sending? Bulk status updates?

Where do you need efficiency multipliers?"

---

## PART 5: PHASE 2 LOGISTICS DETAILS (10 minutes)

### Question 21: Shift Overlap Validation
"When scheduling overlapping shifts for swing coverage, should the system: Warn but allow any overlap? Require explanation for overlaps over 50%? Block overlaps entirely? Smart suggest optimal overlap times?

How much scheduling intelligence versus flexibility do you need?"

### Question 22: Equipment Conflict Resolution
"If the same equipment is assigned to overlapping events, should the system: Hard block it? Warn but allow with reason? Automatically suggest alternatives? Track retrieval and delivery between venues?

How often does this actually happen in your business?"

### Question 23: Operator Skill Progression
"For tracking operator skill improvements, should progression be: Manual updates only? Automatic after training attendance? Points-based with achievements? Performance review based? Time-based degradation if not used?

How do you want to track and incentivize skill development?"

### Question 24: Travel Time Calculation
"For calculating travel times to venues, should the system: Use straight-line distance estimates? Integrate Google Maps API? Factor in time-of-day traffic? Include buffer time automatically? Track actual versus estimated?

How precise does travel planning need to be?"

### Question 25: Deliverable Bounty System
"Your bounty system for rush video editing - should bounties be: Fixed amounts you set? Percentage of project value? Time-based degrading value? Competitive bidding? Automatic based on deadline urgency?

How do you want to incentivize fast turnaround?"

---

## PART 6: PHASE 3 CLIENT MANAGEMENT DETAILS (10 minutes)

### Question 26: Lead Scoring System
"Should leads be scored automatically based on: Organization size? Event type value? Response speed? Email engagement? Previous client history? Or just manual qualification?

How sophisticated should lead prioritization be?"

### Question 27: CRM Organization Tracking
"For the CRM tracking dance studios you haven't converted yet, what statuses matter? 'Never contacted'? 'Not interested this year'? 'Competitor client'? 'Budget too small'? 'Decision maker changed'?

What tracking helps you know when to re-engage?"

### Question 28: Proposal Analytics
"What proposal metrics matter most? View time before submission? Which sections get most attention? Price sensitivity indicators? Abandonment points? Comparison with won proposals?

What data would help you optimize proposal conversion?"

### Question 29: Contract Modification Workflow
"After contracts are signed, how should modifications work? Lock completely? Allow amendments? Version tracking? Require re-signature? Price adjustments only?

How much post-signature flexibility do you need?"

### Question 30: Client Success Tracking
"Post-event, what client success metrics matter? Net promoter score? Referral generation? Repeat booking rate? Social media mentions? Google reviews?

How do you want to track client satisfaction and growth?"

---

## PART 7: TECHNICAL ARCHITECTURE (8 minutes)

### Question 31: Data Retention Policies
"How long should different data types be retained? Completed events? Rejected proposals? Email tracking? System logs? Financial records? Operator availability history?

What are your business and potential compliance needs?"

### Question 32: Backup and Recovery
"For data backup, what's acceptable? Daily automated backups? Real-time replication? Point-in-time recovery? Geographic redundancy? How many days of backup retention?

What's your risk tolerance for data loss?"

### Question 33: API Strategy
"Do you need APIs for: Public proposal submission? Partner integrations? Mobile app? Zapier integration? Webhook notifications to other systems?

What external connectivity is actually valuable?"

### Question 34: Performance Requirements
"What performance is acceptable? Page loads under 2 seconds? Real-time updates? How many concurrent users? Handling 100 proposals per day? 1000 events per year?

What scale are you designing for in the next 2 years?"

### Question 35: Multi-Tenant Architecture
"You have multi-tenant capability built in. Are you planning to: Keep it single-tenant for StreamStage only? Offer CommandCentered to other video companies? White-label for competitors? Franchise model?

What's the business model long-term?"

---

## PART 8: MIGRATION & LAUNCH (8 minutes)

### Question 36: Data Migration Strategy
"What existing data needs migrating? HoneyBook contracts and contacts? Spreadsheet equipment lists? Google Calendar events? Email history? Financial records?

What's worth migrating versus starting fresh?"

### Question 37: Rollout Strategy
"How should we roll out the system? Big bang switchover? Parallel run period? Start with new clients only? Phase by feature area? Beta with specific event types?

What's your risk tolerance for the transition?"

### Question 38: Training Requirements
"Who needs training on the system? Just you? Freelance operators? Partner editors? Client studios? How should training be delivered - documentation, videos, or hands-on?

What's the onboarding plan?"

### Question 39: Success Metrics
"How will you measure if CommandCentered is successful? Time saved per week? Revenue increase? Lead conversion improvement? Client satisfaction scores? Stress reduction?

What KPIs matter most to you?"

### Question 40: MVP Scope Cutting
"If we need to cut scope for MVP, what's droppable? CRM features? Deliverable tracking? Google Drive integration? Proposal Builder Builder? Advanced analytics?

What's the absolute minimum viable system?"

---

## PART 9: FUTURE VISION (7 minutes)

### Question 41: Phase 4 Possibilities
"Looking beyond Phase 3, what excites you most? AI-powered video editing? Automated social media clips? Client mobile apps? Franchise management? Equipment rental marketplace?

Where do you see the platform in 5 years?"

### Question 42: Integration Priorities
"What third-party integrations would be most valuable? QuickBooks for accounting? Instagram for marketing? YouTube for delivery? Calendly for booking? Zoom for client meetings?

What would meaningfully improve your workflow?"

### Question 43: Automation Dreams
"If you could automate anything in your business, what would it be? Quote generation? Schedule optimization? Video editing? Client communication? Social media marketing?

Where do you lose the most time currently?"

### Question 44: Competitive Differentiation
"What would make CommandCentered/StreamStage definitively better than HoneyBook or other alternatives? What's the killer feature that would make other video companies want this?

What's your unique insight from running StreamStage?"

### Question 45: Exit Strategy
"Long-term, do you see this as: A lifestyle business tool for StreamStage? A SaaS product to sell to others? Something to eventually sell to a bigger company? Open source project?

What's the end game?"

---

## PART 10: QUICK FIRES - FINAL DECISIONS (5 minutes)

"Let's do rapid-fire yes/no questions to clean up final decisions:"

1. "Should operator_skills allow custom skills beyond the core 4? Yes or no?"
2. "Should proposals auto-save draft state as clients fill them? Yes or no?"
3. "Should deleted records be soft-deleted or hard-deleted? Soft or hard?"
4. "Should the system track equipment depreciation? Yes or no?"
5. "Should operators see each other's schedules? Yes or no?"
6. "Should clients have username/password accounts or just email links? Accounts or links?"
7. "Should invoices auto-generate from payment schedules? Yes or no?"
8. "Should the system support multiple currencies? Yes or no?"
9. "Should alerts escalate if not acknowledged? Yes or no?"
10. "Should there be a public API eventually? Yes or no?"
11. "Should operators be able to swap shifts between themselves? Yes or no?"
12. "Should the system track mileage for taxes? Yes or no?"
13. "Should proposals support video embeds? Yes or no?"
14. "Should contracts support addendums? Yes or no?"
15. "Should there be client reviews/testimonials features? Yes or no?"

---

## CLOSING

"Daniel, that covers all the major decisions needed to lock the CommandCentered schema and specification. Is there anything else about your business workflow, pain points, or vision that I haven't asked about that would impact the system design? Any features you've dreamed about that we haven't discussed?"

"Based on your answers, I'll compile a complete decision document that locks all specifications and allows development to begin on Sprint 1. Do you have any questions for me about the implementation plan or timeline?"

---

## INTERVIEW NOTES SECTION
(For ChatGPT to fill during interview)

**Session Date:** ___________
**Session Duration:** ___________
**Key Decisions:** (List major decisions as given)
**Surprising Insights:** (Note unexpected requirements)
**Follow-up Needed:** (List any unclear areas)
**Priority Changes:** (Note any MVP scope adjustments)

---

## POST-INTERVIEW SUMMARY PROMPT

"Please summarize the key decisions from this interview in a structured format:
1. All schema decisions (numbered list)
2. All business logic decisions (numbered list)
3. All integration decisions (numbered list)
4. MVP scope confirmation (bullet points)
5. Any new requirements discovered (bullet points)
6. Any features explicitly excluded (bullet points)"

---

**End of Interview Script**

*Note: This interview should take approximately 60-90 minutes depending on answer depth. Perfect for a long drive.*