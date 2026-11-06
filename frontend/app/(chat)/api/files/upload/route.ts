import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/app/(auth)/auth";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB (matching modern ChatGPT interface limits)

// Block dangerous executable extensions for security
const DISALLOWED_EXTENSIONS = [
  ".exe",
  ".bat",
  ".cmd",
  ".com",
  ".msi",
  ".dll",
  ".vbs",
  ".scr",
  ".pif",
];

const FileSchema = z.object({
  file: z
    .instanceof(Blob)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "File size should be less than 50MB",
    })
    .refine(
      (file) => {
        if ("name" in file && typeof file.name === "string") {
          const lower = file.name.toLowerCase();
          return !DISALLOWED_EXTENSIONS.some((ext) => lower.endsWith(ext));
        }
        return true;
      },
      {
        message:
          "Executable file formats are not supported for security reasons",
      }
    ),
});

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (request.body === null) {
    return new Response("Request body is empty", { status: 400 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as Blob;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const validatedFile = FileSchema.safeParse({ file });

    if (!validatedFile.success) {
      const errorMessage = validatedFile.error.issues
        .map((error) => error.message)
        .join(", ");

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const rawFilename = (formData.get("file") as File)?.name || "uploaded_file";
    const safeName = rawFilename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const fileBuffer = await file.arrayBuffer();
    const mimeType = file.type || "application/octet-stream";

    // If Vercel Blob token is configured, use Vercel Blob cloud storage
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const data = await put(safeName, fileBuffer, {
          access: "public",
          contentType: mimeType,
        });

        return NextResponse.json(data);
      } catch (blobError) {
        console.warn(
          "Vercel Blob upload failed, falling back to data URL:",
          blobError
        );
      }
    }

    // Resilient local / offline fallback: encode as Data URL
    // Ensures flawless uploads in local dev, offline environments, and self-hosted deployments
    const base64 = Buffer.from(fileBuffer).toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({
      contentType: mimeType,
      pathname: rawFilename,
      url: dataUrl,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
