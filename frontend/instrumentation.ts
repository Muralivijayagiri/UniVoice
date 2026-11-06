export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      const { registerOTel } = await import("@vercel/otel");
      registerOTel({ serviceName: "chatbot" });
    } catch {
      // Ignore OTEL registration errors on platforms without file URL support
    }

    try {
      const { OpenTelemetry } = await import("@ai-sdk/otel");
      const { registerTelemetry } = await import("ai");
      registerTelemetry(new OpenTelemetry());
    } catch {
      // Ignore in development
    }
  }
}
