"use client";

import type { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import {
  AlertCircle,
  ChevronDown,
  Lock,
  PanelLeftIcon,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { RoleSelector } from "@/components/chat/role-selector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useActiveChat } from "@/hooks/use-active-chat";
import { useRole } from "@/hooks/use-role";
import { generateCampaignDraft } from "@/lib/student-records/campaign-handoff";
import { fetchStudentRecordsByRole } from "@/lib/student-records/supabase-queries";
import { isSupabaseConfigured, isSupabaseRlsResolved } from "@/lib/supabase";
import { STUDENT_RECORDS_PAGE_SIZE } from "@/modules/students/configurations";
import { getDemoRecordsByRole } from "@/modules/students/data/demo-records";
import {
  DEFAULT_FILTER_STATE,
  filterStudentRecords,
  type StudentRecordsFilterState,
} from "@/modules/students/domain/filters";
import type {
  AdmissionsRecord,
  LibraryStudentRecord,
  StudentRecord,
} from "@/modules/students/domain/types";
import { admissionsColumns } from "./columns/admissions-columns";
import { classTeacherColumns } from "./columns/class-teacher-columns";
import { financeColumns } from "./columns/finance-columns";
import { libraryColumns } from "./columns/library-columns";
import { scholarshipColumns } from "./columns/scholarship-columns";
import { studentDirectoryColumns } from "./columns/student-directory-columns";
import {
  StudentDataTable,
  type StudentTableFeatures,
} from "./student-data-table";
import { StudentRecordsFilters } from "./student-records-filters";
import { StudentTablePagination } from "./student-table-pagination";
import { StudentTableToolbar } from "./student-table-toolbar";

export function StudentRecordsPage() {
  const router = useRouter();
  const { state, toggleSidebar, isMobile } = useSidebar();
  const { selectedRole } = useRole();
  const { setInput } = useActiveChat();

  const [filters, setFilters] =
    useState<StudentRecordsFilterState>(DEFAULT_FILTER_STATE);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [prevRoleId, setPrevRoleId] = useState(selectedRole.id);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const pageSize = STUDENT_RECORDS_PAGE_SIZE;

  const [rawRecords, setRawRecords] = useState<StudentRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [duplicateNotice, setDuplicateNotice] = useState<string | null>(null);

  // Reset filters and row selection immediately during rendering if role changed
  if (prevRoleId !== selectedRole.id) {
    setPrevRoleId(selectedRole.id);
    setFilters(DEFAULT_FILTER_STATE);
    setRowSelection({});
    setPageIndex(0);
  }

  // Load records from Supabase (or synthetic fallback if unconfigured)
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setQueryError(null);

    // Live scholarship, admissions, and library tables are not queried until
    // Supabase RLS is verified; use local demo datasets so unsecured rows are
    // not exposed.
    const mustUseDemoProtectedData =
      (selectedRole.id === "scholarship" ||
        selectedRole.id === "admissions" ||
        selectedRole.id === "library") &&
      !isSupabaseRlsResolved();

    if (!isSupabaseConfigured() || mustUseDemoProtectedData) {
      // Use synthetic fallback if credentials are placeholder or RLS is unresolved
      setRawRecords(getDemoRecordsByRole(selectedRole.id));
      setIsLoading(false);
      return;
    }

    try {
      const result = await fetchStudentRecordsByRole(selectedRole.id);
      if (result.error === null) {
        const records = result.data ?? [];

        if (selectedRole.id === "library") {
          // transaction_id is the unique identity for library rows. Multiple
          // transactions may legitimately share the same roll_number.
          const seenTransactions = new Set<string>();
          const duplicateTransactions: string[] = [];
          const uniqueLibrary: StudentRecord[] = [];

          for (const record of records) {
            const transaction = (record as LibraryStudentRecord).transaction_id;
            const transactionId =
              transaction === null || transaction === undefined
                ? ""
                : String(transaction).trim();

            if (transactionId.length === 0) {
              uniqueLibrary.push(record);
              continue;
            }
            if (seenTransactions.has(transactionId)) {
              duplicateTransactions.push(transactionId);
              continue;
            }

            seenTransactions.add(transactionId);
            uniqueLibrary.push(record);
          }

          setDuplicateNotice(
            duplicateTransactions.length > 0
              ? `Notice: Duplicate transaction ID(s) detected in database (${duplicateTransactions.length}): ${duplicateTransactions.join(", ")}`
              : null
          );
          setRawRecords(uniqueLibrary);
        } else if (selectedRole.id === "admissions") {
          // application_number is the unique identity for admission rows.
          const seenApplications = new Set<string>();
          const duplicateApplications: string[] = [];
          const uniqueAdmissions: StudentRecord[] = [];

          for (const record of records) {
            const applicationNumber = String(
              (record as AdmissionsRecord).application_number ?? ""
            ).trim();

            if (applicationNumber.length === 0) {
              uniqueAdmissions.push(record);
              continue;
            }
            if (seenApplications.has(applicationNumber)) {
              duplicateApplications.push(applicationNumber);
              continue;
            }

            seenApplications.add(applicationNumber);
            uniqueAdmissions.push(record);
          }

          setDuplicateNotice(
            duplicateApplications.length > 0
              ? `Notice: Duplicate application number(s) detected in database (${duplicateApplications.length}): ${duplicateApplications.join(", ")}`
              : null
          );
          setRawRecords(uniqueAdmissions);
        } else {
          const seen = new Set<string>();
          const dups: string[] = [];
          for (const r of records) {
            const roll = (r as { roll_number?: string }).roll_number;
            if (roll) {
              if (seen.has(roll)) {
                dups.push(roll);
              } else {
                seen.add(roll);
              }
            }
          }
          if (selectedRole.id !== "finance" && dups.length > 0) {
            setDuplicateNotice(
              `Notice: Duplicate roll number(s) detected in database (${dups.length}): ${dups.join(", ")}`
            );
          } else {
            setDuplicateNotice(null);
          }
          setRawRecords(records);
        }
      } else {
        setQueryError(result.error.message);
        // Fallback gracefully so UI remains functional
        setRawRecords(getDemoRecordsByRole(selectedRole.id));
      }
    } catch (err) {
      setQueryError(
        err instanceof Error ? err.message : "Failed to load student records."
      );
      setRawRecords(getDemoRecordsByRole(selectedRole.id));
    } finally {
      setIsLoading(false);
    }
  }, [selectedRole.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter records combining all active filters with AND logic
  const filteredRecords = useMemo(
    () => filterStudentRecords(rawRecords, filters, selectedRole.id),
    [rawRecords, filters, selectedRole.id]
  );

  const isAdmissions = selectedRole.id === "admissions";
  const isClassTeacher = selectedRole.id === "class_teacher";
  const isFinance = selectedRole.id === "finance";
  const isLibrary = selectedRole.id === "library";
  const isScholarship = selectedRole.id === "scholarship";

  // Admissions rows are keyed by application_number; library rows are keyed by
  // transaction_id. Other departments retain their index-based row identity.
  const getAdmissionsRowId = useCallback(
    (row: Record<string, unknown>, index: number) => {
      const applicationNumber = String(row.application_number ?? "").trim();
      return applicationNumber.length > 0
        ? applicationNumber
        : `admissions-row-${index}`;
    },
    []
  );

  const getLibraryRowId = useCallback(
    (row: Record<string, unknown>, index: number) => {
      const transactionId = row.transaction_id;
      if (
        transactionId !== null &&
        transactionId !== undefined &&
        String(transactionId).trim().length > 0
      ) {
        return String(transactionId).trim();
      }
      return `library-transaction-${index}`;
    },
    []
  );

  // Compute selected, currently visible records
  const selectedRecords = useMemo(() => {
    if (isAdmissions) {
      return filteredRecords.filter((record, index) =>
        Boolean(
          rowSelection[
            getAdmissionsRowId(record as Record<string, unknown>, index)
          ]
        )
      );
    }
    if (isLibrary) {
      return filteredRecords.filter((record, index) =>
        Boolean(
          rowSelection[
            getLibraryRowId(record as Record<string, unknown>, index)
          ]
        )
      );
    }
    return filteredRecords.filter((_, idx) =>
      Boolean(rowSelection[String(idx)])
    );
  }, [
    filteredRecords,
    rowSelection,
    isAdmissions,
    isLibrary,
    getAdmissionsRowId,
    getLibraryRowId,
  ]);

  // Select active column definitions:
  // - 9 columns for Library (including Issue Date, Due Date, Status, and Phone Number)
  // - 8 columns for Admissions (including Admission Status between Documents Submitted and Phone Number)
  // - 8 columns for Finance (Student Name, MGIT Roll Number, Branch, Current Semester, Section, Fee Type, Payment Status, Phone Number)
  // - 7 columns for Class Teacher (including Attendance Percentage)
  // - 7 columns for Scholarship (including Scholarship Status between Section and Phone Number)
  // - 6 directory columns for other departments
  const columns = useMemo(() => {
    if (isAdmissions) {
      return admissionsColumns;
    }
    if (isLibrary) {
      return libraryColumns;
    }
    if (isFinance) {
      return financeColumns;
    }
    if (isClassTeacher) {
      return classTeacherColumns;
    }
    if (isScholarship) {
      return scholarshipColumns;
    }
    return studentDirectoryColumns;
  }, [isAdmissions, isLibrary, isFinance, isClassTeacher, isScholarship]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const currentPage = Math.min(pageIndex + 1, totalPages);

  const handlePreviousPage = useCallback(() => {
    setPageIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setPageIndex((prev) => Math.min(totalPages - 1, prev + 1));
  }, [totalPages]);

  const handleFilterChange = useCallback(
    (key: keyof StudentRecordsFilterState, value: string) => {
      setFilters((prev) => ({
        ...prev,
        [key]:
          key === "attendanceMin" || key === "attendanceMax"
            ? value === ""
              ? undefined
              : Number(value)
            : value,
      }));
      setRowSelection({});
      setPageIndex(0);
    },
    []
  );

  const handleClearAll = useCallback(() => {
    setFilters(DEFAULT_FILTER_STATE);
    setRowSelection({});
    setPageIndex(0);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: query,
    }));
    setRowSelection({});
    setPageIndex(0);
  }, []);

  // Campaign Handoff Handler
  const handleCallStudents = useCallback(() => {
    if (selectedRecords.length === 0) {
      return;
    }

    const draft = generateCampaignDraft({
      filters,
      records: selectedRecords,
      role: selectedRole,
    });

    try {
      localStorage.setItem("input", JSON.stringify(draft));
      window.dispatchEvent(new Event("storage"));
    } catch {
      // Ignore localStorage write failures in sandboxes
    }

    setInput(draft);
    setRowSelection({});

    toast.success(
      `Prepared campaign draft for ${selectedRecords.length} student${selectedRecords.length === 1 ? "" : "s"}.`
    );

    router.push("/");
  }, [selectedRecords, filters, selectedRole, setInput, router]);

  const emptyMessage = useMemo(() => {
    if (queryError) {
      return "Unable to load student records due to database error.";
    }
    if (rawRecords.length === 0) {
      return `No records found in ${selectedRole.name}.`;
    }
    return "No student records match the selected filters.";
  }, [queryError, rawRecords.length, selectedRole.name]);

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-sidebar">
      {/* Top Header */}
      <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-sidebar-border/40 bg-sidebar/80 px-3 backdrop-blur-md">
        <Button
          className={state === "collapsed" && !isMobile ? "flex" : "md:hidden"}
          onClick={toggleSidebar}
          size="icon-sm"
          variant="ghost"
        >
          <PanelLeftIcon className="size-4" />
        </Button>

        <RoleSelector />

        <div className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-card/40 px-2.5 py-1 text-xs text-muted-foreground">
          <Lock className="size-3.5 text-muted-foreground/70" />
          <ChevronDown className="size-3 text-muted-foreground/50" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 md:rounded-tl-[12px] md:border-t md:border-l md:border-border/40 bg-background">
        <div className="mx-auto max-w-5xl space-y-5">
          {/* Page Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/40">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Student Records
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Browse, filter, and select student records.
              </p>
            </div>

            <Badge
              className="border-border/60 bg-muted/40 text-foreground font-normal px-2.5 py-1 text-xs w-fit"
              variant="outline"
            >
              Department: {selectedRole.name}
            </Badge>
          </div>

          {/* Database Error Banner */}
          {queryError !== null && (
            <div className="flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-600 dark:text-rose-400">
              <div className="flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>
                  <strong>Database Notice:</strong> {queryError}
                </span>
              </div>
              <Button
                className="h-7 px-2.5 text-xs gap-1 border-rose-500/30 hover:bg-rose-500/20"
                onClick={loadData}
                size="sm"
                type="button"
                variant="outline"
              >
                <RefreshCw className="size-3" />
                <span>Retry</span>
              </Button>
            </div>
          )}

          {/* Duplicate Roll Numbers Warning Banner */}
          {duplicateNotice !== null && (
            <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-600 dark:text-amber-400">
              <div className="flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{duplicateNotice}</span>
              </div>
            </div>
          )}

          {/* Filter Toolbar */}
          <StudentRecordsFilters
            filters={filters}
            onClearAll={handleClearAll}
            onFilterChange={handleFilterChange}
            records={rawRecords}
            roleId={selectedRole.id}
          />

          {/* Search & Records Count */}
          <StudentTableToolbar
            onSearchChange={handleSearchChange}
            recordCount={filteredRecords.length}
            searchQuery={filters.searchQuery ?? ""}
          />

          {/* Table Container & Records */}
          <StudentDataTable
            className={
              isLibrary
                ? "[&_table]:table-fixed [&_td]:px-2.5 [&_th]:px-2.5"
                : undefined
            }
            columns={
              columns as unknown as ColumnDef<
                StudentTableFeatures,
                Record<string, unknown>,
                unknown
              >[]
            }
            data={filteredRecords as Record<string, unknown>[]}
            departmentName={selectedRole.name}
            emptyMessage={emptyMessage}
            getRowId={
              isAdmissions
                ? getAdmissionsRowId
                : isLibrary
                  ? getLibraryRowId
                  : undefined
            }
            isLoading={isLoading}
            onRowSelectionChange={setRowSelection}
            pageIndex={pageIndex}
            pageSize={pageSize}
            rowSelection={rowSelection}
          />

          {/* Footer Pagination & Call Students handoff button */}
          <StudentTablePagination
            canNextPage={pageIndex < totalPages - 1}
            canPreviousPage={pageIndex > 0}
            currentPage={currentPage}
            onCallStudents={handleCallStudents}
            onNextPage={handleNextPage}
            onPreviousPage={handlePreviousPage}
            pageSize={pageSize}
            selectedCount={selectedRecords.length}
            totalPages={totalPages}
            totalRecords={filteredRecords.length}
          />
        </div>
      </main>
    </div>
  );
}
