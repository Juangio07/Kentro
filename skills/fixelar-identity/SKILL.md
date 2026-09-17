---
name: fixelar-identity
description: Preserve the visual, interaction, architectural, and technical identity of any application in the Fixelar software family. Use when modifying FixelarBase or any app duplicated from it.
metadata:
  short-description: Maintain Fixelar family identity
---

# FixelarIdentity

## Purpose

Maintain a consistent Fixelar family of software. Every product starts by duplicating `FixelarBase`; it may have different business functionality, but it must remain recognizably Fixelar.

## Foundation

Every new app begins with the existing FixelarBase foundation:

- Access/Login screen.
- Menu/AppShell.
- Sidebar and topbar behavior.
- Shared CSS and configuration.
- Electron entry point and secure preload.
- Official logo assets and Font Awesome Classic Solid.

Do not start a new Fixelar app from zero. Do not redesign Access or Menu when adding business functionality.

## Identity source of truth

- Read `Shared/Config/AppConfig.js` before changing identity.
- App-specific name, logos, colors, Login copy, and theme belong in `AppConfig.js`.
- `Shared/Css/Variables.css` contains shared structural and neutral tokens.
- `Shared/Css/Global.css` contains reusable global rules and components.
- CSS must consume semantic variables such as `--brand-primary`, `--app-accent`, and `--login-background-start`; do not hardcode product colors in module CSS.
- Logos must come from `Assets/Logos` and must be configured, not embedded from another app.

## Visual invariants

Preserve the established Fixelar language: typography, hierarchy, spacing, radii, shadows, transitions, button and input states, cards, tables, icons, responsive behavior, focus states, disabled states, Access composition, AppShell, sidebar collapse, and topbar behavior.

Use Font Awesome Classic Solid for interface icons. Do not introduce emojis, unrelated icon packs, or an incompatible visual system.

## Building new functionality

New screens and modules must look like they belong to the existing Access and Menu product. Reuse shared tokens and components first. Module-specific code stays in `Modulos/<Module>/Frontend` and `Modulos/<Module>/Backend`.

Keep the architecture:

```text
Frontend → IPC/API → Controller → Service → Repository → SQLite/API
```

The renderer must not access SQLite, PostgreSQL, filesystem APIs, secrets, or private API credentials directly. Electron must keep `contextIsolation: true`, `nodeIntegration: false`, a minimal preload, and an allowlisted IPC surface.

## Change classification

- Identity change: `AppConfig.js` and `Assets/Logos`.
- Shared visual change: `Shared/Css/Variables.css`, `Shared/Css/Global.css`, or shared components.
- Login-specific layout change: `Modulos/Acceso/` only when the common design requires it.
- AppShell/menu-specific layout change: `Modulos/Menu/` only when the common design requires it.
- Business functionality: a new module with its own Frontend/Backend.

Do not solve a module problem by changing the global design unless the change is genuinely part of the Fixelar family system.

## Required checks

Before finishing a change, verify identity values come from `AppConfig.js`, no product color is hardcoded in shared/module UI, routes and assets resolve, icons load, responsive behavior remains intact, accessibility states remain usable, Electron security settings are preserved, and tests pass.

## Definition of Done

The result remains a Fixelar app, preserves Access and Menu language, uses the configured identity, keeps the required architecture and security boundaries, and does not introduce another app's branding or business logic.
