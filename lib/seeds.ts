import type { ItemType } from '@/types'

export interface SeedItem {
  label: string
  type: ItemType
  content: string
}

export const SEEDS: SeedItem[] = [
  {
    label: 'Professor Assignment Email',
    type: 'email',
    content: `From: prof.johnson@university.edu
To: student@university.edu
Subject: URGENT: Research Paper Requirements — Due March 28

Hi,

I wanted to reach out about your upcoming research paper submission for HIST 4501.

As a reminder, the paper is due on March 28th at 11:59 PM via the course portal. Late submissions will not be accepted under any circumstances.

Requirements:
- 15–20 pages, double-spaced, 12pt Times New Roman
- Chicago citation style (minimum 12 scholarly sources)
- Must include: introduction, 3+ body sections, conclusion, bibliography
- Topic must be pre-approved — if you haven't submitted your topic proposal, do so by Friday March 22
- Plagiarism check via Turnitin — threshold is 15%

Office hours this week: Mon/Wed 2–4 PM, Thompson Hall 204.
Email me if you have questions. This paper is 40% of your final grade.

Best,
Professor Margaret Johnson
Department of History, University of Northern State`,
  },
  {
    label: 'Doctor Appointment Summary',
    type: 'notes',
    content: `Patient Visit Summary
Date: March 18, 2025
Provider: Dr. Sarah Chen, MD — Lakeside Medical Group
Visit Reason: Annual physical + follow-up on elevated cholesterol

FINDINGS:
- Blood pressure: 138/88 (mildly elevated — monitor)
- Cholesterol: LDL 142 mg/dL (target: <130)
- Blood glucose: 99 mg/dL (borderline pre-diabetic range)
- Weight: +4 lbs since last visit

PRESCRIPTIONS:
- Atorvastatin 20mg — start tonight, take with dinner
- Continue current Metformin 500mg dosage

FOLLOW-UP TASKS:
1. Fasting bloodwork within 2 weeks (lab order attached)
2. Return for BP check in 6 weeks (schedule before leaving today)
3. Reduce sodium intake — target <2,300mg/day
4. 30 min moderate exercise 5x/week
5. Schedule ophthalmology referral (Dr. Chen sending referral today)

NEXT APPOINTMENT: 3-month follow-up — schedule for June 2025
Questions? Call 555-234-5678`,
  },
  {
    label: 'Team Meeting Notes',
    type: 'meeting',
    content: `Q1 Product Review — All Hands
Date: Thursday, March 20, 2025 | 10:00 AM – 11:30 AM
Attendees: Alex (PM), Priya (Eng Lead), Jordan (Design), Marcus (Sales), Tamsin (CEO)

AGENDA ITEMS:
1. Q1 Metrics (Tamsin)
   - MRR: $82K (+12% vs Q4) ✓
   - Churn: 4.2% (target <4%) ⚠️
   - NPS: 42 (up from 38)

2. Feature Roadmap (Alex + Priya)
   - Mobile app beta: delayed to April 15 (auth issues)
   - CSV export: shipped Monday, good reception
   - AI recommendations: on track for April 1 launch

3. Customer Feedback (Marcus)
   - Top complaint: onboarding too complex
   - Feature request: bulk import
   - 3 enterprise deals pending onboarding improvements

DECISIONS MADE:
- Prioritize onboarding redesign before mobile launch
- Hire 1 additional frontend engineer (Tamsin approved headcount)
- Cancel desktop app project indefinitely

ACTION ITEMS:
- Jordan: Deliver onboarding flow wireframes by March 27
- Priya: Post updated mobile timeline in Slack by EOD Friday
- Marcus: Send enterprise clients preview access by March 25
- Alex: Draft Q2 roadmap and share for review by March 28
- Everyone: Complete Q1 self-reviews by March 31

NEXT MEETING: April 3, same time`,
  },
  {
    label: 'Travel Itinerary',
    type: 'document',
    content: `BOOKING CONFIRMATION — WANDERFAST TRAVEL
Booking Ref: WF-2025-88421
Traveler: James Okafor

OUTBOUND FLIGHT
Date: Friday, April 4, 2025
Flight: UA 2847 | Newark (EWR) → San Francisco (SFO)
Departs: 7:15 AM | Arrives: 10:42 AM
Seat: 14C (Aisle) | Baggage: 1 checked bag included
Boarding group: 3 — check-in opens 24 hrs before departure

HOTEL
Property: The Fillmore Grand
Address: 1800 Market St, San Francisco, CA 94102
Check-in: April 4 | Check-out: April 7 (3 nights)
Room: Deluxe King | Confirmation: FG-9983341
Rate: $289/night + taxes | Breakfast NOT included
Early check-in requested (subject to availability)

RETURN FLIGHT
Date: Monday, April 7, 2025
Flight: UA 388 | SFO → EWR
Departs: 1:20 PM | Arrives: 9:47 PM
Seat: 22A (Window)

IMPORTANT REMINDERS:
- Airport transfer NOT included — book Lyft/Uber or BART ($10.25)
- Hotel requires credit card for incidentals at check-in
- Trip insurance expires April 2 — confirm coverage before departure
- EWR Terminal C for United departures`,
  },
  {
    label: 'Utility Bill — Final Notice',
    type: 'bill',
    content: `PACIFIC GAS & ELECTRIC
FINAL NOTICE BEFORE SERVICE INTERRUPTION

Account #: 7741-883-2291
Service Address: 445 Birchwood Ave, Oakland, CA 94602
Account Holder: Maria Vasquez

AMOUNT DUE: $347.82
PAYMENT DEADLINE: March 25, 2025

This is your FINAL NOTICE. Service interruption is scheduled for March 26, 2025 if payment is not received by the deadline.

BALANCE BREAKDOWN:
- Previous unpaid balance:     $189.40
- Current charges (Feb 22 – Mar 21): $158.42
- Late fee (applied Feb 15):    $18.94
- Less payments received:      ($18.94)
TOTAL DUE:                     $347.82

AVOID DISCONNECTION — Pay immediately via:
• Online: mypge.com (Account #7741-883-2291)
• Phone: 1-800-743-5000 (24/7 automated)
• In-person: Any authorized payment center

Financial hardship? Call 1-800-743-5000 before March 24 to discuss payment plans or CARE program eligibility.
Reconnection fee after disconnection: $120.00`,
  },
]
