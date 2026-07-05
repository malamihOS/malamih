import AdminHeader from "@/components/admin/AdminHeader";
import BlogForm from "@/components/admin/BlogForm";

export default function AdminNewBlogPage() {
  return (
    <div>
      <AdminHeader title="New Blog Post" />
      <BlogForm />
    </div>
  );
}
