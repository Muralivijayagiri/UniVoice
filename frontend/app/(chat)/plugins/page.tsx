"use client";

import { motion } from "framer-motion";
import {
  Database,
  Plug,
  RefreshCw,
  RotateCw,
  Settings,
  Unplug,
} from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { PluginsHeader } from "@/components/plugins/plugins-header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type PluginStatus = "connected" | "disconnected" | "connecting";

type DatabasePlugin = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  category: string;
  access: string;
  status: PluginStatus;
  uri: string;
  tables: string[];
  records: string;
};

const INITIAL_PLUGINS: DatabasePlugin[] = [
  {
    access: "View records",
    category: "Student Records",
    description: "Student information, enrollment status, and program details.",
    id: "student_master_db",
    name: "Student Records",
    records: "14,820 student records indexed",
    status: "connected",
    subtitle: "Student information",
    tables: ["students", "departments", "programs", "academic_records"],
    uri: "postgresql://app_read:••••••••@cluster-01.univoice.internal:5432/student_master_db",
  },
  {
    access: "View records",
    category: "Fee Records",
    description: "Fees and payments, tuition balances, and billing schedules.",
    id: "fees_ledger_prod",
    name: "Fee Records",
    records: "8,410 ledger accounts indexed",
    status: "disconnected",
    subtitle: "Fees and payments",
    tables: ["tuition_accounts", "payments", "invoices", "installments"],
    uri: "postgresql://app_read:••••••••@ledger-prod.univoice.internal:5432/fees_ledger_prod",
  },
];

interface PluginCardProps {
  onConnect: (id: string) => void;
  onManage: (plugin: DatabasePlugin) => void;
  plugin: DatabasePlugin;
}

const PluginCard = memo(function PurePluginCard({
  plugin,
  onConnect,
  onManage,
}: PluginCardProps) {
  const isConnected = plugin.status === "connected";
  const isConnecting = plugin.status === "connecting";

  const handleConnectClick = useCallback(() => {
    onConnect(plugin.id);
  }, [onConnect, plugin.id]);

  const handleManageClick = useCallback(() => {
    onManage(plugin);
  }, [onManage, plugin]);

  return (
    <div
      className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card/60 p-6 shadow-xs backdrop-blur-md transition-all duration-200 hover:border-border/80"
      data-testid={`plugin-card-${plugin.id}`}
    >
      <div>
        {/* Header: Icon, Friendly Name & Status Indicator */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-muted-foreground">
              <Database className="size-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-foreground tracking-tight">
                {plugin.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {plugin.subtitle}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          {isConnected ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span>Connected</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/50 px-2.5 py-1 text-xs font-medium text-muted-foreground">
              <span className="size-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
              <span>Not connected</span>
            </span>
          )}
        </div>

        {/* Short Description */}
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          {plugin.description}
        </p>
      </div>

      {/* Action Footer: Single Action Button */}
      <div className="mt-6 flex items-center justify-end border-t border-border/30 pt-4">
        {isConnected ? (
          <Button
            className="h-8.5 gap-1.5 rounded-xl border-border/60 px-4 text-xs font-medium hover:bg-muted/60 cursor-pointer text-foreground"
            data-testid={`manage-button-${plugin.id}`}
            onClick={handleManageClick}
            size="sm"
            variant="outline"
          >
            <Settings className="size-3.5 text-muted-foreground" />
            <span>Settings</span>
          </Button>
        ) : (
          <Button
            className="h-8.5 gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white px-4 text-xs font-medium shadow-xs cursor-pointer"
            data-testid={`connect-button-${plugin.id}`}
            disabled={isConnecting}
            onClick={handleConnectClick}
            size="sm"
          >
            {isConnecting ? (
              <>
                <RotateCw className="size-3.5 animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Plug className="size-3.5" />
                <span>Connect</span>
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
});

export default function PluginsPage() {
  const [plugins, setPlugins] = useState<DatabasePlugin[]>(INITIAL_PLUGINS);
  const [activePlugin, setActivePlugin] = useState<DatabasePlugin | null>(null);
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    document.title = "UniVoice — Plugins";
    return () => {
      document.title = "UniVoice — AI Outbound Campaign & Voice Orchestration";
    };
  }, []);

  const handleConnect = useCallback((id: string) => {
    setPlugins((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "connecting" } : p))
    );

    setTimeout(() => {
      setPlugins((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "connected" } : p))
      );
      toast.success(`${id} connected successfully (Simulated)`, {
        description: "Schema verified and read access permissions granted.",
      });
    }, 700);
  }, []);

  const handleOpenManage = useCallback((plugin: DatabasePlugin) => {
    setActivePlugin(plugin);
    setIsManageDialogOpen(true);
  }, []);

  const handleCloseManage = useCallback(() => {
    setIsManageDialogOpen(false);
    setActivePlugin(null);
  }, []);

  const handleDisconnect = useCallback(() => {
    if (!activePlugin) {
      return;
    }
    const pluginId = activePlugin.id;

    setPlugins((prev) =>
      prev.map((p) =>
        p.id === pluginId ? { ...p, status: "disconnected" } : p
      )
    );

    setIsManageDialogOpen(false);
    setActivePlugin(null);

    toast.info(`${pluginId} disconnected (Simulated)`, {
      description: "Database connection closed. Data query cache cleared.",
    });
  }, [activePlugin]);

  const handleTestConnection = useCallback(() => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      toast.success("Connection test passed (12ms latency)", {
        description: "Active read replica healthy and reachable.",
      });
    }, 600);
  }, []);

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-sidebar">
      <PluginsHeader />

      <section className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8 md:rounded-tl-[12px] md:border-t md:border-l md:border-border/40 bg-background">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Top Title Banner */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            initial={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-muted/40 text-muted-foreground shadow-xs">
                <Plug className="size-6" />
              </div>
              <div>
                <h1 className="font-bold text-2xl tracking-tight text-foreground sm:text-3xl">
                  Plugins
                </h1>
                <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">
                  Manage your connected data sources
                </p>
              </div>
            </div>
          </motion.div>

          {/* Database Plugin Cards Grid */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
            initial={{ opacity: 0, y: 12 }}
            transition={{
              delay: 0.1,
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {plugins.map((plugin) => (
              <PluginCard
                key={plugin.id}
                onConnect={handleConnect}
                onManage={handleOpenManage}
                plugin={plugin}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Settings Dialog */}
      <Dialog onOpenChange={setIsManageDialogOpen} open={isManageDialogOpen}>
        <DialogContent className="max-w-md border-border/60 bg-card p-6 shadow-xl">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-muted-foreground">
                <Database className="size-5" />
              </div>
              <div>
                <DialogTitle className="font-bold text-base text-foreground">
                  {activePlugin?.name}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  {activePlugin?.subtitle}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {activePlugin ? (
            <div className="space-y-3.5 py-2 text-xs">
              <div className="rounded-xl border border-border/50 bg-background/50 p-3 space-y-2 text-xs">
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Connection:</span>
                  <span className="text-foreground font-mono text-[11px] truncate max-w-[220px]">
                    {activePlugin.uri}
                  </span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Access:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    View records
                  </span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Status:</span>
                  <span className="text-foreground">
                    {activePlugin.records}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Indexed Tables
                </span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {activePlugin.tables.map((table) => (
                    <span
                      className="rounded-md border border-border/50 bg-muted/40 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                      key={table}
                    >
                      {table}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          <DialogFooter className="mt-4 flex flex-row items-center justify-between gap-2 border-t border-border/40 pt-4">
            <Button
              className="h-8 gap-1 rounded-lg text-xs text-destructive hover:bg-destructive/10 cursor-pointer"
              onClick={handleDisconnect}
              size="sm"
              variant="ghost"
            >
              <Unplug className="size-3.5" />
              <span>Disconnect</span>
            </Button>

            <div className="flex items-center gap-2">
              <Button
                className="h-8 gap-1.5 rounded-lg text-xs cursor-pointer"
                disabled={isTesting}
                onClick={handleTestConnection}
                size="sm"
                variant="outline"
              >
                <RefreshCw
                  className={cn("size-3 text-muted-foreground", {
                    "animate-spin": isTesting,
                  })}
                />
                <span>Test Connection</span>
              </Button>
              <Button
                className="h-8 rounded-lg text-xs cursor-pointer"
                onClick={handleCloseManage}
                size="sm"
              >
                Done
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
