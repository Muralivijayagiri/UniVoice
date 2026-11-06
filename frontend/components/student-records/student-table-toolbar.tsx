"use client";

import { Search, X } from "lucide-react";
import { memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface StudentTableToolbarProps {
  onSearchChange?: (query: string) => void;
  recordCount?: number;
  searchQuery?: string;
}

export const StudentTableToolbar = memo(function StudentTableToolbarInner({
  onSearchChange,
  recordCount = 0,
  searchQuery = "",
}: StudentTableToolbarProps) {
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearchChange?.(e.target.value);
    },
    [onSearchChange]
  );

  const handleClearClick = useCallback(() => {
    onSearchChange?.("");
  }, [onSearchChange]);

  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center gap-3"
      data-testid="student-table-toolbar"
    >
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          className="h-10 w-full rounded-xl border border-border/60 bg-card pl-10 pr-9 text-xs text-foreground placeholder:text-muted-foreground/60 focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/30"
          onChange={handleInputChange}
          placeholder="Search students..."
          value={searchQuery}
        />
        {searchQuery.length > 0 && (
          <Button
            aria-label="Clear search query"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 size-6 rounded-md p-0 text-muted-foreground hover:text-foreground"
            onClick={handleClearClick}
            size="icon"
            type="button"
            variant="ghost"
          >
            <X className="size-3.5" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-1.5 shrink-0 px-1 text-xs text-muted-foreground tabular-nums">
        <span className="font-medium text-foreground">{recordCount}</span>
        <span>matching records</span>
      </div>
    </div>
  );
});
