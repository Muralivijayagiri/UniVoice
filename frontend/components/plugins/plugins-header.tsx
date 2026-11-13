"use client";

import { PanelLeftIcon } from "lucide-react";
import { memo } from "react";
import { RoleSelector } from "@/components/chat/role-selector";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

function PurePluginsHeader() {
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
      <RoleSelector />
    </header>
  );
}

export const PluginsHeader = memo(PurePluginsHeader);
