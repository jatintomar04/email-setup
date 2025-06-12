// service/gmailService.js
import { google } from 'googleapis';

export const sendGmail = async (accessToken, to, subject, message) => {
  const oAuth2Client = new google.auth.OAuth2();
  oAuth2Client.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

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
};
