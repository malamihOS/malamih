# Malamih Creative Company — Website & CMS

Bilingual (EN/AR) marketing agency website with a full CMS admin dashboard, blog, SEO, CRM, and production-ready security features.

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Prisma · PostgreSQL · Cloudflare R2 · Railway

---

## Quick start (development)

```bash
npm install
cp .env.example .env
```

Set `DATABASE_URL` (PostgreSQL), `SESSION_SECRET` (32+ chars), and admin credentials in `.env`.

R2 variables are **optional locally** — without them, uploads fall back to `public/uploads/`.

```bash
npx prisma generate
npx prisma migrate deploy
npm run db:seed
npm run db:seed:blog
npm run db:seed:seo
npm run db:seed:growth
npm run db:seed:team

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
| `npm run build` | Production build (no live DB required) |
| `npm run start` | Start production server (`server.js`, uses `PORT`) |
| `npm run db:migrate:deploy` | Apply migrations (production / Railway) |
| `npm run db:seed` | Seed CMS content + admin user |
| `npm run db:seed:blog` | Seed 50 blog posts |
| `npm run db:seed:seo` | Seed per-page SEO records |
| `npm run db:seed:growth` | Seed lead magnets & growth data |
| `npm run db:seed:team` | Seed team section demo members |
| `npm run db:studio` | Open Prisma Studio |

`postinstall` runs `prisma generate` automatically after `npm install`.

---

## Environment variables

```env
# Database (Railway PostgreSQL)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"

# Auth & site
SESSION_SECRET="your-long-random-secret-min-32-chars"
ADMIN_EMAIL="admin@malamih.net"
ADMIN_PASSWORD="your-secure-password"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
NODE_ENV="production"

# Cloudflare R2 (required in production for uploads)
R2_ACCOUNT_ID=""
R2_ACCESS_KEY_ID=""
R2_SECRET_ACCESS_KEY=""
R2_BUCKET_NAME=""
R2_PUBLIC_URL="https://media.yourdomain.com"
```

Railway injects `PORT` automatically. Do **not** commit `.env`.

---

## Railway deployment (recommended)

### 1. Create Railway project

1. [railway.app](https://railway.app) → **New Project**
2. Add **PostgreSQL** service
3. Add **GitHub repo** service (this project)

### 2. Link PostgreSQL

In the web service → **Variables** → add reference:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

Railway’s internal Postgres URL works; for external tools add `?sslmode=require` if needed.

### 3. Set environment variables

| Variable | Notes |
|----------|-------|
| `DATABASE_URL` | From Railway PostgreSQL |
| `SESSION_SECRET` | Random 32+ character string |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Used only during seed |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (https) |
| `NODE_ENV` | `production` |
| `R2_ACCOUNT_ID` | Cloudflare account ID |
| `R2_ACCESS_KEY_ID` | R2 API token access key |
| `R2_SECRET_ACCESS_KEY` | R2 API token secret |
| `R2_BUCKET_NAME` | Bucket name |
| `R2_PUBLIC_URL` | Public bucket URL (custom domain or r2.dev) |

### 4. Build & start commands

Railway uses `railway.json`:

- **Build:** `npm run build`
- **Start:** `npm run start`

`server.js` reads `process.env.PORT` (Railway sets this automatically).

### 5. Run migrations & seed (first deploy)

Open Railway **Shell** or use a one-off command:

```bash
npx prisma migrate deploy
npm run db:seed
npm run db:seed:blog
npm run db:seed:seo
npm run db:seed:growth
npm run db:seed:team
```

Seed scripts skip if data already exists — they will not overwrite existing CMS content.

### 6. Custom domain

1. Railway service → **Settings** → **Networking** → add custom domain
2. Point DNS to Railway
3. Update `NEXT_PUBLIC_SITE_URL` to match

### 7. Post-deploy checks

- Visit `/` and `/ar`
- Log in at `/admin/login`
- Test contact form, media upload (R2), CRM, blog, and projects

---

## Cloudflare R2 setup

### 1. Create bucket

1. Cloudflare Dashboard → **R2** → **Create bucket**
2. Note the bucket name → `R2_BUCKET_NAME`

### 2. API credentials

1. **R2** → **Manage R2 API Tokens** → **Create API token**
2. Permissions: Object Read & Write on the bucket
3. Copy **Access Key ID** and **Secret Access Key**
4. Account ID → `R2_ACCOUNT_ID`

### 3. Public access

Option A — **Custom domain** (recommended):

1. Bucket → **Settings** → **Custom Domains** → connect `media.yourdomain.com`
2. Set `R2_PUBLIC_URL=https://media.yourdomain.com`

Option B — **R2.dev subdomain**:

1. Enable public access on the bucket
2. Set `R2_PUBLIC_URL` to the provided `*.r2.dev` URL

### 4. Upload behaviour

| Environment | Storage |
|-------------|---------|
| Production (R2 vars set) | Files uploaded to R2; URLs use `R2_PUBLIC_URL` |
| Development (R2 vars missing) | Files saved to `public/uploads/` locally |

Media Library lists files from the **database** (`MediaFile` table), not the filesystem. Deleting media removes the R2 object when configured.

**Allowed types:** JPEG, PNG, WebP, GIF, SVG (10MB) · MP4, WebM (50MB) · PDF, DOC, DOCX, PPT, PPTX, ZIP, TXT (25MB)

---

## Database

PostgreSQL is used in production and development:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
```

### Migrations

```bash
npx prisma generate
npx prisma migrate deploy   # production / Railway
npx prisma migrate dev      # local development
```

Legacy cPanel MySQL migrations are archived in `prisma/migrations-mysql/` for reference only.

---

## Legacy cPanel deployment (MySQL + local uploads)

Previous cPanel + MySQL setup is preserved in git history and `prisma/migrations-mysql/`. New deployments should use **Railway + PostgreSQL + R2**.

If you maintain a legacy cPanel install, use the commit/branch before the PostgreSQL migration and the MySQL `DATABASE_URL` format:

```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/DATABASE_NAME"
```

---

## Admin dashboard

| Module | Path | Access |
|--------|------|--------|
| Dashboard | `/admin` | All roles |
| Hero, Why, Logos, Team, Services, Contact, SEO, Settings | `/admin/*` | Admin, Super Admin |
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

Production files are stored in **Cloudflare R2**. Development without R2 uses `public/uploads/`.

---

## Backup & export

**Admin → Backup & Export** — download JSON/CSV for projects, blog, messages, services, leads, or full CMS JSON.

---

## Production notes

- Custom server: `server.js` (reads `process.env.PORT`)
- Build does **not** require a live database (`force-dynamic` on CMS pages)
- Middleware protects `/admin/*` routes with JWT session cookies (`httpOnly`, `secure` in production)
- Login rate limiting: 5 failed attempts per 15 minutes per email/IP
- Internal analytics stored in `AnalyticsEvent` table; external pixels loaded from CMS settings
- Never commit `.env` — use Railway environment variables

---

## Deployment checklist

See [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) for pre-launch verification.

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
  lib/               Auth, CMS, SEO, email, R2, uploads
prisma/              Schema, migrations, seeds
public/uploads/      Local upload fallback (development only)
server.js            Production startup file
railway.json         Railway build/start config
```
