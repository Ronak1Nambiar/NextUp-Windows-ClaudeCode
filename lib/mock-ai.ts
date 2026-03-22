/**
 * Mock AI — returns realistic structured responses without any API calls.
 * Used when OPENAI_API_KEY is not set or USE_MOCK_AI=true.
 * Each call generates a slightly different result based on content keywords.
 */

import type { AnalysisResult, ItemType } from '@/types'

const today = new Date()
const addDays = (n: number) => {
  const d = new Date(today)
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

export function getMockAnalysis(content: string, type: ItemType): AnalysisResult {
  const lower = content.toLowerCase()

  // Detect urgency from keywords
  const urgency: AnalysisResult['urgency'] =
    lower.includes('urgent') || lower.includes('immediately') || lower.includes('overdue')
      ? 'critical'
      : lower.includes('deadline') || lower.includes('due') || lower.includes('asap')
      ? 'high'
      : lower.includes('reminder') || lower.includes('follow') || lower.includes('schedule')
      ? 'medium'
      : 'low'

  // Detect type-specific mocks
  if (type === 'email') return emailMock(content, urgency)
  if (type === 'meeting') return meetingMock(content, urgency)
  if (type === 'bill') return billMock(content, urgency)
  if (type === 'assignment') return assignmentMock(content, urgency)
  return genericMock(content, type, urgency)
}

function emailMock(content: string, urgency: AnalysisResult['urgency']): AnalysisResult {
  return {
    suggestedTitle: 'Email — Action Required',
    summary:
      'This email contains important information requiring your attention. Key details have been identified including deadlines and required actions. Review the next steps below to stay on top of your commitments.',
    urgency,
    deadlines: [
      { description: 'Respond to email', date: addDays(2) },
      { description: 'Complete requested action', date: addDays(5) },
    ],
    entities: [
      { name: 'Sender', type: 'person' },
      { name: 'Your Organization', type: 'organization' },
    ],
    nextSteps: [
      'Read email in full and note all action items',
      'Reply to sender acknowledging receipt',
      'Complete any attached requests by stated deadlines',
      'File or archive email once actioned',
    ],
    tasks: [
      { title: 'Reply to email', dueDate: addDays(1), priority: 'high' },
      { title: 'Complete requested action', dueDate: addDays(5), priority: 'medium' },
    ],
    reply: {
      professional:
        'Dear [Sender],\n\nThank you for your email. I have reviewed the contents and will address the items raised by the specified deadline.\n\nPlease let me know if you require anything further in the meantime.\n\nKind regards,\n[Your Name]',
      friendly:
        "Hey! Thanks for reaching out — got your message and I'm on it. I'll have everything sorted by the deadline. Let me know if you need anything else!\n\n[Your Name]",
      acknowledgement: 'Thanks for your email — received and will action shortly.',
    },
  }
}

function meetingMock(content: string, urgency: AnalysisResult['urgency']): AnalysisResult {
  return {
    suggestedTitle: 'Meeting Notes — Action Items',
    summary:
      'These meeting notes capture key decisions, discussion points, and action items from the session. Multiple owners have been assigned tasks with upcoming deadlines. Follow-up is required before the next scheduled meeting.',
    urgency,
    deadlines: [
      { description: 'Complete assigned action items', date: addDays(7) },
      { description: 'Follow-up meeting', date: addDays(14) },
    ],
    entities: [
      { name: 'Meeting Attendees', type: 'person' },
      { name: 'Project Team', type: 'organization' },
    ],
    nextSteps: [
      'Review and confirm all assigned action items',
      'Send meeting recap to all attendees',
      'Schedule follow-up meeting if required',
      'Update project tracking with decisions made',
      'Complete your personally assigned tasks by due dates',
    ],
    tasks: [
      { title: 'Send meeting recap to attendees', dueDate: addDays(1), priority: 'high' },
      { title: 'Complete assigned action items', dueDate: addDays(7), priority: 'high' },
      { title: 'Schedule follow-up meeting', dueDate: addDays(5), priority: 'medium' },
      { title: 'Update project tracker', dueDate: addDays(3), priority: 'low' },
    ],
    reply: {
      professional:
        'Hi Team,\n\nPlease find below a recap of today\'s meeting. I\'ve noted all action items and owners. Please confirm your assigned tasks and flag any corrections.\n\nBest,\n[Your Name]',
      friendly:
        'Hey everyone! Quick recap from today\'s meeting. Check your action items below — let me know if I missed anything. See you at the follow-up!\n\n[Your Name]',
      acknowledgement: 'Thanks all — recap and action items sent, will follow up on progress.',
    },
  }
}

function billMock(content: string, urgency: AnalysisResult['urgency']): AnalysisResult {
  return {
    suggestedTitle: 'Bill / Invoice — Payment Required',
    summary:
      'This is a bill or invoice requiring payment. A due date has been identified along with the amount owed. Failure to pay by the deadline may result in late fees or service interruption. Review payment options below.',
    urgency: urgency === 'low' ? 'medium' : urgency,
    deadlines: [
      { description: 'Payment due', date: addDays(7) },
    ],
    entities: [
      { name: 'Billing Company', type: 'organization' },
    ],
    nextSteps: [
      'Review bill for accuracy before paying',
      'Pay via online portal, phone, or in person',
      'Save payment confirmation for records',
      'Set up autopay to avoid future late fees',
    ],
    tasks: [
      { title: 'Pay bill', dueDate: addDays(5), priority: 'high' },
      { title: 'Save payment confirmation', dueDate: addDays(5), priority: 'low' },
    ],
    reply: {
      professional:
        'To Whom It May Concern,\n\nI am writing to confirm receipt of the bill dated above. I intend to make payment by the due date and will retain confirmation for my records.\n\nRegards,\n[Your Name]',
      friendly:
        "Hi there! Got the bill — planning to pay this before the due date. Let me know if there are any issues.\n\nThanks,\n[Your Name]",
      acknowledgement: 'Bill received — payment will be made before the due date.',
    },
  }
}

function assignmentMock(content: string, urgency: AnalysisResult['urgency']): AnalysisResult {
  return {
    suggestedTitle: 'Assignment — Submission Required',
    summary:
      'This assignment has specific requirements and a submission deadline. Key deliverables have been identified including format requirements and grading criteria. Begin working immediately to avoid last-minute stress.',
    urgency,
    deadlines: [
      { description: 'Assignment submission', date: addDays(10) },
      { description: 'First draft complete', date: addDays(6) },
    ],
    entities: [
      { name: 'Instructor', type: 'person' },
      { name: 'Course', type: 'document' },
    ],
    nextSteps: [
      'Read all assignment requirements carefully',
      'Break assignment into smaller milestones',
      'Research and outline content',
      'Complete first draft',
      'Revise and submit before deadline',
    ],
    tasks: [
      { title: 'Outline and plan assignment', dueDate: addDays(2), priority: 'high' },
      { title: 'Complete first draft', dueDate: addDays(6), priority: 'high' },
      { title: 'Revise draft', dueDate: addDays(8), priority: 'medium' },
      { title: 'Submit assignment', dueDate: addDays(10), priority: 'high' },
    ],
    reply: {
      professional:
        'Dear Professor,\n\nThank you for the assignment details. I have reviewed the requirements and will submit by the stated deadline. Please let me know if I have any questions.\n\nRegards,\n[Your Name]',
      friendly:
        "Hey! Thanks for the details — I've gone through the requirements and have a good plan. Will have it in before the deadline.\n\nCheers,\n[Your Name]",
      acknowledgement: 'Assignment details noted — will submit on time.',
    },
  }
}

function genericMock(
  content: string,
  type: ItemType,
  urgency: AnalysisResult['urgency']
): AnalysisResult {
  return {
    suggestedTitle: `${type.charAt(0).toUpperCase() + type.slice(1)} — Review Required`,
    summary:
      'This document contains information that requires your review and follow-up. Key details, entities, and action items have been extracted below. Prioritize the listed tasks based on urgency level.',
    urgency,
    deadlines: [
      { description: 'Review and action this document', date: addDays(3) },
    ],
    entities: [
      { name: 'Referenced Party', type: 'person' },
      { name: 'Related Organization', type: 'organization' },
    ],
    nextSteps: [
      'Read document carefully and highlight key points',
      'Identify and contact any referenced parties',
      'Complete required actions by deadline',
      'File document for future reference',
    ],
    tasks: [
      { title: 'Review document thoroughly', dueDate: addDays(1), priority: 'medium' },
      { title: 'Take required action', dueDate: addDays(3), priority: 'medium' },
      { title: 'File for records', dueDate: addDays(7), priority: 'low' },
    ],
    reply: {
      professional:
        'Dear [Recipient],\n\nI have reviewed the document and will proceed with the necessary actions by the indicated deadline.\n\nBest regards,\n[Your Name]',
      friendly:
        "Hey! Took a look at this — makes sense, I'll take care of what needs to be done. Ping me if you need anything else!\n\n[Your Name]",
      acknowledgement: 'Received and reviewed — will action accordingly.',
    },
  }
}
