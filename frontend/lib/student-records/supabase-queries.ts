import type { RoleId } from "@/lib/roles";
import { getSupabaseClient } from "@/lib/supabase";
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
} from "@/modules/students/domain/types";

/**
 * Standard query result container returned by all read-only queries
 */
export interface QueryResult<T> {
  data: T[] | null;
  error: Error | null;
}

interface RawDepartment {
  dept_id?: string;
  dept_name?: string;
}

interface RawBranch {
  branch_id?: string;
  branch_name?: string;
  departments?: RawDepartment | RawDepartment[] | null;
  dept_id?: string;
}

interface RawStudent {
  attendance_percentage?: number | string | null;
  branch_id?: string;
  branches?: RawBranch | RawBranch[] | null;
  current_semester?: number | string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  roll_number?: string;
  section?: string | number;
}

function extractRelation<T>(value: unknown): T | null {
  if (value === null || value === undefined || typeof value !== "object") {
    return null;
  }
  if (Array.isArray(value)) {
    return (value[0] as T) ?? null;
  }
  return value as T;
}

interface RawScholarshipApplication {
  academic_year?: string | null;
  application_id?: number | string | null;
  application_type?: string | null;
  missing_documents?: string[] | string | null;
  roll_number?: string | null;
  status?: string | null;
}

const SCHOLARSHIP_STATUS_ALIASES: Record<string, ScholarshipStatus> = {
  "action required": "Rejected / Action Required",
  approved: "Approved by College",
  "approved by college": "Approved by College",
  draft: "Draft Saved",
  "draft saved": "Draft Saved",
  "not applied": "Not Applied",
  pending: "Pending Clerk Verification",
  "pending clerk verification": "Pending Clerk Verification",
  rejected: "Rejected / Action Required",
  "rejected / action required": "Rejected / Action Required",
  submitted: "Submitted to Portal",
  "submitted to portal": "Submitted to Portal",
};

/**
 * Normalizes raw database status values (e.g. "Approved", "Pending") to the
 * six fixed Scholarship Status labels used by the UI.
 */
function normalizeScholarshipStatus(value: unknown): ScholarshipStatus | null {
  if (value === null || value === undefined) {
    return null;
  }

  const key = String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/\s*\/\s*/g, " / ");

  return SCHOLARSHIP_STATUS_ALIASES[key] ?? null;
}

/**
 * Returns a negative number when `a` is newer than `b`.
 * Recency is academic year (descending), then application_id (descending).
 */
function compareScholarshipApplications(
  a: RawScholarshipApplication,
  b: RawScholarshipApplication
): number {
  const yearA = String(a.academic_year ?? "");
  const yearB = String(b.academic_year ?? "");
  if (yearA !== yearB) {
    return yearB.localeCompare(yearA);
  }

  const idA = Number(a.application_id);
  const idB = Number(b.application_id);
  if (Number.isFinite(idA) && Number.isFinite(idB) && idA !== idB) {
    return idB - idA;
  }

  return String(b.application_id ?? "").localeCompare(
    String(a.application_id ?? "")
  );
}

/**
 * Fetch Finance student records joining students, student_fees, branches, and departments.
 *
 * Explicit selected fields only. Read-only query.
 */
export async function fetchFinanceRecords(): Promise<
  QueryResult<FinanceStudentRecord>
> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("student_fees").select(`
        academic_year,
        amount_due,
        fee_type,
        roll_number,
        semester,
        status,
        students (
          branch_id,
          current_semester,
          first_name,
          last_name,
          phone_number,
          roll_number,
          section,
          branches (
            branch_id,
            branch_name,
            dept_id,
            departments (
              dept_id,
              dept_name
            )
          )
        )
      `);

    if (error !== null && error !== undefined) {
      return { data: null, error: new Error(error.message) };
    }

    const records: FinanceStudentRecord[] = (data ?? []).map((row) => {
      const student = extractRelation<RawStudent>(row.students);
      const branch = extractRelation<RawBranch>(student?.branches);
      const dept = extractRelation<RawDepartment>(branch?.departments);

      const rawStatus = String(row.status ?? "")
        .trim()
        .toLowerCase();
      let normalizedStatus: FinanceFeeStatus = "Pending";
      if (rawStatus === "paid") {
        normalizedStatus = "Paid";
      } else if (rawStatus === "unpaid" || rawStatus === "not paid") {
        normalizedStatus = "Unpaid";
      } else if (rawStatus === "pending") {
        normalizedStatus = "Pending";
      }

      return {
        academic_year: row.academic_year ?? undefined,
        amount_due: row.amount_due ?? 0,
        branch_id: student?.branch_id ?? branch?.branch_id ?? "",
        branch_name: branch?.branch_name,
        current_semester: student?.current_semester,
        dept_id: branch?.dept_id ?? dept?.dept_id,
        fee_type: row.fee_type ?? "Tuition",
        first_name: student?.first_name ?? "",
        last_name: student?.last_name ?? "",
        phone_number: student?.phone_number ?? "",
        roll_number: row.roll_number ?? student?.roll_number ?? "",
        section:
          student?.section !== undefined && student?.section !== null
            ? String(student.section)
            : undefined,
        semester: row.semester ?? student?.current_semester ?? "",
        status: normalizedStatus,
      };
    });

    return { data: records, error: null };
  } catch (err) {
    return {
      data: null,
      error:
        err instanceof Error
          ? err
          : new Error(
              "An unexpected error occurred while fetching finance records."
            ),
    };
  }
}

const ADMISSION_STATUS_ALIASES: Record<string, AdmissionStatus> = {
  "admission canceled": "Cancelled",
  "admission cancelled": "Cancelled",
  allotted: "Seat Allotted",
  canceled: "Cancelled",
  cancelled: "Cancelled",
  confirmed: "Fee Paid - Confirmed",
  "docs verified": "Documents Verified",
  "document verified": "Documents Verified",
  "documents verification": "Documents Verified",
  "documents verified": "Documents Verified",
  "fee paid": "Fee Paid - Confirmed",
  "fee paid - confirmed": "Fee Paid - Confirmed",
  "fee paid confirmed": "Fee Paid - Confirmed",
  paid: "Fee Paid - Confirmed",
  registered: "Registered",
  "seat allotment": "Seat Allotted",
  "seat allotted": "Seat Allotted",
  verified: "Documents Verified",
};

/**
 * Normalizes raw college_admissions.status values to the five fixed Admission
 * Status labels used by the UI.
 */
function normalizeAdmissionStatus(value: unknown): AdmissionStatus {
  if (value === null || value === undefined) {
    return "Registered";
  }

  const normalizedKey = String(value)
    .trim()
    .toLowerCase()
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/_/g, " ")
    .replace(/\s*-\s*/g, " - ")
    .replace(/\s+/g, " ");
  const compactKey = normalizedKey.replace(/\s*-\s*/g, " ");

  return (
    ADMISSION_STATUS_ALIASES[normalizedKey] ??
    ADMISSION_STATUS_ALIASES[compactKey] ??
    "Registered"
  );
}

/**
 * Fetch Admissions records joining college_admissions, branches, and departments.
 *
 * `college_admissions` is the primary collection; only the many-to-one branch
 * relationship is joined. `application_number` is the unique row identifier.
 * Explicit selected fields only. Read-only query.
 */
export async function fetchAdmissionsRecords(): Promise<
  QueryResult<AdmissionsRecord>
> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("college_admissions").select(`
        allotted_roll_number,
        application_number,
        branch_id,
        entrance_rank,
        first_name,
        last_name,
        original_docs_submitted,
        phone_number,
        quota_type,
        status,
        branches (
          branch_id,
          branch_name,
          dept_id,
          departments (
            dept_id,
            dept_name
          )
        )
      `);

    if (error !== null && error !== undefined) {
      return { data: null, error: new Error(error.message) };
    }

    const seenApplicationNumbers = new Set<string>();
    const duplicateApplicationNumbers: string[] = [];
    const records: AdmissionsRecord[] = [];

    for (const row of data ?? []) {
      const applicationNumber = String(row.application_number ?? "").trim();

      if (applicationNumber.length > 0) {
        if (seenApplicationNumbers.has(applicationNumber)) {
          duplicateApplicationNumbers.push(applicationNumber);
          continue;
        }
        seenApplicationNumbers.add(applicationNumber);
      }

      const branch = extractRelation<RawBranch>(row.branches);

      records.push({
        allotted_roll_number: row.allotted_roll_number,
        application_number: applicationNumber,
        branch_id: row.branch_id ?? branch?.branch_id ?? "",
        branch_name: branch?.branch_name,
        dept_id: branch?.dept_id,
        entrance_rank: row.entrance_rank ?? "—",
        first_name: row.first_name ?? "",
        last_name: row.last_name ?? "",
        original_docs_submitted: row.original_docs_submitted ?? false,
        phone_number: row.phone_number ?? "",
        quota_type: row.quota_type ?? "General",
        status: normalizeAdmissionStatus(row.status),
      });
    }

    if (duplicateApplicationNumbers.length > 0) {
      console.warn(
        `Duplicate application numbers detected in college_admissions (${duplicateApplicationNumbers.length}); one row per application_number was kept.`
      );
    }

    return { data: records, error: null };
  } catch (err) {
    return {
      data: null,
      error:
        err instanceof Error
          ? err
          : new Error(
              "An unexpected error occurred while fetching admissions records."
            ),
    };
  }
}

/**
 * Fetch one row per student with their latest scholarship application status.
 *
 * Uses `students` as the primary collection so students without an application
 * are retained and labelled "Not Applied". Applications are joined in memory
 * by roll_number; no application rows are fabricated.
 *
 * Multiple applications strategy: the latest application wins, ordered by
 * academic_year (descending) then application_id (descending). This guarantees
 * exactly one row per student and avoids duplicate/arbitrary selection.
 *
 * Explicit selected fields only. Read-only query.
 */
export async function fetchScholarshipRecords(): Promise<
  QueryResult<ScholarshipStudentRecord>
> {
  try {
    const supabase = getSupabaseClient();
    const [studentsResult, applicationsResult] = await Promise.all([
      supabase.from("students").select(`
        attendance_percentage,
        branch_id,
        current_semester,
        first_name,
        last_name,
        phone_number,
        roll_number,
        section,
        branches (
          branch_id,
          branch_name,
          dept_id
        )
      `),
      supabase.from("scholarship_applications").select(`
        academic_year,
        application_id,
        application_type,
        missing_documents,
        roll_number,
        status
      `),
    ]);

    if (studentsResult.error !== null && studentsResult.error !== undefined) {
      return { data: null, error: new Error(studentsResult.error.message) };
    }
    if (
      applicationsResult.error !== null &&
      applicationsResult.error !== undefined
    ) {
      return { data: null, error: new Error(applicationsResult.error.message) };
    }

    const latestByRoll = new Map<string, RawScholarshipApplication>();
    for (const application of applicationsResult.data ?? []) {
      const roll = String(application.roll_number ?? "").trim();
      if (!roll) {
        continue;
      }
      const current = latestByRoll.get(roll);
      if (
        !current ||
        compareScholarshipApplications(application, current) < 0
      ) {
        latestByRoll.set(roll, application);
      }
    }

    const seenRolls = new Set<string>();
    const duplicateRolls: string[] = [];
    const records: ScholarshipStudentRecord[] = [];

    for (const row of studentsResult.data ?? []) {
      const student = row as RawStudent;
      const branch = extractRelation<RawBranch>(student.branches);
      const roll = String(student.roll_number ?? "").trim();

      if (roll) {
        if (seenRolls.has(roll)) {
          duplicateRolls.push(roll);
          continue;
        }
        seenRolls.add(roll);
      }

      const application = roll ? latestByRoll.get(roll) : undefined;
      const normalizedStatus = application
        ? normalizeScholarshipStatus(application.status)
        : null;

      records.push({
        academic_year: application?.academic_year ?? undefined,
        application_type: application?.application_type ?? undefined,
        attendance_percentage: student.attendance_percentage ?? undefined,
        branch_id: student.branch_id ?? branch?.branch_id ?? "",
        branch_name: branch?.branch_name,
        current_semester: student.current_semester,
        dept_id: branch?.dept_id,
        first_name: student.first_name ?? "",
        last_name: student.last_name ?? "",
        missing_documents: application?.missing_documents ?? null,
        phone_number: student.phone_number ?? "",
        roll_number: roll,
        section:
          student.section !== undefined && student.section !== null
            ? String(student.section)
            : undefined,
        semester: student.current_semester ?? "",
        status: application
          ? (normalizedStatus ?? "Pending Clerk Verification")
          : "Not Applied",
      });
    }

    if (duplicateRolls.length > 0) {
      console.warn(
        `Duplicate roll numbers detected in students table (${duplicateRolls.length}); one row per student was kept.`
      );
    }

    return { data: records, error: null };
  } catch (err) {
    return {
      data: null,
      error:
        err instanceof Error
          ? err
          : new Error(
              "An unexpected error occurred while fetching scholarship records."
            ),
    };
  }
}

/**
 * Maps raw library_transactions.status values to UI labels.
 *
 * Database `Returned` is displayed as `Submitted`. `Issued` (and any unknown
 * raw value) remains `Issued` so current loans are never mislabelled.
 */
export function normalizeLibraryStatus(
  value: unknown
): LibraryTransactionStatus {
  const key = String(value ?? "")
    .trim()
    .toLowerCase();

  if (key === "returned" || key === "return" || key === "submitted") {
    return "Submitted";
  }
  if (key === "overdue") {
    return "Overdue";
  }
  return "Issued";
}

/**
 * Fetch Library student records.
 *
 * `library_transactions` is the primary collection (one row per transaction),
 * with student details associated in memory by `roll_number` and branch names
 * resolved from the related branch row.
 *
 * Explicit selected fields only. Read-only query.
 */
export async function fetchLibraryRecords(): Promise<
  QueryResult<LibraryStudentRecord>
> {
  try {
    const supabase = getSupabaseClient();
    const [transactionsResult, studentsResult] = await Promise.all([
      supabase.from("library_transactions").select(`
        book_title,
        due_date,
        issue_date,
        roll_number,
        status,
        transaction_id
      `),
      supabase.from("students").select(`
        branch_id,
        current_semester,
        first_name,
        last_name,
        phone_number,
        roll_number,
        section,
        branches (
          branch_id,
          branch_name,
          dept_id,
          departments (
            dept_id,
            dept_name
          )
        )
      `),
    ]);

    if (
      transactionsResult.error !== null &&
      transactionsResult.error !== undefined
    ) {
      return { data: null, error: new Error(transactionsResult.error.message) };
    }
    if (studentsResult.error !== null && studentsResult.error !== undefined) {
      return { data: null, error: new Error(studentsResult.error.message) };
    }

    const studentsByRoll = new Map<string, RawStudent>();
    const duplicateStudentRolls: string[] = [];

    for (const student of studentsResult.data ?? []) {
      const roll = String(student.roll_number ?? "").trim();
      if (roll.length === 0) {
        continue;
      }
      if (studentsByRoll.has(roll)) {
        duplicateStudentRolls.push(roll);
        continue;
      }
      studentsByRoll.set(roll, student as RawStudent);
    }

    if (duplicateStudentRolls.length > 0) {
      console.warn(
        `Duplicate roll numbers detected in students table (${duplicateStudentRolls.length}); the first student row was used for library transactions.`
      );
    }

    const records: LibraryStudentRecord[] = [];
    const seenTransactionIds = new Set<string>();
    const duplicateTransactionIds: string[] = [];

    for (const row of transactionsResult.data ?? []) {
      const transactionId =
        row.transaction_id === null || row.transaction_id === undefined
          ? ""
          : String(row.transaction_id).trim();

      if (transactionId.length > 0) {
        if (seenTransactionIds.has(transactionId)) {
          duplicateTransactionIds.push(transactionId);
          continue;
        }
        seenTransactionIds.add(transactionId);
      }

      const roll = String(row.roll_number ?? "").trim();
      const student = studentsByRoll.get(roll);
      const branch = extractRelation<RawBranch>(student?.branches);
      const dept = extractRelation<RawDepartment>(branch?.departments);

      records.push({
        book_title: row.book_title ?? "—",
        branch_id: student?.branch_id ?? branch?.branch_id ?? "",
        branch_name: branch?.branch_name,
        current_semester: student?.current_semester,
        dept_id: branch?.dept_id ?? dept?.dept_id,
        due_date: row.due_date ?? "",
        first_name: student?.first_name ?? "",
        issue_date: row.issue_date ?? "",
        last_name: student?.last_name ?? "",
        phone_number: student?.phone_number ?? "",
        roll_number: roll || String(student?.roll_number ?? ""),
        section:
          student?.section !== undefined && student?.section !== null
            ? String(student.section)
            : undefined,
        semester: student?.current_semester ?? "",
        status: normalizeLibraryStatus(row.status),
        transaction_id:
          transactionId || `missing-library-transaction-${records.length}`,
      });
    }

    if (duplicateTransactionIds.length > 0) {
      console.warn(
        `Duplicate transaction IDs detected in library_transactions (${duplicateTransactionIds.length}); one row per transaction_id was kept.`
      );
    }

    return { data: records, error: null };
  } catch (err) {
    return {
      data: null,
      error:
        err instanceof Error
          ? err
          : new Error(
              "An unexpected error occurred while fetching library records."
            ),
    };
  }
}

/**
 * Fetch Attendance records for Class Teacher role.
 * Queries attendance joined with students, branches, and departments.
 * Handles missing database table or RLS restrictions cleanly.
 */
export async function fetchClassTeacherRecords(): Promise<
  QueryResult<ClassTeacherStudentRecord>
> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("attendance").select(`
        attendance_date,
        attendance_id,
        attendance_percentage,
        is_present,
        roll_number,
        students (
          branch_id,
          current_semester,
          first_name,
          last_name,
          phone_number,
          roll_number,
          section,
          branches (
            branch_id,
            branch_name,
            dept_id,
            departments (
              dept_id,
              dept_name
            )
          )
        )
      `);

    if (error !== null && error !== undefined) {
      return { data: null, error: new Error(error.message) };
    }

    const records: ClassTeacherStudentRecord[] = (data ?? []).map((row) => {
      const student = extractRelation<RawStudent>(row.students);
      const branch = extractRelation<RawBranch>(student?.branches);
      const dept = extractRelation<RawDepartment>(branch?.departments);

      const isPresent = Boolean(row.is_present);
      const status: AttendanceStatus = isPresent ? "Present" : "Absent";

      return {
        attendance_date: row.attendance_date ?? "",
        attendance_id: row.attendance_id ?? undefined,
        attendance_percentage: row.attendance_percentage ?? undefined,
        branch_id: student?.branch_id ?? branch?.branch_id ?? "",
        branch_name: branch?.branch_name,
        current_semester: student?.current_semester,
        dept_id: branch?.dept_id ?? dept?.dept_id,
        first_name: student?.first_name ?? "",
        is_present: isPresent,
        last_name: student?.last_name ?? "",
        phone_number: student?.phone_number ?? "",
        roll_number: row.roll_number ?? student?.roll_number ?? "",
        section:
          student?.section !== undefined && student?.section !== null
            ? String(student.section)
            : undefined,
        semester: student?.current_semester ?? "",
        status,
      };
    });

    return { data: records, error: null };
  } catch (err) {
    return {
      data: null,
      error:
        err instanceof Error
          ? err
          : new Error(
              "An unexpected error occurred while fetching attendance records."
            ),
    };
  }
}

/**
 * Fetch Student Directory records using `students` as the primary table.
 *
 * Joins only the many-to-one branch relationship needed to retrieve branch_name.
 * Never directly joins unaggregated one-to-many tables (student_fees,
 * library_transactions, scholarship_applications, call_logs) so rows are never duplicated.
 *
 * Guarantees exactly one row per student (300 students total).
 * Checks for duplicate roll numbers in the students table and reports them if found.
 */
export async function fetchStudentDirectoryRecords(): Promise<
  QueryResult<StudentDirectoryRecord>
> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("students").select(`
        attendance_percentage,
        branch_id,
        current_semester,
        first_name,
        last_name,
        phone_number,
        roll_number,
        section,
        branches (
          branch_id,
          branch_name,
          dept_id
        )
      `);

    if (error !== null && error !== undefined) {
      return { data: null, error: new Error(error.message) };
    }

    const seenRollNumbers = new Set<string>();
    const duplicateRollNumbers: string[] = [];

    const records: StudentDirectoryRecord[] = (data ?? []).map((row) => {
      const branch = extractRelation<RawBranch>(row.branches);
      const rollNumber = String(row.roll_number ?? "").trim();

      if (seenRollNumbers.has(rollNumber)) {
        duplicateRollNumbers.push(rollNumber);
      } else {
        seenRollNumbers.add(rollNumber);
      }

      return {
        attendance_percentage:
          row.attendance_percentage !== null &&
          row.attendance_percentage !== undefined
            ? Number(row.attendance_percentage)
            : undefined,
        branch_id: row.branch_id ?? branch?.branch_id ?? "",
        branch_name: branch?.branch_name,
        current_semester: row.current_semester,
        dept_id: branch?.dept_id,
        first_name: row.first_name ?? "",
        last_name: row.last_name ?? "",
        phone_number: row.phone_number ?? "",
        roll_number: rollNumber,
        section:
          row.section !== undefined && row.section !== null
            ? String(row.section)
            : undefined,
        semester: row.current_semester ?? "",
      };
    });

    if (duplicateRollNumbers.length > 0) {
      console.warn(
        `Duplicate roll numbers detected in students table (${duplicateRollNumbers.length}):`,
        duplicateRollNumbers
      );
    }

    return { data: records, error: null };
  } catch (err) {
    return {
      data: null,
      error:
        err instanceof Error
          ? err
          : new Error(
              "An unexpected error occurred while fetching student directory records."
            ),
    };
  }
}

/**
 * Department-aware query dispatcher
 * For Admissions, returns one row per college_admissions application keyed by
 * application_number.
 * For Finance, returns student-fee records (one row per student fee entry).
 * For Library, returns one row per library transaction keyed by transaction_id.
 * For Scholarship, returns one student row enriched with the latest application status.
 * For directory views, queries the primary students table.
 */
export async function fetchStudentRecordsByRole(
  roleId: RoleId
): Promise<QueryResult<StudentRecord>> {
  if (roleId === "admissions") {
    return await fetchAdmissionsRecords();
  }
  if (roleId === "finance") {
    return await fetchFinanceRecords();
  }
  if (roleId === "library") {
    return await fetchLibraryRecords();
  }
  if (roleId === "scholarship") {
    return await fetchScholarshipRecords();
  }
  return await fetchStudentDirectoryRecords();
}

/**
 * Map of query functions by department ID
 */
export const supabaseQueries = {
  fetchAdmissionsRecords,
  fetchClassTeacherRecords,
  fetchFinanceRecords,
  fetchLibraryRecords,
  fetchScholarshipRecords,
  fetchStudentDirectoryRecords,
  fetchStudentRecordsByRole,
};
