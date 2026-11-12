"use client";

import { PanelLeftIcon } from "lucide-react";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { UniVoiceIcon } from "./icons";
import { RoleSelector } from "./role-selector";

function PureChatHeader() {
  const { state, toggleSidebar, isMobile } = useSidebar();

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b border-sidebar-border/40 bg-sidebar/80 px-3 backdrop-blur-md">
      <Button
        className={state === "collapsed" && !isMobile ? "flex" : "md:hidden"}
        onClick={toggleSidebar}
        size="icon-sm"
        variant="ghost"
      >
        <PanelLeftIcon className="size-4" />
      </Button>

      <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary md:hidden">
        <UniVoiceIcon size={16} />
      </div>

      <RoleSelector />
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader);
