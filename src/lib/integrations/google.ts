import { google } from 'googleapis';
import { decrypt } from '@/lib/security/encryption';
import { prisma } from '@/lib/prisma/client';

export async function getGoogleClient(organizationId: string) {
  const creds = await prisma.integrationCredential.findFirst({
    where: {
      provider: 'google',
      organizationId,
    },
  });

  if (!creds) {
    throw new Error('Google integration not connected for this organization');
  }

  const accessToken = decrypt(creds.encryptedToken);

  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  auth.setCredentials({ access_token: accessToken });

  return { auth, creds };
}

export async function sendGmailEmail({ to, subject, body }: { to: string; subject: string; body: string }, organizationId: string) {
  const { auth } = await getGoogleClient(organizationId);
  const gmail = google.gmail({ version: 'v1', auth });

  const utf8Subject = `=utf8''${encodeURIComponent(subject)}`;
  const utf8Body = `=utf8''${encodeURIComponent(body)}`;
  const message = [
    `Content-Type: text/plain; charset="UTF-8"\n`,
    `MIME-Version: 1.0\n`,
    `Content-Transfer-Encoding: 7bit\n`,
    `to: ${to}\n`,
    `subject: ${utf8Subject}\n\n`,
    utf8Body,
  ].join('\n');

  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage,
    },
  });

  return { success: true };
}

export async function appendToSheet({ spreadsheetId, range, values }: { spreadsheetId: string; range: string; values: any[] }, organizationId: string) {
  const { auth } = await getGoogleClient(organizationId);
  const sheets = google.sheets({ version: 'v4', auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [values],
    },
  });

  return { success: true };
}
