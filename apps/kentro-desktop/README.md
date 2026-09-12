# Kentro Desktop

Aplicación Electron instalada por el cliente.

Reglas obligatorias:

- Solo consume `kentro-api` mediante HTTPS.
- Nunca contiene credenciales, host PostgreSQL o nombres de bases tenant.
- `contextIsolation` debe permanecer activo y `nodeIntegration` desactivado.
- Los assets de marca oficiales viven en `Assets/` mientras se completa la migración visual.

La interfaz prototipo actual permanece temporalmente en `Pages/` y será integrada gradualmente aquí.
