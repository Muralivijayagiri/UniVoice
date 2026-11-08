"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Phone } from "lucide-react";
import type { StudentTableFeatures } from "@/components/student-records/student-data-table";
import type {
  LibraryStudentRecord,
  LibraryTransactionStatus,
} from "@/modules/students/domain/types";

/**
 * Formats date string to readable format (e.g. "Oct 15, 2024").
 * Gracefully handles null, undefined, empty strings, and invalid dates.
 */
export function formatDate(dateString: string | null | undefined): string {
  if (
    dateString === null ||
    dateString === undefined ||
    dateString.trim() === ""
  ) {
    return "—";
  }

  // Handle plain YYYY-MM-DD strings without time to prevent UTC-to-local day shift
  const ymdMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString.trim());
  if (ymdMatch) {
    const year = Number.parseInt(ymdMatch[1], 10);
    const month = Number.parseInt(ymdMatch[2], 10) - 1;
    const day = Number.parseInt(ymdMatch[3], 10);
    const d = new Date(year, month, day);
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d);
  }

  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

/**
 * Visual badge for Library transaction statuses:
 * - Issued
 * - Overdue
 * - Submitted (mapped from database `Returned`)
 */
export function LibraryStatusBadge({
  status,
}: {
  status: LibraryTransactionStatus;
}) {
  switch (status) {
    case "Issued":
      return (
        <span className="inline-flex items-center rounded-md border border-sky-500/25 bg-sky-500/10 px-2 py-0.5 text-[11px] font-medium text-sky-600 dark:text-sky-400">
          Issued
        </span>
      );
    case "Overdue":
      return (
        <span className="inline-flex items-center rounded-md border border-rose-500/25 bg-rose-500/10 px-2 py-0.5 text-[11px] font-medium text-rose-600 dark:text-rose-400">
          Overdue
        </span>
      );
    case "Submitted":
      return (
        <span className="inline-flex items-center rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
          Submitted
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-md border border-border bg-muted/40 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          {status}
        </span>
      );
  }
}

/**
 * Library-specific column definitions for Student Records table.
 *
 * Ordered as:
 * 1. Student Name — first_name + last_name
 * 2. MGIT Roll Number — roll_number
 * 3. Branch — branch_name
 * 4. Current Semester — current_semester / semester
 * 5. Section — section
 * 6. Issue Date — issue_date
 * 7. Due Date — due_date
 * 8. Status (Issued | Overdue | Submitted)
 * 9. Phone Number — phone_number
 *
 * Each definition carries an explicit pixel `size` so the table can keep the
 * nine-column layout balanced. TanStack Table v9 only exposes the built-in
 * `size` property when the optional column-sizing feature is enabled, so the
 * extra field is typed locally to avoid changing feature flags (and therefore
 * layout) for every other department.
 */
type LibraryColumnDef = ColumnDef<
  StudentTableFeatures,
  LibraryStudentRecord,
  unknown
> & {
  size: number;
};

export const libraryColumns: LibraryColumnDef[] = [
  // 1. Student Name — first_name + last_name
  {
    accessorFn: (row) => `${row.first_name} ${row.last_name}`.trim(),
    cell: ({ getValue }) => (
      <span className="font-medium text-foreground">
        {String(getValue() ?? "—")}
      </span>
    ),
    header: "Student Name",
    id: "student_name",
    size: 120,
  },
  // 2. MGIT Roll Number
  {
    accessorKey: "roll_number",
    cell: ({ getValue }) => (
      <span className="whitespace-nowrap font-mono text-xs text-muted-foreground">
        {String(getValue() ?? "—")}
      </span>
    ),
    header: "MGIT Roll Number",
    id: "roll_number",
    size: 104,
  },
  // 3. Branch — truncated with a native tooltip to keep the table compact
  {
    accessorFn: (row) => row.branch_name ?? row.branch_id ?? "—",
    cell: ({ getValue }) => {
      const branch = String(getValue() ?? "—");
      return (
        <span className="block truncate text-foreground/90" title={branch}>
          {branch}
        </span>
      );
    },
    header: "Branch",
    id: "branch",
    size: 86,
  },
  // 4. Current Semester
  {
    accessorFn: (row) => row.current_semester ?? row.semester ?? "—",
    cell: ({ getValue }) => {
      const val = getValue();
      return (
        <span className="whitespace-nowrap text-muted-foreground">
          {val && val !== "—" ? `Sem ${val}` : "—"}
        </span>
      );
    },
    header: "Current Semester",
    id: "current_semester",
    size: 80,
  },
  // 5. Section
  {
    accessorKey: "section",
    cell: ({ getValue }) => {
      const val = getValue();
      return (
        <span className="whitespace-nowrap text-muted-foreground">
          {val ? `Sec ${val}` : "—"}
        </span>
      );
    },
    header: "Section",
    id: "section",
    size: 70,
  },
  // 6. Issue Date — complete date on a single line
  {
    accessorKey: "issue_date",
    cell: ({ getValue }) => (
      <span className="whitespace-nowrap font-mono text-xs text-muted-foreground">
        {formatDate(getValue() as string | null | undefined)}
      </span>
    ),
    header: "Issue Date",
    id: "issue_date",
    size: 110,
  },
  // 7. Due Date — complete date on a single line
  {
    accessorKey: "due_date",
    cell: ({ getValue }) => (
      <span className="whitespace-nowrap font-mono text-xs text-muted-foreground">
        {formatDate(getValue() as string | null | undefined)}
      </span>
    ),
    header: "Due Date",
    id: "due_date",
    size: 110,
  },
  // 8. Status
  {
    accessorKey: "status",
    cell: ({ getValue }) => (
      <LibraryStatusBadge status={getValue() as LibraryTransactionStatus} />
    ),
    header: "Status",
    id: "status",
    size: 92,
  },
  // 9. Phone Number — full, unmasked phone number
  {
    accessorKey: "phone_number",
    cell: ({ getValue }) => {
      const phone = String(getValue() ?? "—");
      return (
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono text-xs text-muted-foreground">
          <Phone className="size-3 text-muted-foreground/60" />
          <span>{phone}</span>
        </span>
      );
    },
    header: "Phone Number",
    id: "phone_number",
    size: 148,
  },
];
