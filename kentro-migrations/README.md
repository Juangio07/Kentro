# Kentro Migrations

Migraciones centralizadas para `kentro_core` y las bases `database-per-tenant`. Nunca se ejecutan desde Electron.

Variables requeridas para migrar: `CORE_DATABASE_URL`.

Variables requeridas para provisionar un tenant: `BUSINESS_ID`, `TENANT_DATABASE_NAME`, `POSTGRES_ADMIN_URL` y `CORE_DATABASE_URL`. El nombre de la base se valida antes de interpolarlo en `CREATE DATABASE`.
