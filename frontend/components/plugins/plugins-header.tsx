"use client";

import { ChevronDown, Lock, PanelLeftIcon } from "lucide-react";
import { memo } from "react";
import { RoleSelector } from "@/components/chat/role-selector";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

function PurePluginsHeader() {
  const { state, toggleSidebar, isMobile } = useSidebar();

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-sidebar-border/40 bg-sidebar/80 px-3 backdrop-blur-md">
      <Button
        className={state === "collapsed" && !isMobile ? "flex" : "md:hidden"}
        onClick={toggleSidebar}
        size="icon-sm"
        variant="ghost"
      >
        <PanelLeftIcon className="size-4" />
      </Button>

      <RoleSelector />

      {/* Visibility indicator matching chat shell */}
      <div className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-card/40 px-2.5 py-1 text-xs text-muted-foreground">
        <Lock className="size-3.5 text-muted-foreground/70" />
        <ChevronDown className="size-3 text-muted-foreground/50" />
      </div>
    </header>
  );
}

export const PluginsHeader = memo(PurePluginsHeader);
