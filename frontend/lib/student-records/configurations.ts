import type { RoleId } from "@/lib/roles";
import type {
  AdmissionStatus,
  AdmissionsRecord,
  AttendanceStatus,
  ClassTeacherStudentRecord,
  FinanceFeeStatus,
  FinanceStudentRecord,
  LibraryStudentRecord,
  LibraryTransactionStatus,
  ScholarshipStatus,
  ScholarshipStudentRecord,
  StudentDirectoryRecord,
  StudentRecord,
} from "./types";

export interface AcademicDepartment {
  dept_id: string;
  dept_name: string;
}

export interface AcademicBranch {
  branch_id: string;
  branch_name: string;
  dept_id: string;
}

/**
 * Academic Departments aligned with live Supabase database
 */
export const ACADEMIC_DEPARTMENTS: AcademicDepartment[] = [
  { dept_id: "CIVIL", dept_name: "Civil Engineering" },
  { dept_id: "MECH", dept_name: "Mechanical Engineering" },
  { dept_id: "CSE", dept_name: "Computer Science & Engineering" },
  { dept_id: "EEE", dept_name: "Electrical & Electronics Engineering" },
  { dept_id: "ET", dept_name: "Emerging Technologies" },
  {
    dept_id: "ECE",
    dept_name: "Electronics & Communication Engineering",
  },
  { dept_id: "IT", dept_name: "Information Technology" },
  {
    dept_id: "MME",
    dept_name: "Metallurgical & Materials Engineering",
  },
];

/**
 * Academic Branches with strict MGIT acronym tags for branch_id
 */
export const ACADEMIC_BRANCHES: AcademicBranch[] = [
  { branch_id: "CIVIL", branch_name: "Civil Engineering", dept_id: "CIVIL" },
  { branch_id: "MEC", branch_name: "Mechanical Engineering", dept_id: "MECH" },
  { branch_id: "MCT", branch_name: "Mechatronics", dept_id: "MECH" },
  {
    branch_id: "CSE",
    branch_name: "Computer Science & Eng.",
    dept_id: "CSE",
  },
  {
    branch_id: "EEE",
    branch_name: "Electrical & Electronics",
    dept_id: "EEE",
  },
  {
    branch_id: "ECE",
    branch_name: "Electronics & Comm.",
    dept_id: "ECE",
  },
  {
    branch_id: "IT",
    branch_name: "Information Technology",
    dept_id: "IT",
  },
  {
    branch_id: "CSB",
    branch_name: "Computer Science & Business Systems",
    dept_id: "IT",
  },
  {
    branch_id: "MME",
    branch_name: "Metallurgical & Materials",
    dept_id: "MME",
  },
  {
    branch_id: "CSD",
    branch_name: "CSE - Data Science",
    dept_id: "ET",
  },
  { branch_id: "CSM", branch_name: "CSE - AI & ML", dept_id: "ET" },
];

export const FINANCE_STATUSES: FinanceFeeStatus[] = [
  "Paid",
  "Unpaid",
  "Pending",
];

export const ADMISSION_STATUSES: AdmissionStatus[] = [
  "Registered",
  "Documents Verified",
  "Seat Allotted",
  "Fee Paid - Confirmed",
  "Cancelled",
];

export const SCHOLARSHIP_STATUSES: ScholarshipStatus[] = [
  "Not Applied",
  "Draft Saved",
  "Submitted to Portal",
  "Pending Clerk Verification",
  "Approved by College",
  "Rejected / Action Required",
];

export const LIBRARY_STATUSES: LibraryTransactionStatus[] = [
  "Issued",
  "Overdue",
  "Submitted",
];

export const ATTENDANCE_STATUSES: AttendanceStatus[] = ["Present", "Absent"];

/**
 * Centralized page size for Student Records pagination across all five university roles.
 * Referenced in AGENTS.md under "Student Records Pagination".
 * To change the number of records per page across all departments, modify this constant only.
 */
export const STUDENT_RECORDS_PAGE_SIZE = 25;

const FIRST_NAMES = [
  "Rahul",
  "Priya",
  "Sai",
  "Ananya",
  "Vikram",
  "Sneha",
  "Aditya",
  "Divya",
  "Rohan",
  "Meera",
  "Kavya",
  "Arjun",
  "Neha",
  "Karthik",
  "Pooja",
  "Varun",
  "Deepika",
  "Harsh",
  "Swati",
  "Nikhil",
  "Tanvi",
  "Siddharth",
  "Ishaan",
  "Riya",
];

const LAST_NAMES = [
  "Kumar",
  "Reddy",
  "Verma",
  "Singh",
  "Rao",
  "Sharma",
  "Gupta",
  "Patel",
  "Nair",
  "Iyer",
  "Joshi",
  "Choudhury",
  "Bose",
  "Mehta",
  "Deshmukh",
  "Kulkarni",
];

const BRANCH_INFOS = [
  { branch_id: "CSE", branch_name: "Computer Science & Eng.", dept_id: "CSE" },
  { branch_id: "CSD", branch_name: "CSE - Data Science", dept_id: "ET" },
  { branch_id: "CSM", branch_name: "CSE - AI & ML", dept_id: "ET" },
  { branch_id: "ECE", branch_name: "Electronics & Comm.", dept_id: "ECE" },
  { branch_id: "IT", branch_name: "Information Technology", dept_id: "IT" },
  {
    branch_id: "MEC",
    branch_name: "Mechanical Engineering",
    dept_id: "MECH",
  },
  {
    branch_id: "EEE",
    branch_name: "Electrical & Electronics",
    dept_id: "EEE",
  },
  { branch_id: "CIVIL", branch_name: "Civil Engineering", dept_id: "CIVIL" },
];

function generateDemoFinanceRecords(): FinanceStudentRecord[] {
  const records: FinanceStudentRecord[] = [];
  const statuses: FinanceFeeStatus[] = ["Paid", "Unpaid", "Pending"];

  // 60 distinct students with multiple fee records to verify legitimate multi-fee rows
  for (let i = 1; i <= 60; i += 1) {
    const fName = FIRST_NAMES[(i - 1) % FIRST_NAMES.length];
    const lName = LAST_NAMES[(i - 1) % LAST_NAMES.length];
    const b = BRANCH_INFOS[(i - 1) % BRANCH_INFOS.length];
    const sem = ((i % 4) + 1) * 2 - 1;
    const sec = i % 2 === 0 ? "2" : "1";
    const rollNumber = `24261A0${b.branch_id.slice(0, 2)}${String(i).padStart(3, "0")}`;
    const phone = `+91 98765 ${String(10_000 + i).slice(1)}`;

    // 1. Primary Tuition fee record for every student
    records.push({
      academic_year: "2026-2027",
      amount_due: 45_000,
      branch_id: b.branch_id,
      branch_name: b.branch_name,
      current_semester: sem,
      dept_id: b.dept_id,
      fee_type: "Tuition",
      first_name: fName,
      last_name: lName,
      phone_number: phone,
      roll_number: rollNumber,
      section: sec,
      semester: sem,
      status: statuses[(i - 1) % statuses.length],
    });

    // 2. Exam fee record for odd-numbered students
    if (i % 2 === 1) {
      records.push({
        academic_year: "2026-2027",
        amount_due: 1500,
        branch_id: b.branch_id,
        branch_name: b.branch_name,
        current_semester: sem,
        dept_id: b.dept_id,
        fee_type: "Exam",
        first_name: fName,
        last_name: lName,
        phone_number: phone,
        roll_number: rollNumber,
        section: sec,
        semester: sem,
        status: statuses[i % statuses.length],
      });
    }

    // 3. Hostel or Library fee record for every 3rd student
    if (i % 3 === 0) {
      const isHostel = i % 6 === 0;
      records.push({
        academic_year: "2026-2027",
        amount_due: isHostel ? 32_000 : 1200,
        branch_id: b.branch_id,
        branch_name: b.branch_name,
        current_semester: sem,
        dept_id: b.dept_id,
        fee_type: isHostel ? "Hostel" : "Library",
        first_name: fName,
        last_name: lName,
        phone_number: phone,
        roll_number: rollNumber,
        section: sec,
        semester: sem,
        status: statuses[(i + 1) % statuses.length],
      });
    }
  }
  return records;
}

function generateDemoAdmissionsRecords(): AdmissionsRecord[] {
  const records: AdmissionsRecord[] = [];
  const quotas = ["Merit", "Management", "NRI", "Sports"];
  const statuses: AdmissionStatus[] = [
    "Fee Paid - Confirmed",
    "Registered",
    "Seat Allotted",
    "Documents Verified",
    "Cancelled",
  ];

  for (let i = 1; i <= 120; i += 1) {
    const fName = FIRST_NAMES[(i - 1) % FIRST_NAMES.length];
    const lName = LAST_NAMES[(i - 1) % LAST_NAMES.length];
    const b = BRANCH_INFOS[(i - 1) % BRANCH_INFOS.length];
    const quota = quotas[i % quotas.length];
    const status = statuses[i % statuses.length];
    const docs = i % 3 !== 0;

    records.push({
      allotted_roll_number:
        status === "Fee Paid - Confirmed"
          ? `25${b.branch_id.slice(0, 2)}${String(i).padStart(3, "0")}`
          : null,
      application_number: `ADM-2025-${1000 + i}`,
      branch_id: b.branch_id,
      branch_name: b.branch_name,
      dept_id: b.dept_id,
      entrance_rank: 1000 + i * 115,
      first_name: fName,
      last_name: lName,
      original_docs_submitted: docs,
      phone_number: `+91 98111 ${String(20_000 + i).slice(1)}`,
      quota_type: quota,
      status,
    });
  }
  return records;
}

function generateDemoScholarshipRecords(): ScholarshipStudentRecord[] {
  const records: ScholarshipStudentRecord[] = [];
  const appTypes = ["Renewal", "Fresh"];
  const statuses: ScholarshipStatus[] = [
    "Not Applied",
    "Draft Saved",
    "Submitted to Portal",
    "Pending Clerk Verification",
    "Approved by College",
    "Rejected / Action Required",
  ];

  for (let i = 1; i <= 120; i += 1) {
    const fName = FIRST_NAMES[(i - 1) % FIRST_NAMES.length];
    const lName = LAST_NAMES[(i - 1) % LAST_NAMES.length];
    const b = BRANCH_INFOS[(i - 1) % BRANCH_INFOS.length];
    const sem = ((i % 4) + 1) * 2 - 1;
    const sec = i % 2 === 0 ? "2" : "1";
    const status = statuses[i % statuses.length];
    const appType = appTypes[i % appTypes.length];
    const missingDocs =
      status === "Rejected / Action Required" || status === "Not Applied"
        ? "TS-EPASS Verification Missing"
        : null;

    records.push({
      academic_year: "2026-2027",
      application_type: appType,
      branch_id: b.branch_id,
      branch_name: b.branch_name,
      current_semester: sem,
      dept_id: b.dept_id,
      first_name: fName,
      last_name: lName,
      missing_documents: missingDocs,
      phone_number: `+91 87654 ${String(30_000 + i).slice(1)}`,
      roll_number: `24261A0${b.branch_id.slice(0, 2)}${String(i).padStart(3, "0")}`,
      section: sec,
      semester: sem,
      status,
    });
  }
  return records;
}

function generateDemoLibraryRecords(): LibraryStudentRecord[] {
  const records: LibraryStudentRecord[] = [];
  const books = [
    "Operating Systems Concepts",
    "Computer Networks (Tanenbaum)",
    "Database System Concepts (Korth)",
    "Introduction to Algorithms (CLRS)",
    "Artificial Intelligence (Russell & Norvig)",
    "Digital Logic and Design (Morris Mano)",
  ];
  const statuses: LibraryTransactionStatus[] = [
    "Issued",
    "Overdue",
    "Submitted",
  ];
  const issueDates = ["2026-11-01", "2026-10-05", "2026-09-12"];
  const dueDates = ["2026-11-20", "2026-10-25", "2026-10-02"];
  let transactionId = 0;

  for (let i = 1; i <= 120; i += 1) {
    const fName = FIRST_NAMES[(i - 1) % FIRST_NAMES.length];
    const lName = LAST_NAMES[(i - 1) % LAST_NAMES.length];
    const b = BRANCH_INFOS[(i - 1) % BRANCH_INFOS.length];
    const sem = ((i % 4) + 1) * 2 - 1;
    const sec = i % 2 === 0 ? "2" : "1";
    const rollNumber = `24261A05${String(i).padStart(2, "0")}`;
    const transactionCount = i % 6 === 0 ? 3 : i % 4 === 0 ? 2 : 1;

    for (let t = 0; t < transactionCount; t += 1) {
      transactionId += 1;
      const status = statuses[(i + t - 1) % statuses.length];
      const bookTitle = books[(i + t - 1) % books.length];

      records.push({
        book_title: bookTitle,
        branch_id: b.branch_id,
        branch_name: b.branch_name,
        current_semester: sem,
        dept_id: b.dept_id,
        due_date: dueDates[t] ?? dueDates[0],
        first_name: fName,
        issue_date: issueDates[t] ?? issueDates[0],
        last_name: lName,
        phone_number: `+91 98765 ${String(40_000 + i).slice(1)}`,
        roll_number: rollNumber,
        section: sec,
        semester: sem,
        status,
        transaction_id: transactionId,
      });
    }
  }
  return records;
}

function generateDemoClassTeacherRecords(): ClassTeacherStudentRecord[] {
  const records: ClassTeacherStudentRecord[] = [];

  for (let i = 1; i <= 120; i += 1) {
    const fName = FIRST_NAMES[(i - 1) % FIRST_NAMES.length];
    const lName = LAST_NAMES[(i - 1) % LAST_NAMES.length];
    const b = BRANCH_INFOS[(i - 1) % BRANCH_INFOS.length];
    const sem = ((i % 4) + 1) * 2 - 1;
    const sec = i % 2 === 0 ? "2" : "1";
    const isPresent = i % 5 !== 0;
    const pct =
      Math.round((55 + ((i * 17) % 40) + (isPresent ? 5 : 0)) * 10) / 10;
    const date = i % 3 === 0 ? "2026-11-03" : "2026-11-04";

    records.push({
      attendance_date: date,
      attendance_id: i,
      attendance_percentage: pct,
      branch_id: b.branch_id,
      branch_name: b.branch_name,
      current_semester: sem,
      dept_id: b.dept_id,
      first_name: fName,
      is_present: isPresent,
      last_name: lName,
      phone_number: `+91 98765 ${String(50_000 + i).slice(1)}`,
      roll_number: `24261A0${b.branch_id.slice(0, 2)}${String(i).padStart(3, "0")}`,
      section: sec,
      semester: sem,
      status: isPresent ? "Present" : "Absent",
    });
  }
  return records;
}

function generateDemoStudentDirectoryRecords(): StudentDirectoryRecord[] {
  const records: StudentDirectoryRecord[] = [];

  for (let i = 1; i <= 300; i += 1) {
    const fName = FIRST_NAMES[(i - 1) % FIRST_NAMES.length];
    const lName = LAST_NAMES[(i - 1) % LAST_NAMES.length];
    const b = BRANCH_INFOS[(i - 1) % BRANCH_INFOS.length];
    const sem = ((i % 4) + 1) * 2 - 1;
    const sec = i % 2 === 0 ? "2" : "1";
    // Realistic attendance percentages with 2 decimals (e.g. 85.50, 92.00, 76.25)
    // Student 300 has undefined to verify graceful handling of students without attendance records
    const attendancePercentage =
      i === 300
        ? undefined
        : Number((60 + ((i * 19) % 36) + (i % 4) * 0.25).toFixed(2));

    records.push({
      attendance_percentage: attendancePercentage,
      branch_id: b.branch_id,
      branch_name: b.branch_name,
      current_semester: sem,
      dept_id: b.dept_id,
      first_name: fName,
      last_name: lName,
      phone_number: `+91 98765 ${String(10_000 + i).slice(1)}`,
      roll_number: `24261A0${b.branch_id.slice(0, 2)}${String(i).padStart(3, "0")}`,
      section: sec,
      semester: sem,
    });
  }
  return records;
}

export const DEMO_STUDENT_DIRECTORY_RECORDS: StudentDirectoryRecord[] =
  generateDemoStudentDirectoryRecords();

export const DEMO_FINANCE_RECORDS: FinanceStudentRecord[] =
  generateDemoFinanceRecords();

export const DEMO_ADMISSIONS_RECORDS: AdmissionsRecord[] =
  generateDemoAdmissionsRecords();

export const DEMO_SCHOLARSHIP_RECORDS: ScholarshipStudentRecord[] =
  generateDemoScholarshipRecords();

/**
 * Student directory rows enriched with scholarship application data.
 *
 * Students are the primary collection: a student without an application stays in
 * the list and is labelled "Not Applied". Existing demo applications are joined
 * by roll_number; no extra application records are fabricated.
 */
const demoScholarshipByRoll = new Map(
  DEMO_SCHOLARSHIP_RECORDS.map((application) => [
    application.roll_number,
    application,
  ])
);

export const DEMO_SCHOLARSHIP_DIRECTORY_RECORDS: ScholarshipStudentRecord[] =
  DEMO_STUDENT_DIRECTORY_RECORDS.map((student) => {
    const application = demoScholarshipByRoll.get(student.roll_number);
    return {
      ...student,
      academic_year: application?.academic_year,
      application_type: application?.application_type,
      missing_documents: application?.missing_documents ?? null,
      status: application?.status ?? "Not Applied",
    };
  });

export const DEMO_LIBRARY_RECORDS: LibraryStudentRecord[] =
  generateDemoLibraryRecords();

export const DEMO_CLASS_TEACHER_RECORDS: ClassTeacherStudentRecord[] =
  generateDemoClassTeacherRecords();

export function getDemoRecordsByRole(roleId: RoleId): StudentRecord[] {
  if (roleId === "finance") {
    return DEMO_FINANCE_RECORDS;
  }
  if (roleId === "admissions") {
    return DEMO_ADMISSIONS_RECORDS;
  }
  if (roleId === "library") {
    return DEMO_LIBRARY_RECORDS;
  }
  if (roleId === "scholarship") {
    return DEMO_SCHOLARSHIP_DIRECTORY_RECORDS;
  }
  return DEMO_STUDENT_DIRECTORY_RECORDS;
}

export const studentRecordsConfigurations = {
  ACADEMIC_BRANCHES,
  ACADEMIC_DEPARTMENTS,
  ADMISSION_STATUSES,
  ATTENDANCE_STATUSES,
  DEMO_SCHOLARSHIP_DIRECTORY_RECORDS,
  DEMO_STUDENT_DIRECTORY_RECORDS,
  FINANCE_STATUSES,
  getDemoRecordsByRole,
  LIBRARY_STATUSES,
  SCHOLARSHIP_STATUSES,
  STUDENT_RECORDS_PAGE_SIZE,
};
