-- DropForeignKey
ALTER TABLE "LeadMagnetDownload" DROP CONSTRAINT "LeadMagnetDownload_leadMagnetId_fkey";

-- DropForeignKey
ALTER TABLE "LeadMagnetDownload" DROP CONSTRAINT "LeadMagnetDownload_leadId_fkey";

-- DropTable
DROP TABLE "LeadMagnetDownload";

-- DropTable
DROP TABLE "LeadMagnet";
