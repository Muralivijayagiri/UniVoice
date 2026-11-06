import type { RoleId } from "./roles";

export type CallOutcomeKey = "successful" | "no_answer" | "busy" | "failed";

export type CallOutcomeItem = {
  key: CallOutcomeKey;
  label: string;
  count: number;
  percentage: number;
  color: string;
  badgeClass: string;
  description: string;
};

export type CampaignActivity = {
  id: string;
  name: string;
  department: string;
  roleId: RoleId;
  targetCount: number;
  callsAttempted: number;
  callsSuccessful: number;
  status: "completed" | "in_progress" | "scheduled" | "failed";
  successRate: number;
  timestamp: string;
  avgDuration: string;
};

export type AnalyticsSummary = {
  totalCampaigns: number;
  callsAttempted: number;
  successfulCalls: number;
  successRate: number;
  avgDuration: string;
  voiceLoopLatency: string;
  outcomes: CallOutcomeItem[];
  campaigns: CampaignActivity[];
};

export const MOCK_RECENT_CAMPAIGNS: CampaignActivity[] = [
  {
    avgDuration: "1m 48s",
    callsAttempted: 42,
    callsSuccessful: 37,
    department: "Finance Department",
    id: "camp-act-001",
    name: "Overdue Semester Tuition Reminder (Final Notice)",
    roleId: "finance",
    status: "completed",
    successRate: 88.1,
    targetCount: 42,
    timestamp: "Today, 10:30 AM",
  },
  {
    avgDuration: "1m 32s",
    callsAttempted: 64,
    callsSuccessful: 58,
    department: "Finance Department",
    id: "camp-act-002",
    name: "Hostel Fee Verification Deadline Alert",
    roleId: "finance",
    status: "completed",
    successRate: 90.6,
    targetCount: 64,
    timestamp: "Yesterday, 3:15 PM",
  },
  {
    avgDuration: "2m 04s",
    callsAttempted: 28,
    callsSuccessful: 23,
    department: "Admissions Department",
    id: "camp-act-003",
    name: "Provisional Admission Document Verification",
    roleId: "admissions",
    status: "completed",
    successRate: 82.1,
    targetCount: 28,
    timestamp: "Yesterday, 11:00 AM",
  },
  {
    avgDuration: "1m 55s",
    callsAttempted: 15,
    callsSuccessful: 12,
    department: "Admissions Department",
    id: "camp-act-004",
    name: "NRI Quota Counseling Schedule Outreach",
    roleId: "admissions",
    status: "completed",
    successRate: 80.0,
    targetCount: 15,
    timestamp: "2 days ago",
  },
  {
    avgDuration: "1m 24s",
    callsAttempted: 35,
    callsSuccessful: 30,
    department: "Scholarship Section",
    id: "camp-act-005",
    name: "State Merit Scholarship Renewal Notice",
    roleId: "scholarship",
    status: "completed",
    successRate: 85.7,
    targetCount: 35,
    timestamp: "3 days ago",
  },
  {
    avgDuration: "1m 40s",
    callsAttempted: 22,
    callsSuccessful: 19,
    department: "Scholarship Section",
    id: "camp-act-006",
    name: "Post-Matric Scholarship Bank Linkage Reminder",
    roleId: "scholarship",
    status: "completed",
    successRate: 86.4,
    targetCount: 22,
    timestamp: "4 days ago",
  },
  {
    avgDuration: "1m 15s",
    callsAttempted: 19,
    callsSuccessful: 14,
    department: "Library Administration",
    id: "camp-act-007",
    name: "Overdue Library Returns & Fine Settlement",
    roleId: "library",
    status: "in_progress",
    successRate: 73.7,
    targetCount: 19,
    timestamp: "In progress",
  },
  {
    avgDuration: "1m 10s",
    callsAttempted: 30,
    callsSuccessful: 26,
    department: "Library Administration",
    id: "camp-act-008",
    name: "Semester Book Bank Return Notification",
    roleId: "library",
    status: "completed",
    successRate: 86.7,
    targetCount: 30,
    timestamp: "5 days ago",
  },
];

export const MOCK_GLOBAL_ANALYTICS: AnalyticsSummary = {
  avgDuration: "1m 42s",
  callsAttempted: 1480,
  campaigns: MOCK_RECENT_CAMPAIGNS,
  outcomes: [
    {
      badgeClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
      color: "oklch(0.7 0.16 165)",
      count: 1214,
      description: "Call connected, intent verified & transcript parsed",
      key: "successful",
      label: "Successful Calls",
      percentage: 82.0,
    },
    {
      badgeClass: "border-amber-500/30 bg-amber-500/10 text-amber-400",
      color: "oklch(0.78 0.18 70)",
      count: 142,
      description: "Ringing timed out without clerk/student pickup",
      key: "no_answer",
      label: "No Answer",
      percentage: 9.6,
    },
    {
      badgeClass: "border-purple-500/30 bg-purple-500/10 text-purple-400",
      color: "oklch(0.65 0.25 305)",
      count: 84,
      description: "Line engaged or voicemail forwarded",
      key: "busy",
      label: "Line Busy",
      percentage: 5.7,
    },
    {
      badgeClass: "border-rose-500/30 bg-rose-500/10 text-rose-400",
      color: "oklch(0.68 0.22 18)",
      count: 40,
      description: "Carrier failure or invalid student contact number",
      key: "failed",
      label: "Failed / Invalid",
      percentage: 2.7,
    },
  ],
  successfulCalls: 1214,
  successRate: 82.0,
  totalCampaigns: 24,
  voiceLoopLatency: "840ms",
};

export function getDepartmentAnalytics(
  roleId?: RoleId | "all"
): AnalyticsSummary {
  if (!roleId || roleId === "all") {
    return MOCK_GLOBAL_ANALYTICS;
  }

  const filteredCampaigns = MOCK_RECENT_CAMPAIGNS.filter(
    (c) => c.roleId === roleId
  );

  const totalAttempted = filteredCampaigns.reduce(
    (sum, c) => sum + c.callsAttempted,
    0
  );
  const totalSuccessful = filteredCampaigns.reduce(
    (sum, c) => sum + c.callsSuccessful,
    0
  );
  const rate =
    totalAttempted > 0
      ? Number(((totalSuccessful / totalAttempted) * 100).toFixed(1))
      : 82.0;

  const noAnswer = Math.round(totalAttempted * 0.096);
  const busy = Math.round(totalAttempted * 0.057);
  const failed = Math.max(
    0,
    totalAttempted - totalSuccessful - noAnswer - busy
  );

  return {
    avgDuration: "1m 38s",
    callsAttempted: totalAttempted,
    campaigns: filteredCampaigns,
    outcomes: [
      {
        badgeClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
        color: "oklch(0.7 0.16 165)",
        count: totalSuccessful,
        description: "Call connected, intent verified & transcript parsed",
        key: "successful",
        label: "Successful Calls",
        percentage: rate,
      },
      {
        badgeClass: "border-amber-500/30 bg-amber-500/10 text-amber-400",
        color: "oklch(0.78 0.18 70)",
        count: noAnswer,
        description: "Ringing timed out without clerk/student pickup",
        key: "no_answer",
        label: "No Answer",
        percentage: Number(((noAnswer / totalAttempted) * 100).toFixed(1)),
      },
      {
        badgeClass: "border-purple-500/30 bg-purple-500/10 text-purple-400",
        color: "oklch(0.65 0.25 305)",
        count: busy,
        description: "Line engaged or voicemail forwarded",
        key: "busy",
        label: "Line Busy",
        percentage: Number(((busy / totalAttempted) * 100).toFixed(1)),
      },
      {
        badgeClass: "border-rose-500/30 bg-rose-500/10 text-rose-400",
        color: "oklch(0.68 0.22 18)",
        count: failed,
        description: "Carrier failure or invalid student contact number",
        key: "failed",
        label: "Failed / Invalid",
        percentage: Number(((failed / totalAttempted) * 100).toFixed(1)),
      },
    ],
    successfulCalls: totalSuccessful,
    successRate: rate,
    totalCampaigns: filteredCampaigns.length,
    voiceLoopLatency: "820ms",
  };
}
