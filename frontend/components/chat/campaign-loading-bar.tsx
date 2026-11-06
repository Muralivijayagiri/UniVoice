"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { memo } from "react";

export type CampaignLoadingStep = {
  title: string;
  subtitle: string;
  progressPercent: number;
};

type CampaignLoadingBarProps = {
  step: CampaignLoadingStep;
};

function PureCampaignLoadingBar({ step }: CampaignLoadingBarProps) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl rounded-2xl border border-border/60 bg-card p-4.5 shadow-md backdrop-blur-md"
      exit={{ opacity: 0, y: -8 }}
      initial={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-center gap-3.5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-[#D4AF37]">
          <Loader2 className="size-4 animate-spin" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-medium text-xs sm:text-sm text-foreground truncate">
              {step.title}
            </span>
            <span className="font-mono text-xs text-amber-600 dark:text-[#D4AF37]">
              {step.progressPercent}%
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground truncate">
            {step.subtitle}
          </p>
        </div>
      </div>

      {/* Animated Progress Bar */}
      <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-muted ring-1 ring-border/40">
        <motion.div
          animate={{ width: `${step.progressPercent}%` }}
          className="h-full rounded-full bg-amber-500 dark:bg-[#D4AF37]"
          initial={{ width: "10%" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}

export const CampaignLoadingBar = memo(PureCampaignLoadingBar);
