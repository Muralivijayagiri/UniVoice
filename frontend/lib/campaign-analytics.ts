import type { RoleId } from "./roles";

export type CampaignStatus =
  | "completed"
  | "in_progress"
  | "scheduled"
  | "failed"
  | "draft";

export type CampaignOutcomeBreakdown = {
  successful: number;
  noAnswer: number;
  busy: number;
  failed: number;
};

export type CampaignRecord = {
  id: string;
  name: string;
  description: string;
  department: string;
  roleId: RoleId;
  createdAt: string;
  dateFormatted: string;
  targetCount: number;
  status: CampaignStatus;
  // Per-campaign telephony figures (synthetic & mathematically reconciled)
  callsAttempted: number;
  callsSuccessful: number;
  outcomes: CampaignOutcomeBreakdown;
  successRate: number; // calculated as (callsSuccessful / callsAttempted) * 100
  avgDuration: string;
  timeframe: string;
};

// 8 Realistic Synthetic Campaigns matching the user reference design and UniVoice departments
export const MOCK_CAMPAIGN_RECORDS: CampaignRecord[] = [
  {
    avgDuration: "1m 48s",
    callsAttempted: 1240,
    callsSuccessful: 1092,
    createdAt: "2025-01-26T10:30:00Z",
    dateFormatted: "Jan 26, 2025",
    department: "Finance",
    description: "Automated voice reminders for pending tuition fees",
    id: "camp-fin-001",
    name: "Overdue Semester Tuition Reminder",
    outcomes: {
      busy: 42,
      failed: 18,
      noAnswer: 88,
      successful: 1092,
    },
    roleId: "finance",
    status: "completed",
    successRate: 88.1,
    targetCount: 1240,
    timeframe: "10:30 AM",
  },
  {
    avgDuration: "1m 32s",
    callsAttempted: 620,
    callsSuccessful: 558,
    createdAt: "2025-01-18T14:15:00Z",
    dateFormatted: "Jan 18, 2025",
    department: "Finance",
    description: "Outreach for hostel fee verification and payment",
    id: "camp-fin-002",
    name: "Hostel Fee Verification",
    outcomes: {
      busy: 18,
      failed: 6,
      noAnswer: 38,
      successful: 558,
    },
    roleId: "finance",
    status: "in_progress",
    successRate: 90.0,
    targetCount: 856,
    timeframe: "02:15 PM",
  },
  {
    avgDuration: "1m 24s",
    callsAttempted: 642,
    callsSuccessful: 552,
    createdAt: "2025-01-12T11:20:00Z",
    dateFormatted: "Jan 12, 2025",
    department: "Scholarship",
    description: "Reminder for scholarship document renewal",
    id: "camp-sch-001",
    name: "Scholarship Renewal Follow-up",
    outcomes: {
      busy: 26,
      failed: 12,
      noAnswer: 52,
      successful: 552,
    },
    roleId: "scholarship",
    status: "completed",
    successRate: 86.0,
    targetCount: 642,
    timeframe: "11:20 AM",
  },
  {
    avgDuration: "0s",
    callsAttempted: 0,
    callsSuccessful: 0,
    createdAt: "2025-01-08T15:45:00Z",
    dateFormatted: "Jan 08, 2025",
    department: "Library",
    description: "Voice notification for overdue library books",
    id: "camp-lib-001",
    name: "Library Return Notice",
    outcomes: {
      busy: 0,
      failed: 0,
      noAnswer: 0,
      successful: 0,
    },
    roleId: "library",
    status: "draft",
    successRate: 0,
    targetCount: 497,
    timeframe: "03:45 PM",
  },
  {
    avgDuration: "2m 04s",
    callsAttempted: 921,
    callsSuccessful: 778,
    createdAt: "2025-01-05T09:10:00Z",
    dateFormatted: "Jan 05, 2025",
    department: "Admissions",
    description: "Follow-up for pending admission documents",
    id: "camp-adm-001",
    name: "Admissions Document Verification",
    outcomes: {
      busy: 41,
      failed: 18,
      noAnswer: 84,
      successful: 778,
    },
    roleId: "admissions",
    status: "completed",
    successRate: 84.5,
    targetCount: 921,
    timeframe: "09:10 AM",
  },
  {
    avgDuration: "1m 55s",
    callsAttempted: 380,
    callsSuccessful: 310,
    createdAt: "2024-12-28T13:20:00Z",
    dateFormatted: "Dec 28, 2024",
    department: "Admissions",
    description: "Outreach for NRI quota counseling schedule",
    id: "camp-adm-002",
    name: "NRI Quota Counseling",
    outcomes: {
      busy: 20,
      failed: 8,
      noAnswer: 42,
      successful: 310,
    },
    roleId: "admissions",
    status: "completed",
    successRate: 81.6,
    targetCount: 380,
    timeframe: "01:20 PM",
  },
  {
    avgDuration: "1m 40s",
    callsAttempted: 450,
    callsSuccessful: 392,
    createdAt: "2024-12-20T16:05:00Z",
    dateFormatted: "Dec 20, 2024",
    department: "Scholarship",
    description: "Voice alerts for merit scholarship application",
    id: "camp-sch-002",
    name: "Merit Scholarship Notification",
    outcomes: {
      busy: 14,
      failed: 8,
      noAnswer: 36,
      successful: 392,
    },
    roleId: "scholarship",
    status: "in_progress",
    successRate: 87.1,
    targetCount: 615,
    timeframe: "04:05 PM",
  },
  {
    avgDuration: "1m 12s",
    callsAttempted: 743,
    callsSuccessful: 654,
    createdAt: "2024-12-15T11:50:00Z",
    dateFormatted: "Dec 15, 2024",
    department: "Library",
    description: "Reminder for book bank return before semester end",
    id: "camp-lib-002",
    name: "Book Bank Collection Reminder",
    outcomes: {
      busy: 25,
      failed: 11,
      noAnswer: 53,
      successful: 654,
    },
    roleId: "library",
    status: "completed",
    successRate: 88.0,
    targetCount: 743,
    timeframe: "11:50 AM",
  },
];

export function getCampaignById(id: string): CampaignRecord | undefined {
  return MOCK_CAMPAIGN_RECORDS.find((c) => c.id === id);
}
