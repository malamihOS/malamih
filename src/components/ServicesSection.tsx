"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import ServiceInquiryForm from "@/components/ServiceInquiryForm";
import { useTranslations } from "@/context/LocaleProvider";
import { getServiceInquirySlug } from "@/lib/leads/service-map";
import styles from "./ServicesSection.module.css";

const REVEAL = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function ServicesSection() {
  const t = useTranslations();
  const [openInquiry, setOpenInquiry] = useState<string | null>(null);

  return (
    <section
      id="services"
      className={`framer-1o7b1ai ${styles.section}`}
      aria-labelledby="services-heading"
    >
      <div className={styles.inner}>
        <motion.header
          className={styles.header}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={REVEAL}
        >
          <p className={styles.sectionLabel}>
            <span className={styles.sectionNumber}>(04)</span>
            {t.home.services.label}
          </p>
          <h2 id="services-heading" className={styles.heading}>
            {t.home.services.heading}
          </h2>
        </motion.header>

        <div className={styles.list}>
          {t.home.services.items.map((service) => (
            <motion.article
              key={service.number}
              className={styles.item}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={REVEAL}
            >
              <div className={styles.divider} aria-hidden="true" />

              <div className={styles.row}>
                <div className={styles.left}>
                  <span className={styles.number}>{service.number}</span>
                  <div className={styles.main}>
                    <h3 className={styles.title}>{service.title}</h3>
                  </div>
                </div>

                <div className={styles.tags}>
                  {service.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {getServiceInquirySlug(service.number) ? (
                <>
                  <button
                    type="button"
                    className={styles.inquireBtn}
                    onClick={() =>
                      setOpenInquiry(
                        openInquiry === service.number ? null : service.number,
                      )
                    }
                  >
                    {t.growth.inquiry.inquire}
                  </button>
                  {openInquiry === service.number ? (
                    <ServiceInquiryForm
                      serviceSlug={getServiceInquirySlug(service.number)!}
                      serviceTitle={service.title}
                      onClose={() => setOpenInquiry(null)}
                    />
                  ) : null}
                </>
              ) : null}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
