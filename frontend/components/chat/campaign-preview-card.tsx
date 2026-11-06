"use client";

import {
  CheckCircle2,
  Clock,
  Phone,
  PhoneCall,
  RotateCw,
  XCircle,
} from "lucide-react";
import { memo, useCallback, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { CampaignPreviewData, CampaignStudent } from "@/lib/campaign";
import { cn } from "@/lib/utils";

type CampaignPreviewCardProps = {
  campaign: CampaignPreviewData;
  isReadonly?: boolean;
  onApprove?: (campaignId: string) => Promise<void> | void;
  onCancel?: (campaignId: string) => void;
};

type ActionState = "idle" | "loading" | "success" | "error";

/**
 * Returns the relevant columns for each campaign type.
 * Each column has a label, accessor, alignment, and optional formatter.
 */
function getTableColumns(typeKey: CampaignPreviewData["typeKey"]) {
  const baseColumns = [
    { align: "left" as const, key: "name" as const, label: "Student" },
    { align: "left" as const, key: "idNumber" as const, label: "Student ID" },
    { align: "left" as const, key: "phone" as const, label: "Phone" },
  ];

  switch (typeKey) {
    case "tuition":
      return [
        ...baseColumns,
        {
          align: "right" as const,
          key: "balance" as const,
          label: "Outstanding Balance",
        },
      ];
    case "scholarship":
      return [
        ...baseColumns,
        {
          align: "left" as const,
          key: "missingDocs" as const,
          label: "Missing Document",
        },
      ];
    case "library":
      return [
        ...baseColumns,
        {
          align: "left" as const,
          key: "overdueItem" as const,
          label: "Overdue Item",
        },
      ];
    case "hostel":
      return [
        ...baseColumns,
        {
          align: "right" as const,
          key: "hostelStatus" as const,
          label: "Hostel Dues",
        },
      ];
    case "class_teacher":
      return [
        ...baseColumns,
        {
          align: "right" as const,
          key: "attendancePercentage" as const,
          label: "Attendance %",
        },
      ];
    case "admissions":
      return [
        ...baseColumns,
        {
          align: "left" as const,
          key: "admissionStatus" as const,
          label: "Admission Status",
        },
      ];
    default:
      return baseColumns;
  }
}

type ColumnDef = ReturnType<typeof getTableColumns>[number];

const StudentTableRow = memo(function PureStudentTableRow({
  student,
  columns,
}: {
  student: CampaignStudent;
  columns: ColumnDef[];
}) {
  return (
    <tr className="group border-b border-border/30 last:border-b-0 transition-colors hover:bg-muted/30">
      {columns.map((col) => {
        const raw = student[col.key as keyof CampaignStudent] ?? "—";
        const isPhone = col.key === "phone";
        const isMoney = col.key === "balance" || col.key === "hostelStatus";
        const isId = col.key === "idNumber";
        const isAttendance = col.key === "attendancePercentage";
        const isShortage = isAttendance && Number.parseFloat(String(raw)) < 75;

        return (
          <td
            className={cn(
              "px-3 py-2 text-[11px]",
              col.align === "right" ? "text-right" : "text-left",
              isId && "font-mono text-muted-foreground",
              isMoney &&
                "font-mono font-semibold text-amber-600 dark:text-[#D4AF37]",
              isAttendance &&
                (isShortage
                  ? "font-mono font-semibold text-rose-600 dark:text-rose-400"
                  : "font-mono font-medium text-emerald-600 dark:text-emerald-400"),
              !isId &&
                !isMoney &&
                !isPhone &&
                !isAttendance &&
                col.key !== "name" &&
                "text-muted-foreground",
              col.key === "name" && "font-medium text-foreground"
            )}
            key={col.key}
          >
            {isPhone ? (
              <span className="inline-flex items-center gap-1.5 font-mono text-muted-foreground">
                <Phone className="size-3 text-muted-foreground/50 group-hover:text-amber-600 dark:group-hover:text-[#D4AF37] transition-colors" />
                {raw}
              </span>
            ) : (
              raw
            )}
          </td>
        );
      })}
    </tr>
  );
});

function PureCampaignPreviewCard({
  campaign,
  isReadonly = false,
  onApprove,
  onCancel,
}: CampaignPreviewCardProps) {
  const [status, setStatus] = useState<CampaignPreviewData["status"]>(
    campaign.status
  );
  const [actionState, setActionState] = useState<ActionState>(
    campaign.status === "approved" ? "success" : "idle"
  );

  const handleApprove = useCallback(async () => {
    if (isReadonly || actionState === "loading" || status === "approved") {
      return;
    }

    setActionState("loading");

    try {
      if (onApprove) {
        await onApprove(campaign.id);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setStatus("approved");
      setActionState("success");
      toast.success("Voice Campaign Authorized (Demo Mode)", {
        description: `Verified ${campaign.targetCount} student targets in sandbox telephony queue.`,
      });
    } catch {
      setActionState("error");
      toast.error("Campaign authorization error");
    }
  }, [
    actionState,
    campaign.id,
    campaign.targetCount,
    isReadonly,
    onApprove,
    status,
  ]);

  const handleCancelClick = useCallback(() => {
    if (isReadonly || actionState === "loading") {
      return;
    }
    setStatus("cancelled");
    setActionState("idle");
    if (onCancel) {
      onCancel(campaign.id);
    }
    toast("Campaign Cancelled", {
      description:
        "Outreach preview cancelled. No calls or voice records were queued.",
    });
  }, [actionState, campaign.id, isReadonly, onCancel]);

  const handleReset = useCallback(() => {
    setStatus("pending_review");
    setActionState("idle");
  }, []);

  const isPending = status === "pending_review";
  const isApproved = status === "approved" || actionState === "success";
  const isCancelled = status === "cancelled";

  const columns = getTableColumns(campaign.typeKey);

  return (
    <div
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl border border-border/60 bg-card p-4 shadow-[var(--shadow-card)] transition-all duration-200 sm:p-5",
        isApproved && "border-emerald-500/30 bg-emerald-500/5",
        isCancelled && "border-border/40 opacity-75"
      )}
      data-testid="campaign-preview-card"
    >
      {/* Header: Title + Status */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold tracking-tight text-foreground sm:text-[15px]">
            {campaign.title}
          </h3>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {campaign.department} · {campaign.targetCount} matching records
          </p>
        </div>

        {/* Status Pill */}
        {isPending ? (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400">
            <Clock className="size-3 animate-pulse" />
            Pending Review
          </span>
        ) : null}
        {isApproved ? (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-3" />
            Approved
          </span>
        ) : null}
        {isCancelled ? (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/60 bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
            <XCircle className="size-3" />
            Cancelled
          </span>
        ) : null}
      </div>

      {/* Student Table */}
      <div className="mt-3.5 overflow-hidden rounded-lg border border-border/40">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-muted/40 text-muted-foreground">
                {columns.map((col) => (
                  <th
                    className={cn(
                      "px-3 py-1.5 font-medium text-[10px] uppercase tracking-wider",
                      col.align === "right" && "text-right"
                    )}
                    key={col.key}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {campaign.students.map((student) => (
                <StudentTableRow
                  columns={columns}
                  key={student.id}
                  student={student}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approved Banner */}
      {isApproved ? (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>
            <span className="font-medium">Campaign approved & queued.</span>{" "}
            Demo only — no calls will be placed.
          </span>
        </div>
      ) : null}

      {/* Cancelled Banner */}
      {isCancelled ? (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-border/50 bg-muted/40 px-3 py-2 text-[11px] text-muted-foreground">
          <XCircle className="size-3.5 shrink-0" />
          <span>
            <span className="font-medium text-foreground">
              Preview cancelled.
            </span>{" "}
            No voice records were queued.
          </span>
        </div>
      ) : null}

      {/* Footer: Disclaimer + Actions */}
      {isReadonly ? null : (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border/30 pt-3">
          <span className="text-[10px] text-muted-foreground/60">
            Demo only · No calls will be placed
          </span>

          <div className="flex items-center gap-2">
            {isPending ? (
              <>
                <Button
                  className="h-7.5 rounded-lg border-border/60 px-3.5 text-[11px] font-normal text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                  disabled={actionState === "loading"}
                  onClick={handleCancelClick}
                  size="sm"
                  variant="outline"
                >
                  Cancel
                </Button>

                <Button
                  className="h-7.5 gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 dark:bg-[#D4AF37] dark:hover:bg-[#c7a330] text-black font-medium px-3.5 text-[11px] shadow-xs cursor-pointer disabled:opacity-60"
                  data-testid="approve-campaign-button"
                  disabled={actionState === "loading"}
                  onClick={handleApprove}
                  size="sm"
                >
                  {actionState === "loading" ? (
                    <>
                      <RotateCw className="size-3 animate-spin" />
                      <span>Queueing…</span>
                    </>
                  ) : (
                    <>
                      <PhoneCall className="size-3" />
                      <span>Approve preview</span>
                    </>
                  )}
                </Button>
              </>
            ) : null}

            {isApproved ? (
              <Button
                className="h-7 rounded-lg text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={handleReset}
                size="sm"
                variant="outline"
              >
                Reset Demo
              </Button>
            ) : null}

            {isCancelled ? (
              <Button
                className="h-7 rounded-lg text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={handleReset}
                size="sm"
                variant="outline"
              >
                Resume Review
              </Button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export const CampaignPreviewCard = memo(PureCampaignPreviewCard);
