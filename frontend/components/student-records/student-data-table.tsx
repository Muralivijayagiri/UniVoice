"use client";

import {
  type ColumnDef,
  createPaginatedRowModel,
  type OnChangeFn,
  type Row,
  type RowSelectionState,
  rowPaginationFeature,
  rowSelectionFeature,
  Subscribe,
  type Table as TanStackTable,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { UsersIcon } from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { STUDENT_RECORDS_PAGE_SIZE } from "@/lib/student-records/configurations";
import { cn } from "@/lib/utils";

// Provide useReactTable alias for TanStack Table v8/v9 interoperability
export const useReactTable = useTable;

// Stable table features configuration using TanStack Table v9
export const studentTableFeatures = tableFeatures({
  paginatedRowModel: createPaginatedRowModel(),
  rowPaginationFeature,
  rowSelectionFeature,
});

export type StudentTableFeatures = typeof studentTableFeatures;

// Stable fallback references
const EMPTY_DATA: never[] = [];
const EMPTY_COLUMNS: never[] = [];
const SKELETON_ROW_KEYS = [
  "sk-row-1",
  "sk-row-2",
  "sk-row-3",
  "sk-row-4",
  "sk-row-5",
] as const;

export interface StudentDataTableProps<
  TData extends Record<string, unknown> = Record<string, unknown>,
> {
  className?: string;
  columns?: ColumnDef<StudentTableFeatures, TData, unknown>[];
  data?: TData[];
  departmentName?: string;
  emptyMessage?: React.ReactNode;
  enableRowSelection?: boolean;
  getRowId?: (originalRow: TData, index: number) => string;
  isLoading?: boolean;
  onPaginationChange?: (pageIndex: number, pageSize: number) => void;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  pageIndex?: number;
  pageSize?: number;
  rowSelection?: RowSelectionState;
}

// Extracted header select-all checkbox to maintain stable props without bindings
const HeaderCheckbox = memo(function PureHeaderCheckbox({
  checked,
  onCheckedChange,
}: {
  checked: boolean | "indeterminate";
  onCheckedChange: (checked: boolean) => void;
}) {
  const handleChange = useCallback(
    (value: boolean | "indeterminate") => {
      onCheckedChange(!!value);
    },
    [onCheckedChange]
  );

  return (
    <div className="flex items-center justify-center">
      <Checkbox
        aria-label="Select all visible rows"
        checked={checked}
        onCheckedChange={handleChange}
      />
    </div>
  );
});

// Extracted row select checkbox to maintain stable props without bindings
const RowCheckbox = memo(function PureRowCheckbox({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  const handleChange = useCallback(
    (value: boolean | "indeterminate") => {
      onCheckedChange(!!value);
    },
    [onCheckedChange]
  );

  return (
    <div className="flex items-center justify-center">
      <Checkbox
        aria-label="Select row"
        checked={checked}
        onCheckedChange={handleChange}
      />
    </div>
  );
});

/**
 * Row checkboxes must Subscribe to `table.atoms.rowSelection`.
 * With React Compiler + TanStack Table v9, cell renderers can keep a stable
 * `row` reference while `row.getIsSelected()` changes behind the method —
 * so a plain `checked={row.getIsSelected()}` stays visually stale even though
 * row highlighting (computed in the parent) updates correctly.
 */
function RowSelectCheckbox<TData extends Record<string, unknown>>({
  row,
  table: tableInstance,
}: {
  row: Row<StudentTableFeatures, TData>;
  table: TanStackTable<StudentTableFeatures, TData>;
}) {
  const rowId = row.id;

  const selectIsSelected = useCallback(
    (selection: RowSelectionState) => Boolean(selection?.[rowId]),
    [rowId]
  );

  const handleCheckedChange = useCallback(
    (value: boolean) => {
      row.toggleSelected(!!value);
    },
    [row]
  );

  return (
    <Subscribe
      selector={selectIsSelected}
      source={tableInstance.atoms.rowSelection}
    >
      {(isSelected) => (
        <RowCheckbox
          checked={isSelected}
          onCheckedChange={handleCheckedChange}
        />
      )}
    </Subscribe>
  );
}

function HeaderSelectCheckbox<TData extends Record<string, unknown>>({
  table: tableInstance,
}: {
  table: TanStackTable<StudentTableFeatures, TData>;
}) {
  const handleCheckedChange = useCallback(
    (value: boolean) => {
      tableInstance.toggleAllPageRowsSelected(!!value);
    },
    [tableInstance]
  );

  return (
    <Subscribe source={tableInstance.atoms.rowSelection}>
      {() => (
        <HeaderCheckbox
          checked={
            tableInstance.getIsAllPageRowsSelected() ||
            (tableInstance.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={handleCheckedChange}
        />
      )}
    </Subscribe>
  );
}

export function StudentDataTable<
  TData extends Record<string, unknown> = Record<string, unknown>,
>({
  className,
  columns = EMPTY_COLUMNS as ColumnDef<StudentTableFeatures, TData, unknown>[],
  data = EMPTY_DATA as TData[],
  departmentName = "all departments",
  emptyMessage,
  enableRowSelection = true,
  getRowId,
  isLoading = false,
  onPaginationChange,
  onRowSelectionChange,
  pageIndex: controlledPageIndex,
  pageSize = STUDENT_RECORDS_PAGE_SIZE,
  rowSelection: controlledRowSelection,
}: StudentDataTableProps<TData>) {
  const isControlledSelection = controlledRowSelection !== undefined;
  const [internalRowSelection, setInternalRowSelection] =
    useState<RowSelectionState>({});

  const currentRowSelection = isControlledSelection
    ? controlledRowSelection
    : internalRowSelection;

  const isControlledPage = controlledPageIndex !== undefined;
  const [internalPageIndex, setInternalPageIndex] = useState<number>(0);
  const currentPageIndex = isControlledPage
    ? controlledPageIndex
    : internalPageIndex;

  const handleRowSelectionChange: OnChangeFn<RowSelectionState> = useCallback(
    (updaterOrValue) => {
      const next =
        typeof updaterOrValue === "function"
          ? updaterOrValue(currentRowSelection)
          : updaterOrValue;

      if (!isControlledSelection) {
        setInternalRowSelection(next);
      }
      onRowSelectionChange?.(next);
    },
    [isControlledSelection, onRowSelectionChange, currentRowSelection]
  );

  // Default selection checkbox column
  const selectColumn = useMemo<ColumnDef<StudentTableFeatures, TData, unknown>>(
    () => ({
      cell: ({ row, table: tableInstance }) => (
        <RowSelectCheckbox row={row} table={tableInstance} />
      ),
      enableSorting: false,
      header: ({ table: tableInstance }) => (
        <HeaderSelectCheckbox table={tableInstance} />
      ),
      id: "select",
    }),
    []
  );

  // Merge columns with selection checkbox when enabled
  const tableColumns = useMemo(() => {
    if (columns.length === 0) {
      return EMPTY_COLUMNS as ColumnDef<StudentTableFeatures, TData, unknown>[];
    }
    if (!enableRowSelection) {
      return columns;
    }
    const hasSelectColumn = columns.some((col) => col.id === "select");
    if (hasSelectColumn) {
      return columns;
    }
    return [selectColumn, ...columns];
  }, [columns, enableRowSelection, selectColumn]);

  // Initialize TanStack Table instance
  const table = useReactTable({
    columns: tableColumns,
    data,
    enableRowSelection: true,
    features: studentTableFeatures,
    getRowId,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: STUDENT_RECORDS_PAGE_SIZE,
      },
    },
    onPaginationChange: (updaterOrValue) => {
      const next =
        typeof updaterOrValue === "function"
          ? updaterOrValue({ pageIndex: currentPageIndex, pageSize })
          : updaterOrValue;
      if (!isControlledPage) {
        setInternalPageIndex(next.pageIndex);
      }
      onPaginationChange?.(next.pageIndex, next.pageSize);
    },
    onRowSelectionChange: handleRowSelectionChange,
    state: {
      pagination: {
        pageIndex: currentPageIndex,
        pageSize,
      },
      rowSelection: currentRowSelection,
    },
  });

  // Default empty state UI
  const defaultEmptyState = (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex size-10 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground mb-3">
        <UsersIcon className="size-5 text-muted-foreground/70" />
      </div>
      <p className="text-sm font-medium text-foreground">
        Student records will appear here.
      </p>
      <p className="text-xs text-muted-foreground mt-1 max-w-sm">
        Connect data queries and filters to view student records for{" "}
        <span className="font-medium text-foreground">{departmentName}</span>.
      </p>
    </div>
  );

  // If no columns are provided yet, display standard placeholder view
  if (tableColumns.length === 0) {
    return (
      <div
        className={cn(
          "rounded-xl border border-border/40 bg-card overflow-hidden shadow-2xs",
          className
        )}
        data-testid="student-data-table"
      >
        <div className="flex items-center px-4 py-2.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground border-b border-border/40 bg-muted/20">
          <span className="flex-1">Student</span>
          <span className="hidden sm:inline w-28 text-center">Student ID</span>
          <span className="hidden md:inline w-28 text-center">Branch</span>
          <span className="hidden lg:inline w-20 text-center">Semester</span>
          <span className="w-20 text-right">Section</span>
        </div>
        {emptyMessage ?? defaultEmptyState}
      </div>
    );
  }

  // TanStack Table Rendering Engine
  return (
    <div
      className={cn(
        "rounded-xl border border-border/40 bg-card overflow-hidden shadow-2xs",
        className
      )}
      data-testid="student-data-table"
    >
      <Table>
        <TableHeader className="bg-muted/20">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              className="border-b border-border/40 hover:bg-transparent"
              key={headerGroup.id}
            >
              {headerGroup.headers.map((header) => {
                const { columnDef } = header.column;
                const columnWidth =
                  "size" in columnDef && typeof columnDef.size === "number"
                    ? `${columnDef.size}px`
                    : header.id === "select"
                      ? "40px"
                      : undefined;

                return (
                  <TableHead
                    className="px-4 py-2.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
                    key={header.id}
                    style={columnWidth ? { width: columnWidth } : undefined}
                  >
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {isLoading ? (
            // Loading skeleton rows
            SKELETON_ROW_KEYS.map((rowKey) => (
              <TableRow className="border-b border-border/30" key={rowKey}>
                {tableColumns.map((col, colIndex) => (
                  <TableCell
                    className="px-4 py-3"
                    key={`skeleton-cell-${col.id ?? colIndex}`}
                  >
                    <Skeleton className="h-4 w-full max-w-[120px]" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows.length > 0 ? (
            // Populated records
            table.getRowModel().rows.map((row) => (
              <TableRow
                className="border-b border-border/30 transition-colors hover:bg-muted/40 data-[state=selected]:bg-muted/60"
                data-state={row.getIsSelected() ? "selected" : undefined}
                key={row.id}
              >
                {row.getAllCells().map((cell) => (
                  <TableCell
                    className="px-4 py-3 text-xs text-foreground"
                    key={cell.id}
                  >
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            // Empty state within table
            <TableRow className="hover:bg-transparent">
              <TableCell
                className="p-0 text-center"
                colSpan={tableColumns.length}
              >
                {emptyMessage ?? defaultEmptyState}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
