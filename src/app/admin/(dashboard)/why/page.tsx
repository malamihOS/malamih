"use client";

import { useCallback, useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import BilingualField from "@/components/admin/BilingualField";
import FormField from "@/components/admin/FormField";
import ImageUpload from "@/components/admin/ImageUpload";
import SaveButton from "@/components/admin/SaveButton";
import { adminFetch } from "@/lib/admin-client";

type WhyConfig = {
  labelEn: string;
  labelAr: string;
  titleLine1En: string;
  titleLine1Ar: string;
  titleLine2En: string;
  titleLine2Ar: string;
  descriptionEn: string;
  descriptionAr: string;
  videoUrl: string;
  commitmentHeadingEn: string;
  commitmentHeadingAr: string;
  commitmentDescEn: string;
  commitmentDescAr: string;
  marqueeLabelEn: string;
  marqueeLabelAr: string;
};

type WhySlide = {
  id?: string;
  imageUrl: string;
  altEn: string;
  altAr: string;
  sortOrder: number;
  visible: boolean;
};

type WhyStat = {
  id?: string;
  value: number;
  suffix: string;
  labelEn: string;
  labelAr: string;
  sortOrder: number;
  visible: boolean;
};

type WhyCard = {
  id?: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  imageUrl: string;
  sortOrder: number;
  visible: boolean;
};

const EMPTY_CONFIG: WhyConfig = {
  labelEn: "",
  labelAr: "",
  titleLine1En: "",
  titleLine1Ar: "",
  titleLine2En: "",
  titleLine2Ar: "",
  descriptionEn: "",
  descriptionAr: "",
  videoUrl: "",
  commitmentHeadingEn: "",
  commitmentHeadingAr: "",
  commitmentDescEn: "",
  commitmentDescAr: "",
  marqueeLabelEn: "",
  marqueeLabelAr: "",
};

export default function WhyAdminPage() {
  const [config, setConfig] = useState<WhyConfig>(EMPTY_CONFIG);
  const [slides, setSlides] = useState<WhySlide[]>([]);
  const [stats, setStats] = useState<WhyStat[]>([]);
  const [cards, setCards] = useState<WhyCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: fetchError } = await adminFetch<{
      config: WhyConfig | null;
      slides: WhySlide[];
      stats: WhyStat[];
      cards: WhyCard[];
    }>("/api/admin/why");
    if (fetchError) setError(fetchError);
    else if (data) {
      setConfig(data.config ?? EMPTY_CONFIG);
      setSlides(data.slides);
      setStats(data.stats);
      setCards(data.cards);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function updateConfig<K extends keyof WhyConfig>(key: K, value: WhyConfig[K]) {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }

  function reorder<T extends { sortOrder: number }>(
    items: T[],
    setItems: (v: T[]) => void,
    index: number,
    direction: -1 | 1,
  ) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next.map((s, i) => ({ ...s, sortOrder: i })));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const { error: saveError } = await adminFetch("/api/admin/why", {
      method: "PUT",
      body: JSON.stringify({ config, slides, stats, cards }),
    });

    if (saveError) setError(saveError);
    else {
      setSuccess("Why Malamih section saved.");
      void load();
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <>
        <AdminHeader title="Why Malamih" />
        <div className="admin-content">Loading…</div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Why Malamih" />
      <div className="admin-content">
        <form onSubmit={handleSave}>
          <div className="admin-card">
            <h2 className="admin-card-title">Why Section</h2>
            <BilingualField label="Label" enName="labelEn" arName="labelAr" enValue={config.labelEn} arValue={config.labelAr} onEnChange={(v) => updateConfig("labelEn", v)} onArChange={(v) => updateConfig("labelAr", v)} />
            <BilingualField label="Title line 1" enName="titleLine1En" arName="titleLine1Ar" enValue={config.titleLine1En} arValue={config.titleLine1Ar} onEnChange={(v) => updateConfig("titleLine1En", v)} onArChange={(v) => updateConfig("titleLine1Ar", v)} />
            <BilingualField label="Title line 2" enName="titleLine2En" arName="titleLine2Ar" enValue={config.titleLine2En} arValue={config.titleLine2Ar} onEnChange={(v) => updateConfig("titleLine2En", v)} onArChange={(v) => updateConfig("titleLine2Ar", v)} />
            <BilingualField label="Description" enName="descriptionEn" arName="descriptionAr" enValue={config.descriptionEn} arValue={config.descriptionAr} onEnChange={(v) => updateConfig("descriptionEn", v)} onArChange={(v) => updateConfig("descriptionAr", v)} multiline />
            <ImageUpload label="Video" value={config.videoUrl} onChange={(v) => updateConfig("videoUrl", v)} accept="video/mp4,video/webm,image/*" hint="Upload MP4 or paste video URL" />
          </div>

          <div className="admin-card">
            <h2 className="admin-card-title">Commitment</h2>
            <BilingualField label="Heading" enName="commitmentHeadingEn" arName="commitmentHeadingAr" enValue={config.commitmentHeadingEn} arValue={config.commitmentHeadingAr} onEnChange={(v) => updateConfig("commitmentHeadingEn", v)} onArChange={(v) => updateConfig("commitmentHeadingAr", v)} />
            <BilingualField label="Description" enName="commitmentDescEn" arName="commitmentDescAr" enValue={config.commitmentDescEn} arValue={config.commitmentDescAr} onEnChange={(v) => updateConfig("commitmentDescEn", v)} onArChange={(v) => updateConfig("commitmentDescAr", v)} multiline />
            <BilingualField label="Marquee label" enName="marqueeLabelEn" arName="marqueeLabelAr" enValue={config.marqueeLabelEn} arValue={config.marqueeLabelAr} onEnChange={(v) => updateConfig("marqueeLabelEn", v)} onArChange={(v) => updateConfig("marqueeLabelAr", v)} />
          </div>

          <div className="admin-card">
            <div className="admin-list-item-header">
              <h2 className="admin-card-title" style={{ margin: 0 }}>Commitment Slides</h2>
              <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setSlides((p) => [...p, { imageUrl: "", altEn: "", altAr: "", sortOrder: p.length, visible: true }])}>Add slide</button>
            </div>
            {slides.map((slide, i) => (
              <div key={slide.id ?? `slide-${i}`} className="admin-list-item">
                <div className="admin-list-item-header">
                  <strong>Slide {i + 1}</strong>
                  <div className="admin-list-item-actions">
                    <button type="button" className="admin-btn admin-btn-secondary admin-btn-icon admin-btn-sm" onClick={() => reorder(slides, setSlides, i, -1)} disabled={i === 0}>↑</button>
                    <button type="button" className="admin-btn admin-btn-secondary admin-btn-icon admin-btn-sm" onClick={() => reorder(slides, setSlides, i, 1)} disabled={i === slides.length - 1}>↓</button>
                    <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => setSlides((p) => p.filter((_, j) => j !== i).map((s, j) => ({ ...s, sortOrder: j })))}>Remove</button>
                  </div>
                </div>
                <ImageUpload value={slide.imageUrl} onChange={(url) => setSlides((p) => p.map((s, j) => (j === i ? { ...s, imageUrl: url } : s)))} />
                <BilingualField label="Alt text" enName={`altEn-${i}`} arName={`altAr-${i}`} enValue={slide.altEn} arValue={slide.altAr} onEnChange={(v) => setSlides((p) => p.map((s, j) => (j === i ? { ...s, altEn: v } : s)))} onArChange={(v) => setSlides((p) => p.map((s, j) => (j === i ? { ...s, altAr: v } : s)))} />
                <label className="admin-checkbox-row"><input type="checkbox" checked={slide.visible} onChange={(e) => setSlides((p) => p.map((s, j) => (j === i ? { ...s, visible: e.target.checked } : s)))} /> Visible</label>
              </div>
            ))}
          </div>

          <div className="admin-card">
            <div className="admin-list-item-header">
              <h2 className="admin-card-title" style={{ margin: 0 }}>Stats</h2>
              <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setStats((p) => [...p, { value: 0, suffix: "", labelEn: "", labelAr: "", sortOrder: p.length, visible: true }])}>Add stat</button>
            </div>
            {stats.map((stat, i) => (
              <div key={stat.id ?? `stat-${i}`} className="admin-list-item">
                <div className="admin-list-item-header">
                  <strong>Stat {i + 1}</strong>
                  <div className="admin-list-item-actions">
                    <button type="button" className="admin-btn admin-btn-secondary admin-btn-icon admin-btn-sm" onClick={() => reorder(stats, setStats, i, -1)} disabled={i === 0}>↑</button>
                    <button type="button" className="admin-btn admin-btn-secondary admin-btn-icon admin-btn-sm" onClick={() => reorder(stats, setStats, i, 1)} disabled={i === stats.length - 1}>↓</button>
                    <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => setStats((p) => p.filter((_, j) => j !== i).map((s, j) => ({ ...s, sortOrder: j })))}>Remove</button>
                  </div>
                </div>
                <div className="admin-grid admin-grid-2">
                  <FormField label="Value" value={String(stat.value)} onChange={(v) => setStats((p) => p.map((s, j) => (j === i ? { ...s, value: parseInt(v, 10) || 0 } : s)))} type="number" />
                  <FormField label="Suffix" value={stat.suffix} onChange={(v) => setStats((p) => p.map((s, j) => (j === i ? { ...s, suffix: v } : s)))} hint="e.g. + or %" />
                </div>
                <BilingualField label="Label" enName={`statEn-${i}`} arName={`statAr-${i}`} enValue={stat.labelEn} arValue={stat.labelAr} onEnChange={(v) => setStats((p) => p.map((s, j) => (j === i ? { ...s, labelEn: v } : s)))} onArChange={(v) => setStats((p) => p.map((s, j) => (j === i ? { ...s, labelAr: v } : s)))} />
                <label className="admin-checkbox-row"><input type="checkbox" checked={stat.visible} onChange={(e) => setStats((p) => p.map((s, j) => (j === i ? { ...s, visible: e.target.checked } : s)))} /> Visible</label>
              </div>
            ))}
          </div>

          <div className="admin-card">
            <div className="admin-list-item-header">
              <h2 className="admin-card-title" style={{ margin: 0 }}>Why Cards</h2>
              <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setCards((p) => [...p, { titleEn: "", titleAr: "", descriptionEn: "", descriptionAr: "", imageUrl: "", sortOrder: p.length, visible: true }])}>Add card</button>
            </div>
            {cards.map((card, i) => (
              <div key={card.id ?? `card-${i}`} className="admin-list-item">
                <div className="admin-list-item-header">
                  <strong>Card {i + 1}</strong>
                  <div className="admin-list-item-actions">
                    <button type="button" className="admin-btn admin-btn-secondary admin-btn-icon admin-btn-sm" onClick={() => reorder(cards, setCards, i, -1)} disabled={i === 0}>↑</button>
                    <button type="button" className="admin-btn admin-btn-secondary admin-btn-icon admin-btn-sm" onClick={() => reorder(cards, setCards, i, 1)} disabled={i === cards.length - 1}>↓</button>
                    <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => setCards((p) => p.filter((_, j) => j !== i).map((s, j) => ({ ...s, sortOrder: j })))}>Remove</button>
                  </div>
                </div>
                <BilingualField label="Title" enName={`cardTitleEn-${i}`} arName={`cardTitleAr-${i}`} enValue={card.titleEn} arValue={card.titleAr} onEnChange={(v) => setCards((p) => p.map((s, j) => (j === i ? { ...s, titleEn: v } : s)))} onArChange={(v) => setCards((p) => p.map((s, j) => (j === i ? { ...s, titleAr: v } : s)))} />
                <BilingualField label="Description" enName={`cardDescEn-${i}`} arName={`cardDescAr-${i}`} enValue={card.descriptionEn} arValue={card.descriptionAr} onEnChange={(v) => setCards((p) => p.map((s, j) => (j === i ? { ...s, descriptionEn: v } : s)))} onArChange={(v) => setCards((p) => p.map((s, j) => (j === i ? { ...s, descriptionAr: v } : s)))} multiline />
                <ImageUpload value={card.imageUrl} onChange={(url) => setCards((p) => p.map((s, j) => (j === i ? { ...s, imageUrl: url } : s)))} />
                <label className="admin-checkbox-row"><input type="checkbox" checked={card.visible} onChange={(e) => setCards((p) => p.map((s, j) => (j === i ? { ...s, visible: e.target.checked } : s)))} /> Visible</label>
              </div>
            ))}
          </div>

          <SaveButton loading={saving} error={error} success={success} />
        </form>
      </div>
    </>
  );
}
