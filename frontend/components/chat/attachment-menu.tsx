"use client";

import { Paperclip, Plug, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type AttachmentMenuProps = {
  disabled?: boolean;
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>;
};

function PureAttachmentMenu({
  disabled = false,
  fileInputRef,
}: AttachmentMenuProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleAddImagesAndFiles = useCallback(() => {
    setOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.accept =
        "image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx,.xls,*/*";
      fileInputRef.current.click();
    }
  }, [fileInputRef]);

  const handleOpenPlugins = useCallback(() => {
    setOpen(false);
    router.push("/plugins");
  }, [router]);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          aria-label="Add attachment or action"
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full border border-border/60 bg-background/50 text-muted-foreground transition-all duration-150 hover:border-border hover:bg-muted/80 hover:text-foreground cursor-pointer shadow-xs",
            open
              ? "border-border bg-muted/80 text-foreground ring-1 ring-ring/30"
              : ""
          )}
          data-testid="composer-plus-button"
          disabled={disabled}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <Plus
            className={cn(
              "size-4 transition-transform duration-200",
              open ? "rotate-45 text-foreground" : "text-muted-foreground"
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-56 rounded-2xl border border-border/60 bg-popover/95 p-1.5 backdrop-blur-xl shadow-[var(--shadow-float)]"
        data-testid="composer-plus-menu"
        side="top"
        sideOffset={10}
      >
        <div className="flex flex-col gap-0.5" role="menu">
          {/* Add images and files */}
          <button
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-foreground/90 transition-colors hover:bg-muted/70 hover:text-foreground cursor-pointer text-left focus-visible:outline-hidden focus-visible:bg-muted/70"
            data-testid="attachment-item-files"
            onClick={handleAddImagesAndFiles}
            role="menuitem"
            type="button"
          >
            <Paperclip className="size-4 shrink-0 text-muted-foreground/80" />
            <span className="flex-1">Add images and files</span>
          </button>

          {/* Subtle Divider */}
          <div className="my-1 h-px bg-border/40" />

          {/* Plugins */}
          <button
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-foreground/90 transition-colors hover:bg-muted/70 hover:text-foreground cursor-pointer text-left focus-visible:outline-hidden focus-visible:bg-muted/70"
            data-testid="attachment-item-plugins"
            onClick={handleOpenPlugins}
            role="menuitem"
            type="button"
          >
            <Plug className="size-4 shrink-0 text-muted-foreground/80" />
            <span className="flex-1">Plugins</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export const AttachmentMenu = memo(PureAttachmentMenu);
