# Malamih Creative Company — Website & CMS

Bilingual (EN/AR) marketing agency website with a full CMS admin dashboard, blog, SEO, and production-ready security features.

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Prisma · SQLite

---

## Quick start (development)

```bash
npm install
cp .env.example .env
# Edit .env — set SESSION_SECRET (32+ chars) and admin credentials

npx prisma migrate dev
npm run db:seed
npm run db:seed:blog
npm run db:seed:seo

npm run dev
```

- **Public site:** http://localhost:3000 (English) · http://localhost:3000/ar (Arabic)
- **Admin login:** http://localhost:3000/admin/login

### Default admin account (after seed)

| Field    | Value                |
|----------|----------------------|
| Email    | `admin@malamih.net`  |
| Password | From `ADMIN_PASSWORD` in `.env` (default seed: `Malamih@2025`) |
| Role     | Super Admin          |

Change the password immediately in production.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Generate Prisma client, run migrations, production build |
| `npm start` | Start production server |
| `npm run db:seed` | Seed CMS content + admin user |
| `npm run db:seed:blog` | Seed 50 blog posts |
| `npm run db:seed:seo` | Seed per-page SEO records |
| `npm run db:studio` | Open Prisma Studio |

---

## Database

SQLite is used by default (`DATABASE_URL="file:./prisma/dev.db"`). For production you may switch to PostgreSQL by updating `provider` in `prisma/schema.prisma` and `DATABASE_URL`.

### Migrations

```bash
npx prisma migrate deploy   # production
npx prisma migrate dev      # development
```

Seed scripts skip if data already exists — they will not overwrite existing CMS content.

---

## Admin dashboard

| Module | Path | Access |
|--------|------|--------|
| Dashboard | `/admin` | All roles |
| Hero, Why, Logos, Services, Contact, SEO, Settings | `/admin/*` | Admin, Super Admin |
| Projects, Blog, Media | `/admin/projects`, `/admin/blog`, `/admin/media` | Admin, Super Admin, Editor |
| Messages, Analytics, Integrations, Export | `/admin/*` | Admin, Super Admin |
| Users | `/admin/users` | Super Admin only |

### Roles

- **Super Admin** — Full access including user management
- **Admin** — Manage all website content, integrations, analytics, export
- **Editor** — Projects, blog, and media only

---

## Integrations (CMS-managed)

Configure from **Admin → Integrations** without code changes:

- Google Analytics / GTM
- Meta Pixel, TikTok Pixel, LinkedIn Insight Tag
- Google Search Console & Meta domain verification
- SMTP for contact form emails (only sends when enabled)

---

## Contact form

- Honeypot + rate limiting spam protection
- Saves all submissions to **Admin → Messages**
- Status workflow: New → Read → Replied → Archived
- Admin notification + user auto-reply emails (only when SMTP is configured)

---

## Media library

Upload, rename, delete, and copy URLs from **Admin → Media Library**. Use **Media library** button in any image upload field across the CMS.

Allowed types: JPEG, PNG, WebP, GIF, SVG (10MB) · MP4, WebM (50MB)

---

## Backup & export

**Admin → Backup & Export** — download JSON/CSV for projects, blog, messages, services, or full CMS JSON.

---

## Production deployment

1. Set environment variables (see `.env.example`)
2. Use a strong `SESSION_SECRET` (32+ random characters)
3. Set `NEXT_PUBLIC_SITE_URL` to your production domain
4. Run `npm run build && npm start`
5. Ensure `public/uploads/` is writable for media uploads
6. Configure SMTP and tracking IDs in the admin Integrations page

### Deployment notes

- Middleware protects `/admin/*` routes with JWT session cookies (`httpOnly`, `secure` in production)
- Login rate limiting: 5 failed attempts per 15 minutes per email/IP
- Internal analytics stored in `AnalyticsEvent` table; external pixels loaded from CMS settings

---

## Project structure

```
src/
  app/(en)/          Public English routes
  app/ar/            Public Arabic routes (RTL)
  app/admin/         CMS dashboard
  app/api/           Public & admin APIs
  components/        UI components
  i18n/              Translations & locale helpers
  lib/               Auth, CMS, SEO, email, permissions
prisma/              Schema, migrations, seeds
public/uploads/      Uploaded media files
```

---

## QA checklist

See [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) for pre-launch verification.
