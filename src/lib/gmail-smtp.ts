export const GMAIL_SMTP_HOST = "smtp.gmail.com";
export const GMAIL_SMTP_PORT = 587;

export function normalizeGmailIntegration<T extends {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpFromEmail: string;
}>(settings: T): T {
  const gmailAddress = settings.smtpFromEmail.trim().toLowerCase();

  return {
    ...settings,
    smtpHost: GMAIL_SMTP_HOST,
    smtpPort: GMAIL_SMTP_PORT,
    smtpFromEmail: gmailAddress,
    smtpUser: gmailAddress || settings.smtpUser.trim().toLowerCase(),
  };
}

export function isGmailSmtpConfig(host: string) {
  return !host || host === GMAIL_SMTP_HOST;
}
