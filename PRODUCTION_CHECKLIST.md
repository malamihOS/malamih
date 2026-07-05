# Production Checklist — Malamih Website

Use this checklist before going live. Check each item manually in both English and Arabic where applicable.

---

## Bilingual check

- [ ] Homepage loads correctly at `/` (English)
- [ ] Homepage loads correctly at `/ar` (Arabic)
- [ ] Language switcher toggles EN ↔ AR and preserves navigation context
- [ ] All main pages work in both locales: Projects, Services, Contact, Blog, FAQ, Terms, Privacy
- [ ] CMS content displays correct language (hero, why section, logos, footer, etc.)

## RTL check

- [ ] Arabic pages use RTL layout (`dir="rtl"`)
- [ ] Arabic typography renders with Janna2 font
- [ ] Navigation, forms, and footer align correctly in RTL
- [ ] Blog and project detail pages render correctly in Arabic

## CMS check

- [ ] Admin login works at `/admin/login`
- [ ] Logout clears session and redirects to login
- [ ] Hero, Why Malamih, Logos, Projects, Services editable and reflect on public site
- [ ] Contact settings (phones, emails, address) update correctly
- [ ] Site settings (logo, menu JSON, footer) save and publish
- [ ] Media library upload, rename, delete, copy URL works
- [ ] Image upload fields can pick from media library

## Blog check

- [ ] Blog index `/blog` and `/ar/blog` list published posts
- [ ] Blog post detail pages render bilingual content
- [ ] Category and tag pages work
- [ ] Admin: create, edit, publish, draft blog posts
- [ ] Featured posts display on blog index

## SEO check

- [ ] Page titles and descriptions correct per page (EN + AR)
- [ ] Open Graph and Twitter card metadata present
- [ ] Canonical URLs and hreflang tags on public pages
- [ ] JSON-LD structured data renders (Organization, WebSite)
- [ ] Admin Page SEO module saves per-route metadata
- [ ] `robots.txt` accessible and correct
- [ ] `sitemap.xml` includes all public routes, blog posts, projects

## Sitemap check

- [ ] `/sitemap.xml` returns valid XML
- [ ] English and Arabic URLs included
- [ ] Blog posts and project pages listed
- [ ] No admin or API routes in sitemap

## Contact form check

- [ ] Required fields validated (name, email, message)
- [ ] Optional fields work (phone, company, subject)
- [ ] Honeypot silently rejects bots
- [ ] Submission saved to Admin → Messages with status "New"
- [ ] Success message shown to user (EN + AR)
- [ ] Rate limiting prevents spam floods
- [ ] Admin email notification sent (only when SMTP enabled)
- [ ] User auto-reply sent (only when SMTP enabled)
- [ ] Message status can be updated: New → Read → Replied → Archived

## Dashboard auth check

- [ ] Unauthenticated users redirected from `/admin/*` to login
- [ ] Login rate limiting blocks after repeated failures
- [ ] Super Admin has full access including Users
- [ ] Admin role can manage content but not Users
- [ ] Editor role limited to Projects, Blog, Media
- [ ] Session cookie is httpOnly and secure in production

## Image upload check

- [ ] Allowed image types upload successfully (JPEG, PNG, WebP, GIF, SVG)
- [ ] Allowed video types upload successfully (MP4, WebM)
- [ ] Oversized files rejected with clear error
- [ ] Dangerous file types blocked
- [ ] Uploaded files accessible at `/uploads/*`
- [ ] Media library delete removes file from disk

## Analytics check

- [ ] Page views recorded in Admin → Analytics
- [ ] Language breakdown shows EN/AR usage
- [ ] Device type breakdown populated
- [ ] Top pages, blog posts, projects listed
- [ ] Traffic sources appear when referrer available
- [ ] Google Analytics ID loads on public site (when configured)
- [ ] GTM, Meta Pixel, TikTok, LinkedIn tags load (when configured)

## Performance check

- [ ] Public homepage loads quickly (no admin bundle bloat)
- [ ] Images lazy-load where appropriate (blog cards, media library)
- [ ] No unnecessary layout shift on hero or contact page
- [ ] `npm run build` completes without errors
- [ ] Production start (`npm start`) serves all routes

## Security check

- [ ] `SESSION_SECRET` set to 32+ random characters in production
- [ ] Default admin password changed after first login
- [ ] `.env` not committed to git
- [ ] Admin API routes require authentication
- [ ] CSRF origin check on admin mutations
- [ ] Input sanitization on contact form
- [ ] SMTP password stored only in database/env, not in client code

## Deployment check

- [ ] `DATABASE_URL` configured for MySQL (`mysql://user:pass@localhost:3306/dbname`)
- [ ] `NEXT_PUBLIC_SITE_URL` set to production domain
- [ ] `SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` set in cPanel env
- [ ] `npm install` completed on server
- [ ] `npx prisma generate` completed
- [ ] `npx prisma migrate deploy` run on production
- [ ] Seed commands run once on fresh database (if needed)
- [ ] `npm run build` completed on server
- [ ] cPanel Node.js App startup file set to `server.js`
- [ ] cPanel Node.js App restarted after deploy
- [ ] `public/uploads/` directory writable (`chmod 755`)
- [ ] Uploaded files accessible at `/uploads/filename`
- [ ] HTTPS enabled (required for secure cookies)
- [ ] 404 page displays for unknown routes
- [ ] 500/error fallback page displays on server errors
- [ ] README and `.env.example` reviewed for completeness

---

**Sign-off**

| Role | Name | Date |
|------|------|------|
| Developer | | |
| QA | | |
| Client | | |
