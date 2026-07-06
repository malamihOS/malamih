"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BilingualField from "@/components/admin/BilingualField";
import FormField from "@/components/admin/FormField";
import ImageUpload from "@/components/admin/ImageUpload";
import SaveButton from "@/components/admin/SaveButton";
import { adminFetch } from "@/lib/admin-client";
import { DEFAULT_PROJECT_SECTIONS } from "@/lib/cms/normalize-project";
import type { Project } from "@prisma/client";

type ProjectFormProps = {
  project?: Project;
  onSaved?: (id: string) => void;
};

const DEFAULT_GALLERY = {
  hero: "",
  mosaicOne: { tall: "", top: "", bottom: "" },
  mosaicTwo: { top: "", bottom: "", tall: "" },
  wide: "",
};

export default function ProjectForm({ project, onSaved }: ProjectFormProps) {
  const router = useRouter();
  const isEdit = Boolean(project);

  const [slug, setSlug] = useState(project?.slug ?? "");
  const [titleEn, setTitleEn] = useState(project?.titleEn ?? "");
  const [titleAr, setTitleAr] = useState(project?.titleAr ?? "");
  const [shortDescEn, setShortDescEn] = useState(project?.shortDescEn ?? "");
  const [shortDescAr, setShortDescAr] = useState(project?.shortDescAr ?? "");
  const [categoryEn, setCategoryEn] = useState(project?.categoryEn ?? "");
  const [categoryAr, setCategoryAr] = useState(project?.categoryAr ?? "");
  const [industryEn, setIndustryEn] = useState(project?.industryEn ?? "");
  const [industryAr, setIndustryAr] = useState(project?.industryAr ?? "");
  const [spaceOfWorkEn, setSpaceOfWorkEn] = useState(project?.spaceOfWorkEn ?? "");
  const [spaceOfWorkAr, setSpaceOfWorkAr] = useState(project?.spaceOfWorkAr ?? "");
  const [timeline, setTimeline] = useState(project?.timeline ?? "");
  const [clientName, setClientName] = useState(project?.clientName ?? "");
  const [servicesUsed, setServicesUsed] = useState(project?.servicesUsed ?? "[]");
  const [year, setYear] = useState(project?.year ?? "");
  const [projectUrl, setProjectUrl] = useState(project?.projectUrl ?? "");
  const [coverImage, setCoverImage] = useState(project?.coverImage ?? "");
  const [galleryJson, setGalleryJson] = useState(
    project?.galleryJson ?? JSON.stringify(DEFAULT_GALLERY, null, 2),
  );
  const [sectionsJson, setSectionsJson] = useState(
    project?.sectionsJson ?? JSON.stringify(DEFAULT_PROJECT_SECTIONS, null, 2),
  );
  const [seoTitleEn, setSeoTitleEn] = useState(project?.seoTitleEn ?? "");
  const [seoTitleAr, setSeoTitleAr] = useState(project?.seoTitleAr ?? "");
  const [seoDescEn, setSeoDescEn] = useState(project?.seoDescEn ?? "");
  const [seoDescAr, setSeoDescAr] = useState(project?.seoDescAr ?? "");
  const [status, setStatus] = useState<"draft" | "published">(
    (project?.status as "draft" | "published") ?? "draft",
  );
  const [showOnHomepage, setShowOnHomepage] = useState(project?.showOnHomepage ?? false);
  const [sortOrder, setSortOrder] = useState(String(project?.sortOrder ?? 0));

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function buildPayload() {
    let gallery: unknown;
    let sections: unknown;
    let services: unknown;

    try {
      gallery = JSON.parse(galleryJson);
      sections = JSON.parse(sectionsJson);
      services = JSON.parse(servicesUsed);
    } catch {
      throw new Error("Invalid JSON in gallery, sections, or services fields");
    }

    return {
      slug,
      titleEn,
      titleAr,
      shortDescEn,
      shortDescAr,
      categoryEn,
      categoryAr,
      industryEn,
      industryAr,
      spaceOfWorkEn,
      spaceOfWorkAr,
      timeline,
      clientName,
      servicesUsed: services,
      year,
      projectUrl,
      coverImage,
      galleryJson: gallery,
      sectionsJson: sections,
      seoTitleEn,
      seoTitleAr,
      seoDescEn,
      seoDescAr,
      status,
      showOnHomepage,
      sortOrder: parseInt(sortOrder, 10) || 0,
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = buildPayload();
      const url = isEdit ? `/api/admin/projects/${project!.id}` : "/api/admin/projects";
      const method = isEdit ? "PUT" : "POST";

      const { data, error: saveError } = await adminFetch<{ project: Project }>(url, {
        method,
        body: JSON.stringify(payload),
      });

      if (saveError) {
        setError(saveError);
      } else {
        setSuccess(isEdit ? "Project updated." : "Project created.");
        const id = data?.project.id ?? project?.id;
        if (id) onSaved?.(id);
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }

    setLoading(false);
  }

  async function handleDelete() {
    if (!project || !confirm("Delete this project permanently?")) return;
    setDeleting(true);
    const { error: delError } = await adminFetch(`/api/admin/projects/${project.id}`, {
      method: "DELETE",
    });
    if (delError) {
      setError(delError);
      setDeleting(false);
    } else {
      router.push("/admin/projects");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="admin-card">
        <h2 className="admin-card-title">Basic info</h2>
        <FormField label="Slug" value={slug} onChange={setSlug} required hint="URL-friendly identifier, e.g. urban-glow" />
        <BilingualField label="Title" enName="titleEn" arName="titleAr" enValue={titleEn} arValue={titleAr} onEnChange={setTitleEn} onArChange={setTitleAr} required />
        <BilingualField label="Short description" enName="shortDescEn" arName="shortDescAr" enValue={shortDescEn} arValue={shortDescAr} onEnChange={setShortDescEn} onArChange={setShortDescAr} multiline />
        <BilingualField label="Category" enName="categoryEn" arName="categoryAr" enValue={categoryEn} arValue={categoryAr} onEnChange={setCategoryEn} onArChange={setCategoryAr} />
        <div className="admin-grid admin-grid-2">
          <div className="admin-form-group">
            <label className="admin-label">Status</label>
            <select className="admin-select" value={status} onChange={(e) => setStatus(e.target.value as "draft" | "published")}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <FormField label="Sort order" value={sortOrder} onChange={setSortOrder} type="number" />
        </div>
        <label className="admin-checkbox-row">
          <input type="checkbox" checked={showOnHomepage} onChange={(e) => setShowOnHomepage(e.target.checked)} />
          Show on homepage
        </label>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">Project details</h2>
        <BilingualField label="Industry" enName="industryEn" arName="industryAr" enValue={industryEn} arValue={industryAr} onEnChange={setIndustryEn} onArChange={setIndustryAr} />
        <BilingualField label="Space of work" enName="spaceEn" arName="spaceAr" enValue={spaceOfWorkEn} arValue={spaceOfWorkAr} onEnChange={setSpaceOfWorkEn} onArChange={setSpaceOfWorkAr} />
        <FormField label="Timeline" value={timeline} onChange={setTimeline} />
        <FormField label="Year" value={year} onChange={setYear} />
        <FormField label="Client name" value={clientName} onChange={setClientName} />
        <FormField label="Project URL" value={projectUrl} onChange={setProjectUrl} />
        <FormField label="Services used (JSON array)" value={servicesUsed} onChange={setServicesUsed} multiline hint='e.g. ["Branding", "Web Design"]' />
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">Media</h2>
        <ImageUpload label="Cover image" value={coverImage} onChange={setCoverImage} />
        <FormField label="Gallery JSON" value={galleryJson} onChange={setGalleryJson} multiline hint="hero, mosaicOne, mosaicTwo, wide structure from seed" />
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">Content sections</h2>
        <FormField label="Sections JSON" value={sectionsJson} onChange={setSectionsJson} multiline hint="introduction, challenges, finalThoughts with label/heading/paragraphs" />
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">SEO</h2>
        <BilingualField label="SEO title" enName="seoTitleEn" arName="seoTitleAr" enValue={seoTitleEn} arValue={seoTitleAr} onEnChange={setSeoTitleEn} onArChange={setSeoTitleAr} />
        <BilingualField label="SEO description" enName="seoDescEn" arName="seoDescAr" enValue={seoDescEn} arValue={seoDescAr} onEnChange={setSeoDescEn} onArChange={setSeoDescAr} multiline />
      </div>

      <div className="admin-form-actions">
        <SaveButton loading={loading} error={error} success={success} />
        {isEdit ? (
          <button type="button" className="admin-btn admin-btn-danger" disabled={deleting} onClick={() => void handleDelete()}>
            {deleting ? "Deleting…" : "Delete project"}
          </button>
        ) : null}
      </div>
    </form>
  );
}
