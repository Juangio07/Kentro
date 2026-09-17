---
name: app-specification
description: Define the product purpose, scope, modules, users, workflows, and technical requirements for a new application created by duplicating FixelarBase.
metadata:
  short-description: Specify a Fixelar application
---

# AppSpecification

## Purpose

Describe a concrete Fixelar product before building its business functionality. The specification defines what the app does; `fixelar-identity` defines how it must look and remain part of the Fixelar family.

## Starting rule

The product starts by duplicating `FixelarBase`, never from an empty project. The duplicated app initially contains the shared Access/Login and Menu/AppShell foundation. Everything beyond that is built according to the product's needs.

## Required specification

Capture, when known:

- Product name, slug, description, and target business.
- Problem solved and intended users.
- Business scope and explicit non-goals.
- App logo and theme values for `AppConfig.js`.
- Login classification, slogan, title, message, and functionality copy.
- Manual sidebar divisions and items.
- Modules and their responsibilities.
- User roles, permissions, and states.
- Main workflows and acceptance criteria.
- Local data requirements and external API requirements.
- Operational, security, accessibility, and responsive requirements.
- Open decisions and future scope.

## Base versus product-specific behavior

Keep these from FixelarBase unless the user explicitly changes the family standard:

- Access/Login composition and interaction language.
- Menu/AppShell layout, sidebar collapse, and topbar.
- Shared typography, icons, tokens, components, and states.
- Electron security model and renderer/backend separation.

Define these for the new product:

- Business modules.
- Manual menu divisions and options.
- Dashboard metrics and empty states.
- Domain entities and workflows.
- Roles and permissions.
- Product-specific copy, logos, and theme colors.

## Module requirements

Each product module must live at:

```text
Modulos/<Module>/Frontend
Modulos/<Module>/Backend
```

Frontend responsibilities must remain separate from backend responsibilities. Backend work follows:

```text
Controller → Service → Repository → SQLite/API
```

IPC or API calls must be explicit and validated. Do not invent real endpoints, credentials, payment behavior, or PostgreSQL access when they have not been specified.

## Menu specification

Menu divisions and items are intentionally authored manually in the app's Menu HTML. Do not put navigation generation in `AppConfig.js` unless the product requirements explicitly change this convention. Each item should identify its section and eventual module destination without changing the shared Menu design.

## Product creation flow

```text
Duplicate FixelarBase
  → rename the project
  → complete AppSpecification
  → configure AppConfig.js
  → replace logos in Assets/Logos
  → set product colors
  → manually define Menu divisions/items
  → create product modules
  → implement workflows
  → test identity, behavior, security, and responsive layout
```

## Completion criteria

The app has a clear purpose and scope, its modules and workflows are explicit, its identity is configured rather than hardcoded, its menu is intentionally defined, all new UI follows the Fixelar family system, technical boundaries are respected, and unresolved decisions are documented instead of guessed.
