"use client";

import {
  Activity,
  CheckCircle2,
  Clock,
  Layers,
  PhoneCall,
  TrendingUp,
  Zap,
} from "lucide-react";
import { memo } from "react";
import type { AnalyticsSummary } from "@/lib/analytics";

type KPICardsProps = {
  summary: AnalyticsSummary;
};

function PureKPICards({ summary }: KPICardsProps) {
  const cards = [
    {
      description: "Active & completed batches",
      icon: <Layers className="size-4 text-primary" />,
      id: "total-campaigns",
      label: "Total Campaigns",
      trend: "+12% this month",
      trendPositive: true,
      value: summary.totalCampaigns.toString(),
    },
    {
      description: "Dispatched to student registry",
      icon: <PhoneCall className="size-4 text-blue-400" />,
      id: "calls-attempted",
      label: "Calls Attempted",
      trend: "+184 today",
      trendPositive: true,
      value: summary.callsAttempted.toLocaleString(),
    },
    {
      description: "Verified intent & transcripts",
      icon: <CheckCircle2 className="size-4 text-emerald-400" />,
      id: "successful-calls",
      label: "Successful Calls",
      trend: "98.4% delivery",
      trendPositive: true,
      value: summary.successfulCalls.toLocaleString(),
    },
    {
      description: "Across connected registries",
      icon: <TrendingUp className="size-4 text-emerald-400" />,
      id: "success-rate",
      label: "Success Rate",
      trend: "+3.4% vs benchmark",
      trendPositive: true,
      value: `${summary.successRate}%`,
    },
  ];

  return (
    <div className="space-y-3">
      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-4 shadow-[var(--shadow-card)] backdrop-blur-md transition-all duration-200 hover:border-border hover:bg-card/85"
            data-testid={`kpi-card-${card.id}`}
            key={card.id}
          >
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium text-muted-foreground/80">
                {card.label}
              </span>
              <div className="flex size-7 items-center justify-center rounded-lg border border-border/60 bg-muted/30">
                {card.icon}
              </div>
            </div>

            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="font-semibold text-2xl tracking-tight text-foreground sm:text-3xl">
                {card.value}
              </span>
              <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-1.5 py-0.2 text-[10px] font-mono text-emerald-400 font-medium">
                {card.trend}
              </span>
            </div>

            <p className="mt-1 text-[11px] text-muted-foreground/70">
              {card.description}
            </p>
          </div>
        ))}
      </div>

      {/* Secondary Telephony & SLA Pill Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-border/40 bg-card/30 px-3.5 py-2 text-xs text-muted-foreground">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Clock className="size-3.5 text-muted-foreground/70" />
            <span>Avg Call Duration:</span>
            <span className="font-mono font-medium text-foreground">
              {summary.avgDuration}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Zap className="size-3.5 text-amber-400" />
            <span>Voice Loop Latency:</span>
            <span className="font-mono font-medium text-emerald-400">
              {summary.voiceLoopLatency}
            </span>
            <span className="text-[10px] text-muted-foreground/60">
              (&lt;1000ms target)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground/80">
          <Activity className="size-3 text-primary" />
          <span>Telephony: Indic-F5 + Whisper + Vapi (Sandbox)</span>
        </div>
      </div>
    </div>
  );
}

export const KPICards = memo(PureKPICards);
