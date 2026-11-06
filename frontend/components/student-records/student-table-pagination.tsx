"use client";

import { Phone } from "lucide-react";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { STUDENT_RECORDS_PAGE_SIZE } from "@/lib/student-records/configurations";

export interface StudentTablePaginationProps {
  canNextPage?: boolean;
  canPreviousPage?: boolean;
  currentPage?: number;
  onCallStudents?: () => void;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
  pageSize?: number;
  selectedCount?: number;
  showCallButton?: boolean;
  totalPages?: number;
  totalRecords?: number;
}

export const StudentTablePagination = memo(
  function StudentTablePaginationInner({
    canNextPage,
    canPreviousPage,
    currentPage = 1,
    onCallStudents,
    onNextPage,
    onPreviousPage,
    pageSize = STUDENT_RECORDS_PAGE_SIZE,
    selectedCount = 0,
    showCallButton = true,
    totalPages = 1,
    totalRecords = 0,
  }: StudentTablePaginationProps) {
    const isCallDisabled = selectedCount === 0;
    const isPreviousDisabled =
      canPreviousPage === undefined
        ? !onPreviousPage || currentPage <= 1
        : !canPreviousPage;
    const isNextDisabled =
      canNextPage === undefined
        ? !onNextPage || currentPage >= totalPages
        : !canNextPage;

    const startRecord =
      totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endRecord = Math.min(currentPage * pageSize, totalRecords);

    return (
      <div
        className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/40 pt-4"
        data-testid="student-table-pagination"
      >
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground order-2 sm:order-1">
          <span className="font-medium text-foreground">
            {totalRecords === 0
              ? "Showing 0 records"
              : `Showing ${startRecord}–${endRecord} of ${totalRecords}`}
          </span>
          <span className="text-muted-foreground/40">•</span>
          <span>
            Page {currentPage} of {totalPages}
          </span>
        </div>
        <div className="flex items-center gap-2 order-1 sm:order-2 w-full sm:w-auto justify-end">
          <Button
            className="h-8 rounded-lg border border-border/60 text-xs cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
            disabled={isPreviousDisabled}
            onClick={onPreviousPage}
            size="sm"
            type="button"
            variant="outline"
          >
            Previous
          </Button>
          <Button
            className="h-8 rounded-lg border border-border/60 text-xs cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
            disabled={isNextDisabled}
            onClick={onNextPage}
            size="sm"
            type="button"
            variant="outline"
          >
            Next
          </Button>
          {showCallButton ? (
            <Button
              aria-label={
                selectedCount > 0
                  ? `Call ${selectedCount} selected student${selectedCount === 1 ? "" : "s"}`
                  : "Call Students (none selected)"
              }
              className="h-8 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs gap-1.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 shadow-xs"
              disabled={isCallDisabled}
              onClick={onCallStudents}
              size="sm"
              type="button"
            >
              <Phone className="size-3.5" />
              <span>
                {selectedCount > 0
                  ? `Call Students (${selectedCount})`
                  : "Call Students"}
              </span>
            </Button>
          ) : null}
        </div>
      </div>
    );
  }
);
