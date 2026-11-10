import "server-only";

import {
  createCipheriv,
  createDecipheriv,
  hkdfSync,
  randomBytes,
} from "node:crypto";

export type SupabaseCredentials = {
  anonKey: string;
  projectUrl: string;
};

type SupabaseCredentialsValidation =
  | { message: string; success: false }
  | { credentials: SupabaseCredentials; success: true };

type ConnectionCheck = {
  message: string;
  success: boolean;
};

const ENCRYPTION_CONTEXT = "univoice-supabase-connection-v1";
const CREDENTIALS_FORMAT = "v1";
const MAX_ANON_KEY_LENGTH = 4096;

function getEncryptionKey() {
  const authSecret = process.env.AUTH_SECRET;

  if (!authSecret || authSecret.length < 32) {
    throw new Error("Connection encryption is unavailable.");
  }

  return Buffer.from(
    hkdfSync("sha256", authSecret, ENCRYPTION_CONTEXT, ENCRYPTION_CONTEXT, 32)
  );
}

function isPublicSupabaseKey(value: string) {
  if (value.length > MAX_ANON_KEY_LENGTH) {
    return false;
  }

  if (/^sb_publishable_[A-Za-z0-9_-]{20,}$/.test(value)) {
    return true;
  }

  const tokenParts = value.split(".");
  if (tokenParts.length !== 3) {
    return false;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(tokenParts[1], "base64url").toString("utf8")
    ) as { role?: unknown };
    return payload.role === "anon";
  } catch {
    return false;
  }
}

export function validateSupabaseCredentials(
  input: SupabaseCredentials
): SupabaseCredentialsValidation {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(input.projectUrl.trim());
  } catch {
    return { message: "Enter a valid Supabase Project URL.", success: false };
  }

  const isSupabaseProjectHost =
    /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.supabase\.co$/.test(
      parsedUrl.hostname
    );

  if (
    parsedUrl.protocol !== "https:" ||
    !isSupabaseProjectHost ||
    parsedUrl.username ||
    parsedUrl.password ||
    parsedUrl.port ||
    parsedUrl.pathname !== "/" ||
    parsedUrl.search ||
    parsedUrl.hash
  ) {
    return {
      message:
        "Use the HTTPS URL for a Supabase project, without a path or query.",
      success: false,
    };
  }

  const anonKey = input.anonKey.trim();
  if (!isPublicSupabaseKey(anonKey)) {
    return {
      message:
        "Enter a public anon JWT or Supabase publishable key. Secret and service-role keys are not accepted.",
      success: false,
    };
  }

  return {
    credentials: { anonKey, projectUrl: parsedUrl.origin },
    success: true,
  };
}

export async function testSupabaseConnection(
  credentials: SupabaseCredentials
): Promise<ConnectionCheck> {
  const validation = validateSupabaseCredentials(credentials);
  if (!validation.success) {
    return { message: validation.message, success: false };
  }

  try {
    const response = await fetch(
      `${validation.credentials.projectUrl}/auth/v1/health`,
      {
        cache: "no-store",
        headers: { apikey: validation.credentials.anonKey },
        method: "GET",
        redirect: "error",
        signal: AbortSignal.timeout(8000),
      }
    );

    if (response.ok) {
      return { message: "Supabase accepted the public key.", success: true };
    }

    if (response.status === 401 || response.status === 403) {
      return {
        message: "Supabase rejected the supplied public key.",
        success: false,
      };
    }

    return {
      message: "Supabase could not verify this project and public key.",
      success: false,
    };
  } catch {
    return {
      message: "Could not reach Supabase. Check the Project URL and try again.",
      success: false,
    };
  }
}

export function encryptSupabaseCredentials(credentials: SupabaseCredentials) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(credentials), "utf8"),
    cipher.final(),
  ]);

  return [
    CREDENTIALS_FORMAT,
    iv.toString("base64url"),
    cipher.getAuthTag().toString("base64url"),
    encrypted.toString("base64url"),
  ].join(".");
}

export function decryptSupabaseCredentials(encryptedCredentials: string) {
  const [format, encodedIv, encodedTag, encodedValue, extra] =
    encryptedCredentials.split(".");

  if (
    format !== CREDENTIALS_FORMAT ||
    !encodedIv ||
    !encodedTag ||
    !encodedValue ||
    extra
  ) {
    throw new Error("Saved connection data is invalid.");
  }

  try {
    const decipher = createDecipheriv(
      "aes-256-gcm",
      getEncryptionKey(),
      Buffer.from(encodedIv, "base64url")
    );
    decipher.setAuthTag(Buffer.from(encodedTag, "base64url"));

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encodedValue, "base64url")),
      decipher.final(),
    ]).toString("utf8");

    return JSON.parse(decrypted) as SupabaseCredentials;
  } catch (error) {
    throw new Error("Saved connection could not be decrypted.", {
      cause: error,
    });
  }
}
