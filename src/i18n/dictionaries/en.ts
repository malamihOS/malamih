import { PRIVACY_META, PRIVACY_SECTIONS } from "@/data/legal/privacy";
import { TERMS_META, TERMS_SECTIONS } from "@/data/legal/terms";
import type { Dictionary } from "../types";

export const en: Dictionary = {
  meta: {
    site: {
      title: "malamih — Portfolio & Agency",
      description:
        "malamih, a creative portfolio for designers, freelancers, agencies, and photographers.",
    },
    pages: {
      home: {
        title: "malamih — Portfolio & Agency",
        description:
          "We build systems that help brands grow, sell, and scale.",
      },
      contact: {
        title: "Contact — malamih",
        description:
          "Let's connect to create something curated, immersive, and deeply personal together.",
      },
      projects: {
        title: "Projects — malamih",
        description:
          "Explore selected work from malamih — branding, content, digital products, and marketing campaigns.",
      },
      projectFallback: {
        title: "Project — malamih",
        description:
          "Explore selected work from malamih — branding, content, digital products, and marketing campaigns.",
      },
      terms: {
        title: "Terms & Conditions — malamih",
        description:
          "Terms & Conditions for Malamih Creative Agency services, projects, payments, and intellectual property.",
      },
      privacy: {
        title: "Privacy Policy — malamih",
        description:
          "Privacy Policy for Malamih Creative Agency — how we collect, use, and protect your information.",
      },
      notFound: {
        title: "404 — Page Not Found — malamih",
        description: "The page you are looking for could not be found.",
      },
      blog: {
        title: "Blog — Marketing Insights — malamih",
        description:
          "Expert marketing, branding, and digital growth insights for businesses in Iraq and the Arab world from Malamih Creative Company.",
      },
      blogFallback: {
        title: "Blog — malamih",
        description:
          "Marketing and creative insights from Malamih Creative Company.",
      },
    },
  },
  common: {
    brand: {
      name: "malamih",
      creative: "Creative",
      studio: "",
    },
    header: {
      email: "Email",
      whatsApp: "WhatsApp",
      location: "Location",
      contactNav: "Contact",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    nav: {
      home: "Home",
      projects: "Projects",
      services: "Services",
      contact: "Contact",
      blog: "Blog",
      faq: "FAQ",
    },
    footer: {
      contactUs: "Contact Us",
      haveProject: "Have a project in mind?",
      letsTalk: "Lets Talk",
      navigation: "Navigation",
      priority: "Priority",
      terms: "Terms And Conditions",
      privacy: "Privacy & Policy",
      basedIn: "Based in",
      copyright: "© malamih. All rights reserved.",
      backToTop: "Back to top",
      marquee: [
        "malamih CREATIVE",
        "/",
        "Design",
        "/",
        "Production",
        "/",
        "Marketing",
      ],
    },
    legal: {
      effectiveDate: "Effective Date",
      lastUpdated: "Last Updated",
      contactPage: "contact page",
      officialWebsite: "official website",
      agencyName: "Malamih Creative Agency",
      termsContact:
        "For any questions regarding these Terms & Conditions, please contact us through the official communication channels listed on our website.",
      privacyContact:
        "If you have any questions regarding this Privacy Policy or how your information is handled, please contact us through our official website or business communication channels.",
    },
    notFound: {
      label: "Error",
      title: "Page Not Found",
      description:
        "The page you are looking for does not exist or may have been moved. Return to the homepage or explore our latest work.",
      backHome: "Back to Home",
      viewProjects: "View Projects",
    },
    projectDetail: {
      liveWebsite: "Live Website",
      year: "Year",
      industry: "Industry",
      spaceOfWork: "Space of work",
      timeline: "Timeline",
      showcaseAlt: "showcase",
      detailAlt: "detail",
      finalAlt: "final showcase",
    },
    moreProjects: {
      label: "Projects",
      heading: "More works",
    },
  },
  home: {
    hero: {
      headline: "malamih",
      description: "",
      ctaText: "",
      ctaLink: "/contact",
      categories: [
        "BRAND STRATEGY",
        "CONTENT PRODUCTION",
        "PERFORMANCE MARKETING",
        "WEB DEVELOPMENT",
        "BUSINESS SOLUTIONS",
      ],
      tagline1: "We don't just create content.",
      tagline2: "We build systems that help brands grow, sell, and scale.",
    },
    commitment: {
      slideAlts: [
        "Team collaborating in a modern workspace",
        "Creative team meeting",
        "Professionals working together",
        "Business strategy discussion",
      ],
      heading: "We Build Brands That\nGrow, Scale,\nand Lead.",
      description:
        "Malamih is a creative growth agency helping businesses build strong brands, create impactful content, develop modern digital experiences, and execute marketing strategies that generate measurable business results—not just beautiful designs.",
      stats: [
        { label: "Successful Projects" },
        { label: "Business Partners" },
        { label: "Tailored Solutions" },
      ],
      marqueeLabel: "Malamih brands",
    },
    projects: {
      label: "Selected Work",
      headingLine1: "Projects That",
      headingLine2: "Drive Growth",
      description:
        "Every project starts with strategy, not visuals. From branding and content production to digital products and marketing campaigns, we create work designed to solve problems, grow businesses, and deliver measurable results.",
      seeMore: "See More",
    },
    why: {
      label: "Why Malamih",
      headingLine1: "Why",
      headingLine2: "Malamih?",
      description: "",
      cards: [
        {
          title: "Business First",
          description:
            "We start by understanding your business, market, and customers before creating any strategy. Every decision is driven by clear objectives and measurable growth.",
        },
        {
          title: "Creative Execution",
          description:
            "From branding and content production to websites and campaigns, we craft creative experiences that strengthen your brand and capture attention.",
        },
        {
          title: "Technology & Marketing",
          description:
            "We combine modern development, automation, AI, and performance marketing to build scalable systems that generate real business results.",
        },
        {
          title: "Long-Term Partnership",
          description:
            "We don't disappear after launch. We analyze, optimize, and continuously improve every project to help your business grow over time.",
        },
      ],
    },
    services: {
      label: "Our Services",
      heading: "Services",
      items: [
        {
          number: "01",
          title: "Brand Strategy",
          tags: [
            "Brand Strategy",
            "Brand Positioning",
            "Market Research",
            "Brand Identity",
            "Visual Identity",
            "Brand Guidelines",
            "Brand Messaging",
            "Naming",
            "Creative Direction",
            "Launch Strategy",
          ],
        },
        {
          number: "02",
          title: "Creative Production",
          tags: [
            "Video Production",
            "Commercial Production",
            "Photography",
            "Drone Production",
            "Motion Graphics",
            "Video Editing",
            "Social Media Content",
            "Product Photography",
            "Campaign Creative",
            "Storytelling",
          ],
        },
        {
          number: "03",
          title: "Digital Marketing",
          tags: [
            "Performance Marketing",
            "Meta Ads",
            "Google Ads",
            "TikTok Ads",
            "LinkedIn Ads",
            "SEO",
            "Content Marketing",
            "Email Marketing",
            "Analytics",
            "Conversion Optimization",
            "Reporting",
          ],
        },
        {
          number: "04",
          title: "Web & App Development",
          tags: [
            "Website Design",
            "Website Development",
            "E-Commerce",
            "Landing Pages",
            "UI/UX Design",
            "Mobile Apps",
            "Custom Systems",
            "CMS Development",
            "API Integration",
            "Hosting",
          ],
        },
        {
          number: "05",
          title: "Business Automation",
          tags: [
            "AI Automation",
            "CRM Systems",
            "Lead Generation",
            "Sales Funnels",
            "WhatsApp Automation",
            "Email Automation",
            "Workflow Automation",
            "Dashboards",
            "Business Intelligence",
            "Integrations",
          ],
        },
        {
          number: "06",
          title: "Creative Design",
          tags: [
            "Graphic Design",
            "Social Media Design",
            "Print Design",
            "Packaging Design",
            "Presentation Design",
            "Company Profile",
            "Pitch Deck",
            "3D Mockups",
            "Digital Assets",
          ],
        },
        {
          number: "07",
          title: "Production & Events",
          tags: [
            "Event Coverage",
            "Corporate Events",
            "Live Streaming",
            "Interviews",
            "Podcast Production",
            "Studio Production",
            "Product Launches",
            "Behind The Scenes",
          ],
        },
        {
          number: "08",
          title: "Consulting",
          tags: [
            "Marketing Consultation",
            "Brand Audit",
            "Digital Audit",
            "Growth Strategy",
            "Business Consulting",
            "Content Strategy",
            "Creative Workshops",
            "Team Training",
          ],
        },
      ],
    },
    team: {
      label: "Our Team",
      heading: "Meet the Team",
    },
  },
  contact: {
    heroAlt: "Malamih team",
    stepLabel: "Start with a step",
    title: "Let's Connect",
    subtitle:
      "Let's connect to create something curated, immersive, and deeply personal together.",
    form: {
      name: "Name",
      namePlaceholder: "Your Name",
      email: "Email",
      emailPlaceholder: "Your Email",
      phone: "Phone",
      phonePlaceholder: "Your Phone (optional)",
      company: "Company",
      companyPlaceholder: "Your Company (optional)",
      subject: "Subject",
      subjectPlaceholder: "Subject (optional)",
      message: "Message",
      messagePlaceholder: "Your Message",
      submit: "Send a Message",
      submitted: "Message Sent",
    },
    info: {
      addressTitle: "Address",
      contactTitle: "Contact",
    },
    team: [
      { caption: "The Office / 2025", alt: "Malamih office" },
      { caption: "The Team / 2025", alt: "Malamih team" },
    ],
  },
  legal: {
    terms: {
      title: TERMS_META.title,
      date: TERMS_META.effectiveDate,
      sections: TERMS_SECTIONS,
    },
    privacy: {
      title: PRIVACY_META.title,
      date: PRIVACY_META.lastUpdated,
      sections: PRIVACY_SECTIONS,
    },
  },
  projects: {
    page: {
      label: "Selected Work",
      headingLine1: "Projects That",
      headingLine2: "Drive Growth",
    },
    items: {
      "urban-glow": {
        title: "Urban Glow",
        category: "Portfolio",
        summary:
          "Urban lighting today must be more than bulbs—they need to feel smart, sustainable, and interactive by innovative design.",
        industry: "Logistics & Supply Chain",
        spaceOfWork: "Portfolio",
        timeline: "12 Weeks",
        sections: {
          introduction: {
            label: "Introduction",
            heading:
              "Building a logistics ecosystem that's optimized, adaptive, and deeply connected.",
            paragraphs: [
              "Today's logistics networks are no longer just systems of movement. They're living ecosystems of coordination, intelligence, and human purpose. It's not just what you deliver—it's how you deliver it.",
              "They've evolved into adaptive, data-driven environments—crafted not only to move goods efficiently, but to move industries forward. A supply chain isn't a pipeline of transactions; it's a narrative. It speaks through precision, reveals through flow, and connects through trust.",
              "In the past, logistics was about scale—more routes, more storage, more speed. Now, it's about intention. It's about what you optimize, and more importantly, what you simplify. A strong supply chain doesn't dominate—it synchronizes.",
            ],
          },
          challenges: {
            label: "Challenges",
            heading: "Balancing optimization with moments of intelligent impact.",
            paragraphs: [
              "Don't overcomplicate—refine. Let the system perform, but add character in how it operates. Subtle synchronization, clear hierarchy, and flow designed for movement create supply chains that feel effortless yet intentional.",
              "The strongest logistics networks have rhythm—clear entry points, seamless transitions, and communication that feels human. Treat it like orchestration, not just operation. Structure is no longer linear; it adapts like a living system.",
              "What you're really building is a world—one that mirrors your way of thinking, your rhythm of movement, and your vision of connection. A supply chain like this isn't just a network. It's a philosophy in motion.",
            ],
          },
          finalThoughts: {
            label: "Final thoughts",
            heading:
              "Making your supply chain a living system, not a fixed framework:",
            paragraphs: [
              "Supply chains should evolve. They're not static infrastructures—they're intelligent systems in motion. As your operations expand, your network should adapt too. New routes, refined processes, stronger partnerships, bolder strategies.",
              "Every decision matters. From the first mile to the final delivery, every movement carries meaning. A small optimization can say more about your precision and care than a thousand data points ever could.",
              "And most importantly, a great supply chain feels unfinished in the best way possible—it leaves room for innovation, for agility, for transformation. Because logistics should grow as the world does.",
            ],
          },
        },
      },
      "lunaris-health": {
        title: "Lunaris Health",
        category: "Web Design",
        summary:
          "Good care is not just about treatment—it's about the emotional weight of trust, rhythm, and healing.",
        industry: "Healthcare",
        spaceOfWork: "Web Design",
        timeline: "8 Weeks",
        sections: {
          introduction: {
            label: "Introduction",
            heading:
              "Understanding emotional response through care, rhythm, and gentle guidance:",
            paragraphs: [
              "In healthcare, space isn't empty—it's intentional. Time between interactions creates calm, clear processes build comfort, and thoughtful contrast guides focus. These elements shape trust and connection through subtle, often unseen cues.",
              "Strong care doesn't just treat—it communicates. In well-designed healthcare experiences, every touchpoint becomes memorable. Patients don't just recall the service—they remember how it felt.",
              "When every moment plays its part, and every part respects the whole, we begin to build healthcare experiences that don't just work—they resonate. They linger. They become signatures.",
            ],
          },
          challenges: {
            label: "Challenges",
            heading:
              "Creating interactions that feel intuitive, thoughtful, and emotionally aligned:",
            paragraphs: [
              "When touchpoints, process, and care align, patients don't just follow—they feel. That's the sweet spot where service becomes a bridge. Every interaction should communicate tone as much as function.",
              "Even the simplest detail—a soft curve of a button or the weight of a heading—can influence how someone experiences care. Structured protocols provide guidance, but it's the unexpected gestures that introduce warmth.",
              "Healthcare systems are often thought of as fixed, but the best ones are adaptive. They stretch to accommodate diverse needs, yet never lose coherence. They allow flexibility without losing integrity.",
            ],
          },
          finalThoughts: {
            label: "Final thoughts",
            heading:
              "Balancing order and creativity for expressive healthcare experiences:",
            paragraphs: [
              "Healthcare systems aren't rigid protocols or chaotic improvisation—they're frameworks that breathe, adapt, and respond. A process, when designed with intention, doesn't just deliver service—it elevates it.",
              "A well-designed system doesn't impose—it listens. It adjusts where it needs to. It responds to patient needs, staff workflows, and context. It creates structures that scale, yet feel personal.",
              "A thoughtful healthcare system doesn't flatten experience—it preserves humanity. It knows when to guide gently and when to empower. That balance is the hallmark of intentional care.",
            ],
          },
        },
      },
      voltara: {
        title: "Voltara",
        category: "Design",
        summary:
          "Building an energy ecosystem that's optimized, adaptive, and deeply connected.",
        industry: "Energy",
        spaceOfWork: "Design",
        timeline: "10 Weeks",
        sections: {
          introduction: {
            label: "Introduction",
            heading:
              "Exploring the possibilities of energy in flow and interaction through modern systems:",
            paragraphs: [
              "The evolution of energy networks reflects how we connect, move, and sustain in real-time. From smart grids to adaptive storage systems, energy has transcended static infrastructure.",
              "Modern technologies now offer advanced control, integrating reliability with efficiency. These choices affect not just output, but trust and perception. Energy becomes experience. Infrastructure becomes response.",
              "In a dynamic world, the craft of energy design now shapes how we feel, act, and connect.",
            ],
          },
          challenges: {
            label: "Challenges",
            heading:
              "The impact of adaptive energy systems on operational storytelling and stakeholder engagement:",
            paragraphs: [
              "Motion-led energy management enhances user and community experience by highlighting critical moments in supply and demand. Whether it's optimizing peak output or creating smooth transitions across grids, adaptive systems serve function without sacrificing reliability.",
              "These principles are rooted in intention: why this flow, this timing, this adjustment—right now? As networks expand and contexts diversify, the ability of energy systems to flex and adapt is essential.",
              "With every shift and adjustment, energy networks shape trust and confidence in subtle yet powerful ways.",
            ],
          },
          finalThoughts: {
            label: "Final thoughts",
            heading:
              "Practical applications of modern energy systems in operations and user experiences:",
            paragraphs: [
              "From smart grids to renewable integrations, responsive energy systems are becoming core to operational excellence. These aren't simply technical upgrades—they're design languages.",
              "Adaptive systems and predictive controls help maintain consistency across variable conditions. Paired with strategic monitoring frameworks, they allow operators to scale without compromising reliability.",
              "Energy management is now strategy, not just maintenance. And in the right hands, it becomes the most powerful voice in how communities experience power.",
            ],
          },
        },
      },
      lumeo: {
        title: "Lumeo",
        category: "Visual Identity",
        summary:
          "Minimal design isn't emptiness—it's focus, intention, and the subtle orchestration of space to highlight what truly matters.",
        industry: "Retail",
        spaceOfWork: "Visual Identity",
        timeline: "20 Weeks",
        sections: {
          introduction: {
            label: "Introduction",
            heading:
              "Defining minimalism as a tool, not just a trend, in modern retail:",
            paragraphs: [
              "This approach doesn't strip away meaning—it amplifies it. By removing excess decoration, we allow the product and experience to breathe. We highlight what matters. Every brand element becomes more than visual—it becomes intentional.",
              "Minimalism in retail isn't about doing less for the sake of it. It's about clarity, hierarchy, and the confidence to let great products speak for themselves.",
              "When space is used deliberately, every detail earns its place—and the brand feels sharper, calmer, and more memorable.",
            ],
          },
          challenges: {
            label: "Challenges",
            heading:
              "How reduction increases impact across retail touchpoints and digital experiences:",
            paragraphs: [
              "Minimalism enhances usability, especially in responsive retail platforms. With fewer elements, layouts adapt better across screens, loading faster and guiding customers with ease.",
              "It allows the product to remain the hero while the system supports discovery, trust, and conversion without visual noise.",
              "The challenge is restraint with purpose—knowing what to remove, what to keep, and how each choice shapes perception at every touchpoint.",
            ],
          },
          finalThoughts: {
            label: "Final thoughts",
            heading:
              "Blending function and emotion through visual silence and form in retail:",
            paragraphs: [
              "Great minimalism is emotional. It's not cold—it's calm. Negative space gives pause. Restraint creates presence. A minimal retail design invites thought.",
              "It makes you notice what's left, and value what's there. That quiet confidence is what turns a visual identity into a lasting brand language.",
              "When form and function align with emotion, minimal design becomes a competitive advantage—not a limitation.",
            ],
          },
        },
      },
    },
  },
  blog: {
    page: {
      headingLine1: "Insights &",
      headingLine2: "Growth Stories",
      description:
        "Practical marketing, branding, and digital growth insights for businesses in Iraq and the Arab world.",
      featured: "Featured Articles",
      allPosts: "All Articles",
    },
    detail: {
      by: "By",
      tags: "Tags",
      related: "Related Articles",
      cta: "Ready to grow your business with a full-service creative and marketing agency in Iraq?",
    },
  },
  growth: {
    newsletter: {
      label: "Newsletter",
      title: "Get growth insights in your inbox",
      namePlaceholder: "Your name (optional)",
      emailPlaceholder: "Your email",
      submit: "Subscribe",
      success: "Thank you for subscribing!",
    },
    inquiry: {
      title: "Service inquiry",
      name: "Your name",
      company: "Company",
      phone: "Phone",
      email: "Email",
      description: "Project description",
      budget: "Budget range",
      contactEmail: "Email",
      contactPhone: "Phone",
      contactWhatsApp: "WhatsApp",
      submit: "Send inquiry",
      success: "Thank you! We will contact you soon.",
      close: "Close",
      inquire: "Inquire",
    },
    budget: {
      under5k: "Under $5,000",
      range5k15k: "$5,000 – $15,000",
      range15k50k: "$15,000 – $50,000",
      range50k100k: "$50,000 – $100,000",
      over100k: "$100,000+",
      notSure: "Not sure yet",
    },
    proposal: {
      title: "Request a Proposal",
      step1: "Select services",
      step2: "Company details",
      step3: "Project goals",
      step4: "Budget range",
      step5: "Timeline",
      step6: "Review & submit",
      services: "Which services do you need?",
      company: "Company name",
      companyPlaceholder: "Your company",
      contactName: "Contact name",
      contactEmail: "Email",
      contactPhone: "Phone",
      goals: "Project goals",
      goalsPlaceholder: "Tell us about your goals and challenges",
      budget: "Budget range",
      timeline: "Timeline",
      timelinePlaceholder: "e.g. 4–8 weeks, Q3 launch",
      next: "Next",
      back: "Back",
      submit: "Submit request",
      success: "Thank you! Your proposal request has been received.",
    },
    projectInquiry: {
      title: "Project inquiry",
      submit: "Send inquiry",
      success: "Thank you! We will get back to you soon.",
    },
  },
  site: {
    address: "Iraq, Baghdad, Al Yarmouk",
    social: {
      facebook: "Facebook",
      instagram: "Instagram",
      linkedIn: "LinkedIn",
    },
  },
};
