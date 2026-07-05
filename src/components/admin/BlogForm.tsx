"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BilingualField from "@/components/admin/BilingualField";
import FormField from "@/components/admin/FormField";
import ImageUpload from "@/components/admin/ImageUpload";
import SaveButton from "@/components/admin/SaveButton";
import { adminFetch } from "@/lib/admin-client";
import type { BlogPost } from "@prisma/client";

type BlogFormProps = {
  post?: BlogPost;
};

export default function BlogForm({ post }: BlogFormProps) {
  const router = useRouter();
  const isEdit = Boolean(post);

  const [slug, setSlug] = useState(post?.slug ?? "");
  const [titleEn, setTitleEn] = useState(post?.titleEn ?? "");
  const [titleAr, setTitleAr] = useState(post?.titleAr ?? "");
  const [excerptEn, setExcerptEn] = useState(post?.excerptEn ?? "");
  const [excerptAr, setExcerptAr] = useState(post?.excerptAr ?? "");
  const [contentEn, setContentEn] = useState(post?.contentEn ?? "[]");
  const [contentAr, setContentAr] = useState(post?.contentAr ?? "[]");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [coverAltEn, setCoverAltEn] = useState(post?.coverAltEn ?? "");
  const [coverAltAr, setCoverAltAr] = useState(post?.coverAltAr ?? "");
  const [categoryEn, setCategoryEn] = useState(post?.categoryEn ?? "");
  const [categoryAr, setCategoryAr] = useState(post?.categoryAr ?? "");
  const [categorySlug, setCategorySlug] = useState(post?.categorySlug ?? "");
  const [tagsEn, setTagsEn] = useState(post?.tagsEn ?? "[]");
  const [tagsAr, setTagsAr] = useState(post?.tagsAr ?? "[]");
  const [author, setAuthor] = useState(post?.author ?? "Malamih Creative Company");
  const [publishedAt, setPublishedAt] = useState(
    post?.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
  );
  const [status, setStatus] = useState<"draft" | "published">(
    (post?.status as "draft" | "published") ?? "draft",
  );
  const [featured, setFeatured] = useState(post?.featured ?? false);
  const [seoTitleEn, setSeoTitleEn] = useState(post?.seoTitleEn ?? "");
  const [seoTitleAr, setSeoTitleAr] = useState(post?.seoTitleAr ?? "");
  const [seoDescEn, setSeoDescEn] = useState(post?.seoDescEn ?? "");
  const [seoDescAr, setSeoDescAr] = useState(post?.seoDescAr ?? "");
  const [seoKeywordsEn, setSeoKeywordsEn] = useState(post?.seoKeywordsEn ?? "");
  const [seoKeywordsAr, setSeoKeywordsAr] = useState(post?.seoKeywordsAr ?? "");
  const [ogImageUrl, setOgImageUrl] = useState(post?.ogImageUrl ?? "");
  const [canonicalUrl, setCanonicalUrl] = useState(post?.canonicalUrl ?? "");
  const [noIndex, setNoIndex] = useState(post?.noIndex ?? false);
  const [sortOrder, setSortOrder] = useState(String(post?.sortOrder ?? 0));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      JSON.parse(contentEn);
      JSON.parse(contentAr);
      JSON.parse(tagsEn);
      JSON.parse(tagsAr);
    } catch {
      setError("Invalid JSON in content or tags fields");
      setLoading(false);
      return;
    }

    const payload = {
      slug,
      titleEn,
      titleAr,
      excerptEn,
      excerptAr,
      contentEn,
      contentAr,
      coverImage,
      coverAltEn,
      coverAltAr,
      categoryEn,
      categoryAr,
      categorySlug,
      tagsEn,
      tagsAr,
      author,
      publishedAt: new Date(publishedAt).toISOString(),
      status,
      featured,
      seoTitleEn,
      seoTitleAr,
      seoDescEn,
      seoDescAr,
      seoKeywordsEn,
      seoKeywordsAr,
      ogImageUrl,
      canonicalUrl,
      noIndex,
      sortOrder: Number(sortOrder) || 0,
    };

    const result = await adminFetch<{ post: BlogPost }>(
      isEdit ? `/api/admin/blog/${post!.id}` : "/api/admin/blog",
      {
        method: isEdit ? "PUT" : "POST",
        body: JSON.stringify(payload),
      },
    );

    if (result.error) {
      throw new Error(result.error);
    }

    const saved = result.data?.post;
    if (!saved) throw new Error("Save failed");
    setSuccess("Saved successfully");
    if (!isEdit) {
      router.push(`/admin/blog/${saved.id}`);
    }
    router.refresh();
    setLoading(false);
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      {error ? <p className="admin-error">{error}</p> : null}
      {success ? <p className="admin-success">{success}</p> : null}

      <FormField label="Slug" value={slug} onChange={setSlug} required />
      <BilingualField label="Title" enName="titleEn" arName="titleAr" enValue={titleEn} arValue={titleAr} onEnChange={setTitleEn} onArChange={setTitleAr} required />
      <BilingualField label="Excerpt" enName="excerptEn" arName="excerptAr" enValue={excerptEn} arValue={excerptAr} onEnChange={setExcerptEn} onArChange={setExcerptAr} multiline />

      <FormField label="Content EN (JSON blocks)" value={contentEn} onChange={setContentEn} multiline />
      <FormField label="Content AR (JSON blocks)" value={contentAr} onChange={setContentAr} multiline />

      <ImageUpload label="Cover Image" value={coverImage} onChange={setCoverImage} />
      <BilingualField label="Cover Alt" enName="coverAltEn" arName="coverAltAr" enValue={coverAltEn} arValue={coverAltAr} onEnChange={setCoverAltEn} onArChange={setCoverAltAr} />

      <BilingualField label="Category" enName="categoryEn" arName="categoryAr" enValue={categoryEn} arValue={categoryAr} onEnChange={setCategoryEn} onArChange={setCategoryAr} />
      <FormField label="Category Slug" value={categorySlug} onChange={setCategorySlug} />

      <FormField label="Tags EN (JSON array)" value={tagsEn} onChange={setTagsEn} multiline />
      <FormField label="Tags AR (JSON array)" value={tagsAr} onChange={setTagsAr} multiline />

      <FormField label="Author" value={author} onChange={setAuthor} />
      <FormField label="Published Date" value={publishedAt} onChange={setPublishedAt} />

      <div className="admin-form-group">
        <label className="admin-label">Status</label>
        <select
          className="admin-input"
          value={status}
          onChange={(e) => setStatus(e.target.value as "draft" | "published")}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="admin-form-row">
        <label className="admin-checkbox">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          Featured
        </label>
        <label className="admin-checkbox">
          <input type="checkbox" checked={noIndex} onChange={(e) => setNoIndex(e.target.checked)} />
          No Index
        </label>
      </div>

      <h3 className="admin-section-title">SEO</h3>
      <BilingualField label="SEO Title" enName="seoTitleEn" arName="seoTitleAr" enValue={seoTitleEn} arValue={seoTitleAr} onEnChange={setSeoTitleEn} onArChange={setSeoTitleAr} />
      <BilingualField label="SEO Description" enName="seoDescEn" arName="seoDescAr" enValue={seoDescEn} arValue={seoDescAr} onEnChange={setSeoDescEn} onArChange={setSeoDescAr} multiline />
      <BilingualField label="SEO Keywords" enName="seoKeywordsEn" arName="seoKeywordsAr" enValue={seoKeywordsEn} arValue={seoKeywordsAr} onEnChange={setSeoKeywordsEn} onArChange={setSeoKeywordsAr} />
      <ImageUpload label="Open Graph Image" value={ogImageUrl} onChange={setOgImageUrl} />
      <FormField label="Canonical URL (optional)" value={canonicalUrl} onChange={setCanonicalUrl} />
      <FormField label="Sort Order" value={sortOrder} onChange={setSortOrder} type="number" />

      <SaveButton loading={loading} label={isEdit ? "Update Post" : "Create Post"} />
    </form>
  );
}
