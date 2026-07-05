import type { LegalSection } from "./types";

export const PRIVACY_META = {
  title: "Privacy Policy",
  lastUpdated: "June 29, 2026",
} as const;

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    title: "1. Information We Collect",
    paragraphs: [
      "When you visit the Malamih website, we may collect certain information automatically, including your IP address, browser type, device information, pages visited, and general usage data.",
      "If you contact us, request a quotation, or submit a project inquiry, we may collect information such as:",
    ],
    list: [
      "Full Name",
      "Company Name",
      "Email Address",
      "Phone Number",
      "Project Details",
      "Business Information",
      "Any additional information you choose to provide",
    ],
  },
  {
    title: "2. How We Use Your Information",
    paragraphs: ["We use your information to:"],
    list: [
      "Respond to inquiries and project requests.",
      "Prepare quotations and proposals.",
      "Deliver our creative and digital services.",
      "Improve our website and user experience.",
      "Communicate regarding projects, updates, and support.",
      "Analyze website performance and business insights.",
    ],
  },
  {
    title: "3. Cookies & Analytics",
    paragraphs: [
      "Our website may use cookies and analytics tools to better understand visitor behavior and improve performance.",
      "These technologies help us measure website traffic, optimize user experience, and improve our services.",
      "You may disable cookies through your browser settings at any time.",
    ],
  },
  {
    title: "4. Information Sharing",
    paragraphs: [
      "Malamih does not sell, rent, or trade your personal information.",
      "Your information may only be shared when necessary to:",
    ],
    list: [
      "Deliver requested services.",
      "Work with trusted third-party providers (such as hosting, cloud infrastructure, analytics, payment processors, or communication platforms).",
      "Comply with applicable laws or legal obligations.",
    ],
  },
  {
    title: "5. Data Retention",
    paragraphs: [
      "We retain personal information only for as long as necessary to provide our services, fulfill contractual obligations, maintain business records, or comply with applicable legal requirements.",
    ],
  },
  {
    title: "6. Data Security",
    paragraphs: [
      "We implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction.",
      "While we follow industry best practices, no online system can guarantee absolute security.",
    ],
  },
  {
    title: "7. Your Rights",
    paragraphs: [
      "Depending on your applicable laws, you may have the right to:",
      "To exercise these rights, please contact us using the information below.",
    ],
    list: [
      "Access your personal information.",
      "Request corrections or updates.",
      "Request deletion of your data.",
      "Withdraw consent where applicable.",
      "Request information about how your data is processed.",
    ],
  },
  {
    title: "8. Third-Party Services",
    paragraphs: [
      "Our website and services may integrate with trusted third-party providers, including but not limited to:",
      "These services operate under their own privacy policies.",
    ],
    list: [
      "Google Services",
      "Meta Platforms",
      "LinkedIn",
      "TikTok",
      "Microsoft",
      "Cloud Hosting Providers",
      "Analytics Platforms",
      "Payment Providers",
    ],
  },
  {
    title: "9. Changes to This Policy",
    paragraphs: [
      "We may update this Privacy Policy from time to time to reflect changes in our services, legal requirements, or business practices.",
      "The latest version will always be available on our website.",
    ],
  },
  {
    title: "10. Contact",
    paragraphs: [
      "Malamih Creative Agency",
      "If you have any questions regarding this Privacy Policy or how your information is handled, please contact us through our official website or business communication channels.",
    ],
  },
];
