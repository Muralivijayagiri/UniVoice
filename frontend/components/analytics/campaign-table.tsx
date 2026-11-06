"use client";

import {
  Building2,
  CheckCircle2,
  Clock,
  Filter,
  RotateCw,
  Search,
  Users,
} from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CampaignActivity } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type CampaignTableProps = {
  campaigns: CampaignActivity[];
  selectedDepartment?: string;
};

const CampaignTableRow = memo(function PureCampaignTableRow({
  campaign,
}: {
  campaign: CampaignActivity;
}) {
  const isCompleted = campaign.status === "completed";

  return (
    <tr
      className="group border-b border-border/30 transition-colors hover:bg-muted/30"
      data-testid={`campaign-row-${campaign.id}`}
    >
      {/* Campaign Name */}
      <td className="px-3.5 py-3 text-left">
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-[13px] text-foreground tracking-tight group-hover:text-primary transition-colors">
            {campaign.name}
          </span>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground/70">
            <span className="font-mono">ID: {campaign.id}</span>
            <span>•</span>
            <span>{campaign.timestamp}</span>
            <span>•</span>
            <span>Avg {campaign.avgDuration}</span>
          </div>
        </div>
      </td>

      {/* Department */}
      <td className="px-3.5 py-3 text-left">
        <Badge
          className="gap-1 border-primary/20 bg-primary/10 text-primary hover:bg-primary/15 text-[11px]"
          variant="outline"
        >
          <Building2 className="size-2.5" />
          <span>{campaign.department}</span>
        </Badge>
      </td>

      {/* Target Count */}
      <td className="px-3.5 py-3 text-left">
        <div className="flex items-center gap-1.5 font-mono text-[12px] text-muted-foreground">
          <Users className="size-3 text-muted-foreground/60" />
          <span>{campaign.targetCount} targets</span>
        </div>
      </td>

      {/* Completion Status */}
      <td className="px-3.5 py-3 text-left">
        {isCompleted ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
            <CheckCircle2 className="size-3" />
            Completed
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
            <Clock className="size-3 animate-pulse" />
            In Progress
          </span>
        )}
      </td>

      {/* Success Rate */}
      <td className="px-3.5 py-3 text-left">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[12px] font-semibold text-foreground">
            {campaign.successRate}%
          </span>
          <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-muted/40 sm:block">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${campaign.successRate}%` }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground/60 font-mono hidden md:inline">
            ({campaign.callsSuccessful}/{campaign.callsAttempted})
          </span>
        </div>
      </td>
    </tr>
  );
});

function PureCampaignTable({
  campaigns,
  selectedDepartment: _selectedDepartment,
}: CampaignTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "completed" | "in_progress"
  >("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter("all");
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const handleFilterAll = useCallback(() => {
    setStatusFilter("all");
  }, []);

  const handleFilterCompleted = useCallback(() => {
    setStatusFilter("completed");
  }, []);

  const handleFilterInProgress = useCallback(() => {
    setStatusFilter("in_progress");
  }, []);

  const filteredCampaigns = useMemo(
    () =>
      campaigns.filter((c) => {
        const matchesSearch =
          searchQuery.trim() === "" ||
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
          statusFilter === "all" || c.status === statusFilter;

        return matchesSearch && matchesStatus;
      }),
    [campaigns, searchQuery, statusFilter]
  );

  return (
    <div
      className="rounded-2xl border border-border/50 bg-card/60 p-4 shadow-[var(--shadow-card)] backdrop-blur-md sm:p-5"
      data-testid="campaign-activity-table"
    >
      {/* Top Filter and Controls Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-3.5">
        <div>
          <h2 className="font-semibold text-[13px] sm:text-[14px] text-foreground tracking-tight">
            Recent Campaign Outreach Activity
          </h2>
          <p className="text-[11px] text-muted-foreground/80">
            Real-time delivery status across all academic departments
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative w-full sm:w-48">
            <Search className="absolute left-2.5 top-1/2 size-3 -translate-y-1/2 text-muted-foreground/60" />
            <input
              className="h-7.5 w-full rounded-lg border border-border/50 bg-background/50 pl-7.5 pr-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-hidden"
              onChange={handleSearchChange}
              placeholder="Search campaigns..."
              type="text"
              value={searchQuery}
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center rounded-lg border border-border/50 bg-background/40 p-0.5">
            <button
              className={cn(
                "rounded-md px-2 py-1 text-[11px] font-medium transition-colors cursor-pointer",
                statusFilter === "all"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={handleFilterAll}
              type="button"
            >
              All
            </button>
            <button
              className={cn(
                "rounded-md px-2 py-1 text-[11px] font-medium transition-colors cursor-pointer",
                statusFilter === "completed"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={handleFilterCompleted}
              type="button"
            >
              Completed
            </button>
            <button
              className={cn(
                "rounded-md px-2 py-1 text-[11px] font-medium transition-colors cursor-pointer",
                statusFilter === "in_progress"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={handleFilterInProgress}
              type="button"
            >
              In Progress
            </button>
          </div>

          {/* Refresh Action Button */}
          <Button
            className="h-7.5 size-7.5 p-0 cursor-pointer"
            disabled={isRefreshing}
            onClick={handleRefresh}
            size="sm"
            title="Refresh campaign data"
            variant="outline"
          >
            <RotateCw
              className={cn("size-3 text-muted-foreground", {
                "animate-spin": isRefreshing,
              })}
            />
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="mt-3.5 overflow-hidden rounded-xl border border-border/50 bg-background/50">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[580px] text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-muted/30 text-muted-foreground">
                <th className="px-3.5 py-2.5 font-semibold text-[11px] uppercase tracking-wider">
                  Campaign Name
                </th>
                <th className="px-3.5 py-2.5 font-semibold text-[11px] uppercase tracking-wider">
                  Department
                </th>
                <th className="px-3.5 py-2.5 font-semibold text-[11px] uppercase tracking-wider">
                  Target Count
                </th>
                <th className="px-3.5 py-2.5 font-semibold text-[11px] uppercase tracking-wider">
                  Completion Status
                </th>
                <th className="px-3.5 py-2.5 font-semibold text-[11px] uppercase tracking-wider">
                  Success Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.length > 0 ? (
                filteredCampaigns.map((campaign) => (
                  <CampaignTableRow campaign={campaign} key={campaign.id} />
                ))
              ) : (
                <tr>
                  <td className="px-3.5 py-10 text-center" colSpan={5}>
                    <div className="mx-auto flex max-w-sm flex-col items-center gap-2">
                      <div className="flex size-9 items-center justify-center rounded-full border border-border/60 bg-muted/30 text-muted-foreground">
                        <Filter className="size-4" />
                      </div>
                      <p className="font-medium text-foreground text-xs">
                        No campaigns match your filter criteria
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Try modifying your search term or clearing active status
                        filters.
                      </p>
                      <Button
                        className="mt-1 h-7 text-xs"
                        onClick={handleClearFilters}
                        size="sm"
                        variant="outline"
                      >
                        Reset Filters
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground/70">
        <span>
          Showing {filteredCampaigns.length} of {campaigns.length} total
          campaigns
        </span>
        <span className="font-mono text-[10px]">
          Sync: Automated post-call webhooks (Sandbox)
        </span>
      </div>
    </div>
  );
}

export const CampaignTable = memo(PureCampaignTable);
