import fs from 'fs';
import { google } from 'googleapis';
import path from 'path';

export const sendGmail = async (accessToken, to, subject, message, filePath = null) => {
  const oAuth2Client = new google.auth.OAuth2();
  oAuth2Client.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  // If no attachment, send simple email
  if (!filePath) {
    const emailContent = [
      `To: ${to}`,
      `Subject: ${subject}`,
      '',
      message
    ].join('\n');

    const encodedMessage = Buffer.from(emailContent)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage
      }
    });

    return;
  }

  // With attachment
  const boundary = '__my_boundary__';
  const fileName = path.basename(filePath);
  const fileContent = fs.readFileSync(filePath).toString('base64');

  const emailParts = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    '',
    message,
    '',
    `--${boundary}`,
    'Content-Type: application/octet-stream',
    `Content-Disposition: attachment; filename="${fileName}"`,
    'Content-Transfer-Encoding: base64',
    '',
    fileContent,
    `--${boundary}--`
  ];

  const rawMessage = Buffer.from(emailParts.join('\n'))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: rawMessage
    }
  });
};
