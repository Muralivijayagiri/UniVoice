"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Phone } from "lucide-react";
import type { StudentTableFeatures } from "@/components/student-records/student-data-table";
import type { StudentDirectoryRecord } from "@/lib/student-records/types";

/**
 * Student Directory column definitions.
 *
 * Ordered as required:
 * 1. Student Name — first_name + last_name
 * 2. MGIT Roll Number — roll_number
 * 3. Branch — branch_name
 * 4. Current Semester — current_semester
 * 5. Section — section
 * 6. Phone Number — phone_number
 */
export const studentDirectoryColumns: ColumnDef<
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
  // 6. Phone Number — phone_number (full unmasked phone number)
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
