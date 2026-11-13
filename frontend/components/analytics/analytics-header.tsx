"use client";

import { BarChart3, PanelLeftIcon } from "lucide-react";
import { memo } from "react";
import { RoleSelector } from "@/components/chat/role-selector";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

function PureAnalyticsHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-sidebar-border/40 bg-sidebar/80 px-3 backdrop-blur-md">
      <Button
        className="md:hidden"
        onClick={toggleSidebar}
        size="icon-sm"
        variant="ghost"
      >
        <PanelLeftIcon className="size-4" />
      </Button>
      <div className="flex items-center gap-2.5">
        <div className="flex size-7.5 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
          <BarChart3 className="size-4" />
        </div>
        <div>
          <h1 className="font-semibold text-[13px] sm:text-[14px] text-foreground tracking-tight leading-tight">
            Campaign History
          </h1>
          <p className="text-[10px] text-muted-foreground hidden sm:block">
            Outreach records & post-call reports
          </p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <RoleSelector />

        <div className="hidden items-center gap-2 rounded-full border border-border/50 bg-card/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm md:flex">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-medium text-foreground/90 text-[11px]">
            Live Webhooks
          </span>
          <span className="text-[10px] text-muted-foreground/60 font-mono">
            • Sandbox
          </span>
        </div>
      </div>
    </header>
  );
}

export const AnalyticsHeader = memo(PureAnalyticsHeader);
