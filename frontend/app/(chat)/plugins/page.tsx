"use client";

import { motion } from "framer-motion";
import { Database, Plug, Save } from "lucide-react";
import { useEffect } from "react";
import { PluginsHeader } from "@/components/plugins/plugins-header";
import { Button } from "@/components/ui/button";

export default function PluginsPage() {
  useEffect(() => {
    document.title = "UniVoice — Plugins";
    return () => {
      document.title = "UniVoice — AI Outbound Campaign & Voice Orchestration";
    };
  }, []);

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
                    disabled
                    id="supabase-project-url"
                    placeholder="https://your-project.supabase.co"
                    spellCheck={false}
                    type="url"
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
                      disabled
                      id="supabase-anon-key"
                      placeholder="Public anon or sb_publishable_… key"
                      spellCheck={false}
                      type="password"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 rounded-xl border border-border/50 bg-background/60 p-3.5 sm:flex-row sm:items-center sm:justify-between">
                <div
                  aria-live="polite"
                  className="flex min-w-0 items-start gap-2.5"
                >
                  <span className="mt-0.5 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/60 bg-muted/50 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-current" />
                    Not Connected
                  </span>
                  <p className="pt-0.5 text-xs leading-relaxed text-muted-foreground">
                    Connection setup is a demo placeholder and is not enabled
                    yet.
                  </p>
                </div>
                <div className="flex shrink-0 gap-2 sm:justify-end">
                  <Button
                    className="h-9 gap-1.5 rounded-lg px-3 text-xs"
                    disabled
                    size="sm"
                    variant="outline"
                  >
                    Test Connection
                  </Button>
                  <Button
                    className="h-9 gap-1.5 rounded-lg px-3 text-xs"
                    disabled
                    size="sm"
                  >
                    <Save className="size-3.5" />
                    Save Connection
                  </Button>
                </div>
              </div>

              <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground/80">
                Supabase connection setup will be available in a future update.
              </p>
            </section>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
