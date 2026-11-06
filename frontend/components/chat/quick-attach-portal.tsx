"use client";

import { Paperclip, Sparkles, Tag } from "lucide-react";
import { memo, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type QuickTag = {
  category: string;
  description: string;
  id: string;
  insertValue: string;
  label: string;
};

export const QUICK_TAGS: QuickTag[] = [
  {
    category: "Academic",
    description: "Scope queries to 1st, 2nd, 3rd, or Final year batches",
    id: "batch-year",
    insertValue: "Filter by Batch Year",
    label: "Filter by Batch Year",
  },
  {
    category: "Financial",
    description: "Filter student accounts by outstanding tuition balance",
    id: "target-balance",
    insertValue: "Target Balance",
    label: "Target Balance",
  },
  {
    category: "Financial",
    description: "Identify records with overdue fee installments",
    id: "pending-dues",
    insertValue: "Pending Dues",
    label: "Pending Dues",
  },
  {
    category: "Compliance",
    description: "Target students missing verification certificates",
    id: "missing-documents",
    insertValue: "Missing Documents",
    label: "Missing Documents",
  },
];

type TagItemProps = {
  onInsertTag: (tag: string) => void;
  tag: QuickTag;
};

const QuickTagItem = memo(function PureQuickTagItem({
  onInsertTag,
  tag,
}: TagItemProps) {
  const handleClick = useCallback(() => {
    onInsertTag(tag.insertValue);
  }, [onInsertTag, tag.insertValue]);

  return (
    <button
      className="group flex w-full items-start gap-2.5 rounded-lg border border-border/50 bg-card/40 p-2 text-left text-xs transition-all duration-150 hover:border-border hover:bg-accent/50 hover:text-foreground active:scale-[0.99] cursor-pointer"
      data-testid={`quick-tag-${tag.id}`}
      onClick={handleClick}
      type="button"
    >
      <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border border-border/60 bg-muted/40 text-muted-foreground group-hover:border-primary/40 group-hover:text-primary">
        <Tag className="size-3" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center justify-between">
          <span className="font-medium text-foreground tracking-tight text-[12px]">
            {tag.label}
          </span>
          <span className="rounded bg-muted/50 px-1.5 py-0.2 text-[9px] text-muted-foreground/80 font-mono">
            {tag.category}
          </span>
        </div>
        <p className="line-clamp-1 text-[10px] text-muted-foreground/70">
          {tag.description}
        </p>
      </div>
    </button>
  );
});

type QuickAttachPortalProps = {
  disabled?: boolean;
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>;
  onInsertTag: (tag: string) => void;
};

function PureQuickAttachPortal({
  disabled = false,
  fileInputRef,
  onInsertTag,
}: QuickAttachPortalProps) {
  const [open, setOpen] = useState(false);

  const handleFileClick = useCallback(() => {
    setOpen(false);
    fileInputRef.current?.click();
  }, [fileInputRef]);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "group flex h-7.5 items-center gap-1.5 rounded-lg border border-border/40 bg-card/40 px-2 text-xs text-muted-foreground transition-all duration-150 hover:border-border hover:bg-card/90 hover:text-foreground shadow-xs",
            open ? "border-border bg-card/90 text-foreground" : ""
          )}
          data-testid="quick-attach-trigger"
          disabled={disabled}
          size="sm"
          variant="ghost"
        >
          <Paperclip className="size-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
          <span className="text-[11px] font-medium hidden sm:inline">
            Quick-Attach
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-80 rounded-xl border border-border/70 bg-popover/95 p-3 backdrop-blur-xl shadow-[var(--shadow-float)]"
        data-testid="quick-attach-portal-content"
        side="top"
        sideOffset={8}
      >
        <div className="flex items-center justify-between border-b border-border/40 pb-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-primary" />
            <span className="text-[12px] font-semibold tracking-tight text-foreground">
              Quick-Attach Database Portal
            </span>
          </div>
          <span className="rounded bg-muted/60 px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground">
            Tags
          </span>
        </div>

        <p className="mt-2 text-[11px] text-muted-foreground/80 leading-normal">
          Click tags to insert query criteria into your prompt:
        </p>

        <div className="mt-2.5 flex flex-col gap-1.5">
          {QUICK_TAGS.map((tag) => (
            <QuickTagItem key={tag.id} onInsertTag={onInsertTag} tag={tag} />
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2.5">
          <button
            className="flex items-center gap-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
            onClick={handleFileClick}
            type="button"
          >
            <Paperclip className="size-3" />
            <span>Upload Document / CSV</span>
          </button>
          <span className="text-[10px] text-muted-foreground/50">
            Cursor-inserted
          </span>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export const QuickAttachPortal = memo(PureQuickAttachPortal);
