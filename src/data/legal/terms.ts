import type { LegalSection } from "./types";

export type { LegalSection };

export const TERMS_META = {
  title: "Terms & Conditions",
  effectiveDate: "January 1, 2026",
} as const;

export const TERMS_SECTIONS: LegalSection[] = [
  {
    title: "1. Introduction",
    paragraphs: [
      "Welcome to Malamih Creative Agency. By accessing our website or using our services, you agree to these Terms & Conditions. If you do not agree with any part of these terms, please refrain from using our services.",
    ],
  },
  {
    title: "2. Services",
    paragraphs: [
      "Malamih provides creative and digital services including, but not limited to:",
      "The scope of each project is defined in the approved quotation or service agreement.",
    ],
    list: [
      "Brand Strategy",
      "Branding & Visual Identity",
      "Graphic Design",
      "Content Production",
      "Photography & Videography",
      "Motion Graphics",
      "Website & App Development",
      "Digital Marketing",
      "Performance Marketing",
      "AI & Business Automation",
      "Business Consulting",
    ],
  },
  {
    title: "3. Project Approval",
    paragraphs: [
      "A project officially begins once the client approves the quotation or proposal and any required advance payment has been received.",
      "Any work requested outside the agreed scope may require additional time and fees.",
    ],
  },
  {
    title: "4. Payments",
    paragraphs: [
      "Payment schedules are defined in the approved quotation or contract.",
      "Invoices must be paid within the agreed payment period.",
      "Late payments may result in project delays, suspension of services, or additional fees.",
    ],
  },
  {
    title: "5. Revisions",
    paragraphs: [
      "Each project includes the number of revisions specified in the proposal.",
      "Additional revisions or major scope changes may be billed separately.",
    ],
  },
  {
    title: "6. Intellectual Property",
    paragraphs: [
      "Upon full payment, ownership of the final approved deliverables is transferred to the client unless otherwise stated in the agreement.",
      "Malamih retains ownership of drafts, concepts, source files, internal assets, templates, and proprietary production workflows unless explicitly transferred.",
    ],
  },
  {
    title: "7. Client Responsibilities",
    paragraphs: [
      "Clients are responsible for providing accurate information, required materials, approvals, and timely feedback.",
      "Project timelines may be extended if approvals or required assets are delayed.",
    ],
  },
  {
    title: "8. Confidentiality",
    paragraphs: [
      "All client information, project materials, and business data are treated as confidential and will not be shared with third parties unless required by law or authorized by the client.",
    ],
  },
  {
    title: "9. Portfolio Rights",
    paragraphs: [
      "Unless otherwise agreed in writing, Malamih reserves the right to showcase completed projects in its portfolio, website, presentations, and marketing materials.",
    ],
  },
  {
    title: "10. Third-Party Services",
    paragraphs: [
      "Projects may involve third-party platforms or services such as Meta, Google, TikTok, hosting providers, cloud services, AI providers, or software vendors.",
      "Malamih is not responsible for outages, policy changes, pricing updates, or technical issues originating from these third-party services.",
    ],
  },
  {
    title: "11. Limitation of Liability",
    paragraphs: [
      "Malamih shall not be liable for indirect, incidental, or consequential damages arising from the use of our services.",
      "Our liability is limited to the amount paid for the specific service provided.",
    ],
  },
  {
    title: "12. Cancellation",
    paragraphs: [
      "Either party may terminate a project according to the terms specified in the service agreement.",
      "Work completed before cancellation remains payable.",
    ],
  },
  {
    title: "13. Changes to These Terms",
    paragraphs: [
      "Malamih may update these Terms & Conditions at any time. Continued use of our services constitutes acceptance of the updated terms.",
    ],
  },
  {
    title: "14. Contact",
    paragraphs: [
      "Malamih Creative Agency",
      "For any questions regarding these Terms & Conditions, please contact us through the official communication channels listed on our website.",
    ],
  },
];
