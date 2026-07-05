import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { BLOG_POSTS_SEED } from "./data/blog-seed";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.blogPost.count();
  if (count > 0) {
    console.log(`BlogPost table already has ${count} row(s), skipping blog seed.`);
    return;
  }

  for (const [index, post] of BLOG_POSTS_SEED.entries()) {
    await prisma.blogPost.create({
      data: {
        slug: post.slug,
        titleEn: post.titleEn,
        titleAr: post.titleAr,
        excerptEn: post.excerptEn,
        excerptAr: post.excerptAr,
        contentEn: JSON.stringify(post.contentEn),
        contentAr: JSON.stringify(post.contentAr),
        coverImage: post.coverImage,
        coverAltEn: post.coverAltEn,
        coverAltAr: post.coverAltAr,
        categoryEn: post.categoryEn,
        categoryAr: post.categoryAr,
        categorySlug: post.categorySlug,
        tagsEn: JSON.stringify(post.tagsEn),
        tagsAr: JSON.stringify(post.tagsAr),
        author: post.author,
        publishedAt: new Date(post.publishedAt),
        status: "published",
        featured: post.featured,
        seoTitleEn: post.seoTitleEn,
        seoTitleAr: post.seoTitleAr,
        seoDescEn: post.seoDescEn,
        seoDescAr: post.seoDescAr,
        seoKeywordsEn: post.seoKeywordsEn,
        seoKeywordsAr: post.seoKeywordsAr,
        sortOrder: index,
      },
    });
  }

  console.log(`Seeded ${BLOG_POSTS_SEED.length} blog posts successfully.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
