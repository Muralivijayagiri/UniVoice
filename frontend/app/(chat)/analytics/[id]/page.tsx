"use client";

import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  PhoneCall,
  Users,
} from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCampaignById } from "@/lib/campaign-analytics";

export default function CampaignDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const campaign = useMemo(() => getCampaignById(id), [id]);

  if (!campaign) {
    notFound();
  }

  const { outcomes, callsAttempted, callsSuccessful, successRate } = campaign;
  const isDraft = campaign.status === "draft";

  const pctSuccess =
    callsAttempted > 0
      ? Number(((outcomes.successful / callsAttempted) * 100).toFixed(1))
      : 0;
  const pctNoAnswer =
    callsAttempted > 0
      ? Number(((outcomes.noAnswer / callsAttempted) * 100).toFixed(1))
      : 0;
  const pctBusy =
    callsAttempted > 0
      ? Number(((outcomes.busy / callsAttempted) * 100).toFixed(1))
      : 0;
  const pctFailed =
    callsAttempted > 0
      ? Number(((outcomes.failed / callsAttempted) * 100).toFixed(1))
      : 0;

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-sidebar">
      {/* Top Header */}
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border/40 bg-sidebar/80 px-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Button
            asChild
            className="size-8 rounded-lg border border-border/60 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
            size="icon"
            variant="ghost"
          >
            <Link href="/analytics">
              <ArrowLeft className="size-4" />
              <span className="sr-only">Back to Campaign History</span>
            </Link>
          </Button>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link
              className="hover:text-foreground transition-colors"
              href="/analytics"
            >
              Campaign History
            </Link>
            <span>/</span>
            <span className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-xs">
              {campaign.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {campaign.status === "completed" && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-3.5" />
              Completed
            </span>
          )}
          {campaign.status === "in_progress" && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
              <Clock className="size-3.5" />
              In progress
            </span>
          )}
          {campaign.status === "draft" && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              Draft
            </span>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 md:rounded-tl-[12px] md:border-t md:border-l md:border-border/40 bg-background">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Campaign Overview Banner */}
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm backdrop-blur-md">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                    {campaign.name}
                  </h1>
                  <Badge
                    className="border-border/60 bg-muted/40 text-foreground font-normal text-xs"
                    variant="outline"
                  >
                    {campaign.department}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  {campaign.description}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  <span>
                    Created: {campaign.dateFormatted} {campaign.timeframe}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {/* Targeted Students */}
            <div className="rounded-xl border border-border/60 bg-card p-4.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Targeted Students
                </span>
                <Users className="size-4 text-muted-foreground/60" />
              </div>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground font-mono">
                {campaign.targetCount.toLocaleString()}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Registry batch size
              </p>
            </div>

            {/* Calls Attempted */}
            <div className="rounded-xl border border-border/60 bg-card p-4.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Calls Attempted
                </span>
                <PhoneCall className="size-4 text-muted-foreground/60" />
              </div>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground font-mono">
                {callsAttempted.toLocaleString()}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {callsAttempted > 0
                  ? `${Math.round((callsAttempted / campaign.targetCount) * 100)}% of target dispatched`
                  : "No calls dispatched"}
              </p>
            </div>

            {/* Successful Calls */}
            <div className="rounded-xl border border-border/60 bg-card p-4.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Successful Calls
                </span>
                <CheckCircle2 className="size-4 text-amber-600 dark:text-[#D4AF37]" />
              </div>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-amber-600 dark:text-[#D4AF37] font-mono">
                {callsSuccessful.toLocaleString()}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Connected & verified
              </p>
            </div>

            {/* Success Rate */}
            <div className="rounded-xl border border-border/60 bg-card p-4.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Success Rate
                </span>
                <span className="font-mono text-xs text-amber-600 dark:text-[#D4AF37]">
                  {campaign.avgDuration === "0s"
                    ? "—"
                    : `Avg ${campaign.avgDuration}`}
                </span>
              </div>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground font-mono">
                {callsAttempted > 0 ? `${successRate}%` : "—"}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {callsAttempted > 0 ? "Of attempted calls" : "Pending launch"}
              </p>
            </div>
          </div>

          {/* Outcome Breakdown Section */}
          <div className="rounded-2xl border border-border/60 bg-card p-6 space-y-5">
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Call Outcome Distribution
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Detailed telephony telemetry from AI outbound voice sessions
              </p>
            </div>

            {isDraft ? (
              <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-border/60 rounded-xl bg-muted/20">
                <p className="text-sm font-medium text-foreground">
                  No telemetry recorded yet
                </p>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                  This campaign is currently in Draft status. Analytics and
                  outcome breakdowns will appear once calls are launched.
                </p>
              </div>
            ) : (
              <>
                {/* Horizontal Outcome Bar */}
                <div className="space-y-2">
                  <div className="flex h-4 w-full overflow-hidden rounded-full bg-muted p-0.5 ring-1 ring-border/40">
                    <div
                      className="h-full rounded-l-full bg-amber-500 dark:bg-[#D4AF37] transition-all duration-300"
                      style={{ width: `${pctSuccess}%` }}
                      title={`Successful: ${outcomes.successful} (${pctSuccess}%)`}
                    />
                    <div
                      className="h-full bg-amber-500/80 transition-all duration-300"
                      style={{ width: `${pctNoAnswer}%` }}
                      title={`No Answer: ${outcomes.noAnswer} (${pctNoAnswer}%)`}
                    />
                    <div
                      className="h-full bg-purple-500/80 transition-all duration-300"
                      style={{ width: `${pctBusy}%` }}
                      title={`Line Busy: ${outcomes.busy} (${pctBusy}%)`}
                    />
                    <div
                      className="h-full rounded-r-full bg-rose-500/80 transition-all duration-300"
                      style={{ width: `${pctFailed}%` }}
                      title={`Failed: ${outcomes.failed} (${pctFailed}%)`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                    <span>0 calls</span>
                    <span>{callsAttempted.toLocaleString()} calls total</span>
                  </div>
                </div>

                {/* Outcome Breakdown Cards */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 pt-2">
                  {/* Successful Calls */}
                  <div className="rounded-xl border border-border/50 bg-muted/30 p-3.5 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-amber-500 dark:bg-[#D4AF37]" />
                        <span className="text-xs font-medium text-foreground">
                          Successful
                        </span>
                      </div>
                      <span className="font-mono text-xs text-amber-600 dark:text-[#D4AF37] font-semibold">
                        {pctSuccess}%
                      </span>
                    </div>
                    <div className="mt-3 flex items-baseline justify-between">
                      <span className="font-mono text-xl font-semibold text-foreground">
                        {outcomes.successful.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        calls
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">
                      Intent verified & parsed
                    </p>
                  </div>

                  {/* No Answer */}
                  <div className="rounded-xl border border-border/50 bg-muted/30 p-3.5 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-amber-500" />
                        <span className="text-xs font-medium text-foreground">
                          No Answer
                        </span>
                      </div>
                      <span className="font-mono text-xs text-amber-600 dark:text-amber-400 font-semibold">
                        {pctNoAnswer}%
                      </span>
                    </div>
                    <div className="mt-3 flex items-baseline justify-between">
                      <span className="font-mono text-xl font-semibold text-foreground">
                        {outcomes.noAnswer.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        calls
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">
                      Ringing timed out
                    </p>
                  </div>

                  {/* Line Busy */}
                  <div className="rounded-xl border border-border/50 bg-muted/30 p-3.5 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-purple-500" />
                        <span className="text-xs font-medium text-foreground">
                          Line Busy
                        </span>
                      </div>
                      <span className="font-mono text-xs text-purple-600 dark:text-purple-400 font-semibold">
                        {pctBusy}%
                      </span>
                    </div>
                    <div className="mt-3 flex items-baseline justify-between">
                      <span className="font-mono text-xl font-semibold text-foreground">
                        {outcomes.busy.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        calls
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">
                      Engaged / voicemail forwarded
                    </p>
                  </div>

                  {/* Failed / Invalid */}
                  <div className="rounded-xl border border-border/50 bg-muted/30 p-3.5 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-rose-500" />
                        <span className="text-xs font-medium text-foreground">
                          Failed / Invalid
                        </span>
                      </div>
                      <span className="font-mono text-xs text-rose-600 dark:text-rose-400 font-semibold">
                        {pctFailed}%
                      </span>
                    </div>
                    <div className="mt-3 flex items-baseline justify-between">
                      <span className="font-mono text-xl font-semibold text-foreground">
                        {outcomes.failed.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        calls
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">
                      Carrier error / invalid number
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
