import nodemailer from "nodemailer";
import { isGmailSmtpConfig } from "@/lib/gmail-smtp";
import { prisma } from "@/lib/prisma";

type SmtpConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  fromEmail: string;
  fromName: string;
};

async function getSmtpConfig(): Promise<SmtpConfig | null> {
  const settings = await prisma.siteSettings.findFirst();
  const fromEmail = settings?.smtpFromEmail?.trim() ?? "";
  const user = settings?.smtpUser?.trim() || fromEmail;

  if (!settings?.smtpEnabled || !fromEmail || !user) {
    return null;
  }

  return {
    host: settings.smtpHost,
    port: settings.smtpPort || 587,
    user,
    pass: settings.smtpPass,
    fromEmail,
    fromName: settings.smtpFromName || "Malamih Creative Company",
  };
}

function createTransporter(config: SmtpConfig) {
  if (isGmailSmtpConfig(config.host)) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });
  }

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: config.user
      ? { user: config.user, pass: config.pass }
      : undefined,
  });
}

async function sendMail(options: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  const config = await getSmtpConfig();
  if (!config) {
    return { sent: false, reason: "SMTP not configured" };
  }

  const transporter = createTransporter(config);

  await transporter.sendMail({
    from: `"${config.fromName}" <${config.fromEmail}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html ?? options.text.replace(/\n/g, "<br>"),
  });

  return { sent: true };
}

export async function sendContactAdminNotification(data: {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
}) {
  const settings = await prisma.siteSettings.findFirst();
  const to =
    settings?.notifyEmail ||
    settings?.smtpFromEmail ||
    process.env.ADMIN_EMAIL ||
    "";

  if (!to) return { sent: false, reason: "No notification email configured" };

  return sendMail({
    to,
    subject: `[Malamih] New contact: ${data.subject || data.name}`,
    text: [
      `New contact form submission`,
      ``,
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone || "—"}`,
      `Company: ${data.company || "—"}`,
      `Subject: ${data.subject || "—"}`,
      ``,
      `Message:`,
      data.message,
    ].join("\n"),
  });
}

export async function sendContactAutoReply(data: {
  name: string;
  email: string;
}) {
  return sendMail({
    to: data.email,
    subject: "Thank you for contacting Malamih Creative Company",
    text: [
      `Hello ${data.name},`,
      ``,
      `Thank you for reaching out to Malamih Creative Company.`,
      `We have received your message and will get back to you shortly.`,
      ``,
      `Best regards,`,
      `Malamih Creative Company`,
      `Full-Service Creative & Marketing Agency`,
    ].join("\n"),
  });
}
