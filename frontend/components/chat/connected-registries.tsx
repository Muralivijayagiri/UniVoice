"use client";

import { Database } from "lucide-react";
import { memo } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export type RegistryItem = {
  description: string;
  dotColor: string;
  id: string;
  name: string;
  pillColor: string;
  status: "connected" | "synced";
  statusLabel: string;
};

const REGISTRIES: RegistryItem[] = [
  {
    description: "Enrollment & Demographics",
    dotColor: "bg-emerald-400",
    id: "student_master_db",
    name: "student_master_db",
    pillColor: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    status: "connected",
    statusLabel: "Live",
  },
  {
    description: "Tuition Accounts & Balances",
    dotColor: "bg-sky-400",
    id: "fees_ledger_prod",
    name: "fees_ledger_prod",
    pillColor: "border-sky-500/20 bg-sky-500/10 text-sky-400",
    status: "synced",
    statusLabel: "Synced",
  },
];

function PureConnectedRegistries() {
  return (
    <SidebarGroup className="py-1 group-data-[collapsible=icon]:py-0">
      <div className="flex items-center justify-between px-2 pb-1.5 pt-0.5 group-data-[collapsible=icon]:hidden">
        <div className="flex items-center gap-1.5">
          <Database className="size-3 text-muted-foreground/60" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Connected Registries
          </span>
        </div>
        <span className="rounded-full border border-border/40 bg-muted/40 px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
          2 Active
        </span>
      </div>

      <SidebarGroupContent>
        <SidebarMenu className="gap-1">
          {REGISTRIES.map((registry) => (
            <SidebarMenuItem key={registry.id}>
              <SidebarMenuButton
                className="group/registry h-auto rounded-lg border border-sidebar-border/40 bg-sidebar-accent/15 px-2 py-1.5 transition-all duration-150 hover:border-sidebar-border hover:bg-sidebar-accent/40"
                tooltip={`${registry.name} (${registry.statusLabel})`}
              >
                <div className="flex size-5.5 shrink-0 items-center justify-center rounded-md border border-sidebar-border/60 bg-muted/30 text-muted-foreground transition-colors group-hover/registry:border-border/60 group-hover/registry:text-foreground">
                  <Database className="size-3" />
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-left group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-mono text-[11px] font-medium text-foreground/90 tracking-tight">
                    {registry.name}
                  </span>
                  <span className="truncate text-[10px] text-muted-foreground/70">
                    {registry.description}
                  </span>
                </div>

                <div
                  className={cn(
                    "flex shrink-0 items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] font-medium group-data-[collapsible=icon]:hidden",
                    registry.pillColor
                  )}
                >
                  <span className="relative flex size-1.5">
                    <span
                      className={cn(
                        "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                        registry.dotColor
                      )}
                    />
                    <span
                      className={cn(
                        "relative inline-flex size-1.5 rounded-full",
                        registry.dotColor
                      )}
                    />
                  </span>
                  <span>{registry.statusLabel}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export const ConnectedRegistries = memo(PureConnectedRegistries);
