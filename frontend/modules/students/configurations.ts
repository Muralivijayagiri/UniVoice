import {
  ACADEMIC_BRANCHES,
  ACADEMIC_DEPARTMENTS,
} from "@/modules/departments/domain/academic-structure";
import {
  DEMO_SCHOLARSHIP_DIRECTORY_RECORDS,
  DEMO_STUDENT_DIRECTORY_RECORDS,
  getDemoRecordsByRole,
} from "@/modules/students/data/demo-records";
import type {
  AdmissionStatus,
  AttendanceStatus,
  FinanceFeeStatus,
  LibraryTransactionStatus,
  ScholarshipStatus,
} from "@/modules/students/domain/types";

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
