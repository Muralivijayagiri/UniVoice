"use client";

import {
  BarChart3Icon,
  PanelLeftIcon,
  PenSquareIcon,
  PlugIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "next-auth";
import { useCallback } from "react";
import { SidebarHistory } from "@/components/chat/sidebar-history";
import { SidebarUserNav } from "@/components/chat/sidebar-user-nav";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { UniVoiceIcon } from "./icons";

export function AppSidebar({ user }: { user: User | undefined }) {
  const router = useRouter();
  const pathname = usePathname();
  const { setOpenMobile, toggleSidebar } = useSidebar();

  const closeMobile = useCallback(() => {
    setOpenMobile(false);
  }, [setOpenMobile]);

  const handleToggleSidebar = useCallback(() => {
    toggleSidebar();
  }, [toggleSidebar]);

  const handleNewChat = useCallback(() => {
    setOpenMobile(false);
    router.push("/");
    router.refresh();
  }, [router, setOpenMobile]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="pb-0 pt-3">
        <SidebarMenu>
          <SidebarMenuItem className="flex flex-row items-center justify-between">
            <div className="group/logo relative flex items-center justify-center">
              <SidebarMenuButton
                asChild
                className="size-8 !px-0 items-center justify-center group-data-[collapsible=icon]:group-hover/logo:opacity-0"
                tooltip="UniVoice Workspace"
              >
                <Link href="/" onClick={closeMobile}>
                  <UniVoiceIcon className="size-4 text-primary" />
                </Link>
              </SidebarMenuButton>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                    className="pointer-events-none absolute inset-0 size-8 opacity-0 group-data-[collapsible=icon]:pointer-events-auto group-data-[collapsible=icon]:group-hover/logo:opacity-100"
                    onClick={handleToggleSidebar}
                  >
                    <PanelLeftIcon className="size-4" />
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent className="hidden md:block" side="right">
                  Open sidebar
                </TooltipContent>
              </Tooltip>
            </div>
            <Link
              className="flex items-center gap-2 group-data-[collapsible=icon]:hidden mr-auto pl-1"
              href="/"
              onClick={closeMobile}
            >
              <span className="text-[14px] font-semibold tracking-tight text-foreground">
                UniVoice
              </span>
            </Link>
            <div className="group-data-[collapsible=icon]:hidden">
              <SidebarTrigger className="text-sidebar-foreground/60 transition-colors duration-150 hover:text-sidebar-foreground" />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="pt-4">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              <SidebarMenuItem>
                <SidebarMenuButton
                  className={cn(
                    "h-8.5 rounded-lg text-[13px] transition-all duration-150 cursor-pointer",
                    pathname === "/"
                      ? "border border-sidebar-border bg-sidebar-accent text-sidebar-foreground font-medium"
                      : "border border-sidebar-border/60 bg-sidebar-accent/30 text-sidebar-foreground/80 hover:border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                  onClick={handleNewChat}
                  tooltip="New Campaign"
                >
                  <PenSquareIcon className="size-4 text-primary/80" />
                  <span className="font-medium">New campaign</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "h-8.5 rounded-lg text-[13px] transition-all duration-150 cursor-pointer",
                    pathname === "/student-records"
                      ? "border border-primary/30 bg-primary/10 text-primary font-medium"
                      : "border border-sidebar-border/40 bg-sidebar-accent/15 text-sidebar-foreground/80 hover:border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                  tooltip="Student Records"
                >
                  <Link href="/student-records" onClick={closeMobile}>
                    <UsersIcon className="size-4 text-primary/80" />
                    <span className="font-medium">Student Records</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "h-8.5 rounded-lg text-[13px] transition-all duration-150 cursor-pointer",
                    pathname === "/analytics"
                      ? "border border-primary/30 bg-primary/10 text-primary font-medium"
                      : "border border-sidebar-border/40 bg-sidebar-accent/15 text-sidebar-foreground/80 hover:border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                  tooltip="Campaign History"
                >
                  <Link href="/analytics" onClick={closeMobile}>
                    <BarChart3Icon className="size-4 text-primary/80" />
                    <span className="font-medium">Campaign History</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "h-8.5 rounded-lg text-[13px] transition-all duration-150 cursor-pointer",
                    pathname === "/plugins"
                      ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
                      : "border border-sidebar-border/40 bg-sidebar-accent/15 text-sidebar-foreground/80 hover:border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                  tooltip="Plugins"
                >
                  <Link href="/plugins" onClick={closeMobile}>
                    <PlugIcon className="size-4 text-emerald-500/90" />
                    <span className="font-medium">Plugins</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarHistory user={user} />
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border pt-2 pb-3">
        {user ? <SidebarUserNav user={user} /> : null}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
