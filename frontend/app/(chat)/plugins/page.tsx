"use client";

import { motion } from "framer-motion";
import { Database, Eye, EyeOff, LoaderCircle, Plug, Save } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { PluginsHeader } from "@/components/plugins/plugins-header";
import { Button } from "@/components/ui/button";

type ConnectionStatus = "connected" | "not-connected" | "testing" | "error";

type ConnectionResponse = {
  connected?: boolean;
  message?: string;
  success?: boolean;
  status?: ConnectionStatus;
};

const statusLabels: Record<ConnectionStatus, string> = {
  connected: "Connected",
  error: "Error",
  "not-connected": "Not Connected",
  testing: "Testing",
};

const statusStyles: Record<ConnectionStatus, string> = {
  connected:
    "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  error: "border-destructive/25 bg-destructive/10 text-destructive",
  "not-connected": "border-border/60 bg-muted/50 text-muted-foreground",
  testing: "border-sky-500/25 bg-sky-500/10 text-sky-600 dark:text-sky-400",
};

async function readSavedConnectionStatus(): Promise<ConnectionResponse> {
  const response = await fetch("/api/supabase-connection", {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  let result: ConnectionResponse | null = null;
  try {
    result = (await response.json()) as ConnectionResponse;
  } catch {
    result = null;
  }

  if (!response.ok) {
    return {
      message: result?.message ?? "Saved connection status is unavailable.",
      status: "error",
    };
  }

  return result ?? {};
}

export default function PluginsPage() {
  const [projectUrl, setProjectUrl] = useState("");
  const anonKeyInputRef = useRef<HTMLInputElement>(null);
  const [hasAnonKey, setHasAnonKey] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [status, setStatus] = useState<ConnectionStatus>("not-connected");
  const [message, setMessage] = useState(
    "Add your Supabase project URL and public anon or publishable key."
  );
  const [busyAction, setBusyAction] = useState<"test" | "save" | null>(null);

  useEffect(() => {
    document.title = "UniVoice — Plugins";
    return () => {
      document.title = "UniVoice — AI Outbound Campaign & Voice Orchestration";
    };
  }, []);

  useEffect(() => {
    let isCurrent = true;

    readSavedConnectionStatus()
      .then((result) => {
        if (!isCurrent || !result) {
          return;
        }
        if (result.status) {
          setStatus(result.status);
          if (result.message) {
            setMessage(result.message);
          }
        }
      })
      .catch(() => {
        // The form remains available if saved connection status cannot be loaded.
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const updateCredentials = useCallback(() => {
    setStatus("not-connected");
    setMessage("Test the current credentials before saving the connection.");
  }, []);

  const handleProjectUrlChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setProjectUrl(event.currentTarget.value);
      updateCredentials();
    },
    [updateCredentials]
  );

  const handleAnonKeyChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setHasAnonKey(event.currentTarget.value.trim().length > 0);
      updateCredentials();
    },
    [updateCredentials]
  );

  const handleToggleKeyVisibility = useCallback(() => {
    setShowKey((current) => !current);
  }, []);

  const submitCredentials = useCallback(
    async (action: "test" | "save") => {
      if (busyAction) {
        return;
      }

      const anonKey = anonKeyInputRef.current?.value.trim() ?? "";
      if (!anonKey || !projectUrl.trim()) {
        return;
      }

      setBusyAction(action);
      setStatus("testing");
      setMessage(
        action === "test"
          ? "Checking the connection securely on the server…"
          : "Verifying and saving the connection securely…"
      );

      try {
        const response = await fetch("/api/supabase-connection", {
          body: JSON.stringify({ action, anonKey, projectUrl }),
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });
        const result = (await response.json()) as ConnectionResponse;

        if (!response.ok || !result.success) {
          setStatus("error");
          setMessage(
            result.message ?? "The Supabase connection could not be verified."
          );
          return;
        }

        setStatus("connected");
        setMessage(
          action === "save"
            ? "Connection verified and securely saved."
            : "Connection verified. Save it to keep it for your account."
        );

        if (action === "save") {
          if (anonKeyInputRef.current) {
            anonKeyInputRef.current.value = "";
          }
          setHasAnonKey(false);
          setShowKey(false);
        }
      } catch {
        setStatus("error");
        setMessage("Unable to reach the connection service. Please try again.");
      } finally {
        setBusyAction(null);
      }
    },
    [busyAction, projectUrl]
  );

  const handleTestConnection = useCallback(async () => {
    await submitCredentials("test");
  }, [submitCredentials]);

  const handleSaveConnection = useCallback(async () => {
    await submitCredentials("save");
  }, [submitCredentials]);

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-sidebar">
      <PluginsHeader />

      <section className="flex-1 overflow-y-auto bg-background px-4 py-6 sm:px-8 sm:py-8 md:rounded-tl-[12px] md:border-l md:border-t md:border-border/40">
        <div className="mx-auto flex min-h-full max-w-4xl flex-col">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-muted/40 text-muted-foreground shadow-xs">
              <Plug className="size-6" />
            </div>
            <div>
              <h1 className="font-bold text-2xl tracking-tight text-foreground sm:text-3xl">
                Plugins
              </h1>
              <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                Manage your connected data sources
              </p>
            </div>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-1 items-center justify-center py-8"
            initial={{ opacity: 0, y: 12 }}
            transition={{
              delay: 0.1,
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <section className="w-full max-w-xl rounded-2xl border border-border/50 bg-card/70 p-5 shadow-xs backdrop-blur-md sm:p-7">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-muted-foreground">
                  <Database className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-base tracking-tight text-foreground">
                    Supabase Connection
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Connect with your project URL and public anon or publishable
                    key.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <label
                    className="text-xs font-medium text-foreground"
                    htmlFor="supabase-project-url"
                  >
                    Supabase Project URL
                  </label>
                  <input
                    autoComplete="url"
                    className="h-10 w-full rounded-lg border border-border/60 bg-background px-3 text-sm text-foreground shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                    id="supabase-project-url"
                    onChange={handleProjectUrlChange}
                    placeholder="https://your-project.supabase.co"
                    spellCheck={false}
                    type="url"
                    value={projectUrl}
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    className="text-xs font-medium text-foreground"
                    htmlFor="supabase-anon-key"
                  >
                    Supabase Anon / Publishable Key
                  </label>
                  <div className="relative">
                    <input
                      autoComplete="off"
                      className="h-10 w-full rounded-lg border border-border/60 bg-background py-2 pl-3 pr-11 font-mono text-xs text-foreground shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                      id="supabase-anon-key"
                      onChange={handleAnonKeyChange}
                      placeholder="Public anon or sb_publishable_… key"
                      ref={anonKeyInputRef}
                      spellCheck={false}
                      type={showKey ? "text" : "password"}
                    />
                    <button
                      aria-label={showKey ? "Hide key" : "Show key"}
                      className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground transition hover:text-foreground"
                      onClick={handleToggleKeyVisibility}
                      type="button"
                    >
                      {showKey ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 rounded-xl border border-border/50 bg-background/60 p-3.5 sm:flex-row sm:items-center sm:justify-between">
                <div
                  aria-live="polite"
                  className="flex min-w-0 items-start gap-2.5"
                >
                  <span
                    className={`mt-0.5 inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusStyles[status]}`}
                  >
                    {status === "testing" ? (
                      <LoaderCircle className="size-3 animate-spin" />
                    ) : (
                      <span className="size-1.5 rounded-full bg-current" />
                    )}
                    {statusLabels[status]}
                  </span>
                  <p className="pt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {message}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2 sm:justify-end">
                  <Button
                    className="h-9 gap-1.5 rounded-lg px-3 text-xs"
                    disabled={
                      busyAction !== null || !projectUrl.trim() || !hasAnonKey
                    }
                    onClick={handleTestConnection}
                    size="sm"
                    variant="outline"
                  >
                    {busyAction === "test" ? (
                      <LoaderCircle className="size-3.5 animate-spin" />
                    ) : null}
                    Test Connection
                  </Button>
                  <Button
                    className="h-9 gap-1.5 rounded-lg px-3 text-xs"
                    disabled={
                      busyAction !== null || !projectUrl.trim() || !hasAnonKey
                    }
                    onClick={handleSaveConnection}
                    size="sm"
                  >
                    {busyAction === "save" ? (
                      <LoaderCircle className="size-3.5 animate-spin" />
                    ) : (
                      <Save className="size-3.5" />
                    )}
                    Save Connection
                  </Button>
                </div>
              </div>

              <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground/80">
                Use only a public anon or publishable key. Connection checks and
                encrypted storage run on the server.
              </p>
            </section>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
