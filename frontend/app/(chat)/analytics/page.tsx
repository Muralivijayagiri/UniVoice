"use client";

import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Filter,
  GraduationCap,
  Landmark,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, useCallback, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  type CampaignRecord,
  MOCK_CAMPAIGN_RECORDS,
} from "@/lib/campaign-analytics";
import type { RoleId } from "@/lib/roles";
import { cn } from "@/lib/utils";

// Department icon helper
function getDepartmentIcon(roleId: RoleId) {
  switch (roleId) {
    case "finance":
      return <Landmark className="size-3.5 text-muted-foreground" />;
    case "admissions":
      return <GraduationCap className="size-3.5 text-muted-foreground" />;
    case "scholarship":
      return <Award className="size-3.5 text-muted-foreground" />;
    case "library":
      return <BookOpen className="size-3.5 text-muted-foreground" />;
    default:
      return <Landmark className="size-3.5 text-muted-foreground" />;
  }
}

// Campaign Row Component
const CampaignRowItem = memo(function PureCampaignRowItem({
  campaign,
  onClick,
}: {
  campaign: CampaignRecord;
  onClick: (id: string) => void;
}) {
  const handleClick = useCallback(() => {
    onClick(campaign.id);
  }, [onClick, campaign.id]);

  return (
    <button
      aria-label={`View analytics for ${campaign.name}`}
      className="group flex w-full flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3.5 rounded-xl border border-border/40 hover:border-amber-500/40 hover:bg-muted/40 transition-all duration-150 cursor-pointer bg-card text-left focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-amber-500/50 shadow-2xs"
      data-testid={`campaign-item-${campaign.id}`}
      onClick={handleClick}
      type="button"
    >
      {/* Left: Icon, Name & Description */}
      <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/50 text-foreground group-hover:border-amber-500/40 group-hover:text-amber-600 dark:group-hover:text-[#D4AF37] transition-colors">
          {getDepartmentIcon(campaign.roleId)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-foreground truncate group-hover:text-amber-600 dark:group-hover:text-[#D4AF37] transition-colors">
              {campaign.name}
            </span>
          </div>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {campaign.description}
          </p>
        </div>
      </div>

      {/* Middle & Right metadata */}
      <div className="flex items-center justify-between sm:justify-end gap-5 pl-12.5 sm:pl-0 text-xs shrink-0">
        {/* Department Badge */}
        <Badge
          className="border-border/60 bg-muted/40 text-foreground font-normal px-2.5 py-0.5 text-[11px]"
          variant="outline"
        >
          {campaign.department}
        </Badge>

        {/* Date Created */}
        <div className="hidden md:flex flex-col text-right w-24">
          <span className="text-foreground text-xs font-medium">
            {campaign.dateFormatted}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">
            {campaign.timeframe}
          </span>
        </div>

        {/* Targeted Count */}
        <div className="text-right w-20">
          <span className="font-mono text-sm font-semibold text-foreground">
            {campaign.targetCount.toLocaleString()}
          </span>
          <span className="text-[10px] text-muted-foreground block">
            targeted
          </span>
        </div>

        {/* Status Badge */}
        <div className="w-24 text-right">
          {campaign.status === "completed" && (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-3" />
              Completed
            </span>
          )}
          {campaign.status === "in_progress" && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400">
              <Clock className="size-3 animate-pulse" />
              In progress
            </span>
          )}
          {campaign.status === "draft" && (
            <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              Draft
            </span>
          )}
        </div>

        {/* Chevron */}
        <ChevronRight className="size-4 text-muted-foreground/60 group-hover:text-amber-600 dark:group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all shrink-0" />
      </div>
    </button>
  );
});

const DeptMenuItem = memo(function PureDeptMenuItem({
  dept,
  isSelected,
  onSelect,
}: {
  dept: string;
  isSelected: boolean;
  onSelect: (dept: string) => void;
}) {
  const handleClick = useCallback(() => {
    onSelect(dept);
  }, [onSelect, dept]);

  return (
    <DropdownMenuItem
      className={cn(
        "cursor-pointer text-xs rounded-lg py-1.5",
        isSelected
          ? "bg-amber-500/15 text-amber-600 dark:text-[#D4AF37] font-medium"
          : "text-foreground hover:bg-muted"
      )}
      onClick={handleClick}
    >
      {dept}
    </DropdownMenuItem>
  );
});

const StatusMenuItem = memo(function PureStatusMenuItem({
  status,
  isSelected,
  onSelect,
}: {
  status: string;
  isSelected: boolean;
  onSelect: (status: string) => void;
}) {
  const handleClick = useCallback(() => {
    onSelect(status);
  }, [onSelect, status]);

  return (
    <DropdownMenuItem
      className={cn(
        "cursor-pointer text-xs rounded-lg py-1.5",
        isSelected
          ? "bg-amber-500/15 text-amber-600 dark:text-[#D4AF37] font-medium"
          : "text-foreground hover:bg-muted"
      )}
      onClick={handleClick}
    >
      {status}
    </DropdownMenuItem>
  );
});

export default function AnalyticsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState<string>("All Departments");
  const [selectedStatus, setSelectedStatus] = useState<string>("All Statuses");

  const handleCampaignClick = useCallback(
    (id: string) => {
      router.push(`/analytics/${id}`);
    },
    [router]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const handleResetFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedDept("All Departments");
    setSelectedStatus("All Statuses");
  }, []);

  // Filtered campaigns
  const filteredCampaigns = useMemo(
    () =>
      MOCK_CAMPAIGN_RECORDS.filter((c) => {
        const matchesSearch =
          searchQuery.trim() === "" ||
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.department.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDept =
          selectedDept === "All Departments" || c.department === selectedDept;

        const matchesStatus =
          selectedStatus === "All Statuses" ||
          (selectedStatus === "Completed" && c.status === "completed") ||
          (selectedStatus === "In progress" && c.status === "in_progress") ||
          (selectedStatus === "Draft" && c.status === "draft");

        return matchesSearch && matchesDept && matchesStatus;
      }),
    [searchQuery, selectedDept, selectedStatus]
  );

  const departments = [
    "All Departments",
    "Finance",
    "Admissions",
    "Scholarship",
    "Library",
  ];

  const statuses = ["All Statuses", "Completed", "In progress", "Draft"];

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-sidebar">
      {/* Top Header */}
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border/40 bg-sidebar/80 px-4 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground">
            Campaign History
          </h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 md:rounded-tl-[12px] md:border-t md:border-l md:border-border/40 bg-background">
        <div className="mx-auto max-w-5xl space-y-5">
          {/* Page Heading & Filters Bar */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-border/40">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Campaign History
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                View previous outbound voice campaigns and delivery reports
              </p>
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Department Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="h-8.5 rounded-lg border border-border/60 bg-card px-3 text-xs font-normal text-foreground hover:bg-muted cursor-pointer"
                    size="sm"
                    variant="outline"
                  >
                    <Landmark className="mr-1.5 size-3.5 text-muted-foreground" />
                    <span>{selectedDept}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="rounded-xl border border-border/60 bg-popover text-popover-foreground text-xs shadow-lg"
                >
                  {departments.map((dept) => (
                    <DeptMenuItem
                      dept={dept}
                      isSelected={selectedDept === dept}
                      key={dept}
                      onSelect={setSelectedDept}
                    />
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Status Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="h-8.5 rounded-lg border border-border/60 bg-card px-3 text-xs font-normal text-foreground hover:bg-muted cursor-pointer"
                    size="sm"
                    variant="outline"
                  >
                    <Filter className="mr-1.5 size-3.5 text-muted-foreground" />
                    <span>{selectedStatus}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="rounded-xl border border-border/60 bg-popover text-popover-foreground text-xs shadow-lg"
                >
                  {statuses.map((status) => (
                    <StatusMenuItem
                      isSelected={selectedStatus === status}
                      key={status}
                      onSelect={setSelectedStatus}
                      status={status}
                    />
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Search Field */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              className="h-10 w-full rounded-xl border border-border/60 bg-card pl-10 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus-visible:border-amber-500/50 focus-visible:ring-1 focus-visible:ring-amber-500/30"
              onChange={handleSearchChange}
              placeholder="Search campaigns by name, department, or keywords..."
              value={searchQuery}
            />
          </div>

          {/* Table Header Row */}
          <div className="flex items-center justify-between px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            <div className="flex-1">Campaign</div>
            <div className="flex items-center justify-end gap-5 shrink-0">
              <span className="hidden sm:inline w-24 text-center">
                Department
              </span>
              <span className="hidden md:inline w-24 text-right">Date ↓</span>
              <span className="w-20 text-right">Targeted</span>
              <span className="w-24 text-right">Status</span>
              <span className="w-4" />
            </div>
          </div>

          {/* Campaign List */}
          <div className="space-y-2">
            {filteredCampaigns.length > 0 ? (
              filteredCampaigns.map((campaign) => (
                <CampaignRowItem
                  campaign={campaign}
                  key={campaign.id}
                  onClick={handleCampaignClick}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/50 py-16 text-center">
                <Search className="size-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium text-foreground">
                  No matching campaigns found
                </p>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                  Try adjusting your search query or filters to find existing
                  UniVoice campaign records.
                </p>
                <Button
                  className="mt-4 h-8 rounded-lg border border-border/60 text-xs text-foreground hover:bg-muted"
                  onClick={handleResetFilters}
                  size="sm"
                  variant="outline"
                >
                  Reset filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
