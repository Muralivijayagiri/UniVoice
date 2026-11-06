"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Phone } from "lucide-react";
import type { StudentTableFeatures } from "@/components/student-records/student-data-table";
import type {
  ScholarshipStatus,
  ScholarshipStudentRecord,
} from "@/lib/student-records/types";

/**
 * Visual badge for the six fixed Scholarship Status values:
 * - Not Applied
 * - Draft Saved
 * - Submitted to Portal
 * - Pending Clerk Verification
 * - Approved by College
 * - Rejected / Action Required
 */
export function ScholarshipStatusBadge({
  status,
}: {
  status: ScholarshipStatus;
}) {
  switch (status) {
    case "Not Applied":
      return (
        <span className="inline-flex items-center rounded-md border border-zinc-500/25 bg-zinc-500/10 px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
          Not Applied
        </span>
      );
    case "Draft Saved":
      return (
        <span className="inline-flex items-center rounded-md border border-slate-500/25 bg-slate-500/10 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-400">
          Draft Saved
        </span>
      );
    case "Submitted to Portal":
      return (
        <span className="inline-flex items-center rounded-md border border-sky-500/25 bg-sky-500/10 px-2 py-0.5 text-[11px] font-medium text-sky-600 dark:text-sky-400">
          Submitted to Portal
        </span>
      );
    case "Pending Clerk Verification":
      return (
        <span className="inline-flex items-center rounded-md border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400">
          Pending Clerk Verification
        </span>
      );
    case "Approved by College":
      return (
        <span className="inline-flex items-center rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
          Approved by College
        </span>
      );
    case "Rejected / Action Required":
      return (
        <span className="inline-flex items-center rounded-md border border-rose-500/25 bg-rose-500/10 px-2 py-0.5 text-[11px] font-medium text-rose-600 dark:text-rose-400">
          Rejected / Action Required
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
 * Formatter and renderer for missing documents.
 * Handles arrays, strings, null, and empty values gracefully.
 */
export function MissingDocumentsCell({
  missingDocs,
}: {
  missingDocs: string[] | string | null | undefined;
}) {
  if (missingDocs === null || missingDocs === undefined) {
    return <span className="text-muted-foreground">—</span>;
  }

  let docsList: string[] = [];

  if (Array.isArray(missingDocs)) {
    docsList = missingDocs
      .map((d) => (typeof d === "string" ? d.trim() : String(d).trim()))
      .filter(
        (d) =>
          d.length > 0 &&
          d.toLowerCase() !== "none" &&
          d.toLowerCase() !== "nil"
      );
  } else if (typeof missingDocs === "string") {
    const trimmed = missingDocs.trim();
    if (
      trimmed.length === 0 ||
      trimmed.toLowerCase() === "none" ||
      trimmed.toLowerCase() === "nil"
    ) {
      return <span className="text-muted-foreground">—</span>;
    }
    docsList = trimmed
      .split(",")
      .map((d) => d.trim())
      .filter(
        (d) =>
          d.length > 0 &&
          d.toLowerCase() !== "none" &&
          d.toLowerCase() !== "nil"
      );
  }

  if (docsList.length === 0) {
    return <span className="text-muted-foreground">—</span>;
  }

  const label = docsList.join(", ");

  return (
    <span
      className="inline-flex max-w-[220px] truncate text-xs font-medium text-rose-600 dark:text-rose-400"
      title={label}
    >
      {label}
    </span>
  );
}

/**
 * Scholarship-specific column definitions for Student Records table.
 *
 * Ordered as required:
 * 1. Student Name — first_name + last_name
 * 2. MGIT Roll Number — roll_number
 * 3. Branch — branch_name
 * 4. Current Semester — current_semester
 * 5. Section — section
 * 6. Scholarship Status — latest application status (or "Not Applied")
 * 7. Phone Number — full unmasked phone number
 */
export const scholarshipColumns: ColumnDef<
  StudentTableFeatures,
  ScholarshipStudentRecord,
  unknown
>[] = [
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
  },
  // 2. MGIT Roll Number — roll_number
  {
    accessorKey: "roll_number",
    cell: ({ getValue }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {String(getValue() ?? "—")}
      </span>
    ),
    header: "MGIT Roll Number",
    id: "roll_number",
  },
  // 3. Branch — branch_name
  {
    accessorFn: (row) => row.branch_name ?? row.branch_id ?? "—",
    cell: ({ getValue }) => (
      <span className="text-foreground/90">{String(getValue())}</span>
    ),
    header: "Branch",
    id: "branch",
  },
  // 4. Current Semester — current_semester
  {
    accessorFn: (row) => row.current_semester ?? row.semester ?? "—",
    cell: ({ getValue }) => {
      const val = getValue();
      return (
        <span className="text-muted-foreground">
          {val && val !== "—" ? `Sem ${val}` : "—"}
        </span>
      );
    },
    header: "Current Semester",
    id: "current_semester",
  },
  // 5. Section — section
  {
    accessorKey: "section",
    cell: ({ getValue }) => {
      const val = getValue();
      return (
        <span className="text-muted-foreground">
          {val ? `Sec ${val}` : "—"}
        </span>
      );
    },
    header: "Section",
    id: "section",
  },
  // 6. Scholarship Status — latest application status or "Not Applied"
  {
    accessorKey: "status",
    cell: ({ getValue }) => (
      <ScholarshipStatusBadge status={getValue() as ScholarshipStatus} />
    ),
    header: "Scholarship Status",
    id: "scholarship_status",
  },
  // 7. Phone Number — full, unmasked phone number
  {
    accessorKey: "phone_number",
    cell: ({ getValue }) => {
      const phone = String(getValue() ?? "—");
      return (
        <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
          <Phone className="size-3 text-muted-foreground/60" />
          <span>{phone}</span>
        </span>
      );
    },
    header: "Phone Number",
    id: "phone_number",
  },
];
