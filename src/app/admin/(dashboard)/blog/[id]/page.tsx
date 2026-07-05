import { notFound } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import BlogForm from "@/components/admin/BlogForm";
import { prisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminEditBlogPage({ params }: PageProps) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div>
      <AdminHeader title={`Edit: ${post.titleEn}`} />
      <BlogForm post={post} />
    </div>
  );
}
