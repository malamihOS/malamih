-- CreateTable
CREATE TABLE `Admin` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL DEFAULT '',
    `role` VARCHAR(191) NOT NULL DEFAULT 'admin',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoginAttempt` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `ipAddress` VARCHAR(191) NOT NULL DEFAULT '',
    `success` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MediaFile` (
    `id` VARCHAR(191) NOT NULL,
    `filename` VARCHAR(191) NOT NULL,
    `originalName` VARCHAR(191) NOT NULL DEFAULT '',
    `url` VARCHAR(191) NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL DEFAULT '',
    `size` INTEGER NOT NULL DEFAULT 0,
    `width` INTEGER NULL,
    `height` INTEGER NULL,
    `altEn` VARCHAR(191) NOT NULL DEFAULT '',
    `altAr` VARCHAR(191) NOT NULL DEFAULT '',
    `uploadedBy` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnalyticsEvent` (
    `id` VARCHAR(191) NOT NULL,
    `eventType` VARCHAR(191) NOT NULL DEFAULT 'page_view',
    `path` VARCHAR(191) NOT NULL,
    `locale` VARCHAR(191) NOT NULL DEFAULT 'en',
    `referrer` TEXT NOT NULL DEFAULT '',
    `userAgent` TEXT NOT NULL DEFAULT '',
    `deviceType` VARCHAR(191) NOT NULL DEFAULT 'desktop',
    `sessionId` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HeroConfig` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `headlineEn` VARCHAR(191) NOT NULL DEFAULT '',
    `headlineAr` VARCHAR(191) NOT NULL DEFAULT '',
    `descriptionEn` VARCHAR(191) NOT NULL DEFAULT '',
    `descriptionAr` VARCHAR(191) NOT NULL DEFAULT '',
    `ctaTextEn` VARCHAR(191) NOT NULL DEFAULT '',
    `ctaTextAr` VARCHAR(191) NOT NULL DEFAULT '',
    `ctaLink` VARCHAR(191) NOT NULL DEFAULT '',
    `tagline1En` VARCHAR(191) NOT NULL DEFAULT '',
    `tagline1Ar` VARCHAR(191) NOT NULL DEFAULT '',
    `tagline2En` VARCHAR(191) NOT NULL DEFAULT '',
    `tagline2Ar` VARCHAR(191) NOT NULL DEFAULT '',
    `categoriesEn` TEXT NOT NULL DEFAULT '[]',
    `categoriesAr` TEXT NOT NULL DEFAULT '[]',
    `brandNameEn` VARCHAR(191) NOT NULL DEFAULT 'malamih',
    `brandNameAr` VARCHAR(191) NOT NULL DEFAULT 'malamih',
    `brandCreativeEn` VARCHAR(191) NOT NULL DEFAULT 'Creative',
    `brandCreativeAr` VARCHAR(191) NOT NULL DEFAULT 'إبداعي',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HeroSlide` (
    `id` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `textEn` VARCHAR(191) NOT NULL DEFAULT '',
    `textAr` VARCHAR(191) NOT NULL DEFAULT '',
    `objectPosition` VARCHAR(191) NOT NULL DEFAULT 'center',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `visible` BOOLEAN NOT NULL DEFAULT true,
    `animationJson` TEXT NOT NULL DEFAULT '{}',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WhyMalamihConfig` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `labelEn` VARCHAR(191) NOT NULL DEFAULT '',
    `labelAr` VARCHAR(191) NOT NULL DEFAULT '',
    `titleLine1En` VARCHAR(191) NOT NULL DEFAULT '',
    `titleLine1Ar` VARCHAR(191) NOT NULL DEFAULT '',
    `titleLine2En` VARCHAR(191) NOT NULL DEFAULT '',
    `titleLine2Ar` VARCHAR(191) NOT NULL DEFAULT '',
    `descriptionEn` VARCHAR(191) NOT NULL DEFAULT '',
    `descriptionAr` VARCHAR(191) NOT NULL DEFAULT '',
    `videoUrl` VARCHAR(191) NOT NULL DEFAULT '',
    `commitmentHeadingEn` VARCHAR(191) NOT NULL DEFAULT '',
    `commitmentHeadingAr` VARCHAR(191) NOT NULL DEFAULT '',
    `commitmentDescEn` VARCHAR(191) NOT NULL DEFAULT '',
    `commitmentDescAr` VARCHAR(191) NOT NULL DEFAULT '',
    `marqueeLabelEn` VARCHAR(191) NOT NULL DEFAULT '',
    `marqueeLabelAr` VARCHAR(191) NOT NULL DEFAULT '',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WhyMalamihSlide` (
    `id` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `altEn` VARCHAR(191) NOT NULL DEFAULT '',
    `altAr` VARCHAR(191) NOT NULL DEFAULT '',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `visible` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WhyMalamihStat` (
    `id` VARCHAR(191) NOT NULL,
    `value` INTEGER NOT NULL,
    `suffix` VARCHAR(191) NOT NULL DEFAULT '',
    `labelEn` VARCHAR(191) NOT NULL DEFAULT '',
    `labelAr` VARCHAR(191) NOT NULL DEFAULT '',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `visible` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WhyMalamihCard` (
    `id` VARCHAR(191) NOT NULL,
    `titleEn` VARCHAR(191) NOT NULL DEFAULT '',
    `titleAr` VARCHAR(191) NOT NULL DEFAULT '',
    `descriptionEn` VARCHAR(191) NOT NULL DEFAULT '',
    `descriptionAr` VARCHAR(191) NOT NULL DEFAULT '',
    `imageUrl` VARCHAR(191) NOT NULL DEFAULT '',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `visible` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClientLogo` (
    `id` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `nameEn` VARCHAR(191) NOT NULL DEFAULT '',
    `nameAr` VARCHAR(191) NOT NULL DEFAULT '',
    `link` VARCHAR(191) NOT NULL DEFAULT '',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `visible` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TeamConfig` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `labelEn` VARCHAR(191) NOT NULL DEFAULT 'Our Team',
    `labelAr` VARCHAR(191) NOT NULL DEFAULT 'فريقنا',
    `headingEn` VARCHAR(191) NOT NULL DEFAULT 'Meet the Team',
    `headingAr` VARCHAR(191) NOT NULL DEFAULT 'تعرف على الفريق',
    `visible` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TeamMember` (
    `id` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `nameEn` VARCHAR(191) NOT NULL DEFAULT '',
    `nameAr` VARCHAR(191) NOT NULL DEFAULT '',
    `positionEn` VARCHAR(191) NOT NULL DEFAULT '',
    `positionAr` VARCHAR(191) NOT NULL DEFAULT '',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `visible` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Project` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `titleEn` VARCHAR(191) NOT NULL,
    `titleAr` VARCHAR(191) NOT NULL,
    `shortDescEn` TEXT NOT NULL DEFAULT '',
    `shortDescAr` TEXT NOT NULL DEFAULT '',
    `categoryEn` VARCHAR(191) NOT NULL DEFAULT '',
    `categoryAr` VARCHAR(191) NOT NULL DEFAULT '',
    `industryEn` VARCHAR(191) NOT NULL DEFAULT '',
    `industryAr` VARCHAR(191) NOT NULL DEFAULT '',
    `spaceOfWorkEn` VARCHAR(191) NOT NULL DEFAULT '',
    `spaceOfWorkAr` VARCHAR(191) NOT NULL DEFAULT '',
    `timeline` VARCHAR(191) NOT NULL DEFAULT '',
    `clientName` VARCHAR(191) NOT NULL DEFAULT '',
    `servicesUsed` TEXT NOT NULL DEFAULT '[]',
    `year` VARCHAR(191) NOT NULL DEFAULT '',
    `projectUrl` VARCHAR(191) NOT NULL DEFAULT '',
    `coverImage` VARCHAR(191) NOT NULL DEFAULT '',
    `galleryJson` TEXT NOT NULL DEFAULT '{}',
    `sectionsJson` TEXT NOT NULL DEFAULT '{}',
    `seoTitleEn` VARCHAR(191) NOT NULL DEFAULT '',
    `seoTitleAr` VARCHAR(191) NOT NULL DEFAULT '',
    `seoDescEn` VARCHAR(191) NOT NULL DEFAULT '',
    `seoDescAr` VARCHAR(191) NOT NULL DEFAULT '',
    `seoKeywordsEn` VARCHAR(191) NOT NULL DEFAULT '',
    `seoKeywordsAr` VARCHAR(191) NOT NULL DEFAULT '',
    `ogImageUrl` VARCHAR(191) NOT NULL DEFAULT '',
    `canonicalUrl` VARCHAR(191) NOT NULL DEFAULT '',
    `noIndex` BOOLEAN NOT NULL DEFAULT false,
    `status` VARCHAR(191) NOT NULL DEFAULT 'published',
    `showOnHomepage` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Project_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BlogPost` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `titleEn` VARCHAR(191) NOT NULL,
    `titleAr` VARCHAR(191) NOT NULL,
    `excerptEn` TEXT NOT NULL DEFAULT '',
    `excerptAr` TEXT NOT NULL DEFAULT '',
    `contentEn` TEXT NOT NULL DEFAULT '[]',
    `contentAr` TEXT NOT NULL DEFAULT '[]',
    `coverImage` VARCHAR(191) NOT NULL DEFAULT '',
    `coverAltEn` VARCHAR(191) NOT NULL DEFAULT '',
    `coverAltAr` VARCHAR(191) NOT NULL DEFAULT '',
    `categoryEn` VARCHAR(191) NOT NULL DEFAULT '',
    `categoryAr` VARCHAR(191) NOT NULL DEFAULT '',
    `categorySlug` VARCHAR(191) NOT NULL DEFAULT '',
    `tagsEn` VARCHAR(191) NOT NULL DEFAULT '[]',
    `tagsAr` VARCHAR(191) NOT NULL DEFAULT '[]',
    `author` VARCHAR(191) NOT NULL DEFAULT 'Malamih Creative Company',
    `publishedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `seoTitleEn` VARCHAR(191) NOT NULL DEFAULT '',
    `seoTitleAr` VARCHAR(191) NOT NULL DEFAULT '',
    `seoDescEn` VARCHAR(191) NOT NULL DEFAULT '',
    `seoDescAr` VARCHAR(191) NOT NULL DEFAULT '',
    `seoKeywordsEn` VARCHAR(191) NOT NULL DEFAULT '',
    `seoKeywordsAr` VARCHAR(191) NOT NULL DEFAULT '',
    `ogImageUrl` VARCHAR(191) NOT NULL DEFAULT '',
    `canonicalUrl` VARCHAR(191) NOT NULL DEFAULT '',
    `noIndex` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BlogPost_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PageSeo` (
    `pageKey` VARCHAR(191) NOT NULL,
    `seoTitleEn` VARCHAR(191) NOT NULL DEFAULT '',
    `seoTitleAr` VARCHAR(191) NOT NULL DEFAULT '',
    `seoDescEn` VARCHAR(191) NOT NULL DEFAULT '',
    `seoDescAr` VARCHAR(191) NOT NULL DEFAULT '',
    `seoKeywordsEn` VARCHAR(191) NOT NULL DEFAULT '',
    `seoKeywordsAr` VARCHAR(191) NOT NULL DEFAULT '',
    `ogImageUrl` VARCHAR(191) NOT NULL DEFAULT '',
    `canonicalUrlEn` VARCHAR(191) NOT NULL DEFAULT '',
    `canonicalUrlAr` VARCHAR(191) NOT NULL DEFAULT '',
    `noIndex` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`pageKey`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service` (
    `id` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NOT NULL DEFAULT '',
    `titleEn` VARCHAR(191) NOT NULL,
    `titleAr` VARCHAR(191) NOT NULL,
    `descriptionEn` TEXT NOT NULL DEFAULT '',
    `descriptionAr` TEXT NOT NULL DEFAULT '',
    `tagsEn` TEXT NOT NULL DEFAULT '[]',
    `tagsAr` TEXT NOT NULL DEFAULT '[]',
    `iconUrl` VARCHAR(191) NOT NULL DEFAULT '',
    `seoTitleEn` VARCHAR(191) NOT NULL DEFAULT '',
    `seoTitleAr` VARCHAR(191) NOT NULL DEFAULT '',
    `seoDescEn` VARCHAR(191) NOT NULL DEFAULT '',
    `seoDescAr` VARCHAR(191) NOT NULL DEFAULT '',
    `seoKeywordsEn` VARCHAR(191) NOT NULL DEFAULT '',
    `seoKeywordsAr` VARCHAR(191) NOT NULL DEFAULT '',
    `ogImageUrl` VARCHAR(191) NOT NULL DEFAULT '',
    `canonicalUrl` VARCHAR(191) NOT NULL DEFAULT '',
    `noIndex` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `visible` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactSettings` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `phones` TEXT NOT NULL DEFAULT '[]',
    `whatsappNumbers` TEXT NOT NULL DEFAULT '[]',
    `emails` TEXT NOT NULL DEFAULT '[]',
    `addressEn` VARCHAR(191) NOT NULL DEFAULT '',
    `addressAr` VARCHAR(191) NOT NULL DEFAULT '',
    `mapsUrl` VARCHAR(191) NOT NULL DEFAULT '',
    `socialLinks` TEXT NOT NULL DEFAULT '[]',
    `workingHoursEn` VARCHAR(191) NOT NULL DEFAULT '',
    `workingHoursAr` VARCHAR(191) NOT NULL DEFAULT '',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactSubmission` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL DEFAULT '',
    `company` VARCHAR(191) NOT NULL DEFAULT '',
    `subject` VARCHAR(191) NOT NULL DEFAULT '',
    `message` TEXT NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'new',
    `formType` VARCHAR(191) NOT NULL DEFAULT 'contact',
    `sourcePage` VARCHAR(191) NOT NULL DEFAULT '',
    `metadataJson` TEXT NOT NULL DEFAULT '{}',
    `utmSource` VARCHAR(191) NOT NULL DEFAULT '',
    `utmMedium` VARCHAR(191) NOT NULL DEFAULT '',
    `utmCampaign` VARCHAR(191) NOT NULL DEFAULT '',
    `utmContent` VARCHAR(191) NOT NULL DEFAULT '',
    `utmTerm` VARCHAR(191) NOT NULL DEFAULT '',
    `leadId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lead` (
    `id` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `companyName` VARCHAR(191) NOT NULL DEFAULT '',
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL DEFAULT '',
    `whatsApp` VARCHAR(191) NOT NULL DEFAULT '',
    `city` VARCHAR(191) NOT NULL DEFAULT '',
    `country` VARCHAR(191) NOT NULL DEFAULT '',
    `industry` VARCHAR(191) NOT NULL DEFAULT '',
    `leadSource` VARCHAR(191) NOT NULL DEFAULT 'manual',
    `interestedServices` TEXT NOT NULL DEFAULT '[]',
    `budgetRange` VARCHAR(191) NOT NULL DEFAULT '',
    `notes` TEXT NOT NULL DEFAULT '',
    `status` VARCHAR(191) NOT NULL DEFAULT 'new',
    `priority` VARCHAR(191) NOT NULL DEFAULT 'medium',
    `assignedTo` VARCHAR(191) NOT NULL DEFAULT '',
    `score` INTEGER NOT NULL DEFAULT 0,
    `qualityLabel` VARCHAR(191) NOT NULL DEFAULT 'cold',
    `utmSource` VARCHAR(191) NOT NULL DEFAULT '',
    `utmMedium` VARCHAR(191) NOT NULL DEFAULT '',
    `utmCampaign` VARCHAR(191) NOT NULL DEFAULT '',
    `utmContent` VARCHAR(191) NOT NULL DEFAULT '',
    `utmTerm` VARCHAR(191) NOT NULL DEFAULT '',
    `lastContactDate` DATETIME(3) NULL,
    `nextFollowUpDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NewsletterSubscriber` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL DEFAULT '',
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `sourcePage` VARCHAR(191) NOT NULL DEFAULT '',
    `utmSource` VARCHAR(191) NOT NULL DEFAULT '',
    `utmMedium` VARCHAR(191) NOT NULL DEFAULT '',
    `utmCampaign` VARCHAR(191) NOT NULL DEFAULT '',
    `utmContent` VARCHAR(191) NOT NULL DEFAULT '',
    `utmTerm` VARCHAR(191) NOT NULL DEFAULT '',
    `leadId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `NewsletterSubscriber_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LeadMagnet` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `titleEn` VARCHAR(191) NOT NULL,
    `titleAr` VARCHAR(191) NOT NULL,
    `descriptionEn` VARCHAR(191) NOT NULL DEFAULT '',
    `descriptionAr` VARCHAR(191) NOT NULL DEFAULT '',
    `coverImage` VARCHAR(191) NOT NULL DEFAULT '',
    `fileUrl` VARCHAR(191) NOT NULL DEFAULT '',
    `relatedService` VARCHAR(191) NOT NULL DEFAULT '',
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `LeadMagnet_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LeadMagnetDownload` (
    `id` VARCHAR(191) NOT NULL,
    `leadMagnetId` VARCHAR(191) NOT NULL,
    `leadId` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL DEFAULT '',
    `company` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProposalRequest` (
    `id` VARCHAR(191) NOT NULL,
    `leadId` VARCHAR(191) NULL,
    `contactSubmissionId` VARCHAR(191) NOT NULL DEFAULT '',
    `companyName` VARCHAR(191) NOT NULL DEFAULT '',
    `contactName` VARCHAR(191) NOT NULL DEFAULT '',
    `contactEmail` VARCHAR(191) NOT NULL DEFAULT '',
    `contactPhone` VARCHAR(191) NOT NULL DEFAULT '',
    `selectedServices` TEXT NOT NULL DEFAULT '[]',
    `goals` TEXT NOT NULL DEFAULT '',
    `budgetRange` VARCHAR(191) NOT NULL DEFAULT '',
    `timeline` VARCHAR(191) NOT NULL DEFAULT '',
    `status` VARCHAR(191) NOT NULL DEFAULT 'new',
    `utmSource` VARCHAR(191) NOT NULL DEFAULT '',
    `utmMedium` VARCHAR(191) NOT NULL DEFAULT '',
    `utmCampaign` VARCHAR(191) NOT NULL DEFAULT '',
    `utmContent` VARCHAR(191) NOT NULL DEFAULT '',
    `utmTerm` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LandingPage` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `titleEn` VARCHAR(191) NOT NULL,
    `titleAr` VARCHAR(191) NOT NULL,
    `headlineEn` VARCHAR(191) NOT NULL DEFAULT '',
    `headlineAr` VARCHAR(191) NOT NULL DEFAULT '',
    `descriptionEn` TEXT NOT NULL DEFAULT '',
    `descriptionAr` TEXT NOT NULL DEFAULT '',
    `coverImage` VARCHAR(191) NOT NULL DEFAULT '',
    `coverVideo` VARCHAR(191) NOT NULL DEFAULT '',
    `relatedService` VARCHAR(191) NOT NULL DEFAULT '',
    `ctaTextEn` VARCHAR(191) NOT NULL DEFAULT 'Get Started',
    `ctaTextAr` VARCHAR(191) NOT NULL DEFAULT 'ابدأ الآن',
    `formFieldsJson` TEXT NOT NULL DEFAULT '[]',
    `seoTitleEn` VARCHAR(191) NOT NULL DEFAULT '',
    `seoTitleAr` VARCHAR(191) NOT NULL DEFAULT '',
    `seoDescEn` VARCHAR(191) NOT NULL DEFAULT '',
    `seoDescAr` VARCHAR(191) NOT NULL DEFAULT '',
    `status` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `LandingPage_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SiteSettings` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `websiteNameEn` VARCHAR(191) NOT NULL DEFAULT 'malamih',
    `websiteNameAr` VARCHAR(191) NOT NULL DEFAULT 'malamih',
    `logoUrl` VARCHAR(191) NOT NULL DEFAULT '',
    `faviconUrl` VARCHAR(191) NOT NULL DEFAULT '',
    `defaultSeoTitleEn` VARCHAR(191) NOT NULL DEFAULT '',
    `defaultSeoTitleAr` VARCHAR(191) NOT NULL DEFAULT '',
    `defaultSeoDescEn` VARCHAR(191) NOT NULL DEFAULT '',
    `defaultSeoDescAr` VARCHAR(191) NOT NULL DEFAULT '',
    `defaultSeoKeywordsEn` VARCHAR(191) NOT NULL DEFAULT '',
    `defaultSeoKeywordsAr` VARCHAR(191) NOT NULL DEFAULT '',
    `ogImageUrl` VARCHAR(191) NOT NULL DEFAULT '',
    `siteUrl` VARCHAR(191) NOT NULL DEFAULT 'https://malamih.net',
    `headerMenuJson` TEXT NOT NULL DEFAULT '[]',
    `footerContentJson` TEXT NOT NULL DEFAULT '{}',
    `footerLinksJson` TEXT NOT NULL DEFAULT '[]',
    `homeProjectsJson` TEXT NOT NULL DEFAULT '{}',
    `contactPageJson` TEXT NOT NULL DEFAULT '{}',
    `smtpHost` VARCHAR(191) NOT NULL DEFAULT '',
    `smtpPort` INTEGER NOT NULL DEFAULT 587,
    `smtpUser` VARCHAR(191) NOT NULL DEFAULT '',
    `smtpPass` VARCHAR(191) NOT NULL DEFAULT '',
    `smtpFromEmail` VARCHAR(191) NOT NULL DEFAULT '',
    `smtpFromName` VARCHAR(191) NOT NULL DEFAULT '',
    `smtpEnabled` BOOLEAN NOT NULL DEFAULT false,
    `notifyEmail` VARCHAR(191) NOT NULL DEFAULT '',
    `googleAnalyticsId` VARCHAR(191) NOT NULL DEFAULT '',
    `googleTagManagerId` VARCHAR(191) NOT NULL DEFAULT '',
    `metaPixelId` VARCHAR(191) NOT NULL DEFAULT '',
    `tiktokPixelId` VARCHAR(191) NOT NULL DEFAULT '',
    `linkedInInsightTag` VARCHAR(191) NOT NULL DEFAULT '',
    `googleSiteVerification` VARCHAR(191) NOT NULL DEFAULT '',
    `metaDomainVerification` VARCHAR(191) NOT NULL DEFAULT '',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ContactSubmission` ADD CONSTRAINT `ContactSubmission_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Lead`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NewsletterSubscriber` ADD CONSTRAINT `NewsletterSubscriber_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Lead`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeadMagnetDownload` ADD CONSTRAINT `LeadMagnetDownload_leadMagnetId_fkey` FOREIGN KEY (`leadMagnetId`) REFERENCES `LeadMagnet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeadMagnetDownload` ADD CONSTRAINT `LeadMagnetDownload_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Lead`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProposalRequest` ADD CONSTRAINT `ProposalRequest_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Lead`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

