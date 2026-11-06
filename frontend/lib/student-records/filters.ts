import type { RoleId } from "@/lib/roles";
import type {
  AdmissionStatus,
  AttendanceStatus,
  FinanceFeeStatus,
  LibraryTransactionStatus,
  ScholarshipStatus,
} from "./types";

export interface StudentRecordsFilterState {
  academicYear?: string;
  admissionStatus?: AdmissionStatus | "all";
  applicationType?: string;
  attendanceDate?: string;
  // New attendance filter fields for Class Teacher
  attendanceFilter?: "all" | "below65" | "below75" | "custom";
  attendanceMax?: number;
  attendanceMin?: number;
  attendanceStatus?: AttendanceStatus | "all";
  branch?: string;
  department?: string;
  docsSubmitted?: "all" | "yes" | "no";
  feeType?: string;
  libraryStatus?: LibraryTransactionStatus | "all";
  paymentStatus?: FinanceFeeStatus | "all";
  quotaType?: string;
  scholarshipStatus?: ScholarshipStatus | "all";
  searchQuery?: string;
  section?: string;
  semester?: string;
}

export const DEFAULT_FILTER_STATE: StudentRecordsFilterState = {
  academicYear: "all",
  admissionStatus: "all",
  applicationType: "all",
  attendanceDate: "all",
  attendanceFilter: "all",
  attendanceStatus: "all",
  branch: "all",
  department: "all",
  docsSubmitted: "all",
  feeType: "all",
  libraryStatus: "all",
  paymentStatus: "all",
  quotaType: "all",
  scholarshipStatus: "all",
  searchQuery: "",
  section: "all",
  semester: "all",
};

/**
 * Checks whether any filter (or search query) is actively filtering records for the current role
 */
export function hasActiveFilters(
  filters: StudentRecordsFilterState,
  roleId: RoleId
): boolean {
  if (
    filters.searchQuery !== undefined &&
    filters.searchQuery.trim().length > 0
  ) {
    return true;
  }
  if (filters.department && filters.department !== "all") {
    return true;
  }
  if (filters.branch && filters.branch !== "all") {
    return true;
  }
  // Attendance filter active?
  if (filters.attendanceFilter && filters.attendanceFilter !== "all") {
    return true;
  }
  // Admissions hides semester & section
  if (roleId !== "admissions") {
    if (filters.semester && filters.semester !== "all") {
      return true;
    }
    if (filters.section && filters.section !== "all") {
      return true;
    }
  }

  switch (roleId) {
    case "finance":
      return (
        (filters.academicYear !== undefined &&
          filters.academicYear !== "all") ||
        (filters.feeType !== undefined && filters.feeType !== "all") ||
        (filters.paymentStatus !== undefined && filters.paymentStatus !== "all")
      );
    case "admissions":
      return (
        (filters.quotaType !== undefined && filters.quotaType !== "all") ||
        (filters.docsSubmitted !== undefined &&
          filters.docsSubmitted !== "all") ||
        (filters.admissionStatus !== undefined &&
          filters.admissionStatus !== "all")
      );
    case "scholarship":
      return (
        (filters.academicYear !== undefined &&
          filters.academicYear !== "all") ||
        (filters.applicationType !== undefined &&
          filters.applicationType !== "all") ||
        (filters.scholarshipStatus !== undefined &&
          filters.scholarshipStatus !== "all")
      );
    case "library":
      return (
        filters.libraryStatus !== undefined && filters.libraryStatus !== "all"
      );
    case "class_teacher": {
      // Handled above via attendanceFilter check
      return false;
    }
    default:
      return false;
  }
}

/**
 * Extract distinct values from records for dropdown filters
 */
export function extractDistinctValues<T extends object>(
  records: T[],
  key: string
): string[] {
  const set = new Set<string>();
  for (const record of records) {
    const val = (record as Record<string, unknown>)[key];
    if (val !== null && val !== undefined && String(val).trim() !== "") {
      set.add(String(val).trim());
    }
  }
  return Array.from(set).sort();
}

/**
 * Extract distinct semester numbers formatted as strings
 */
export function extractDistinctSemesters<T extends object>(
  records: T[]
): string[] {
  const set = new Set<string>();
  for (const r of records) {
    const record = r as Record<string, unknown>;
    const sem = record.semester ?? record.current_semester;
    if (sem !== null && sem !== undefined && String(sem).trim() !== "") {
      set.add(String(sem).trim());
    }
  }
  return Array.from(set).sort((a, b) => Number(a) - Number(b));
}

/**
 * Filters student records combining all active filters with strict AND logic
 */
export function filterStudentRecords<T extends object>(
  records: T[],
  filters: StudentRecordsFilterState,
  roleId: RoleId
): T[] {
  const query = filters.searchQuery?.trim().toLowerCase();

  return records.filter((r) => {
    const row = r as Record<string, unknown>;
    // 1. Text Search query (AND)
    if (query && query.length > 0) {
      const firstName = String(row.first_name ?? "").toLowerCase();
      const lastName = String(row.last_name ?? "").toLowerCase();
      const fullName = `${firstName} ${lastName}`.trim();
      const rollNumber = String(row.roll_number ?? "").toLowerCase();
      const appNumber = String(row.application_number ?? "").toLowerCase();
      const phone = String(row.phone_number ?? "").toLowerCase();
      const bookTitle = String(row.book_title ?? "").toLowerCase();
      const branchName = String(row.branch_name ?? "").toLowerCase();

      const matchesSearch =
        fullName.includes(query) ||
        rollNumber.includes(query) ||
        appNumber.includes(query) ||
        phone.includes(query) ||
        bookTitle.includes(query) ||
        branchName.includes(query);

      if (!matchesSearch) {
        return false;
      }
    }

    // 2. Global: Academic Department (AND)
    if (filters.department && filters.department !== "all") {
      const rowDept = String(row.dept_id ?? "");
      if (rowDept !== filters.department) {
        return false;
      }
    }

    // 3. Global: Branch (AND)
    if (filters.branch && filters.branch !== "all") {
      const rowBranchId = String(row.branch_id ?? "");
      const rowBranchName = String(row.branch_name ?? "");
      if (rowBranchId !== filters.branch && rowBranchName !== filters.branch) {
        return false;
      }
    }

    // 4. Global: Semester & Section (AND) — hidden for Admissions
    if (roleId !== "admissions") {
      if (filters.semester && filters.semester !== "all") {
        const sem = String(row.semester ?? row.current_semester ?? "");
        if (sem !== filters.semester) {
          return false;
        }
      }

      if (filters.section && filters.section !== "all") {
        const sec = String(row.section ?? "").toUpperCase();
        if (sec !== filters.section.toUpperCase()) {
          return false;
        }
      }
    }

    // 5. Department-specific filters (AND)
    switch (roleId) {
      case "finance": {
        if (
          filters.academicYear &&
          filters.academicYear !== "all" &&
          String(row.academic_year ?? "") !== filters.academicYear
        ) {
          return false;
        }
        if (
          filters.feeType &&
          filters.feeType !== "all" &&
          String(row.fee_type ?? "") !== filters.feeType
        ) {
          return false;
        }
        if (
          filters.paymentStatus &&
          filters.paymentStatus !== "all" &&
          String(row.status ?? "") !== filters.paymentStatus
        ) {
          return false;
        }
        break;
      }
      case "admissions": {
        if (
          filters.quotaType &&
          filters.quotaType !== "all" &&
          String(row.quota_type ?? "") !== filters.quotaType
        ) {
          return false;
        }
        if (filters.docsSubmitted && filters.docsSubmitted !== "all") {
          const raw = row.original_docs_submitted;
          const isSubmitted =
            raw === true ||
            raw === 1 ||
            String(raw).toLowerCase() === "true" ||
            String(raw).toLowerCase() === "yes";
          if (filters.docsSubmitted === "yes" && !isSubmitted) {
            return false;
          }
          if (filters.docsSubmitted === "no" && isSubmitted) {
            return false;
          }
        }
        if (
          filters.admissionStatus &&
          filters.admissionStatus !== "all" &&
          String(row.status ?? "") !== filters.admissionStatus
        ) {
          return false;
        }
        break;
      }
      case "scholarship": {
        if (
          filters.academicYear &&
          filters.academicYear !== "all" &&
          String(row.academic_year ?? "") !== filters.academicYear
        ) {
          return false;
        }
        if (
          filters.applicationType &&
          filters.applicationType !== "all" &&
          String(row.application_type ?? "") !== filters.applicationType
        ) {
          return false;
        }
        if (
          filters.scholarshipStatus &&
          filters.scholarshipStatus !== "all" &&
          String(row.status ?? "") !== filters.scholarshipStatus
        ) {
          return false;
        }
        break;
      }
      case "library": {
        if (
          filters.libraryStatus &&
          filters.libraryStatus !== "all" &&
          String(row.status ?? "") !== filters.libraryStatus
        ) {
          return false;
        }
        break;
      }
      case "class_teacher": {
        // Attendance filter logic applied after this block
        break;
      }
      default:
        break;
    }

    // Attendance filter for class teacher (applies only when roleId is class_teacher)
    if (roleId === "class_teacher") {
      const att = (row as Record<string, unknown>).attendance_percentage as
        | number
        | null
        | undefined;
      switch (filters.attendanceFilter) {
        case "below65":
          if (att === null || att === undefined) {
            return false;
          }
          return att < 65;
        case "below75":
          if (att === null || att === undefined) {
            return false;
          }
          return att < 75;
        case "custom": {
          if (att === null || att === undefined) {
            return false;
          }
          const min = filters.attendanceMin ?? 0;
          const max = filters.attendanceMax ?? 100;
          return att >= min && att <= max;
        }
        default:
          return true;
      }
    }

    return true;
  });
}

export const studentRecordsFilters = {
  DEFAULT_FILTER_STATE,
  extractDistinctSemesters,
  extractDistinctValues,
  filterStudentRecords,
  hasActiveFilters,
};
