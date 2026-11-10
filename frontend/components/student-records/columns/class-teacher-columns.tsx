"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Phone } from "lucide-react";
import type { StudentTableFeatures } from "@/components/student-records/student-data-table";
import { cn } from "@/lib/utils";
import type { StudentDirectoryRecord } from "@/modules/students/domain/types";

/**
 * Formats attendance percentage with up to two decimal places (e.g. 85.50%, 92.00%, 76.25%).
 * Gracefully shows "—" when attendance data is unavailable.
 */
export function formatAttendancePercentage(
  percentage: number | string | null | undefined
): string {
  if (
    percentage === null ||
    percentage === undefined ||
    percentage === "" ||
    percentage === "—"
  ) {
    return "—";
  }

  const numeric =
    typeof percentage === "number"
      ? percentage
      : Number.parseFloat(String(percentage).replace(/[^0-9.-]/g, ""));

  if (Number.isNaN(numeric)) {
    return "—";
  }

  return `${numeric.toFixed(2)}%`;
}

/**
 * Renders attendance percentage clearly with up to two decimal places.
 * Highlights attendance shortage (<75%) vs satisfactory (≥75%).
 */
export function AttendancePercentageCell({
  percentage,
}: {
  percentage: number | string | null | undefined;
}) {
  const formatted = formatAttendancePercentage(percentage);
  if (formatted === "—") {
    return <span className="text-muted-foreground font-mono text-xs">—</span>;
  }

  const numeric =
    typeof percentage === "number"
      ? percentage
      : Number.parseFloat(String(percentage).replace(/[^0-9.-]/g, ""));

  const isShortage = !Number.isNaN(numeric) && numeric < 75;

  return (
    <span
      className={cn(
        "font-mono text-xs tabular-nums font-medium",
        isShortage
          ? "text-rose-600 dark:text-rose-400 font-semibold"
          : "text-emerald-600 dark:text-emerald-400"
      )}
      title={isShortage ? "Attendance shortage (<75%)" : "Satisfactory (≥75%)"}
    >
      {formatted}
    </span>
  );
}

/**
 * Class Teacher columns: Exactly seven columns in the required order:
 * 1. Student Name
 * 2. MGIT Roll Number
 * 3. Branch
 * 4. Current Semester
 * 5. Section
 * 6. Attendance Percentage
 * 7. Phone Number
 */
export const classTeacherColumns: ColumnDef<
  StudentTableFeatures,
  StudentDirectoryRecord,
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
  // 6. Attendance Percentage — attendance_percentage
  {
    accessorKey: "attendance_percentage",
    cell: ({ getValue }) => (
      <AttendancePercentageCell
        percentage={getValue() as number | string | null | undefined}
      />
    ),
    header: "Attendance Percentage",
    id: "attendance_percentage",
  },
  // 7. Phone Number — phone_number (full unmasked phone number)
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
