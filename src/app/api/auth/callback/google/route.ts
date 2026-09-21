import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma/client";
import { encrypt } from "@/lib/security/encryption";
import { google } from "googleapis";

export async function GET(req: Request) {
  try {
    const { organizationId } = auth();
    if (!organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const code = req.nextUrl.searchParams.get("code");
    if (!code) {
      return NextResponse.json({ error: "Missing authorization code" }, { status: 400 });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.access_token) {
      return NextResponse.json({ error: "Failed to obtain access token" }, { status: 500 });
    }

    // Securely store the token
    await prisma.integrationCredential.upsert({
      where: {
        // We'll need a unique constraint on provider + organizationId for this to work properly
        // For now, we'll find existing first
        id: 'placeholder',
      },
      update: {
        encryptedToken: encrypt(tokens.access_token),
        refreshToken: tokens.refresh_token ? encrypt(tokens.refresh_token) : null,
        expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      },
      create: {
        provider: 'google',
        encryptedToken: encrypt(tokens.access_token),
        refreshToken: tokens.refresh_token ? encrypt(tokens.refresh_token) : null,
        expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        organizationId,
      },
    });

    // For the a simplified MVP implementation, we handle the upsert manually:
    const existing = await prisma.integrationCredential.findFirst({
      where: { provider: 'google', organizationId }
    });

    if (existing) {
      await prisma.integrationCredential.update({
        where: { id: existing.id },
        data: {
          encryptedToken: encrypt(tokens.access_token),
          refreshToken: tokens.refresh_token ? encrypt(tokens.refresh_token) : null,
          expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        }
      });
    } else {
      await prisma.integrationCredential.create({
        data: {
          provider: 'google',
          encryptedToken: encrypt(tokens.access_token),
          refreshToken: tokens.refresh_token ? encrypt(tokens.refresh_token) : null,
          expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
          organizationId,
        }
      });
    }

    return NextResponse.redirect(new URL('/employees', req.url));
  } catch (error: any) {
    console.error("Google OAuth Callback Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
