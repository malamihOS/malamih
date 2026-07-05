-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginAttempt" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL DEFAULT '',
    "success" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaFile" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL DEFAULT '',
    "url" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL DEFAULT '',
    "size" INTEGER NOT NULL DEFAULT 0,
    "width" INTEGER,
    "height" INTEGER,
    "altEn" TEXT NOT NULL DEFAULT '',
    "altAr" TEXT NOT NULL DEFAULT '',
    "uploadedBy" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL DEFAULT 'page_view',
    "path" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "referrer" TEXT NOT NULL DEFAULT '',
    "userAgent" TEXT NOT NULL DEFAULT '',
    "deviceType" TEXT NOT NULL DEFAULT 'desktop',
    "sessionId" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeroConfig" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "headlineEn" TEXT NOT NULL DEFAULT '',
    "headlineAr" TEXT NOT NULL DEFAULT '',
    "descriptionEn" TEXT NOT NULL DEFAULT '',
    "descriptionAr" TEXT NOT NULL DEFAULT '',
    "ctaTextEn" TEXT NOT NULL DEFAULT '',
    "ctaTextAr" TEXT NOT NULL DEFAULT '',
    "ctaLink" TEXT NOT NULL DEFAULT '',
    "tagline1En" TEXT NOT NULL DEFAULT '',
    "tagline1Ar" TEXT NOT NULL DEFAULT '',
    "tagline2En" TEXT NOT NULL DEFAULT '',
    "tagline2Ar" TEXT NOT NULL DEFAULT '',
    "categoriesEn" TEXT NOT NULL DEFAULT '[]',
    "categoriesAr" TEXT NOT NULL DEFAULT '[]',
    "brandNameEn" TEXT NOT NULL DEFAULT 'malamih',
    "brandNameAr" TEXT NOT NULL DEFAULT 'malamih',
    "brandCreativeEn" TEXT NOT NULL DEFAULT 'Creative',
    "brandCreativeAr" TEXT NOT NULL DEFAULT 'إبداعي',

    CONSTRAINT "HeroConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeroSlide" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "textEn" TEXT NOT NULL DEFAULT '',
    "textAr" TEXT NOT NULL DEFAULT '',
    "objectPosition" TEXT NOT NULL DEFAULT 'center',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "animationJson" TEXT NOT NULL DEFAULT '{}',

    CONSTRAINT "HeroSlide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhyMalamihConfig" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "labelEn" TEXT NOT NULL DEFAULT '',
    "labelAr" TEXT NOT NULL DEFAULT '',
    "titleLine1En" TEXT NOT NULL DEFAULT '',
    "titleLine1Ar" TEXT NOT NULL DEFAULT '',
    "titleLine2En" TEXT NOT NULL DEFAULT '',
    "titleLine2Ar" TEXT NOT NULL DEFAULT '',
    "descriptionEn" TEXT NOT NULL DEFAULT '',
    "descriptionAr" TEXT NOT NULL DEFAULT '',
    "videoUrl" TEXT NOT NULL DEFAULT '',
    "commitmentHeadingEn" TEXT NOT NULL DEFAULT '',
    "commitmentHeadingAr" TEXT NOT NULL DEFAULT '',
    "commitmentDescEn" TEXT NOT NULL DEFAULT '',
    "commitmentDescAr" TEXT NOT NULL DEFAULT '',
    "marqueeLabelEn" TEXT NOT NULL DEFAULT '',
    "marqueeLabelAr" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "WhyMalamihConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhyMalamihSlide" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "altEn" TEXT NOT NULL DEFAULT '',
    "altAr" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "WhyMalamihSlide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhyMalamihStat" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "suffix" TEXT NOT NULL DEFAULT '',
    "labelEn" TEXT NOT NULL DEFAULT '',
    "labelAr" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "WhyMalamihStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhyMalamihCard" (
    "id" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL DEFAULT '',
    "titleAr" TEXT NOT NULL DEFAULT '',
    "descriptionEn" TEXT NOT NULL DEFAULT '',
    "descriptionAr" TEXT NOT NULL DEFAULT '',
    "imageUrl" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "WhyMalamihCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientLogo" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL DEFAULT '',
    "nameAr" TEXT NOT NULL DEFAULT '',
    "link" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ClientLogo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamConfig" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "labelEn" TEXT NOT NULL DEFAULT 'Our Team',
    "labelAr" TEXT NOT NULL DEFAULT 'فريقنا',
    "headingEn" TEXT NOT NULL DEFAULT 'Meet the Team',
    "headingAr" TEXT NOT NULL DEFAULT 'تعرف على الفريق',
    "visible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "TeamConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL DEFAULT '',
    "nameAr" TEXT NOT NULL DEFAULT '',
    "positionEn" TEXT NOT NULL DEFAULT '',
    "positionAr" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "shortDescEn" TEXT NOT NULL DEFAULT '',
    "shortDescAr" TEXT NOT NULL DEFAULT '',
    "categoryEn" TEXT NOT NULL DEFAULT '',
    "categoryAr" TEXT NOT NULL DEFAULT '',
    "industryEn" TEXT NOT NULL DEFAULT '',
    "industryAr" TEXT NOT NULL DEFAULT '',
    "spaceOfWorkEn" TEXT NOT NULL DEFAULT '',
    "spaceOfWorkAr" TEXT NOT NULL DEFAULT '',
    "timeline" TEXT NOT NULL DEFAULT '',
    "clientName" TEXT NOT NULL DEFAULT '',
    "servicesUsed" TEXT NOT NULL DEFAULT '[]',
    "year" TEXT NOT NULL DEFAULT '',
    "projectUrl" TEXT NOT NULL DEFAULT '',
    "coverImage" TEXT NOT NULL DEFAULT '',
    "galleryJson" TEXT NOT NULL DEFAULT '{}',
    "sectionsJson" TEXT NOT NULL DEFAULT '{}',
    "seoTitleEn" TEXT NOT NULL DEFAULT '',
    "seoTitleAr" TEXT NOT NULL DEFAULT '',
    "seoDescEn" TEXT NOT NULL DEFAULT '',
    "seoDescAr" TEXT NOT NULL DEFAULT '',
    "seoKeywordsEn" TEXT NOT NULL DEFAULT '',
    "seoKeywordsAr" TEXT NOT NULL DEFAULT '',
    "ogImageUrl" TEXT NOT NULL DEFAULT '',
    "canonicalUrl" TEXT NOT NULL DEFAULT '',
    "noIndex" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'published',
    "showOnHomepage" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "excerptEn" TEXT NOT NULL DEFAULT '',
    "excerptAr" TEXT NOT NULL DEFAULT '',
    "contentEn" TEXT NOT NULL DEFAULT '[]',
    "contentAr" TEXT NOT NULL DEFAULT '[]',
    "coverImage" TEXT NOT NULL DEFAULT '',
    "coverAltEn" TEXT NOT NULL DEFAULT '',
    "coverAltAr" TEXT NOT NULL DEFAULT '',
    "categoryEn" TEXT NOT NULL DEFAULT '',
    "categoryAr" TEXT NOT NULL DEFAULT '',
    "categorySlug" TEXT NOT NULL DEFAULT '',
    "tagsEn" TEXT NOT NULL DEFAULT '[]',
    "tagsAr" TEXT NOT NULL DEFAULT '[]',
    "author" TEXT NOT NULL DEFAULT 'Malamih Creative Company',
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "seoTitleEn" TEXT NOT NULL DEFAULT '',
    "seoTitleAr" TEXT NOT NULL DEFAULT '',
    "seoDescEn" TEXT NOT NULL DEFAULT '',
    "seoDescAr" TEXT NOT NULL DEFAULT '',
    "seoKeywordsEn" TEXT NOT NULL DEFAULT '',
    "seoKeywordsAr" TEXT NOT NULL DEFAULT '',
    "ogImageUrl" TEXT NOT NULL DEFAULT '',
    "canonicalUrl" TEXT NOT NULL DEFAULT '',
    "noIndex" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageSeo" (
    "pageKey" TEXT NOT NULL,
    "seoTitleEn" TEXT NOT NULL DEFAULT '',
    "seoTitleAr" TEXT NOT NULL DEFAULT '',
    "seoDescEn" TEXT NOT NULL DEFAULT '',
    "seoDescAr" TEXT NOT NULL DEFAULT '',
    "seoKeywordsEn" TEXT NOT NULL DEFAULT '',
    "seoKeywordsAr" TEXT NOT NULL DEFAULT '',
    "ogImageUrl" TEXT NOT NULL DEFAULT '',
    "canonicalUrlEn" TEXT NOT NULL DEFAULT '',
    "canonicalUrlAr" TEXT NOT NULL DEFAULT '',
    "noIndex" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PageSeo_pkey" PRIMARY KEY ("pageKey")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL DEFAULT '',
    "titleEn" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL DEFAULT '',
    "descriptionAr" TEXT NOT NULL DEFAULT '',
    "tagsEn" TEXT NOT NULL DEFAULT '[]',
    "tagsAr" TEXT NOT NULL DEFAULT '[]',
    "iconUrl" TEXT NOT NULL DEFAULT '',
    "seoTitleEn" TEXT NOT NULL DEFAULT '',
    "seoTitleAr" TEXT NOT NULL DEFAULT '',
    "seoDescEn" TEXT NOT NULL DEFAULT '',
    "seoDescAr" TEXT NOT NULL DEFAULT '',
    "seoKeywordsEn" TEXT NOT NULL DEFAULT '',
    "seoKeywordsAr" TEXT NOT NULL DEFAULT '',
    "ogImageUrl" TEXT NOT NULL DEFAULT '',
    "canonicalUrl" TEXT NOT NULL DEFAULT '',
    "noIndex" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "phones" TEXT NOT NULL DEFAULT '[]',
    "whatsappNumbers" TEXT NOT NULL DEFAULT '[]',
    "emails" TEXT NOT NULL DEFAULT '[]',
    "addressEn" TEXT NOT NULL DEFAULT '',
    "addressAr" TEXT NOT NULL DEFAULT '',
    "mapsUrl" TEXT NOT NULL DEFAULT '',
    "socialLinks" TEXT NOT NULL DEFAULT '[]',
    "workingHoursEn" TEXT NOT NULL DEFAULT '',
    "workingHoursAr" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "ContactSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactSubmission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "company" TEXT NOT NULL DEFAULT '',
    "subject" TEXT NOT NULL DEFAULT '',
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "formType" TEXT NOT NULL DEFAULT 'contact',
    "sourcePage" TEXT NOT NULL DEFAULT '',
    "metadataJson" TEXT NOT NULL DEFAULT '{}',
    "utmSource" TEXT NOT NULL DEFAULT '',
    "utmMedium" TEXT NOT NULL DEFAULT '',
    "utmCampaign" TEXT NOT NULL DEFAULT '',
    "utmContent" TEXT NOT NULL DEFAULT '',
    "utmTerm" TEXT NOT NULL DEFAULT '',
    "leadId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "companyName" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "whatsApp" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "country" TEXT NOT NULL DEFAULT '',
    "industry" TEXT NOT NULL DEFAULT '',
    "leadSource" TEXT NOT NULL DEFAULT 'manual',
    "interestedServices" TEXT NOT NULL DEFAULT '[]',
    "budgetRange" TEXT NOT NULL DEFAULT '',
    "notes" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'new',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "assignedTo" TEXT NOT NULL DEFAULT '',
    "score" INTEGER NOT NULL DEFAULT 0,
    "qualityLabel" TEXT NOT NULL DEFAULT 'cold',
    "utmSource" TEXT NOT NULL DEFAULT '',
    "utmMedium" TEXT NOT NULL DEFAULT '',
    "utmCampaign" TEXT NOT NULL DEFAULT '',
    "utmContent" TEXT NOT NULL DEFAULT '',
    "utmTerm" TEXT NOT NULL DEFAULT '',
    "lastContactDate" TIMESTAMP(3),
    "nextFollowUpDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsletterSubscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'active',
    "sourcePage" TEXT NOT NULL DEFAULT '',
    "utmSource" TEXT NOT NULL DEFAULT '',
    "utmMedium" TEXT NOT NULL DEFAULT '',
    "utmCampaign" TEXT NOT NULL DEFAULT '',
    "utmContent" TEXT NOT NULL DEFAULT '',
    "utmTerm" TEXT NOT NULL DEFAULT '',
    "leadId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadMagnet" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL DEFAULT '',
    "descriptionAr" TEXT NOT NULL DEFAULT '',
    "coverImage" TEXT NOT NULL DEFAULT '',
    "fileUrl" TEXT NOT NULL DEFAULT '',
    "relatedService" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'active',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadMagnet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadMagnetDownload" (
    "id" TEXT NOT NULL,
    "leadMagnetId" TEXT NOT NULL,
    "leadId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "company" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadMagnetDownload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProposalRequest" (
    "id" TEXT NOT NULL,
    "leadId" TEXT,
    "contactSubmissionId" TEXT NOT NULL DEFAULT '',
    "companyName" TEXT NOT NULL DEFAULT '',
    "contactName" TEXT NOT NULL DEFAULT '',
    "contactEmail" TEXT NOT NULL DEFAULT '',
    "contactPhone" TEXT NOT NULL DEFAULT '',
    "selectedServices" TEXT NOT NULL DEFAULT '[]',
    "goals" TEXT NOT NULL DEFAULT '',
    "budgetRange" TEXT NOT NULL DEFAULT '',
    "timeline" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'new',
    "utmSource" TEXT NOT NULL DEFAULT '',
    "utmMedium" TEXT NOT NULL DEFAULT '',
    "utmCampaign" TEXT NOT NULL DEFAULT '',
    "utmContent" TEXT NOT NULL DEFAULT '',
    "utmTerm" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProposalRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LandingPage" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "headlineEn" TEXT NOT NULL DEFAULT '',
    "headlineAr" TEXT NOT NULL DEFAULT '',
    "descriptionEn" TEXT NOT NULL DEFAULT '',
    "descriptionAr" TEXT NOT NULL DEFAULT '',
    "coverImage" TEXT NOT NULL DEFAULT '',
    "coverVideo" TEXT NOT NULL DEFAULT '',
    "relatedService" TEXT NOT NULL DEFAULT '',
    "ctaTextEn" TEXT NOT NULL DEFAULT 'Get Started',
    "ctaTextAr" TEXT NOT NULL DEFAULT 'ابدأ الآن',
    "formFieldsJson" TEXT NOT NULL DEFAULT '[]',
    "seoTitleEn" TEXT NOT NULL DEFAULT '',
    "seoTitleAr" TEXT NOT NULL DEFAULT '',
    "seoDescEn" TEXT NOT NULL DEFAULT '',
    "seoDescAr" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LandingPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "websiteNameEn" TEXT NOT NULL DEFAULT 'malamih',
    "websiteNameAr" TEXT NOT NULL DEFAULT 'malamih',
    "logoUrl" TEXT NOT NULL DEFAULT '',
    "faviconUrl" TEXT NOT NULL DEFAULT '',
    "defaultSeoTitleEn" TEXT NOT NULL DEFAULT '',
    "defaultSeoTitleAr" TEXT NOT NULL DEFAULT '',
    "defaultSeoDescEn" TEXT NOT NULL DEFAULT '',
    "defaultSeoDescAr" TEXT NOT NULL DEFAULT '',
    "defaultSeoKeywordsEn" TEXT NOT NULL DEFAULT '',
    "defaultSeoKeywordsAr" TEXT NOT NULL DEFAULT '',
    "ogImageUrl" TEXT NOT NULL DEFAULT '',
    "siteUrl" TEXT NOT NULL DEFAULT 'https://malamih.net',
    "headerMenuJson" TEXT NOT NULL DEFAULT '[]',
    "footerContentJson" TEXT NOT NULL DEFAULT '{}',
    "footerLinksJson" TEXT NOT NULL DEFAULT '[]',
    "homeProjectsJson" TEXT NOT NULL DEFAULT '{}',
    "contactPageJson" TEXT NOT NULL DEFAULT '{}',
    "smtpHost" TEXT NOT NULL DEFAULT '',
    "smtpPort" INTEGER NOT NULL DEFAULT 587,
    "smtpUser" TEXT NOT NULL DEFAULT '',
    "smtpPass" TEXT NOT NULL DEFAULT '',
    "smtpFromEmail" TEXT NOT NULL DEFAULT '',
    "smtpFromName" TEXT NOT NULL DEFAULT '',
    "smtpEnabled" BOOLEAN NOT NULL DEFAULT false,
    "notifyEmail" TEXT NOT NULL DEFAULT '',
    "googleAnalyticsId" TEXT NOT NULL DEFAULT '',
    "googleTagManagerId" TEXT NOT NULL DEFAULT '',
    "metaPixelId" TEXT NOT NULL DEFAULT '',
    "tiktokPixelId" TEXT NOT NULL DEFAULT '',
    "linkedInInsightTag" TEXT NOT NULL DEFAULT '',
    "googleSiteVerification" TEXT NOT NULL DEFAULT '',
    "metaDomainVerification" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");

-- CreateIndex
CREATE UNIQUE INDEX "LeadMagnet_slug_key" ON "LeadMagnet"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "LandingPage_slug_key" ON "LandingPage"("slug");

-- AddForeignKey
ALTER TABLE "ContactSubmission" ADD CONSTRAINT "ContactSubmission_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsletterSubscriber" ADD CONSTRAINT "NewsletterSubscriber_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadMagnetDownload" ADD CONSTRAINT "LeadMagnetDownload_leadMagnetId_fkey" FOREIGN KEY ("leadMagnetId") REFERENCES "LeadMagnet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadMagnetDownload" ADD CONSTRAINT "LeadMagnetDownload_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalRequest" ADD CONSTRAINT "ProposalRequest_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;
