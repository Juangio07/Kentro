# Progreso de Kentro

## Resumen del proyecto

Kentro es una aplicación de escritorio basada en Electron, perteneciente a la familia de aplicaciones Fixelar. Su base actual contiene una pantalla de Acceso, un Menu/AppShell, configuración central de identidad visual y recursos gráficos de Kentro y Fixelar.

El objetivo definido para el proyecto es evolucionar hacia una aplicación de gestión empresarial con autenticación real multiempresa, separación entre Desktop, API y PostgreSQL, y aislamiento completo de los datos entre negocios.

## Estado actual

El proyecto se encuentra en una fase inicial de prototipo funcional de interfaz. La ventana Electron y las pantallas principales existen, pero la autenticación, la API, la persistencia de datos y la arquitectura multi-tenant todavía no están implementadas.

El repositorio está limpio al registrar este documento: no había cambios pendientes en Git antes de crear `PROGRESO.md`.

La estructura actual no coincide todavía completamente con la estructura modular Frontend/Backend definida en `AGENTS.md`.

## Funcionalidades completadas

- Ventana principal de Electron configurada en `Electron/main.js`.
- Carga inicial de la pantalla de Acceso.
- Configuración inicial de seguridad Electron:
  - `contextIsolation: true`.
  - `nodeIntegration: false`.
  - Preload separado en `Electron/preload.js`.
- Pantalla de Acceso implementada con HTML, CSS y JavaScript.
- Formulario visual de correo/usuario y contraseña.
- Interacción para mostrar u ocultar la contraseña.
- Menu/AppShell implementado con sidebar, topbar y contenido de demostración.
- Sidebar con estado expandido y colapsado.
- Configuración central de identidad en `Shared/Config/AppConfig.js`.
- Aplicación dinámica de identidad y textos mediante `Shared/Config/FixelarGlobal.js`.
- Tokens visuales compartidos en `Shared/Css/Variables.css`.
- Reglas globales en `Shared/Css/Global.css`.
- Logos e iconos oficiales disponibles en `Assets/`.
- Font Awesome configurado como dependencia de iconos.
- Validación sintáctica de los archivos JavaScript mediante el script `npm test` verificada durante la revisión anterior; no existen pruebas funcionales automatizadas.

## Funcionalidades en desarrollo

No hay una funcionalidad de backend actualmente en desarrollo que pueda verificarse en el repositorio.

La base visual de Acceso y Menu existe y puede utilizarse como fundamento para las siguientes fases, pero aún requiere integrarse con autenticación real y navegación conectada a módulos de negocio.

## Tareas pendientes

### Arquitectura y organización

- Reorganizar cada módulo hacia `Modulos/<Nombre>/Frontend` y `Modulos/<Nombre>/Backend`.
- Definir la API central de Fixelar.
- Definir la comunicación Desktop → IPC/API → Backend.
- Implementar una superficie IPC explícita y allowlisted.
- Mantener el renderer sin acceso directo a filesystem, base de datos o secretos.

### Autenticación multiempresa

- Definir empresas/tenants.
- Definir usuarios y su relación con cada empresa.
- Implementar login contra una API real.
- Implementar hash seguro de contraseñas.
- Implementar sesiones y expiración de credenciales.
- Resolver el tenant en el servidor y no confiar únicamente en datos enviados por el cliente.
- Implementar autorización por empresa, rol y permiso.
- Verificar con pruebas que dos negocios no puedan acceder a los datos del otro.

### Persistencia y backend

- Diseñar el esquema PostgreSQL central.
- Definir migraciones.
- Crear controllers, services y repositories por módulo.
- Implementar validación de payloads.
- Implementar manejo de errores y auditoría.
- Definir si alguna información local requiere SQLite; actualmente no está implementado.

### Producto

- Documentar la especificación concreta de Kentro: alcance, usuarios, roles, módulos y flujos.
- Definir los módulos empresariales posteriores a Acceso y Menu.
- Sustituir las vistas de demostración por módulos reales, conforme a los requisitos aprobados.
- Revisar y limpiar referencias rígidas a Kentro donde la base deba ser reutilizable como aplicación Fixelar.

### Calidad y seguridad

- Añadir pruebas unitarias, de integración y de seguridad.
- Añadir pruebas de aislamiento entre tenants.
- Verificar rutas de assets, responsive y accesibilidad.
- Añadir validaciones de navegación y contenido externo en Electron si se requiere.
- Incorporar linting y formato cuando se defina la configuración del proyecto.

## Errores conocidos

- El formulario de Acceso es actualmente una interfaz visual; no autentica contra un servidor real.
- No existe API backend dentro del proyecto.
- No existe conexión funcional con PostgreSQL.
- No existe aislamiento multi-tenant implementado.
- No existen controllers, services, repositories ni módulos Backend.
- La prueba configurada en `package.json` valida sintaxis JavaScript, pero no comportamiento funcional.
- Hay referencias literales a Kentro en HTML, CSS y JavaScript, además de la configuración central.
- Hay nombres de clases con referencias históricas a Kentro dentro de estilos y scripts, por ejemplo `input-wrKentroer` y `table-wrKentroer`.
- `Menu.html` contiene contenido de demostración y opciones que todavía no representan módulos conectados a un backend.
- La estructura física actual de `Modulos/Acceso` y `Modulos/Menu` todavía no sigue completamente la separación `Frontend/Backend` de `AGENTS.md`.

## Últimos avances

La última revisión registrada confirmó la estructura y el estado real del repositorio sin modificar el código de la aplicación.

Archivos y áreas revisadas:

- `AGENTS.md`.
- `package.json` y `package-lock.json`.
- `Electron/main.js` y `Electron/preload.js`.
- `Modulos/Acceso/`.
- `Modulos/Menu/`.
- `Shared/Config/`.
- `Shared/Css/`.
- `Assets/`.
- `skills/fixelar-identity/SKILL.md`.
- `skills/app-specification/SKILL.md`.
- Historial reciente de Git.

En esta sesión se creó únicamente este archivo: `PROGRESO.md`.

## Decisiones técnicas

- `AGENTS.md` es la autoridad principal del proyecto y no debe modificarse sin autorización explícita.
- Las skills `fixelar-identity` y `app-specification` deben consultarse antes de modificar una aplicación Fixelar.
- `Shared/Config/AppConfig.js` debe ser la fuente de identidad de la aplicación.
- Los colores de producto deben llegar a la interfaz mediante configuración y variables semánticas, no mediante valores aislados en los módulos.
- Acceso y Menu son la base común de la experiencia Fixelar.
- La navegación se define manualmente en el HTML del Menu; no debe generarse automáticamente desde `AppConfig.js` sin cambiar explícitamente esta decisión.
- El renderer no debe acceder directamente a PostgreSQL, SQLite, filesystem, secretos ni servicios privados.
- PostgreSQL pertenece a la plataforma central y debe consumirse mediante la API Fixelar.
- La primera meta funcional debe ser autenticación multiempresa real con dos negocios completamente aislados.
- No se deben inventar endpoints, roles, pagos, integraciones ni reglas comerciales que no estén especificados.
- No se registran contraseñas, claves API ni credenciales en este documento.

## Próximos pasos

1. Definir y documentar la especificación funcional de Kentro: empresas, usuarios, roles, permisos y alcance inicial.
2. Diseñar la arquitectura de autenticación multi-tenant y el contrato de la API Fixelar.
3. Diseñar el esquema inicial de PostgreSQL con aislamiento por tenant.
4. Crear pruebas de seguridad que demuestren el aislamiento de dos negocios.
5. Reorganizar la estructura de módulos únicamente cuando exista autorización para modificar el código.
6. Implementar primero el flujo mínimo de registro de empresa, usuario, login y sesión.
7. Conectar Acceso y Menu a la API sin exponer datos sensibles al renderer.

## Última actualización

**2026-11-09** — Se creó este registro inicial después de revisar `AGENTS.md`, la estructura del repositorio, el código fuente, las dependencias, los assets, las skills disponibles y el historial reciente de Git. No se modificó ningún archivo de código ni `AGENTS.md`.
