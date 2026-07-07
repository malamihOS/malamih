import nodemailer from "nodemailer";
import { isGmailSmtpConfig } from "@/lib/gmail-smtp";
import type { FormType } from "@/lib/leads/types";
import { prisma } from "@/lib/prisma";

type SmtpConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  fromEmail: string;
  fromName: string;
};

const FORM_TYPE_LABELS: Record<FormType, string> = {
  contact: "Contact form",
  service_inquiry: "Service inquiry",
  project_inquiry: "Project inquiry",
  blog_cta: "Blog CTA",
  newsletter: "Newsletter signup",
  proposal: "Proposal request",
  landing_page: "Landing page",
  manual: "Manual entry",
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

export async function getNotificationEmail(): Promise<string> {
  const settings = await prisma.siteSettings.findFirst();
  return (
    settings?.notifyEmail?.trim() ||
    settings?.smtpFromEmail?.trim() ||
    process.env.ADMIN_EMAIL?.trim() ||
    ""
  );
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

export async function sendSubmissionAdminNotification(data: {
  formType: FormType;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  sourcePage?: string;
  metadata?: Record<string, unknown>;
}) {
  const to = await getNotificationEmail();
  if (!to) return { sent: false, reason: "No notification email configured" };

  const formLabel = FORM_TYPE_LABELS[data.formType] ?? "Website submission";
  const subjectLine = data.subject?.trim() || data.name;
  const metadataLines =
    data.metadata && Object.keys(data.metadata).length > 0
      ? [
          "",
          "Details:",
          ...Object.entries(data.metadata).map(([key, value]) => `${key}: ${String(value)}`),
        ]
      : [];

  return sendMail({
    to,
    subject: `[Malamih] ${formLabel}: ${subjectLine}`,
    text: [
      `New ${formLabel.toLowerCase()}`,
      ``,
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone || "—"}`,
      `Company: ${data.company || "—"}`,
      `Subject: ${data.subject || "—"}`,
      `Source page: ${data.sourcePage || "—"}`,
      ...metadataLines,
      ``,
      `Message:`,
      data.message,
    ].join("\n"),
  });
}

export async function sendContactAdminNotification(data: {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  sourcePage?: string;
}) {
  return sendSubmissionAdminNotification({
    formType: "contact",
    ...data,
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
