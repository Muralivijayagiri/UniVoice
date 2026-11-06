"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Phone } from "lucide-react";
import type { StudentTableFeatures } from "@/components/student-records/student-data-table";
import type {
  FinanceFeeStatus,
  FinanceStudentRecord,
} from "@/lib/student-records/types";

/**
 * Currency formatter for fee amounts in INR
 */
export function formatCurrency(
  amount: number | string | null | undefined
): string {
  if (amount === null || amount === undefined || amount === "") {
    return "—";
  }
  const numeric =
    typeof amount === "number"
      ? amount
      : Number.parseFloat(String(amount).replace(/[^0-9.-]/g, ""));
  if (Number.isNaN(numeric)) {
    return String(amount);
  }
  return new Intl.NumberFormat("en-IN", {
    currency: "INR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(numeric);
}

/**
 * Visual status badge for the three fixed Finance statuses: Paid, Unpaid, Pending
 */
export function FinanceStatusBadge({ status }: { status: FinanceFeeStatus }) {
  switch (status) {
    case "Paid":
      return (
        <span className="inline-flex items-center rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
          Paid
        </span>
      );
    case "Unpaid":
      return (
        <span className="inline-flex items-center rounded-md border border-rose-500/25 bg-rose-500/10 px-2 py-0.5 text-[11px] font-medium text-rose-600 dark:text-rose-400">
          Unpaid
        </span>
      );
    case "Pending":
      return (
        <span className="inline-flex items-center rounded-md border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400">
          Pending
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
 * Finance-specific column definitions for Student Records table.
 *
 * Ordered as:
 * 1. Student Name — first_name + last_name
 * 2. MGIT Roll Number — roll_number
 * 3. Branch — branch_name
 * 4. Current Semester — current_semester / semester
 * 5. Section — section
 * 6. Fee Type — fee_type
 * 7. Payment Status — status (Paid | Unpaid | Pending)
 * 8. Phone Number — phone_number
 */
export const financeColumns: ColumnDef<
  StudentTableFeatures,
  FinanceStudentRecord,
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
  // 4. Current Semester — semester / current_semester
  {
    accessorFn: (row) => row.semester ?? row.current_semester ?? "—",
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
  // 6. Fee Type — fee_type
  {
    accessorKey: "fee_type",
    cell: ({ getValue }) => (
      <span className="text-foreground/90">{String(getValue() ?? "—")}</span>
    ),
    header: "Fee Type",
    id: "fee_type",
  },
  // 7. Payment Status — status (Paid | Unpaid | Pending)
  {
    accessorKey: "status",
    cell: ({ getValue }) => (
      <FinanceStatusBadge status={getValue() as FinanceFeeStatus} />
    ),
    header: "Payment Status",
    id: "status",
  },
  // 8. Phone Number — phone_number
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
