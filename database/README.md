# Kentro Database

Modelo inicial `database-per-tenant`.

```text
kentro_core
kentro_business_000001
kentro_business_000002
```

`kentro_core` registra negocios, planes, sesiones, dispositivos y el catálogo de bases mediante `database_registry`. Todas las bases tenant deben usar el mismo esquema versionado.
