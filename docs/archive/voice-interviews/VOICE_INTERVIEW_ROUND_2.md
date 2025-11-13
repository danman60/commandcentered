# CommandCentered Voice Interview - ROUND 2
## Deeper Questions to Prevent Future Backtracking

**Purpose:** These questions dig into edge cases, failure modes, and subtle business logic that often causes rework during implementation.

---

## PART 1: MONEY & FINANCIAL EDGE CASES (10 minutes)

### Question 1: Partial Payments & Overpayments
"When a client sends a payment that doesn't match an invoice amount - say they pay $1,300 when the invoice is $1,250, or they pay $800 toward a $1,250 invoice without specifying - how should the system handle this? Should it auto-apply to oldest invoice, hold in credit, require manual allocation, or reject mismatched amounts?"

### Question 2: Refunds & Cancellations
"Walk me through a cancellation scenario. Event is booked for June, client paid 50% deposit in January. In March they cancel. What happens to: the deposit, the contract status, the event in logistics, operator assignments, equipment reservations? Do you have a cancellation fee structure? Is the refund automatic or manual?"

### Question 3: Currency & Tax Complexity
"You said CAD is your primary currency. But what about: US clients paying in USD? Tax calculation - is it always the same rate or does it vary by service type or client location? Do you need to track tax-exempt clients? What about Quebec's different tax structure if you work there?"

### Question 4: Payment Dispute Resolution
"A client disputes a charge with their credit card company three months after the event. Stripe reverses the payment. How should the system handle this? Does it affect the operator who was already paid? Do you need a reserve fund feature? How do you track the dispute resolution?"

### Question 5: Price Adjustments After Booking
"Client books a basic package, then two weeks before the event wants to add drone footage. How do you handle: modifying the signed contract, adjusting payment schedules, updating operator assignments for the new scope? Can prices change after contract signing, and if so, what's the approval flow?"

---

## PART 2: SCHEDULING CONFLICTS & EDGE CASES (10 minutes)

### Question 6: Operator Availability Granularity
"Currently you have blackout dates for operators. But what about partial availability - like 'available but only until 3pm' or 'available but not willing to travel more than 50km'? How granular does availability need to be? What about operators who are available but at a higher rate (overtime/holiday rates)?"

### Question 7: Equipment Failure During Event
"Camera breaks during a wedding. What's the cascade of actions? Who gets notified? How is backup equipment assigned? Is there a client communication protocol? Do you need equipment redundancy rules like 'always bring 2 cameras to weddings'? How does this affect billing if you can't deliver everything?"

### Question 8: Last-Minute Operator Cancellations
"Operator calls in sick morning of the event. Walk through the replacement flow. Is there an on-call system? Automatic notifications to backup operators? Premium pay for last-minute fill-ins? How do you track who's qualified to replace whom?"

### Question 9: Multi-Location Events
"Some events might have multiple locations in one day - ceremony at church, reception at hotel. How should this be modeled? One event with multiple venues? Multiple linked events? How does this affect travel time calculations and operator scheduling?"

### Question 10: Overlapping Event Dependencies
"Event A needs equipment returned by 2pm to load for Event B at 3pm. How do you model these dependencies? Should the system prevent booking Event B equipment until Event A is marked complete? What about crew members who need to shower/change between events?"

---

## PART 3: CLIENT RELATIONSHIP EDGE CASES (10 minutes)

### Question 11: Proposal Versions & Comparisons
"Client asks for three different options - basic, standard, premium. Do you need to support multiple active proposals per lead? Side-by-side comparison views? What happens to the rejected proposals when one is accepted? Can clients switch between options after initial selection?"

### Question 12: Recurring Clients & Bulk Bookings
"A dance studio wants to book you for 5 recitals throughout the year. Do you handle this as: 5 separate contracts? One master agreement with 5 events? Volume discount across all events? How does invoicing work - separate per event or consolidated?"

### Question 13: Referral & Commission Tracking
"An event planner refers clients to you and expects 10% commission. How do you track: referral sources, commission owed, when commission is payable? Do you need approval workflows for commission payments? What about referral chains?"

### Question 14: Client Communication Preferences
"Some clients want everything by email, others prefer text, some want phone calls only. How granular should communication preferences be? Can they differ by communication type (invoices by email, reminders by text)? How do you handle 'do not contact' periods?"

### Question 15: Shared Decision Makers
"For a wedding, you might have bride, groom, and mother-of-bride all involved in decisions. Who can approve changes? Who gets communications? How do you handle conflicting instructions from multiple stakeholders? Do you need authorization hierarchies?"

---

## PART 4: DATA INTEGRITY & AUDIT REQUIREMENTS (10 minutes)

### Question 16: Legal Hold & Compliance
"If you get sued or audited, you might need to preserve all records for a specific client or time period. Do you need a 'legal hold' feature that prevents deletion? How long do you need to keep contracts, emails, payment records for tax/legal purposes? Any industry-specific compliance?"

### Question 17: Operator Performance Tracking
"Beyond skill levels, do you want to track: client complaints, no-shows, equipment damage incidents, client compliments? Should these affect future assignment algorithms? Do operators see their own performance metrics? Is there a probation system?"

### Question 18: Intellectual Property & Usage Rights
"Who owns the raw footage - you or client? Can you use event footage for marketing? Do you need model releases from guests? How do you track which footage you have permission to use? Different rights for different packages?"

### Question 19: Data Privacy & Access Control
"Can operators see each other's pay rates? Can they see client contact information? What about editors who are contractors - what data can they access? Do clients need data deletion rights (GDPR-style)? How do you handle footage of minors?"

### Question 20: Change Auditing Granularity
"For contracts and invoices, do you need to track every edit with who/when/what/why? Should clients be notified of any changes? Do you need 'locked' periods where changes require special approval? What about backdating - is it ever allowed?"

---

## PART 5: OPERATIONAL EFFICIENCY FEATURES (10 minutes)

### Question 21: Batch Operations Specifics
"You have 20 similar events next month. What operations need batching: Creating shifts? Assigning default crews? Sending invoices? Generating contracts? Equipment allocation? For each, what should be customizable per item versus applied to all?"

### Question 22: Template Inheritance & Variants
"For proposal templates, do you need: seasonal variants (summer/winter pricing)? Client-type variants (corporate/consumer)? Can templates inherit from a master with overrides? How do you handle template updates - affect existing proposals or only new ones?"

### Question 23: Automated Quality Checks
"What automated checks would prevent expensive mistakes: Double-booking operators? Equipment conflicts? Missing deposits before event date? Unsigned contracts approaching event? Deliverables past due? For each, is it a warning or hard block?"

### Question 24: Resource Optimization
"Should the system suggest optimizations like: 'These 3 events could share equipment transport'? 'This operator is already near venue from earlier event'? 'Combining these two roles would save $X'? How proactive versus assistive should it be?"

### Question 25: Capacity Planning
"How do you decide if you can take on a new event? Do you need capacity views showing: operator availability percentage, equipment utilization rates, editing backlog? What about 'soft bookings' that are penciled in but not confirmed?"

---

## PART 6: EXTERNAL INTEGRATION DEPTH (10 minutes)

### Question 26: Calendar Sync Complexity
"For calendar integration, what's the source of truth? If someone moves an event in Google Calendar, does it update the system? What about conflicts between system events and personal calendar items? How do you handle timezone differences for destination events?"

### Question 27: Accounting System Integration
"You mentioned reports for your accountant. But should the system also: generate journal entries, track expense categories, handle sales tax remittance, integrate with QuickBooks/Xero? Where's the line between CommandCentered and accounting software?"

### Question 28: Marketing Attribution
"How do you track what marketing actually works? Should the system track: which Instagram post led to inquiry, Google Ad conversions, referral source effectiveness? Do you need UTM parameter tracking? Cost per acquisition calculations?"

### Question 29: Equipment Maintenance Scheduling
"Cameras need sensor cleaning, batteries need replacement cycles. Should the system track: usage hours, maintenance schedules, warranty expiration, repair history? Alert when equipment needs service? Block equipment from booking during maintenance?"

### Question 30: Deliverable Distribution
"When delivering final videos, do you: upload to YouTube privately, send Google Drive links, use Vimeo, physical USB drives? Should the system track: download counts, view analytics, delivery confirmation? What about expiring access after X months?"

---

## PART 7: SCALABILITY & FUTURE-PROOFING (10 minutes)

### Question 31: Team Collaboration Features
"As you grow and have multiple people in the system, do you need: internal comments on leads/events, task assignments within events, approval chains for discounts, handoff protocols between team members? How collaborative versus siloed should it be?"

### Question 32: Client Self-Service Boundaries
"You said no client portal, but what about letting clients: reschedule within parameters, update their venue address, submit questionnaire responses, approve deliverables? Where's the line between convenience and control?"

### Question 33: Franchise/License Model
"If you let other videographers use CommandCentered, what needs to be: completely isolated (finances), shareable (equipment types), standardized (workflows), customizable (branding)? Do you need marketplace features for sharing templates?"

### Question 34: Seasonal Business Patterns
"Your business has busy seasons (June weddings) and slow seasons. Should the system: adjust pricing automatically, suggest optimal event scheduling, track seasonal operator availability, predict cash flow? How much seasonality intelligence do you want?"

### Question 35: AI/Automation Boundaries
"Where do you draw the line on automation? Should AI: write proposal copy, suggest optimal pricing, auto-respond to simple inquiries, edit videos, assign operators based on past performance? What must remain human decisions?"

---

## PART 8: FAILURE RECOVERY & EDGE CASES (10 minutes)

### Question 36: Disaster Recovery Scenarios
"Walk through these scenarios: venue burns down week before event, COVID-style industry shutdown, you're hospitalized and someone needs to run the business, major equipment theft. What system features would help in each case?"

### Question 37: Payment System Failures
"Stripe goes down on the day multiple payments are due. E-transfer emails aren't arriving. Client's credit card is expired. For each, what's the fallback process? How do you track payment attempts? When do you stop providing service for non-payment?"

### Question 38: Communication Breakdowns
"Email server is blacklisted, client's spam filter blocks you, phone number is disconnected, client goes radio silent after booking. For each scenario, what's the escalation path? Legal requirements for proof of communication attempts?"

### Question 39: Quality Disputes
"Client says the video is 'not what they expected' and demands full refund. How do you track: what was promised versus delivered, approval checkpoints, change requests? Do you need formal acceptance criteria? Partial refund calculations?"

### Question 40: Competitive Threats
"A client books you, then competitor offers them 30% less to switch. Do you need: price matching protocols, cancellation penalties that discourage switching, loyalty rewards, exclusive venue partnerships? How defensive should the system be?"

---

## PART 9: VERY SPECIFIC WORKFLOW DETAILS (8 minutes)

### Question 41: The Inquiry-to-Booking Speed Run
"A hot lead calls at 2pm wanting to book for next weekend. Walk me through the absolute fastest path from inquiry to signed contract. What can be skipped? What must not be skipped? How fast should this be possible?"

### Question 42: The Multi-Event Weekend
"You have 3 events on Saturday - 9am, 2pm, 7pm. How do you handle: operator meals, equipment charging between events, file offloading, operator fatigue rules? Should the system enforce minimum breaks? Maximum hours per day?"

### Question 43: The Difficult Client Workflow
"Client who constantly requests changes, argues about invoices, asks for extras not in contract. Do you need: change request limits, additional approval requirements, automatic documentation, right to terminate contract? How do you protect yourself?"

### Question 44: The Rush Delivery Scenario
"Client needs highlight reel in 24 hours for their event tomorrow. How do you handle: rush pricing calculation, editor availability confirmation, quality vs speed tradeoffs, setting realistic expectations? Should system auto-decline impossible deadlines?"

### Question 45: The Scope Creep Timeline
"Track a typical project from 'just a simple video' to 'can you also do photos, and drone, and livestream, and...' At what point do you force a new contract? How do you document additions? Can you refuse additions after certain point?"

---

## PART 10: PHILOSOPHY & CONSTRAINTS (5 minutes)

### Question 46: What Will You Never Automate?
"What decisions or actions should ALWAYS require human judgment in your business, no matter how good AI gets? Why are these the red lines?"

### Question 47: What's Your Biggest Current Time Waster?
"In your current workflow, what single task takes the most time for the least value? How would the perfect solution to this look?"

### Question 48: What Would Make You Switch Back?
"What failure in CommandCentered would be so critical that you'd abandon it and go back to HoneyBook? What's absolutely unforgivable?"

### Question 49: Who Else Touches The System?
"Besides you, who else needs access and why: your accountant, insurance company, venue partners, equipment rental companies, freelance operators? What can each see/do?"

### Question 50: The 10x Growth Question
"If StreamStage grew 10x in the next 2 years - from 50 to 500 events per year - what would break first in the system? What would need to fundamentally change about how you operate?"

---

## CLOSING QUESTIONS

"Based on everything we've discussed, what's the one feature that if perfectly implemented would give you an unfair competitive advantage?"

"What's the one thing about running StreamStage that no software could ever really understand or solve?"

"If you could only build 3 features from everything we've discussed, which 3 would move the needle most?"

---

## WHY THESE QUESTIONS MATTER

These questions prevent expensive mistakes like:
- Building payment systems that don't handle real-world edge cases
- Creating scheduling that breaks under actual operational pressure
- Missing critical audit/compliance requirements discovered later
- Integration assumptions that don't match actual workflows
- Scale bottlenecks that require architecture rewrites

Each answer eliminates days or weeks of potential rework.