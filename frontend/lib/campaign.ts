import type { RoleId } from "./roles";

export type CampaignStudent = {
  admissionStatus?: string; // Admissions
  attendancePercentage?: string; // Class Teacher
  balance?: string; // Tuition
  daysOverdue?: string; // Library
  deadline?: string; // All
  department?: string;
  hostelStatus?: string; // Hostel
  id: string;
  idNumber: string;
  missingDocs?: string; // Scholarship
  name: string;
  overdueItem?: string; // Library
  phone: string;
  program?: string;
};

export type CampaignStatus = "pending_review" | "approved" | "cancelled";

export type CampaignPreviewData = {
  approvedAt?: string;
  callRecommended: boolean;
  createdAt: string;
  dataOverview: string;
  dataSources: string[];
  department: string;
  extraColumnHeader: string;
  id: string;
  recommendationReason: string;
  roleId: RoleId;
  selectionCriteria: string;
  status: CampaignStatus;
  students: CampaignStudent[];
  summary: string;
  targetCount: number;
  title: string;
  typeKey:
    | "tuition"
    | "scholarship"
    | "library"
    | "hostel"
    | "class_teacher"
    | "admissions";
};

export const MOCK_CAMPAIGNS: Record<
  | "tuition"
  | "scholarship"
  | "library"
  | "hostel"
  | "class_teacher"
  | "admissions",
  CampaignPreviewData
> = {
  admissions: {
    callRecommended: true,
    createdAt: "2026-10-27T11:30:00Z",
    dataOverview:
      "Cross-referenced TS-EAMCET allotment list with registry; 3 candidates have pending document verification.",
    dataSources: ["student_master_db", "admissions_registry"],
    department: "Admissions Department",
    extraColumnHeader: "Admission Status",
    id: "camp-adm-2026-002",
    recommendationReason:
      "Original document submission required before enrollment reporting deadline.",
    roleId: "admissions",
    selectionCriteria:
      "Admissions 2025 • Seat Allotted • Original Certificates Pending",
    status: "pending_review",
    students: [
      {
        admissionStatus: "Seat Allotted",
        deadline: "Feb 10, 2026",
        id: "rec-adm-01",
        idNumber: "ADM-2025-1042",
        name: "Vikram Rathore",
        phone: "+91 98111-XXXX1",
        program: "B.Tech Computer Science",
      },
      {
        admissionStatus: "Documents Verified",
        deadline: "Feb 10, 2026",
        id: "rec-adm-02",
        idNumber: "ADM-2025-1089",
        name: "Neha Sundaram",
        phone: "+91 98111-XXXX2",
        program: "B.Tech Information Technology",
      },
      {
        admissionStatus: "Seat Allotted",
        deadline: "Feb 10, 2026",
        id: "rec-adm-03",
        idNumber: "ADM-2025-1150",
        name: "Karan Johar",
        phone: "+91 98111-XXXX3",
        program: "B.Tech Electronics & Comm.",
      },
    ],
    summary:
      "Automated voice follow-up for newly allotted candidates regarding pending original certificate submission.",
    targetCount: 3,
    title: "Admissions Document Follow-up — Draft Preview",
    typeKey: "admissions",
  },

  class_teacher: {
    callRecommended: true,
    createdAt: "2026-10-27T12:00:00Z",
    dataOverview:
      "Aggregated daily attendance records; 3 students identified with cumulative attendance below 75%.",
    dataSources: ["student_master_db", "attendance_records_view"],
    department: "Class Teacher",
    extraColumnHeader: "Attendance %",
    id: "camp-att-2026-006",
    recommendationReason:
      "Mandatory university regulation requires parent notification for students below condonation threshold.",
    roleId: "class_teacher",
    selectionCriteria:
      "Aggregate Attendance < 75% • Current Semester • Parent Phone Verified",
    status: "pending_review",
    students: [
      {
        attendancePercentage: "68.20%",
        deadline: "Immediate",
        id: "rec-att-01",
        idNumber: "24261A0502",
        name: "Priya Reddy",
        phone: "+91 98765-XXXX1",
        program: "CSE • Sem 3 • Sec 1",
      },
      {
        attendancePercentage: "64.50%",
        deadline: "Immediate",
        id: "rec-att-02",
        idNumber: "23261A0301",
        name: "Vikram Singh",
        phone: "+91 98765-XXXX2",
        program: "MEC • Sem 5 • Sec 2",
      },
      {
        attendancePercentage: "72.00%",
        deadline: "Immediate",
        id: "rec-att-03",
        idNumber: "24261A05A1",
        name: "Sai Kiran",
        phone: "+91 98765-XXXX3",
        program: "CSE • Sem 3 • Sec 2",
      },
    ],
    summary:
      "Automated voice outreach alerting parents of students with cumulative attendance shortage below 75%.",
    targetCount: 3,
    title: "Attendance Shortage Parent Outreach — Draft Preview",
    typeKey: "class_teacher",
  },
  hostel: {
    callRecommended: true,
    createdAt: "2026-10-27T16:00:00Z",
    dataOverview:
      "Cross-referenced campus housing records with fees ledger; 4 parent contacts have unverified allotments.",
    dataSources: [
      "student_master_db",
      "hostel_allotment_db",
      "fees_ledger_prod",
    ],
    department: "Finance Department",
    extraColumnHeader: "Hostel Dues & Room",
    id: "camp-fin-2026-005",
    recommendationReason:
      "Unverified room allotments will be released to waitlisted students in 72 hours.",
    roleId: "finance",
    selectionCriteria:
      "Hostel Blocks A-D • Allotment Verification: Pending • Due within 72 hours",
    status: "pending_review",
    students: [
      {
        deadline: "Feb 02, 2026",
        hostelStatus: "₹18,500 (Room B-204)",
        id: "rec-14",
        idNumber: "2024-HST-0082",
        name: "Kavya Menon (Parent: Dr. R. Menon)",
        phone: "+91 98765-XXXX4",
        program: "B.Tech Bio-Tech (Hostel Block B)",
      },
      {
        deadline: "Feb 02, 2026",
        hostelStatus: "₹22,000 (Room A-102)",
        id: "rec-15",
        idNumber: "2024-HST-0119",
        name: "Arjun Singhania (Parent: S. Singhania)",
        phone: "+91 98765-XXXX5",
        program: "B.Tech Mechanical (Hostel Block A)",
      },
      {
        deadline: "Feb 02, 2026",
        hostelStatus: "₹19,000 (Room C-310)",
        id: "rec-16",
        idNumber: "2023-HST-0245",
        name: "Pranav Varma (Parent: V. Varma)",
        phone: "+91 98765-XXXX6",
        program: "B.Tech Computer Science (Hostel Block C)",
      },
      {
        deadline: "Feb 02, 2026",
        hostelStatus: "₹18,500 (Room D-108)",
        id: "rec-17",
        idNumber: "2024-HST-0301",
        name: "Diya Chatterjee (Parent: A. Chatterjee)",
        phone: "+91 98765-XXXX7",
        program: "B.Tech Electronics (Hostel Block D)",
      },
    ],
    summary:
      "Automated outreach to parents regarding the upcoming hostel fee verification deadline and room allotment confirmations.",
    targetCount: 4,
    title: "Hostel Fee Verification — Draft Preview",
    typeKey: "hostel",
  },

  library: {
    callRecommended: true,
    createdAt: "2026-10-27T14:20:00Z",
    dataOverview:
      "Queried Koha ILS system; 3 students hold reserved reference volumes blocking degree clearance.",
    dataSources: ["student_master_db", "koha_library_ils"],
    department: "Library Administration",
    extraColumnHeader: "Overdue Book & Days",
    id: "camp-lib-2026-004",
    recommendationReason:
      "Books have active hold requests from upcoming semester batches; library clearance required.",
    roleId: "library",
    selectionCriteria:
      "Graduating Batch 2025 • Circulation Overdue > 14 Days • Reserved Books",
    status: "pending_review",
    students: [
      {
        deadline: "Immediate",
        id: "rec-11",
        idNumber: "2022-BTECH-0331",
        name: "Aditi Joshi",
        overdueItem: "Distributed Systems (Coulouris) • 21 days",
        phone: "+91 98765-XXXX1",
        program: "Computer Science",
      },
      {
        deadline: "Immediate",
        id: "rec-12",
        idNumber: "2022-BTECH-0104",
        name: "Gaurav Sen",
        overdueItem: "Operating System Concepts • 16 days",
        phone: "+91 98765-XXXX2",
        program: "Information Technology",
      },
      {
        deadline: "Immediate",
        id: "rec-13",
        idNumber: "2022-BTECH-0195",
        name: "Tanvi Deshmukh",
        overdueItem: "Process Dynamics & Control • 28 days",
        phone: "+91 98765-XXXX3",
        program: "Chemical Engineering",
      },
    ],
    summary:
      "Notification to graduating final-year students holding high-demand catalog items past the maximum circulation limit.",
    targetCount: 3,
    title: "Overdue Library Returns — Draft Preview",
    typeKey: "library",
  },

  scholarship: {
    callRecommended: true,
    createdAt: "2026-10-27T09:00:00Z",
    dataOverview:
      "Queried 642 active scholarship accounts; 3 beneficiaries flagged for missing compliance proofs.",
    dataSources: ["student_master_db", "scholarship_portal_sync"],
    department: "Scholarship Section",
    extraColumnHeader: "Missing Documents",
    id: "camp-sch-2026-003",
    recommendationReason:
      "State treasury submission cutoff is in 5 days; missing files will revoke grant.",
    roleId: "scholarship",
    selectionCriteria:
      "Merit Tier 1 & 2 • Renewal Status: Incomplete • Missing: Income Cert / Grade Card",
    status: "pending_review",
    students: [
      {
        deadline: "Jan 31, 2026",
        id: "rec-08",
        idNumber: "2024-BTECH-0112",
        missingDocs: "Income Certificate 2025",
        name: "Deepak Kumar",
        phone: "+91 98765-XXXX8",
        program: "Electrical Engineering",
      },
      {
        deadline: "Jan 31, 2026",
        id: "rec-09",
        idNumber: "2024-BTECH-0290",
        missingDocs: "Semester 4 Grade Sheet",
        name: "Meera Krishnan",
        phone: "+91 98765-XXXX9",
        program: "Civil Engineering",
      },
      {
        deadline: "Jan 31, 2026",
        id: "rec-10",
        idNumber: "2024-BTECH-0078",
        missingDocs: "Bank Aadhaar Seeding Proof",
        name: "Harshavardhan Rao",
        phone: "+91 98765-XXXX0",
        program: "Data Science",
      },
    ],
    summary:
      "Urgent voice reminders for eligible state & merit scholarship beneficiaries missing mandatory renewal documents.",
    targetCount: 3,
    title: "Scholarship Renewal Verification — Draft Preview",
    typeKey: "scholarship",
  },
  tuition: {
    callRecommended: true,
    createdAt: "2026-10-27T10:30:00Z",
    dataOverview:
      "Queried 1,240 records across ledger; 4 students identified with verified billing holds.",
    dataSources: ["student_master_db", "fees_ledger_prod"],
    department: "Finance Department",
    extraColumnHeader: "Outstanding Balance",
    id: "camp-fin-2026-001",
    recommendationReason:
      "Outstanding tuition balance above threshold with final registration hold pending.",
    roleId: "finance",
    selectionCriteria:
      "Batch Year: 2023 (3rd-Year) • Balance > ₹25,000 • Due Date: Passed",
    status: "pending_review",
    students: [
      {
        balance: "₹34,500",
        deadline: "Feb 05, 2026",
        id: "rec-01",
        idNumber: "2023-BTECH-0142",
        name: "Aarav Sharma",
        phone: "+91 98765-XXXX1",
        program: "Computer Science",
      },
      {
        balance: "₹28,000",
        deadline: "Feb 05, 2026",
        id: "rec-02",
        idNumber: "2023-BTECH-0819",
        name: "Sneha Patel",
        phone: "+91 98765-XXXX2",
        program: "Information Technology",
      },
      {
        balance: "₹41,200",
        deadline: "Feb 05, 2026",
        id: "rec-03",
        idNumber: "2023-BTECH-0215",
        name: "Rohan Verma",
        phone: "+91 98765-XXXX3",
        program: "Electronics & Communication",
      },
      {
        balance: "₹30,000",
        deadline: "Feb 05, 2026",
        id: "rec-04",
        idNumber: "2023-BTECH-0054",
        name: "Ananya Reddy",
        phone: "+91 98765-XXXX4",
        program: "Mechanical Engineering",
      },
    ],
    summary:
      "Automated voice reminders for 3rd-year students with pending semester tuition fees exceeding ₹25,000 threshold.",
    targetCount: 4,
    title: "Tuition Fee Reminder — Draft Preview",
    typeKey: "tuition",
  },
};

export function getMockCampaign(keyOrRoleId?: string): CampaignPreviewData {
  if (keyOrRoleId) {
    const lower = keyOrRoleId.toLowerCase();
    if (
      lower.includes("class_teacher") ||
      lower.includes("teacher") ||
      lower.includes("attendance")
    ) {
      return { ...MOCK_CAMPAIGNS.class_teacher };
    }
    if (lower.includes("tuition") || lower === "finance") {
      return { ...MOCK_CAMPAIGNS.tuition };
    }
    if (lower.includes("scholarship")) {
      return { ...MOCK_CAMPAIGNS.scholarship };
    }
    if (lower.includes("library")) {
      return { ...MOCK_CAMPAIGNS.library };
    }
    if (lower.includes("hostel")) {
      return { ...MOCK_CAMPAIGNS.hostel };
    }
    if (lower.includes("admission") || lower === "admissions") {
      return { ...MOCK_CAMPAIGNS.admissions };
    }
  }
  return { ...MOCK_CAMPAIGNS.tuition };
}
