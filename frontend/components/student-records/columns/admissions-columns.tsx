"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Phone } from "lucide-react";
import type { StudentTableFeatures } from "@/components/student-records/student-data-table";
import type {
  AdmissionStatus,
  AdmissionsRecord,
} from "@/modules/students/domain/types";

/**
 * Visual badge for original documents submission state (Yes / No)
 */
export function DocumentsBadge({ submitted }: { submitted: boolean }) {
  if (submitted) {
    return (
      <span className="inline-flex items-center rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
        Yes
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
      No
    </span>
  );
}

/**
 * Visual badge for the five fixed Admission Status values:
 * - Registered
 * - Documents Verified
 * - Seat Allotted
 * - Fee Paid - Confirmed
 * - Cancelled
 */
export function AdmissionStatusBadge({ status }: { status: AdmissionStatus }) {
  switch (status) {
    case "Registered":
      return (
        <span className="inline-flex items-center rounded-md border border-sky-500/25 bg-sky-500/10 px-2 py-0.5 text-[11px] font-medium text-sky-600 dark:text-sky-400">
          Registered
        </span>
      );
    case "Documents Verified":
      return (
        <span className="inline-flex items-center rounded-md border border-indigo-500/25 bg-indigo-500/10 px-2 py-0.5 text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
          Documents Verified
        </span>
      );
    case "Seat Allotted":
      return (
        <span className="inline-flex items-center rounded-md border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400">
          Seat Allotted
        </span>
      );
    case "Fee Paid - Confirmed":
      return (
        <span className="inline-flex items-center rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
          Fee Paid - Confirmed
        </span>
      );
    case "Cancelled":
      return (
        <span className="inline-flex items-center rounded-md border border-rose-500/25 bg-rose-500/10 px-2 py-0.5 text-[11px] font-medium text-rose-600 dark:text-rose-400">
          Cancelled
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
 * Admissions-specific column definitions for Student Records table.
 *
 * Ordered as:
 * 1. Applicant (first name + last name)
 * 2. Application Number
 * 3. Branch
 * 4. Entrance Rank
 * 5. Quota
 * 6. Documents Submitted (Yes / No)
 * 7. Admission Status (Registered | Documents Verified | Seat Allotted | Fee Paid - Confirmed | Cancelled)
 * 8. Phone (full unmasked phone number)
 */
export const admissionsColumns: ColumnDef<
  StudentTableFeatures,
  AdmissionsRecord,
  unknown
>[] = [
  // 1. Applicant — first name + last name
  {
    accessorFn: (row) => `${row.first_name} ${row.last_name}`.trim(),
    cell: ({ getValue }) => (
      <span className="font-medium text-foreground">
        {String(getValue() ?? "—")}
      </span>
    ),
    header: "Applicant",
    id: "applicant",
  },
  // 2. Application Number
  {
    accessorKey: "application_number",
    cell: ({ getValue }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {String(getValue() ?? "—")}
      </span>
    ),
    header: "Application Number",
    id: "application_number",
  },
  // 3. Branch
  {
    accessorFn: (row) => row.branch_name ?? row.branch_id ?? "—",
    cell: ({ getValue }) => (
      <span className="text-foreground/90">{String(getValue())}</span>
    ),
    header: "Branch",
    id: "branch",
  },
  // 4. Entrance Rank
  {
    accessorKey: "entrance_rank",
    cell: ({ getValue }) => {
      const rank = getValue();
      if (rank === null || rank === undefined || rank === "") {
        return <span className="text-muted-foreground">—</span>;
      }
      const num = Number(rank);
      return (
        <span className="font-mono text-xs tabular-nums text-foreground/90">
          {Number.isNaN(num) ? String(rank) : `#${num.toLocaleString()}`}
        </span>
      );
    },
    header: "Entrance Rank",
    id: "entrance_rank",
  },
  // 5. Quota
  {
    accessorKey: "quota_type",
    cell: ({ getValue }) => (
      <span className="text-foreground/90">{String(getValue() ?? "—")}</span>
    ),
    header: "Quota",
    id: "quota",
  },
  // 6. Documents Submitted — Yes / No
  {
    accessorKey: "original_docs_submitted",
    cell: ({ getValue }) => {
      const val = getValue();
      const isSubmitted =
        val === true ||
        val === "true" ||
        val === 1 ||
        val === "1" ||
        val === "Yes";
      return <DocumentsBadge submitted={isSubmitted} />;
    },
    header: "Documents Submitted",
    id: "documents",
  },
  // 7. Admission Status
  {
    accessorKey: "status",
    cell: ({ getValue }) => (
      <AdmissionStatusBadge status={getValue() as AdmissionStatus} />
    ),
    header: "Admission Status",
    id: "admission_status",
  },
  // 8. Phone — full unmasked phone number
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
    header: "Phone",
    id: "phone",
  },
];
