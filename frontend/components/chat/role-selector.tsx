"use client";

import {
  Award,
  BookOpen,
  Check,
  ChevronDown,
  ClipboardCheck,
  GraduationCap,
  Landmark,
} from "lucide-react";
import { memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRole } from "@/hooks/use-role";
import type { RoleId, UniversityRole } from "@/lib/roles";
import { cn } from "@/lib/utils";

function getRoleIcon(roleId: RoleId, className = "size-4") {
  switch (roleId) {
    case "finance":
      return <Landmark className={className} />;
    case "admissions":
      return <GraduationCap className={className} />;
    case "scholarship":
      return <Award className={className} />;
    case "library":
      return <BookOpen className={className} />;
    case "class_teacher":
      return <ClipboardCheck className={className} />;
    default:
      return <Landmark className={className} />;
  }
}

type RoleMenuItemProps = {
  role: UniversityRole;
  isSelected: boolean;
  onSelectRole: (role: UniversityRole) => void;
};

const RoleMenuItem = memo(function PureRoleMenuItem({
  role,
  isSelected,
  onSelectRole,
}: RoleMenuItemProps) {
  const handleSelect = useCallback(() => {
    onSelectRole(role);
  }, [onSelectRole, role]);

  return (
    <DropdownMenuItem
      className={cn(
        "flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-xs transition-all duration-150 focus-visible:outline-hidden",
        isSelected
          ? "bg-amber-500/10 text-foreground font-medium"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
      )}
      data-testid={`role-item-${role.id}`}
      onSelect={handleSelect}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-md border transition-colors",
            isSelected
              ? "border-amber-500/30 bg-amber-500/15 text-amber-600 dark:text-[#D4AF37]"
              : "border-border/50 bg-muted/40 text-muted-foreground"
          )}
        >
          {getRoleIcon(role.id, "size-3.5")}
        </div>
        <span
          className={cn(
            "text-[13px] tracking-tight leading-tight truncate",
            isSelected
              ? "font-semibold text-foreground"
              : "font-normal text-foreground/90"
          )}
        >
          {role.name}
        </span>
      </div>
      {isSelected ? (
        <Check className="size-3.5 shrink-0 text-amber-600 dark:text-[#D4AF37] animate-in fade-in-50 zoom-in-75 duration-150" />
      ) : null}
    </DropdownMenuItem>
  );
});

function PureRoleSelector() {
  const { selectedRole, setSelectedRole, roles } = useRole();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="group flex h-9 items-center gap-2 rounded-lg border border-border/60 bg-card/60 px-2.5 text-xs transition-all duration-150 hover:border-border hover:bg-card/90 hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring shadow-xs"
          data-testid="role-selector-trigger"
          size="sm"
          variant="ghost"
        >
          <div className="flex size-5.5 items-center justify-center rounded-md border border-border/60 bg-muted/40 text-muted-foreground text-[11px] transition-colors group-hover:text-foreground">
            {getRoleIcon(selectedRole.id, "size-3.5")}
          </div>
          <div className="flex items-center gap-1.5 text-left">
            <span className="font-semibold text-foreground tracking-tight text-[13px]">
              {selectedRole.name}
            </span>
          </div>
          <ChevronDown className="ml-0.5 size-3.5 text-muted-foreground/70 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-64 rounded-xl border border-border/70 bg-popover/95 p-1.5 backdrop-blur-xl shadow-[var(--shadow-float)]"
        data-testid="role-selector-content"
        sideOffset={6}
      >
        <div className="px-2.5 py-1.5">
          <span className="text-[11px] font-medium tracking-tight text-muted-foreground">
            Switch department
          </span>
        </div>
        <DropdownMenuSeparator className="my-1 border-border/40" />
        <DropdownMenuGroup className="space-y-0.5">
          {roles.map((role) => (
            <RoleMenuItem
              isSelected={selectedRole.id === role.id}
              key={role.id}
              onSelectRole={setSelectedRole}
              role={role}
            />
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const RoleSelector = memo(PureRoleSelector);
