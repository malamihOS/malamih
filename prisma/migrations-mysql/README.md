# Archived MySQL migration (cPanel)

This folder preserves the original MySQL init migration used for cPanel deployments.

The active Prisma provider is now **PostgreSQL** for Railway. Use:

- `prisma/migrations/20260706100000_init_postgresql/` for new Railway / PostgreSQL deployments
- This archived migration only if you maintain a legacy cPanel + MySQL deployment from an older branch

Do not mix MySQL and PostgreSQL migrations in the same database.
