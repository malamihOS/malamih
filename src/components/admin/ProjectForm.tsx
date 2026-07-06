"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BilingualField from "@/components/admin/BilingualField";
import FormField from "@/components/admin/FormField";
import ImageUpload from "@/components/admin/ImageUpload";
import ProjectImagePosition from "@/components/admin/ProjectImagePosition";
import SaveButton from "@/components/admin/SaveButton";
import { adminFetch } from "@/lib/admin-client";
import {
  GALLERY_IMAGE_ASPECT,
  type GalleryImageKey,
} from "@/lib/cms/gallery-position";
import {
  PROJECT_SECTION_KEYS,
  PROJECT_SECTION_META,
  parseGalleryFromProject,
  parseSectionsFromProject,
  parseServicesField,
  serializeGallery,
  serializeSections,
  serializeServicesField,
  type GalleryFormState,
  type ProjectSectionKey,
  type SectionFormState,
  type SectionsFormState,
} from "@/lib/cms/project-form";
import type { Project } from "@prisma/client";

type ProjectFormProps = {
  project?: Project;
  onSaved?: (id: string) => void;
};

function GalleryImageField({
  label,
  imageKey,
  value,
  onChange,
  position,
  onPositionChange,
  hint,
}: {
  label: string;
  imageKey: GalleryImageKey;
  value: string;
  onChange: (value: string) => void;
  position: string;
  onPositionChange: (value: string) => void;
  hint?: string;
}) {
  return (
    <div className="admin-gallery-slot">
      <ImageUpload label={label} value={value} onChange={onChange} hint={hint} />
      {value ? (
        <ProjectImagePosition
          imageUrl={value}
          value={position}
          onChange={onPositionChange}
          aspectRatio={GALLERY_IMAGE_ASPECT[imageKey]}
        />
      ) : null}
    </div>
  );
}

function ProjectSectionEditor({
  sectionKey,
  section,
  onChange,
}: {
  sectionKey: ProjectSectionKey;
  section: SectionFormState;
  onChange: (next: SectionFormState) => void;
}) {
  const meta = PROJECT_SECTION_META[sectionKey];

  return (
    <div className="admin-project-subsection">
      <h3 className="admin-project-subsection-title">{meta.title}</h3>
      <BilingualField
        label="Section label"
        enName={`${sectionKey}LabelEn`}
        arName={`${sectionKey}LabelAr`}
        enValue={section.labelEn}
        arValue={section.labelAr}
        onEnChange={(value) => onChange({ ...section, labelEn: value })}
        onArChange={(value) => onChange({ ...section, labelAr: value })}
      />
      <BilingualField
        label="Heading"
        enName={`${sectionKey}HeadingEn`}
        arName={`${sectionKey}HeadingAr`}
        enValue={section.headingEn}
        arValue={section.headingAr}
        onEnChange={(value) => onChange({ ...section, headingEn: value })}
        onArChange={(value) => onChange({ ...section, headingAr: value })}
        multiline
      />
      <BilingualField
        label="Paragraphs"
        enName={`${sectionKey}ParagraphsEn`}
        arName={`${sectionKey}ParagraphsAr`}
        enValue={section.paragraphsEn}
        arValue={section.paragraphsAr}
        onEnChange={(value) => onChange({ ...section, paragraphsEn: value })}
        onArChange={(value) => onChange({ ...section, paragraphsAr: value })}
        multiline
      />
      <p className="admin-inline-hint">
        Separate paragraphs with a blank line — each block becomes its own paragraph on the project page.
      </p>
    </div>
  );
}

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
  const [servicesUsed, setServicesUsed] = useState(
    parseServicesField(project?.servicesUsed ?? "[]"),
  );
  const [year, setYear] = useState(project?.year ?? "");
  const [projectUrl, setProjectUrl] = useState(project?.projectUrl ?? "");
  const [coverImage, setCoverImage] = useState(project?.coverImage ?? "");
  const [gallery, setGallery] = useState<GalleryFormState>(() =>
    parseGalleryFromProject(project?.galleryJson, project?.coverImage ?? ""),
  );
  const [sections, setSections] = useState<SectionsFormState>(() =>
    parseSectionsFromProject(project?.sectionsJson),
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

  function updateSection(sectionKey: ProjectSectionKey, next: SectionFormState) {
    setSections((current) => ({ ...current, [sectionKey]: next }));
  }

  function updateMosaicOne(field: keyof GalleryFormState["mosaicOne"], value: string) {
    setGallery((current) => ({
      ...current,
      mosaicOne: { ...current.mosaicOne, [field]: value },
    }));
  }

  function updateMosaicTwo(field: keyof GalleryFormState["mosaicTwo"], value: string) {
    setGallery((current) => ({
      ...current,
      mosaicTwo: { ...current.mosaicTwo, [field]: value },
    }));
  }

  function updatePosition(imageKey: GalleryImageKey, position: string) {
    setGallery((current) => ({
      ...current,
      positions: { ...current.positions, [imageKey]: position },
    }));
  }

  function buildPayload() {
    const effectiveCover = coverImage || gallery.hero;
    const galleryPayload = serializeGallery(gallery, effectiveCover);

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
      servicesUsed: serializeServicesField(servicesUsed),
      year,
      projectUrl,
      coverImage: effectiveCover,
      galleryJson: galleryPayload,
      sectionsJson: serializeSections(sections),
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
        <FormField
          label="Slug"
          value={slug}
          onChange={setSlug}
          required
          hint="URL-friendly identifier, e.g. wild-tiger"
        />
        <BilingualField
          label="Title"
          enName="titleEn"
          arName="titleAr"
          enValue={titleEn}
          arValue={titleAr}
          onEnChange={setTitleEn}
          onArChange={setTitleAr}
          required
        />
        <BilingualField
          label="Short description"
          enName="shortDescEn"
          arName="shortDescAr"
          enValue={shortDescEn}
          arValue={shortDescAr}
          onEnChange={setShortDescEn}
          onArChange={setShortDescAr}
          multiline
        />
        <BilingualField
          label="Category"
          enName="categoryEn"
          arName="categoryAr"
          enValue={categoryEn}
          arValue={categoryAr}
          onEnChange={setCategoryEn}
          onArChange={setCategoryAr}
        />
        <div className="admin-grid admin-grid-2">
          <div className="admin-form-group">
            <label className="admin-label">Status</label>
            <select
              className="admin-select"
              value={status}
              onChange={(e) => setStatus(e.target.value as "draft" | "published")}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <FormField label="Sort order" value={sortOrder} onChange={setSortOrder} type="number" />
        </div>
        <label className="admin-checkbox-row">
          <input
            type="checkbox"
            checked={showOnHomepage}
            onChange={(e) => setShowOnHomepage(e.target.checked)}
          />
          Show on homepage
        </label>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">Project details</h2>
        <BilingualField
          label="Industry"
          enName="industryEn"
          arName="industryAr"
          enValue={industryEn}
          arValue={industryAr}
          onEnChange={setIndustryEn}
          onArChange={setIndustryAr}
        />
        <BilingualField
          label="Space of work"
          enName="spaceEn"
          arName="spaceAr"
          enValue={spaceOfWorkEn}
          arValue={spaceOfWorkAr}
          onEnChange={setSpaceOfWorkEn}
          onArChange={setSpaceOfWorkAr}
        />
        <FormField label="Timeline" value={timeline} onChange={setTimeline} />
        <FormField label="Year" value={year} onChange={setYear} />
        <FormField label="Client name" value={clientName} onChange={setClientName} />
        <FormField label="Project URL" value={projectUrl} onChange={setProjectUrl} />
        <FormField
          label="Services used"
          value={servicesUsed}
          onChange={setServicesUsed}
          hint='Comma-separated, e.g. Branding, Web Design, Photography'
        />
      </div>

      <div className="admin-card">
        <div className="admin-card-head">
          <h2 className="admin-card-title">Page gallery</h2>
          <p className="admin-card-desc">
            Upload images in the same layout as the Lumeo demo — hero, two mosaic groups, and a wide image.
          </p>
        </div>
        <GalleryImageField
          label="Cover image (project card)"
          imageKey="cover"
          value={coverImage}
          onChange={setCoverImage}
          position={gallery.positions.cover}
          onPositionChange={(value) => updatePosition("cover", value)}
          hint="Shown on the projects list and homepage cards."
        />
        <GalleryImageField
          label="Hero image"
          imageKey="hero"
          value={gallery.hero}
          onChange={(value) => setGallery((current) => ({ ...current, hero: value }))}
          position={gallery.positions.hero}
          onPositionChange={(value) => updatePosition("hero", value)}
          hint="Large image at the top of the project page. Uses cover image if left empty."
        />

        <div className="admin-project-subsection">
          <h3 className="admin-project-subsection-title">Mosaic group 1</h3>
          <div className="admin-grid admin-grid-3">
            <GalleryImageField
              label="Tall (left)"
              imageKey="mosaicOne.tall"
              value={gallery.mosaicOne.tall}
              onChange={(value) => updateMosaicOne("tall", value)}
              position={gallery.positions["mosaicOne.tall"]}
              onPositionChange={(value) => updatePosition("mosaicOne.tall", value)}
            />
            <GalleryImageField
              label="Top (right)"
              imageKey="mosaicOne.top"
              value={gallery.mosaicOne.top}
              onChange={(value) => updateMosaicOne("top", value)}
              position={gallery.positions["mosaicOne.top"]}
              onPositionChange={(value) => updatePosition("mosaicOne.top", value)}
            />
            <GalleryImageField
              label="Bottom (right)"
              imageKey="mosaicOne.bottom"
              value={gallery.mosaicOne.bottom}
              onChange={(value) => updateMosaicOne("bottom", value)}
              position={gallery.positions["mosaicOne.bottom"]}
              onPositionChange={(value) => updatePosition("mosaicOne.bottom", value)}
            />
          </div>
        </div>

        <div className="admin-project-subsection">
          <h3 className="admin-project-subsection-title">Mosaic group 2</h3>
          <div className="admin-grid admin-grid-3">
            <GalleryImageField
              label="Top (left)"
              imageKey="mosaicTwo.top"
              value={gallery.mosaicTwo.top}
              onChange={(value) => updateMosaicTwo("top", value)}
              position={gallery.positions["mosaicTwo.top"]}
              onPositionChange={(value) => updatePosition("mosaicTwo.top", value)}
            />
            <GalleryImageField
              label="Bottom (left)"
              imageKey="mosaicTwo.bottom"
              value={gallery.mosaicTwo.bottom}
              onChange={(value) => updateMosaicTwo("bottom", value)}
              position={gallery.positions["mosaicTwo.bottom"]}
              onPositionChange={(value) => updatePosition("mosaicTwo.bottom", value)}
            />
            <GalleryImageField
              label="Tall (right)"
              imageKey="mosaicTwo.tall"
              value={gallery.mosaicTwo.tall}
              onChange={(value) => updateMosaicTwo("tall", value)}
              position={gallery.positions["mosaicTwo.tall"]}
              onPositionChange={(value) => updatePosition("mosaicTwo.tall", value)}
            />
          </div>
        </div>

        <div className="admin-project-subsection">
          <GalleryImageField
            label="Wide image"
            imageKey="wide"
            value={gallery.wide}
            onChange={(value) => setGallery((current) => ({ ...current, wide: value }))}
            position={gallery.positions.wide}
            onPositionChange={(value) => updatePosition("wide", value)}
            hint="Full-width image before the text sections."
          />
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-head">
          <h2 className="admin-card-title">Content sections</h2>
          <p className="admin-card-desc">
            Introduction, challenges, and final thoughts — same structure as the Lumeo project page.
          </p>
        </div>
        {PROJECT_SECTION_KEYS.map((sectionKey) => (
          <ProjectSectionEditor
            key={sectionKey}
            sectionKey={sectionKey}
            section={sections[sectionKey]}
            onChange={(next) => updateSection(sectionKey, next)}
          />
        ))}
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">SEO</h2>
        <BilingualField
          label="SEO title"
          enName="seoTitleEn"
          arName="seoTitleAr"
          enValue={seoTitleEn}
          arValue={seoTitleAr}
          onEnChange={setSeoTitleEn}
          onArChange={setSeoTitleAr}
        />
        <BilingualField
          label="SEO description"
          enName="seoDescEn"
          arName="seoDescAr"
          enValue={seoDescEn}
          arValue={seoDescAr}
          onEnChange={setSeoDescEn}
          onArChange={setSeoDescAr}
          multiline
        />
      </div>

      <div className="admin-form-actions">
        <SaveButton loading={loading} error={error} success={success} />
        {isEdit ? (
          <button
            type="button"
            className="admin-btn admin-btn-danger"
            disabled={deleting}
            onClick={() => void handleDelete()}
          >
            {deleting ? "Deleting…" : "Delete project"}
          </button>
        ) : null}
      </div>
    </form>
  );
}
