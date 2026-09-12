# KENTRO — AGENTS.md

## 1. Propósito del proyecto

Kentro es una plataforma SaaS de escritorio para gestión empresarial, diseñada para ser utilizada por miles de negocios mediante membresías.

Debe existir una sola aplicación de escritorio distribuida a todos los clientes. Cada negocio debe operar de forma independiente, con aislamiento estricto de datos, sin posibilidad de acceder a información de otra empresa.

El sistema debe permitir administrar, como mínimo:

- Dashboard
- Inventario
- Productos / Artículos
- Categorías
- Clientes
- Proveedores
- Ventas
- Facturación
- Caja
- Créditos
- Abonos
- Gastos
- Inversiones
- Usuarios
- Roles y permisos
- Reportes
- Estadísticas
- Auditoría
- Membresías
- Licencias
- Dispositivos
- Actualizaciones automáticas

Kentro debe ser concebido como una plataforma escalable, segura, mantenible y preparada para crecer a miles de negocios sin necesidad de reescribir la arquitectura.

---

## 2. Arquitectura obligatoria

La arquitectura general debe ser:

```text
Kentro Desktop
      ↓ HTTPS
Kentro API
      ↓
Tenant Resolver / Tenant Manager
      ↓
PostgreSQL
```

### Regla crítica

La aplicación de escritorio **NO debe conectarse directamente a PostgreSQL**.

Nunca incluir en Electron:

- host de PostgreSQL
- usuario de PostgreSQL
- contraseña de PostgreSQL
- nombre directo de la base tenant
- credenciales sensibles

La aplicación Desktop solo debe comunicarse con la API mediante HTTPS.

---

## 3. Estructura de proyectos

Kentro debe separarse conceptualmente en los siguientes proyectos:

```text
kentro-desktop
kentro-api
kentro-web
kentro-admin
kentro-migrations
```

### kentro-desktop

Aplicación instalada por el cliente.

Responsabilidades:

- interfaz
- login
- consumo de API
- navegación
- caché local
- configuración local
- impresión
- identificación del dispositivo
- actualizaciones automáticas
- futura operación offline

Tecnologías base:

- Electron
- HTML
- CSS
- JavaScript
- electron-builder
- electron-updater

---

### kentro-api

Es el núcleo funcional del sistema.

Responsabilidades:

- autenticación
- autorización
- multi-tenancy
- usuarios
- roles
- permisos
- empresas
- productos
- inventario
- clientes
- proveedores
- ventas
- caja
- créditos
- gastos
- reportes
- membresías
- licencias
- dispositivos
- auditoría

Tecnologías base:

- Node.js
- API REST
- PostgreSQL
- HTTPS

---

### kentro-web

Sitio comercial y portal del cliente.

Debe permitir:

- registro
- login
- creación de negocio
- elección de plan
- pago de membresía
- gestión de suscripción
- descarga de Kentro
- gestión de dispositivos
- consulta de facturación
- actualización de datos de cuenta

---

### kentro-admin

Panel privado de administración de la plataforma Kentro.

Debe permitir:

- ver negocios
- ver suscripciones
- administrar planes
- ver pagos
- activar / suspender negocios
- cambiar plan
- consultar dispositivos
- cerrar sesiones
- ver versiones instaladas
- gestionar releases
- forzar actualizaciones
- ver errores
- ver backups
- ver migraciones
- ver métricas generales

---

### kentro-migrations

Sistema centralizado para mantener todas las bases tenant con la misma estructura.

Nunca ejecutar migraciones directamente desde Electron.

---

## 4. Modelo multi-tenant

Kentro usará inicialmente una arquitectura **database-per-tenant**.

### Base central

```text
kentro_core
```

Debe contener, como mínimo:

- businesses
- subscriptions
- plans
- global_users
- devices
- licenses
- database_registry
- app_versions
- payments
- sessions
- refresh_tokens
- release_channels
- system_logs

### Bases tenant

Ejemplo:

```text
kentro_business_000001
kentro_business_000002
kentro_business_000003
```

Todas deben compartir exactamente la misma estructura.

### Regla de aislamiento

Ninguna operación debe confiar en un `business_id` enviado libremente por el cliente.

El backend debe determinar el negocio desde la sesión autenticada.

Nunca permitir que el frontend elija manualmente qué tenant consultar.

---

## 5. Escalabilidad

La arquitectura debe diseñarse desde el inicio pensando en miles de negocios.

No significa desplegar infraestructura para miles desde el primer día, pero sí evitar decisiones que obliguen a rehacer el sistema al crecer.

`database_registry` debe poder indicar:

- business_id
- cluster
- host lógico
- database_name
- schema_version
- status

Esto debe permitir distribuir tenants entre diferentes clusters PostgreSQL en el futuro.

---

## 6. Autenticación

La autenticación debe realizarse por API.

Flujo base:

```text
Desktop
↓
correo + contraseña + device_id
↓
API
↓
autenticación
↓
sesión / token
```

La respuesta puede incluir:

- usuario
- negocio
- rol
- permisos
- plan
- módulos habilitados
- estado de membresía
- información mínima del dispositivo

### Seguridad de contraseñas

Nunca guardar contraseñas en texto plano.

Usar hash seguro.

---

## 7. Sesiones y tokens

Usar tokens o sesiones seguras.

Si se usa JWT:

- access token de corta duración
- refresh token seguro
- revocación posible
- control por dispositivo

Nunca confiar solo en información del token sin validación del backend cuando la operación lo requiera.

---

## 8. Roles y permisos

Roles iniciales:

- propietario
- administrador
- cajero
- bodega
- contador
- empleado

Los permisos deben validarse en el backend.

Ocultar un botón en la interfaz no constituye seguridad.

Ejemplos de permisos:

```text
sales.read
sales.create
sales.cancel
inventory.read
inventory.adjust
customers.read
customers.create
users.manage
reports.read
settings.manage
```

---

## 9. Dispositivos

Cada instalación debe tener un `device_id` único.

El sistema debe permitir identificar dispositivos como:

- PC Caja
- PC Gerencia
- Laptop
- PC Bodega

Cada plan puede limitar la cantidad de dispositivos autorizados.

Debe existir capacidad para:

- autorizar dispositivo
- desautorizar dispositivo
- cerrar sesión remota
- detectar instalación nueva

---

## 10. Membresías

Estados mínimos:

```text
trial
active
past_due
suspended
cancelled
```

El vencimiento de una membresía **nunca debe eliminar automáticamente los datos del negocio**.

Se puede implementar modo restringido o solo lectura.

Los planes pueden controlar:

- módulos
- usuarios
- dispositivos
- sucursales
- almacenamiento
- backups
- funciones premium

---

## 11. Actualizaciones automáticas

Kentro Desktop debe incluir actualizaciones automáticas.

Usar:

- electron-builder
- electron-updater

Flujo esperado:

```text
Kentro inicia
↓
consulta versión
↓
existe nueva versión
↓
descarga en segundo plano
↓
notifica al usuario
↓
reiniciar y actualizar
```

Debe existir soporte para:

- actualización opcional
- actualización obligatoria
- canal stable
- futuro canal beta
- futuro canal internal

---

## 12. Versionado

Usar Semantic Versioning:

```text
MAJOR.MINOR.PATCH
```

Ejemplos:

```text
1.0.0
1.0.1
1.1.0
2.0.0
```

Interpretación:

- PATCH: corrección
- MINOR: nueva funcionalidad compatible
- MAJOR: cambio importante o incompatible

---

## 13. Migraciones

Cada tenant debe tener una versión de esquema.

Ejemplo:

```text
schema_version = 12
```

Si una nueva versión requiere cambios:

```text
schema_version = 13
```

Las migraciones deben ser:

- centralizadas
- registradas
- auditables
- repetibles de forma segura
- recuperables ante error

Nunca ejecutar migraciones críticas desde el cliente Electron.

---

## 14. Backups

Diseñar backups independientes por tenant.

Configuración inicial sugerida:

- backup diario
- retención mínima 30 días

Planes superiores pueden tener mayor retención.

Debe ser posible restaurar un tenant sin afectar a otros.

---

## 15. Base local / offline

La primera versión puede requerir internet.

Sin embargo, la arquitectura debe permitir usar SQLite local para:

- preferencias
- caché
- configuración del dispositivo
- impresoras
- sesión local
- cola de sincronización futura

Preparar conceptualmente soporte para:

```text
sync_queue
pending_sales
pending_movements
```

No implementar lógica offline compleja sin requerimiento explícito.

---

## 16. Auditoría

Toda acción relevante debe registrarse.

Datos mínimos:

- user_id
- business_id
- action
- module
- entity
- entity_id
- device_id
- IP si aplica
- created_at

Ejemplos:

- crear producto
- modificar precio
- ajustar inventario
- eliminar cliente
- anular venta
- modificar configuración
- crear usuario

---

## 17. Productos / artículos

Campos iniciales esperados:

- id
- code
- barcode
- name
- description
- category_id
- supplier_id
- cost
- sale_price
- tax
- stock
- minimum_stock
- unit
- image
- status
- created_by
- created_at
- updated_at

---

## 18. Inventario

No almacenar únicamente stock actual.

Debe existir historial de movimientos.

Tipos iniciales:

- entrada
- venta
- compra
- devolución
- ajuste
- daño
- pérdida
- traslado

Tabla esperada:

```text
inventory_movements
```

Campos sugeridos:

- product_id
- type
- quantity
- previous_stock
- new_stock
- reference_type
- reference_id
- user_id
- notes
- created_at

---

## 19. Clientes

Campos iniciales:

- nombre
- documento
- teléfono
- correo
- dirección
- ciudad
- fecha de nacimiento
- notas
- estado

Métricas derivadas:

- total compras
- saldo pendiente
- última compra

---

## 20. Proveedores

Campos iniciales:

- nombre
- documento / NIT
- contacto
- teléfono
- correo
- dirección
- ciudad
- notas
- estado

---

## 21. Ventas

Flujo esperado:

```text
Nueva venta
↓
Buscar producto
↓
Agregar cantidades
↓
Seleccionar cliente
↓
Aplicar descuento
↓
Método de pago
↓
Confirmar
↓
Actualizar inventario
↓
Generar comprobante
```

Métodos de pago iniciales:

- efectivo
- tarjeta
- transferencia
- mixto
- crédito

---

## 22. Caja

Funciones mínimas:

- abrir caja
- cerrar caja
- registrar ingresos
- registrar egresos
- saldo esperado
- saldo real
- diferencia

Debe ser auditable.

---

## 23. Créditos y abonos

Permitir ventas a crédito.

Registrar:

- venta relacionada
- cliente
- saldo inicial
- abonos
- saldo actual
- fechas
- método de pago
- usuario responsable

---

## 24. Gastos

Campos iniciales:

- categoría
- descripción
- valor
- proveedor
- fecha
- forma de pago
- responsable
- comprobante

---

## 25. Inversiones

Campos iniciales:

- concepto
- valor
- fecha
- responsable
- observaciones

---

## 26. Dashboard

Debe mostrar inicialmente:

- ventas del día
- ventas del mes
- utilidad estimada
- gastos
- clientes nuevos
- productos vendidos
- inventario bajo
- créditos pendientes

Gráficas iniciales:

- ventas por día
- ventas por mes
- productos más vendidos
- categorías más vendidas
- métodos de pago

---

## 27. Reportes

Exportaciones previstas:

- PDF
- Excel
- CSV

Reportes iniciales:

- ventas
- inventario
- clientes
- créditos
- gastos
- caja
- productos
- utilidades

---

## 28. Personalización del negocio

Debe permitir configurar:

- logo
- nombre empresa
- propietario
- NIT / CC
- teléfono
- correo
- dirección
- lema
- color principal
- color secundario

La personalización debe aplicarse de forma consistente sin romper la identidad base de Kentro.

---

# IDENTIDAD VISUAL OFICIAL DE KENTRO

## 29. Personalidad visual

Kentro debe sentirse:

- moderna
- premium
- productiva
- tecnológica
- limpia
- confiable
- ordenada
- clara

Evitar:

- diseños infantiles
- colores aleatorios
- interfaces saturadas
- exceso de sombras
- exceso de gradientes
- componentes demasiado pegados
- inconsistencias entre módulos

---

## 30. Paleta oficial

### Deep Navy

```text
#0B1E3F
```

Uso:

- fondo principal
- sidebar
- navegación
- encabezados premium

### Cobalt

```text
#2563FF
```

Uso:

- acciones principales
- botones
- estados activos

### Electric Blue

```text
#0EA5FF
```

Uso:

- iconos
- highlights
- componentes interactivos

### Cyan

```text
#22D3EE
```

Uso:

- acentos
- indicadores
- métricas positivas

### Teal Accent

```text
#14B8A6
```

Uso:

- éxito
- indicadores secundarios
- gráficas

---

## 31. Gradiente oficial

Gradiente sugerido:

```text
#2563FF → #0EA5FF → #22D3EE
```

Usar con moderación.

Puede aplicarse en:

- isotipo
- iconos destacados
- gráficas
- indicadores
- algunos elementos premium

No convertir toda la interfaz en gradientes.

---

## 32. Fondos y superficies

Modo oscuro principal:

```text
#071426
#0B1E3F
```

Superficies sugeridas:

```text
#0F2547
#12294D
```

Preferir contraste suave entre superficies antes que bordes excesivos.

---

## 33. Tipografía

Tipografía principal:

```text
Inter
```

Pesos:

- 400 Regular
- 500 Medium
- 600 Semibold
- 700 Bold

Jerarquía sugerida:

- Título principal: 700
- Subtítulo: 600
- Labels: 500
- Texto: 400
- Métricas: 600 / 700

---

## 34. Bordes

Radios recomendados:

```text
8px
10px
12px
16px
```

Botones:

```text
8px - 10px
```

Cards:

```text
12px - 16px
```

Inputs:

```text
8px - 10px
```

---

## 35. Espaciado

Usar sistema consistente:

```text
4px
8px
12px
16px
24px
32px
40px
```

Nunca pegar:

- label con input
- botones entre sí
- cards entre sí
- títulos al contenido

Mantener siempre simetría y aire visual.

---

## 36. Cards

Las cards deben:

- ser limpias
- tener jerarquía
- mostrar métricas claras
- mantener padding consistente
- evitar bordes fuertes innecesarios

---

## 37. Botones

### Primario

```text
background: #2563FF
hover: #0EA5FF
text: #FFFFFF
```

### Secundario

```text
background: transparent
border: rgba(255,255,255,0.12)
text: #E5E7EB
```

---

## 38. Inputs

Fondo sugerido:

```text
#0F2547
```

Borde:

```text
rgba(255,255,255,0.08)
```

Focus:

```text
#0EA5FF
```

---

## 39. Sidebar

Elementos previstos:

- Inicio
- Clientes
- Productos
- Inventario
- Ventas
- Caja
- Créditos
- Gastos
- Reportes
- Estadísticas
- Usuarios
- Configuración

Estado activo:

- fondo azul sutil
- icono azul/cyan
- texto blanco

Estado normal:

- icono gris azulado
- texto gris claro

---

## 40. Iconografía

Usar iconos:

- simples
- lineales
- modernos
- consistentes

No mezclar estilos diferentes de iconos.

Colores permitidos preferentes:

```text
#0EA5FF
#22D3EE
#E5E7EB
```

---

## 41. Logo

El isotipo Kentro utiliza una K geométrica modular de esquinas redondeadas.

No redibujar ni reinterpretar el logo sin autorización expresa.

Versiones esperadas:

- fondo claro
- fondo oscuro
- isotipo
- imagotipo
- favicon
- icono app

Si existe una referencia visual en:

```text
docs/assets/kentro-brand-reference.png
```

usar esa imagen como referencia principal.

---

## 42. Design Tokens

Priorizar variables CSS / tokens en vez de valores sueltos.

Base sugerida:

```css
:root {
  --kentro-navy: #0B1E3F;
  --kentro-cobalt: #2563FF;
  --kentro-blue: #0EA5FF;
  --kentro-cyan: #22D3EE;
  --kentro-teal: #14B8A6;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
}
```

Evitar repetir valores arbitrarios pantalla por pantalla.

---

## 43. Responsive

Aunque Kentro sea desktop, la UI debe adaptarse a diferentes resoluciones.

Preferir:

- flex
- grid
- minmax
- clamp

Evitar dimensiones rígidas innecesarias.

---

## 44. Principios de desarrollo

Priorizar siempre:

- seguridad
- mantenibilidad
- escalabilidad
- separación de responsabilidades
- consistencia
- modularidad
- pruebas
- documentación
- legibilidad

No crear soluciones rápidas que comprometan la arquitectura.

---

## 45. Regla antes de implementar una funcionalidad

Antes de programar cualquier funcionalidad:

1. revisar impacto multi-tenant
2. revisar permisos
3. revisar auditoría
4. revisar migraciones
5. revisar compatibilidad de versiones
6. revisar seguridad
7. revisar identidad visual
8. revisar componentes reutilizables
9. plantear plan de implementación
10. implementar
11. probar

---

## 46. Forma de trabajo esperada del agente

Para tareas grandes:

1. analizar primero
2. inspeccionar el código existente
3. proponer plan
4. indicar archivos afectados
5. indicar dependencias
6. señalar riesgos
7. implementar
8. ejecutar pruebas
9. revisar diff
10. resumir cambios

No rehacer componentes funcionales sin necesidad.

Conservar código existente siempre que sea razonable.

---

## 47. Estado actual del proyecto

El proyecto Kentro ya tiene trabajo iniciado en Electron.

Existen o han sido trabajadas interfaces de:

- acceso
- menú principal
- personalización

Antes de reemplazar estas pantallas, inspeccionar si pueden reutilizarse.

---

## 48. Primera meta técnica

Antes de desarrollar todos los módulos de negocio debe funcionar este flujo:

1. crear Negocio A
2. crear Negocio B
3. crear automáticamente tenant para cada uno
4. crear propietario de cada empresa
5. instalar Kentro
6. iniciar sesión con Empresa A
7. detectar Empresa A
8. acceder al dashboard
9. cerrar sesión
10. iniciar sesión con Empresa B
11. detectar Empresa B
12. comprobar aislamiento absoluto entre ambas empresas

Este flujo es prioritario.

---

## 49. Primera versión comercial

Kentro 1.0 debe priorizar:

- autenticación
- empresas
- usuarios
- roles
- permisos
- personalización
- clientes
- productos
- categorías
- inventario
- ventas
- caja
- créditos
- gastos
- dashboard
- reportes básicos
- membresías
- licencias
- dispositivos
- actualizaciones automáticas

---

## 50. Roadmap inicial

Orden recomendado:

```text
FASE 1  Arquitectura backend
FASE 2  Base central
FASE 3  Tenant provisioning
FASE 4  Autenticación
FASE 5  Roles y permisos
FASE 6  Dispositivos
FASE 7  Conectar Electron
FASE 8  Personalización
FASE 9  Productos
FASE 10 Inventario
FASE 11 Clientes
FASE 12 Ventas
FASE 13 Caja
FASE 14 Créditos
FASE 15 Gastos
FASE 16 Estadísticas
FASE 17 Reportes
FASE 18 Membresías
FASE 19 Actualizador
FASE 20 Instalador producción
```

---

## 51. Definition of Done

Una tarea no está terminada solo porque compile.

Antes de finalizar una tarea:

- ejecutar tests relacionados
- ejecutar lint si existe
- verificar errores
- revisar multi-tenancy
- revisar permisos
- revisar seguridad
- verificar que no se agregaron secretos
- verificar migraciones si aplica
- revisar git diff
- confirmar que la identidad visual se respeta
- documentar cambios relevantes

Si una prueba no puede ejecutarse, explicar claramente por qué.

---

## 52. Regla final

No sacrificar la arquitectura de Kentro por velocidad de implementación.

Toda nueva decisión debe mantener el objetivo principal:

> Una sola aplicación Kentro, distribuida a miles de negocios, con datos aislados, actualizaciones centralizadas, membresías, seguridad, escalabilidad y una identidad visual consistente.
