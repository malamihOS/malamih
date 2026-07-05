import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { prisma } from "@/lib/prisma";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
  });

  return (
    <>
      <AdminHeader title="Blog Posts">
        <Link href="/admin/blog/new" className="admin-btn admin-btn-primary admin-btn-sm">
          New post
        </Link>
      </AdminHeader>
      <div className="admin-content">
        <div className="admin-card admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Published</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>{post.titleEn}</td>
                  <td>{post.slug}</td>
                  <td>
                    <StatusBadge status={post.status} />
                  </td>
                  <td>{post.featured ? "Yes" : "No"}</td>
                  <td>{new Date(post.publishedAt).toLocaleDateString()}</td>
                  <td>
                    <Link href={`/admin/blog/${post.id}`} className="admin-btn admin-btn-secondary admin-btn-sm">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {posts.length === 0 ? <p className="admin-inline-hint">No blog posts yet.</p> : null}
        </div>
      </div>
    </>
  );
}
