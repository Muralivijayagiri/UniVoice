"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  FileText,
  GraduationCap,
  Users,
} from "lucide-react";
import { memo, useCallback } from "react";

export type CampaignTile = {
  key: "tuition" | "scholarship" | "library" | "hostel";
  title: string;
  icon: "graduation" | "document" | "library" | "users";
};

export const CAMPAIGN_TILES: CampaignTile[] = [
  {
    icon: "graduation",
    key: "tuition",
    title: "Call 3rd-year students with pending semester tuition fees",
  },
  {
    icon: "document",
    key: "scholarship",
    title: "Send reminder for missing scholarship renewal documents",
  },
  {
    icon: "library",
    key: "library",
    title: "Notify final-year students about overdue library returns",
  },
  {
    icon: "users",
    key: "hostel",
    title: "Announce hostel fee verification deadline to parents",
  },
];

type SuggestedActionsProps = {
  chatId: string;
  onSelectCampaign: (tile: CampaignTile) => void;
};

const TileIcon = ({ type }: { type: CampaignTile["icon"] }) => {
  switch (type) {
    case "graduation":
      return (
        <GraduationCap className="size-4.5 text-foreground/80 group-hover:text-amber-600 dark:group-hover:text-[#D4AF37] transition-colors" />
      );
    case "document":
      return (
        <FileText className="size-4.5 text-foreground/80 group-hover:text-amber-600 dark:group-hover:text-[#D4AF37] transition-colors" />
      );
    case "library":
      return (
        <BookOpen className="size-4.5 text-foreground/80 group-hover:text-amber-600 dark:group-hover:text-[#D4AF37] transition-colors" />
      );
    case "users":
      return (
        <Users className="size-4.5 text-foreground/80 group-hover:text-amber-600 dark:group-hover:text-[#D4AF37] transition-colors" />
      );
    default:
      return (
        <GraduationCap className="size-4.5 text-foreground/80 group-hover:text-amber-600 dark:group-hover:text-[#D4AF37] transition-colors" />
      );
  }
};

const CampaignTileButton = memo(function PureCampaignTileButton({
  tile,
  onSelect,
}: {
  tile: CampaignTile;
  onSelect: (tile: CampaignTile) => void;
}) {
  const handleClick = useCallback(() => {
    onSelect(tile);
  }, [onSelect, tile]);

  return (
    <button
      className="group relative flex w-full items-center justify-between gap-3.5 rounded-xl border border-border/50 bg-card/80 px-3.5 py-2.5 sm:px-4 sm:py-3 text-left transition-all duration-200 hover:border-amber-500/40 hover:bg-muted/40 hover:shadow-xs cursor-pointer focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-amber-500/50"
      data-testid={`campaign-tile-${tile.key}`}
      onClick={handleClick}
      type="button"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/60 text-foreground group-hover:border-amber-500/40 group-hover:bg-amber-500/10 transition-colors">
          <TileIcon type={tile.icon} />
        </div>
        <span className="font-medium text-xs sm:text-[13px] leading-snug text-foreground/90 group-hover:text-foreground transition-colors">
          {tile.title}
        </span>
      </div>
      <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground group-hover:text-amber-600 dark:group-hover:text-[#D4AF37] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
    </button>
  );
});

function PureSuggestedActions({ onSelectCampaign }: SuggestedActionsProps) {
  return (
    <div className="flex w-full flex-col gap-2" data-testid="suggested-actions">
      {CAMPAIGN_TILES.map((tile, index) => (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
          initial={{ opacity: 0, y: 8 }}
          key={tile.key}
          transition={{
            delay: 0.04 * index,
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <CampaignTileButton onSelect={onSelectCampaign} tile={tile} />
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions);
