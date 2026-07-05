# Malamih Creative Company — Website & CMS

Bilingual (EN/AR) marketing agency website with a full CMS admin dashboard, blog, SEO, CRM, and production-ready security features.

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Prisma · MySQL

---

## Quick start (development)

```bash
npm install
cp .env.example .env
```

Set a MySQL `DATABASE_URL` in `.env` (local MySQL or cPanel remote access), plus `SESSION_SECRET` (32+ chars) and admin credentials.

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
| `npm run build` | Production build |
| `npm start` | Start production server (`server.js`, uses `PORT`) |
| `npm run db:seed` | Seed CMS content + admin user |
| `npm run db:seed:blog` | Seed 50 blog posts |
| `npm run db:seed:seo` | Seed per-page SEO records |
| `npm run db:seed:growth` | Seed lead magnets & growth data |
| `npm run db:seed:team` | Seed team section demo members |
| `npm run db:studio` | Open Prisma Studio |

`postinstall` runs `prisma generate` automatically after `npm install`.

---

## Database

MySQL is used in production and development:

```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/DATABASE_NAME"
```

### Migrations

```bash
npx prisma generate
npx prisma migrate deploy   # production / cPanel
npx prisma migrate dev      # local development
```

Seed scripts skip if data already exists — they will not overwrite existing CMS content.

---

## cPanel deployment (GitHub + Node.js + MySQL)

### 1. MySQL database

1. In cPanel → **MySQL Databases**, create a database (e.g. `cpanel_malamih`).
2. Create a MySQL user with a strong password.
3. Add the user to the database with **ALL PRIVILEGES**.
4. Note the host (usually `localhost`), database name, username, and password.

### 2. GitHub repository

1. Push this project to GitHub (do **not** commit `.env`).
2. Ensure `.env.example` is in the repo for reference.

### 3. Node.js App in cPanel

1. cPanel → **Setup Node.js App** → **Create Application**
2. Recommended settings:
   - **Node.js version:** 20.x or latest LTS available
   - **Application mode:** Production
   - **Application root:** your app folder (e.g. `malamih`)
   - **Application URL:** your domain or subdomain
   - **Application startup file:** `server.js`
3. Clone the repo into the application root (Terminal or Git Version Control):

```bash
cd ~/malamih
git clone https://github.com/YOUR_USER/YOUR_REPO.git .
```

### 4. Environment variables

In the Node.js App panel (or a `.env` file in the app root), set:

```env
DATABASE_URL="mysql://DB_USER:DB_PASSWORD@localhost:3306/DB_NAME"
SESSION_SECRET="your-long-random-secret-min-32-chars"
ADMIN_EMAIL="admin@malamih.net"
ADMIN_PASSWORD="your-secure-password"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
NODE_ENV="production"
PORT=XXXX
```

Use the `PORT` value shown by cPanel for your Node.js application.

### 5. Install, migrate, seed, build

Open **Terminal** in cPanel (or SSH), then:

```bash
cd ~/malamih
npm install
npx prisma generate
npx prisma migrate deploy
npm run db:seed
npm run db:seed:blog
npm run db:seed:seo
npm run db:seed:growth
npm run db:seed:team
npm run build
```

### 6. Uploads folder

Ensure uploads are writable:

```bash
mkdir -p public/uploads
chmod 755 public/uploads
```

Uploaded files are stored in `public/uploads/` and served at `/uploads/filename`.

### 7. Start / restart the app

1. In cPanel Node.js App, click **Restart**.
2. Confirm **Application startup file** is `server.js`.
3. Confirm **Application URL** matches your domain.

### 8. Post-deploy checks

- Visit `/` and `/ar`
- Log in at `/admin/login`
- Test contact form, media upload, CRM, blog, and projects

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

Allowed types: JPEG, PNG, WebP, GIF, SVG (10MB) · MP4, WebM (50MB)

Files are saved locally to `public/uploads/` and served from `/uploads/…`.

---

## Backup & export

**Admin → Backup & Export** — download JSON/CSV for projects, blog, messages, services, leads, or full CMS JSON.

---

## Production notes

- Custom server: `server.js` (reads `process.env.PORT` for cPanel)
- Middleware protects `/admin/*` routes with JWT session cookies (`httpOnly`, `secure` in production)
- Login rate limiting: 5 failed attempts per 15 minutes per email/IP
- Internal analytics stored in `AnalyticsEvent` table; external pixels loaded from CMS settings
- Never commit `.env` — use cPanel environment variables

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
public/uploads/      Uploaded media files (local on cPanel)
server.js            cPanel Node.js startup file
```

---

## QA checklist

See [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) for pre-launch verification.
