import { z } from "zod";
import { auth } from "@/app/(auth)/auth";
import {
  getSupabaseConnectionByUserId,
  saveSupabaseConnectionForUser,
} from "@/lib/db/queries";
import {
  decryptSupabaseCredentials,
  encryptSupabaseCredentials,
  testSupabaseConnection,
  validateSupabaseCredentials,
} from "@/lib/supabase-connections";

const credentialRequestSchema = z
  .object({
    action: z.enum(["test", "save"]),
    anonKey: z.string().min(1).max(4096),
    projectUrl: z.string().min(1).max(512),
  })
  .strict();

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return Response.json(body, {
    headers: { "Cache-Control": "no-store, max-age=0" },
    status,
  });
}

function isAuthorizedStaff(user: { id: string; type: "guest" | "regular" }) {
  if (user.type !== "regular") {
    return false;
  }

  const staffUserIds = (process.env.SUPABASE_CONNECTION_STAFF_USER_IDS ?? "")
    .split(",")
    .map((userId) => userId.trim())
    .filter(Boolean);

  return staffUserIds.includes(user.id);
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return jsonResponse({ message: "Sign in to manage this connection." }, 401);
  }
  if (!isAuthorizedStaff(session.user)) {
    return jsonResponse(
      {
        message:
          "This account is not authorized to manage Supabase connections.",
      },
      403
    );
  }
  if (!process.env.POSTGRES_URL?.trim()) {
    return jsonResponse(
      {
        connected: false,
        message:
          "Saved connection status requires POSTGRES_URL. Configure the app database and apply migration 0001_supabase_connection.",
        status: "error",
      },
      503
    );
  }

  try {
    const savedConnection = await getSupabaseConnectionByUserId(
      session.user.id
    );
    if (!savedConnection) {
      return jsonResponse({ connected: false, status: "not-connected" });
    }

    const credentials = decryptSupabaseCredentials(
      savedConnection.encryptedCredentials
    );
    const check = await testSupabaseConnection(credentials);

    return jsonResponse({
      connected: true,
      message: check.success
        ? "A verified connection is securely saved for your account."
        : check.message,
      status: check.success ? "connected" : "error",
    });
  } catch {
    return jsonResponse(
      {
        connected: false,
        message:
          "Saved connection status is unavailable. Ensure migration 0001_supabase_connection is applied and the app database is reachable.",
        status: "error",
      },
      503
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return jsonResponse({ message: "Sign in to manage this connection." }, 401);
  }
  if (!isAuthorizedStaff(session.user)) {
    return jsonResponse(
      {
        message:
          "This account is not authorized to manage Supabase connections.",
      },
      403
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 8192) {
    return jsonResponse({ message: "Connection details are too large." }, 413);
  }

  let requestBody: z.infer<typeof credentialRequestSchema>;
  try {
    requestBody = credentialRequestSchema.parse(await request.json());
  } catch {
    return jsonResponse(
      {
        message:
          "Enter a Supabase Project URL and public anon or publishable key.",
      },
      400
    );
  }

  const validation = validateSupabaseCredentials({
    anonKey: requestBody.anonKey,
    projectUrl: requestBody.projectUrl,
  });
  if (!validation.success) {
    return jsonResponse({ message: validation.message, success: false }, 400);
  }

  const connectionCheck = await testSupabaseConnection(validation.credentials);
  if (!connectionCheck.success) {
    return jsonResponse(
      { message: connectionCheck.message, success: false },
      400
    );
  }

  if (requestBody.action === "test") {
    return jsonResponse({ message: connectionCheck.message, success: true });
  }

  if (!process.env.POSTGRES_URL?.trim()) {
    return jsonResponse(
      {
        message:
          "Supabase verified the credentials, but POSTGRES_URL is not configured. Configure the app database and apply migration 0001_supabase_connection to save them.",
        success: false,
      },
      503
    );
  }

  try {
    await saveSupabaseConnectionForUser({
      encryptedCredentials: encryptSupabaseCredentials(validation.credentials),
      userId: session.user.id,
    });
  } catch {
    return jsonResponse(
      {
        message:
          "Supabase verified the credentials, but PostgreSQL storage is unavailable. Ensure migration 0001_supabase_connection is applied and the app database is reachable.",
        success: false,
      },
      503
    );
  }

  return jsonResponse({
    message: "Connection verified and securely saved.",
    success: true,
  });
}
