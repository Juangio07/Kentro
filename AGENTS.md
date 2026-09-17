# Fixelar Apps — Instrucciones Generales

## Propósito

Fixelar es una familia de aplicaciones de software independientes. Todas comparten una identidad visual, técnica y de experiencia común, pero cada aplicación resuelve necesidades de negocio diferentes.

Estas reglas aplican a cualquier aplicación perteneciente a la familia Fixelar.

## Skills obligatorias

Antes de modificar una aplicación Fixelar, consultar y respetar:

- `skills/fixelar-identity/SKILL.md` (`FixelarIdentity`): define la identidad visual, técnica y de experiencia que debe conservar toda la familia.
- `skills/app-specification/SKILL.md` (`AppSpecification`): define la temática, propósito, funcionalidades, módulos, usuarios, roles y alcance de la aplicación concreta.

`FixelarIdentity` establece lo común a todas las aplicaciones. `AppSpecification` establece lo particular de cada producto.

## Identidad de familia

Toda aplicación Fixelar debe conservar una relación clara con el ecosistema Fixelar mediante:

- Login y lenguaje visual coherentes.
- AppShell, sidebar y topbar consistentes.
- Tipografía y jerarquía visual compartidas.
- Componentes, estados, espaciados, radios y sombras coherentes.
- Font Awesome Classic Solid como sistema de iconos.
- Configuración central de identidad mediante `AppConfig.js`.
- Tokens estructurales compartidos mediante `Shared/Css/Variables.css`.
- Reglas globales mediante `Shared/Css/Global.css`.
- Logos oficiales dentro de `Assets/Logos`.

La aplicación puede tener nombre, logo, colores, textos, módulos y funcionalidades diferentes, pero no debe parecer un producto ajeno a Fixelar.

## Base visual y funcional

Acceso y Menu constituyen la base común de la experiencia Fixelar.

- Acceso conserva su composición, proporciones, estados, responsive y lenguaje visual.
- Menu conserva su AppShell, sidebar, topbar, colapsado, navegación visual y estados.
- Las divisiones y opciones del menú se definen manualmente en el HTML de la aplicación.
- `AppConfig.js` no genera automáticamente la navegación.
- Las nuevas pantallas y módulos deben parecer parte del mismo producto.

Lo que se construya después de Acceso y Menu depende de la temática descrita en `AppSpecification`.

## Configuración de identidad

`Shared/Config/AppConfig.js` es la fuente de identidad de la aplicación. Debe controlar, cuando corresponda:

- Nombre.
- Logos.
- Colores principales y secundarios.
- Fondos de identidad.
- Colores de acento.
- Textos del Login.
- Clasificación de la aplicación.
- Slogan.
- Descripción funcional.

`FixelarGlobal.js` conecta esa configuración con las variables CSS en tiempo de ejecución.

Los colores de producto no deben escribirse directamente en los componentes ni en los CSS de módulos. Los estilos deben consumir variables semánticas.

## Estructura técnica

Cada funcionalidad específica debe vivir dentro de su módulo:

```text
Modulos/<Nombre>/
├── Frontend/
│   ├── <Nombre>.html
│   ├── <Nombre>.css
│   └── <Nombre>.js
└── Backend/
    ├── <Nombre>.controller.js
    ├── <Nombre>.service.js
    ├── <Nombre>.repository.js
    └── <Nombre>.ipc.js
```

La comunicación debe respetar:

```text
Frontend → IPC/API → Controller → Service → Repository → SQLite/API
```

El Frontend no accede directamente a SQLite, PostgreSQL, filesystem, secretos ni servicios privados.

## Electron y seguridad

Toda aplicación Fixelar debe conservar:

- `contextIsolation: true`.
- `nodeIntegration: false`.
- Preload mínimo.
- IPC con allowlist.
- Validación de payloads.
- No exponer `fs` completo.
- No exponer `child_process`.
- No exponer la base de datos al renderer.
- No guardar secretos privados en el proyecto.

PostgreSQL pertenece a la plataforma central y solo debe utilizarse mediante la API Fixelar. SQLite local puede utilizarse cuando la `AppSpecification` lo requiera.

## Regla de alcance

No inventar funcionalidades, endpoints, roles, pagos, integraciones ni reglas comerciales que no estén definidos en `AppSpecification` o solicitados explícitamente.

Si una decisión afecta al producto, debe documentarse como decisión pendiente en lugar de asumirla.

No copiar lógica de negocio entre aplicaciones solo porque comparten diseño. Compartir únicamente lo que sea realmente común y mantener lo específico dentro del módulo correspondiente.

## Validación antes de finalizar

Antes de declarar terminado cualquier cambio:

- Leer `FixelarIdentity` y `AppSpecification` aplicables.
- Verificar que la identidad visual se conserva.
- Verificar que los colores de producto provienen de `AppConfig.js`.
- Verificar logos y rutas de assets.
- Verificar Font Awesome.
- Verificar responsive y accesibilidad.
- Verificar que no haya referencias a otra aplicación.
- Verificar que no existan imports o rutas rotas.
- Ejecutar las pruebas disponibles.
- Revisar la seguridad Electron.
- Revisar el diff y los archivos modificados.

## Definition of Done

Un cambio está terminado cuando:

- Respeta `FixelarIdentity`.
- Respeta la temática y alcance de `AppSpecification`.
- Conserva la relación visual y técnica con la familia Fixelar.
- No rompe Acceso, Menu ni AppShell.
- Mantiene la separación Frontend/Backend.
- Mantiene los límites de seguridad de Electron.
- No introduce colores, logos o iconos incompatibles.
- No contiene funcionalidades inventadas.
- Las pruebas y verificaciones relevantes pasan correctamente.
