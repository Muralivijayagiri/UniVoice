export type FinanceFeeStatus = "Paid" | "Unpaid" | "Pending";

export type AdmissionStatus =
  | "Registered"
  | "Documents Verified"
  | "Seat Allotted"
  | "Fee Paid - Confirmed"
  | "Cancelled";

export type ScholarshipStatus =
  | "Not Applied"
  | "Draft Saved"
  | "Submitted to Portal"
  | "Pending Clerk Verification"
  | "Approved by College"
  | "Rejected / Action Required";

/** Raw status values stored in library_transactions.status. */
export type LibraryDatabaseStatus = "Issued" | "Overdue" | "Returned";

/** Status labels displayed in the Library Administration UI. */
export type LibraryTransactionStatus = "Issued" | "Overdue" | "Submitted";

export type AttendanceStatus = "Present" | "Absent";

export interface StudentBaseRecord {
  branch_id?: string;
  current_semester?: number | string;
  first_name: string;
  last_name: string;
  phone_number: string;
  roll_number: string;
  section?: string;
}

export interface StudentFeeRecord {
  academic_year?: string;
  amount_due: number | string;
  fee_type: string;
  roll_number: string;
  semester?: number | string;
  status: FinanceFeeStatus;
}

export interface BranchRecord {
  branch_id: string;
  branch_name: string;
  dept_id?: string;
}

export interface FinanceStudentRecord extends StudentBaseRecord {
  academic_year?: string;
  amount_due: number | string;
  branch_id: string;
  branch_name?: string;
  current_semester?: number | string;
  dept_id?: string;
  fee_type: string;
  semester: number | string;
  status: FinanceFeeStatus;
}

export interface AdmissionsRecord {
  allotted_roll_number?: string | null;
  application_number: string;
  branch_id: string;
  branch_name?: string;
  dept_id?: string;
  entrance_rank: number | string;
  first_name: string;
  last_name: string;
  original_docs_submitted: boolean | string | number;
  phone_number: string;
  quota_type: string;
  status: AdmissionStatus;
}

export interface ScholarshipStudentRecord extends StudentDirectoryRecord {
  academic_year?: string;
  application_type?: string;
  missing_documents?: string[] | string | null;
  status: ScholarshipStatus;
}

export interface LibraryTransactionRecord {
  book_title: string;
  due_date: string;
  issue_date: string;
  roll_number: string;
  status: LibraryDatabaseStatus;
  transaction_id: number | string;
}

export interface LibraryStudentRecord extends StudentBaseRecord {
  book_title: string;
  branch_id: string;
  branch_name?: string;
  current_semester?: number | string;
  dept_id?: string;
  due_date: string;
  issue_date: string;
  semester?: number | string;
  status: LibraryTransactionStatus;
  transaction_id: number | string;
}

export interface AttendanceRecord {
  attendance_date: string;
  attendance_id?: number | string;
  attendance_percentage?: number | string;
  is_present: boolean | number;
  roll_number: string;
  status?: AttendanceStatus;
}

export interface ClassTeacherStudentRecord extends StudentBaseRecord {
  attendance_date: string;
  attendance_id?: number | string;
  attendance_percentage?: number | string;
  branch_id: string;
  branch_name?: string;
  current_semester?: number | string;
  dept_id?: string;
  is_present: boolean | number;
  section?: string;
  semester?: number | string;
  status: AttendanceStatus;
}

export interface StudentDirectoryRecord extends StudentBaseRecord {
  attendance_percentage?: number | string;
  branch_id: string;
  branch_name?: string;
  current_semester?: number | string;
  dept_id?: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  roll_number: string;
  section?: string;
  semester?: number | string;
}

export type StudentRecord =
  | StudentDirectoryRecord
  | FinanceStudentRecord
  | AdmissionsRecord
  | ScholarshipStudentRecord
  | LibraryStudentRecord
  | ClassTeacherStudentRecord
  | Record<string, unknown>;
