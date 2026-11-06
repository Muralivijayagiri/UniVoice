"use client";

import {
  AlertTriangle,
  CheckCircle2,
  PhoneForwarded,
  PhoneMissed,
  PieChart,
} from "lucide-react";
import { memo, useCallback, useState } from "react";
import type { CallOutcomeItem, CallOutcomeKey } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type OutcomeChartProps = {
  outcomes: CallOutcomeItem[];
  totalCalls: number;
};

const OUTCOME_ICONS: Record<CallOutcomeKey, React.ReactNode> = {
  busy: <PhoneForwarded className="size-3.5 text-purple-400" />,
  failed: <AlertTriangle className="size-3.5 text-rose-400" />,
  no_answer: <PhoneMissed className="size-3.5 text-amber-400" />,
  successful: <CheckCircle2 className="size-3.5 text-emerald-400" />,
};

type OutcomeCardButtonProps = {
  isSelected: boolean;
  onSelect: (key: CallOutcomeKey) => void;
  outcome: CallOutcomeItem;
  totalCalls: number;
};

const OutcomeCardButton = memo(function PureOutcomeCardButton({
  isSelected,
  onSelect,
  outcome,
  totalCalls,
}: OutcomeCardButtonProps) {
  const handleClick = useCallback(() => {
    onSelect(outcome.key);
  }, [onSelect, outcome.key]);

  return (
    <button
      className={cn(
        "group flex flex-col gap-1.5 rounded-xl border p-3 text-left transition-all duration-150 cursor-pointer",
        isSelected
          ? "border-primary/50 bg-primary/10 shadow-xs"
          : "border-border/50 bg-background/50 hover:border-border hover:bg-muted/30"
      )}
      data-testid={`outcome-card-${outcome.key}`}
      onClick={handleClick}
      type="button"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-5.5 items-center justify-center rounded-md border border-border/60 bg-muted/30">
            {OUTCOME_ICONS[outcome.key]}
          </div>
          <span className="text-[12px] font-medium text-foreground">
            {outcome.label}
          </span>
        </div>
        <span
          className={cn(
            "rounded-full border px-1.5 py-0.2 font-mono text-[10px] font-medium",
            outcome.badgeClass
          )}
        >
          {outcome.percentage}%
        </span>
      </div>

      <div className="flex items-baseline justify-between pl-7.5">
        <span className="font-mono text-[14px] font-semibold text-foreground">
          {outcome.count.toLocaleString()}
        </span>
        <span className="text-[10px] text-muted-foreground/70">
          of {totalCalls.toLocaleString()}
        </span>
      </div>

      <p className="text-[10px] text-muted-foreground/75 leading-relaxed pl-7.5 line-clamp-1">
        {outcome.description}
      </p>
    </button>
  );
});

function PureOutcomeChart({ outcomes, totalCalls }: OutcomeChartProps) {
  const [activeOutcome, setActiveOutcome] = useState<CallOutcomeKey | null>(
    null
  );

  const handleSelectOutcome = useCallback((key: CallOutcomeKey) => {
    setActiveOutcome((prev) => (prev === key ? null : key));
  }, []);

  // SVG Donut calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  const donutSegments = outcomes.map((outcome) => {
    const strokeDasharray = `${(outcome.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += outcome.percentage;

    return {
      ...outcome,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  const selectedItem = outcomes.find((o) => o.key === activeOutcome);

  return (
    <div
      className="rounded-2xl border border-border/50 bg-card/60 p-4 shadow-[var(--shadow-card)] backdrop-blur-md sm:p-5"
      data-testid="outcome-chart-container"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex size-6.5 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-primary">
            <PieChart className="size-3.5" />
          </div>
          <div>
            <h2 className="font-semibold text-[13px] sm:text-[14px] text-foreground tracking-tight">
              Call Outcome Telemetry
            </h2>
            <p className="text-[11px] text-muted-foreground/80">
              Aggregated results across all student contact dispatches
            </p>
          </div>
        </div>

        <span className="rounded-full border border-border/50 bg-card/40 px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
          {totalCalls.toLocaleString()} Total Calls
        </span>
      </div>

      {/* Main Chart Area: Donut + Detailed Outcome Cards */}
      <div className="mt-4 grid grid-cols-1 items-center gap-6 md:grid-cols-12">
        {/* Left: Donut Chart with Center Metric */}
        <div className="flex flex-col items-center justify-center md:col-span-5 lg:col-span-4">
          <div className="relative flex size-44 items-center justify-center">
            <svg className="-rotate-90 size-44 transform" viewBox="0 0 140 140">
              {/* Background Ring */}
              <circle
                className="text-muted/20"
                cx="70"
                cy="70"
                fill="transparent"
                r={radius}
                stroke="currentColor"
                strokeWidth="14"
              />

              {/* Data Arcs */}
              {donutSegments.map((segment) => {
                const isHighlighted =
                  activeOutcome === null || activeOutcome === segment.key;
                return (
                  <circle
                    className={cn(
                      "transition-all duration-300",
                      isHighlighted ? "opacity-100" : "opacity-25"
                    )}
                    cx="70"
                    cy="70"
                    fill="transparent"
                    key={segment.key}
                    r={radius}
                    stroke={segment.color}
                    strokeDasharray={segment.strokeDasharray}
                    strokeDashoffset={segment.strokeDashoffset}
                    strokeLinecap="round"
                    strokeWidth={activeOutcome === segment.key ? "18" : "14"}
                  />
                );
              })}
            </svg>

            {/* Donut Center Display */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-semibold text-2xl tracking-tight text-foreground sm:text-3xl">
                {selectedItem
                  ? `${selectedItem.percentage}%`
                  : `${outcomes[0]?.percentage ?? 82}%`}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/80">
                {selectedItem ? selectedItem.label : "Success Rate"}
              </span>
              <span className="font-mono text-[9px] text-muted-foreground/60">
                {selectedItem
                  ? `${selectedItem.count.toLocaleString()} calls`
                  : `${totalCalls.toLocaleString()} total`}
              </span>
            </div>
          </div>

          <span className="mt-2 text-[10px] text-muted-foreground/60">
            Click cards on right to inspect categories
          </span>
        </div>

        {/* Right: 4 Call Outcome Cards */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:col-span-7 lg:col-span-8">
          {outcomes.map((outcome) => (
            <OutcomeCardButton
              isSelected={activeOutcome === outcome.key}
              key={outcome.key}
              onSelect={handleSelectOutcome}
              outcome={outcome}
              totalCalls={totalCalls}
            />
          ))}
        </div>
      </div>

      {/* Segmented Distribution Bar */}
      <div className="mt-5 space-y-1.5 border-t border-border/40 pt-3.5">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground/80">
          <span>Outcome Distribution</span>
          <div className="flex items-center gap-3">
            {outcomes.map((o) => (
              <div
                className="flex items-center gap-1.5 text-[10px]"
                key={o.key}
              >
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: o.color }}
                />
                <span>{o.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted/40 p-0.5">
          {outcomes.map((o) => (
            <div
              className={cn(
                "h-full transition-all duration-300 first:rounded-l-full last:rounded-r-full",
                activeOutcome === null || activeOutcome === o.key
                  ? "opacity-100"
                  : "opacity-30"
              )}
              key={o.key}
              style={{
                backgroundColor: o.color,
                width: `${o.percentage}%`,
              }}
              title={`${o.label}: ${o.percentage}% (${o.count} calls)`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export const OutcomeChart = memo(PureOutcomeChart);
