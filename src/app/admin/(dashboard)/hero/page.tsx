"use client";

import { useCallback, useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import BilingualField from "@/components/admin/BilingualField";
import FormField from "@/components/admin/FormField";
import ImageUpload from "@/components/admin/ImageUpload";
import SaveButton from "@/components/admin/SaveButton";
import { adminFetch, parseJsonField } from "@/lib/admin-client";

type HeroSlide = {
  id?: string;
  imageUrl: string;
  textEn: string;
  textAr: string;
  objectPosition: string;
  sortOrder: number;
  visible: boolean;
  animationJson: string;
};

type HeroConfig = {
  headlineEn: string;
  headlineAr: string;
  descriptionEn: string;
  descriptionAr: string;
  ctaTextEn: string;
  ctaTextAr: string;
  ctaLink: string;
  tagline1En: string;
  tagline1Ar: string;
  tagline2En: string;
  tagline2Ar: string;
  categoriesEn: string;
  categoriesAr: string;
  brandNameEn: string;
  brandNameAr: string;
  brandCreativeEn: string;
  brandCreativeAr: string;
};

const EMPTY_CONFIG: HeroConfig = {
  headlineEn: "",
  headlineAr: "",
  descriptionEn: "",
  descriptionAr: "",
  ctaTextEn: "",
  ctaTextAr: "",
  ctaLink: "",
  tagline1En: "",
  tagline1Ar: "",
  tagline2En: "",
  tagline2Ar: "",
  categoriesEn: "[]",
  categoriesAr: "[]",
  brandNameEn: "",
  brandNameAr: "",
  brandCreativeEn: "",
  brandCreativeAr: "",
};

export default function HeroAdminPage() {
  const [config, setConfig] = useState<HeroConfig>(EMPTY_CONFIG);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: fetchError } = await adminFetch<{
      config: HeroConfig | null;
      slides: HeroSlide[];
    }>("/api/admin/hero");
    if (fetchError) {
      setError(fetchError);
    } else if (data) {
      setConfig(data.config ?? EMPTY_CONFIG);
      setSlides(data.slides);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function updateConfig<K extends keyof HeroConfig>(key: K, value: HeroConfig[K]) {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }

  function updateSlide(index: number, patch: Partial<HeroSlide>) {
    setSlides((prev) =>
      prev.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    );
  }

  function addSlide() {
    setSlides((prev) => [
      ...prev,
      {
        imageUrl: "",
        textEn: "",
        textAr: "",
        objectPosition: "center",
        sortOrder: prev.length,
        visible: true,
        animationJson: "{}",
      },
    ]);
  }

  function removeSlide(index: number) {
    setSlides((prev) =>
      prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, sortOrder: i })),
    );
  }

  function moveSlide(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= slides.length) return;
    setSlides((prev) => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((s, i) => ({ ...s, sortOrder: i }));
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const payload = {
      config: {
        ...config,
        categoriesEn: parseJsonField<string[]>(config.categoriesEn, []),
        categoriesAr: parseJsonField<string[]>(config.categoriesAr, []),
      },
      slides,
    };

    const { error: saveError } = await adminFetch("/api/admin/hero", {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    if (saveError) {
      setError(saveError);
    } else {
      setSuccess("Hero section saved successfully.");
      void load();
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <>
        <AdminHeader title="Hero Section" subtitle="Headline, slides, and call-to-action on the homepage." />
        <div className="admin-content">Loading…</div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Hero Section" subtitle="Headline, slides, and call-to-action on the homepage." />
      <div className="admin-content">
        <form onSubmit={handleSave}>
          <div className="admin-card">
            <h2 className="admin-card-title">Headline & CTA</h2>
            <BilingualField
              label="Headline"
              enName="headlineEn"
              arName="headlineAr"
              enValue={config.headlineEn}
              arValue={config.headlineAr}
              onEnChange={(v) => updateConfig("headlineEn", v)}
              onArChange={(v) => updateConfig("headlineAr", v)}
            />
            <BilingualField
              label="Description"
              enName="descriptionEn"
              arName="descriptionAr"
              enValue={config.descriptionEn}
              arValue={config.descriptionAr}
              onEnChange={(v) => updateConfig("descriptionEn", v)}
              onArChange={(v) => updateConfig("descriptionAr", v)}
              multiline
            />
            <p className="admin-inline-hint">
              Shown in the hero tagline area (bottom right). Leave empty to use Tagline 1 and Tagline 2 instead.
            </p>
            <BilingualField
              label="CTA Text"
              enName="ctaTextEn"
              arName="ctaTextAr"
              enValue={config.ctaTextEn}
              arValue={config.ctaTextAr}
              onEnChange={(v) => updateConfig("ctaTextEn", v)}
              onArChange={(v) => updateConfig("ctaTextAr", v)}
            />
            <FormField
              label="CTA Link"
              value={config.ctaLink}
              onChange={(v) => updateConfig("ctaLink", v)}
            />
          </div>

          <div className="admin-card">
            <h2 className="admin-card-title">Taglines & Brand</h2>
            <BilingualField
              label="Tagline 1"
              enName="tagline1En"
              arName="tagline1Ar"
              enValue={config.tagline1En}
              arValue={config.tagline1Ar}
              onEnChange={(v) => updateConfig("tagline1En", v)}
              onArChange={(v) => updateConfig("tagline1Ar", v)}
            />
            <BilingualField
              label="Tagline 2"
              enName="tagline2En"
              arName="tagline2Ar"
              enValue={config.tagline2En}
              arValue={config.tagline2Ar}
              onEnChange={(v) => updateConfig("tagline2En", v)}
              onArChange={(v) => updateConfig("tagline2Ar", v)}
            />
            <BilingualField
              label="Brand Name"
              enName="brandNameEn"
              arName="brandNameAr"
              enValue={config.brandNameEn}
              arValue={config.brandNameAr}
              onEnChange={(v) => updateConfig("brandNameEn", v)}
              onArChange={(v) => updateConfig("brandNameAr", v)}
            />
            <BilingualField
              label="Brand Creative"
              enName="brandCreativeEn"
              arName="brandCreativeAr"
              enValue={config.brandCreativeEn}
              arValue={config.brandCreativeAr}
              onEnChange={(v) => updateConfig("brandCreativeEn", v)}
              onArChange={(v) => updateConfig("brandCreativeAr", v)}
            />
            <FormField
              label="Categories (EN) — JSON array"
              value={config.categoriesEn}
              onChange={(v) => updateConfig("categoriesEn", v)}
              hint='e.g. ["Branding", "Web Design"]'
            />
            <FormField
              label="Categories (AR) — JSON array"
              value={config.categoriesAr}
              onChange={(v) => updateConfig("categoriesAr", v)}
              dir="rtl"
            />
          </div>

          <div className="admin-card">
            <div className="admin-list-item-header">
              <h2 className="admin-card-title" style={{ margin: 0 }}>
                Slides
              </h2>
              <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={addSlide}>
                Add slide
              </button>
            </div>

            {slides.map((slide, index) => (
              <div key={slide.id ?? `new-${index}`} className="admin-list-item">
                <div className="admin-list-item-header">
                  <strong>Slide {index + 1}</strong>
                  <div className="admin-list-item-actions">
                    <button type="button" className="admin-btn admin-btn-secondary admin-btn-icon admin-btn-sm" onClick={() => moveSlide(index, -1)} disabled={index === 0}>↑</button>
                    <button type="button" className="admin-btn admin-btn-secondary admin-btn-icon admin-btn-sm" onClick={() => moveSlide(index, 1)} disabled={index === slides.length - 1}>↓</button>
                    <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => removeSlide(index)}>Remove</button>
                  </div>
                </div>
                <ImageUpload
                  label="Slide image"
                  value={slide.imageUrl}
                  onChange={(url) => updateSlide(index, { imageUrl: url })}
                />
                <BilingualField
                  label="Overlay text"
                  enName={`slideTextEn-${index}`}
                  arName={`slideTextAr-${index}`}
                  enValue={slide.textEn}
                  arValue={slide.textAr}
                  onEnChange={(v) => updateSlide(index, { textEn: v })}
                  onArChange={(v) => updateSlide(index, { textAr: v })}
                />
                <FormField
                  label="Object position"
                  value={slide.objectPosition}
                  onChange={(v) => updateSlide(index, { objectPosition: v })}
                  hint="CSS object-position, e.g. center or 68.3% 36.4%"
                />
                <FormField
                  label="Animation JSON"
                  value={slide.animationJson}
                  onChange={(v) => updateSlide(index, { animationJson: v })}
                  multiline
                />
                <label className="admin-checkbox-row">
                  <input
                    type="checkbox"
                    checked={slide.visible}
                    onChange={(e) => updateSlide(index, { visible: e.target.checked })}
                  />
                  Visible
                </label>
              </div>
            ))}
          </div>

          <SaveButton loading={saving} error={error} success={success} />
        </form>
      </div>
    </>
  );
}
