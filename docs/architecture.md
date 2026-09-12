# Arquitectura Kentro

```text
Kentro Desktop / Web / Admin
              ↓ HTTPS
          Kentro API
              ↓
     Tenant Resolver / Manager
              ↓
          PostgreSQL
```

La aplicación Desktop no se conecta directamente a PostgreSQL. El tenant se obtiene desde la sesión autenticada y nunca desde un `business_id` libre enviado por el cliente.

Primera meta verificable: crear dos negocios, provisionar dos bases, autenticar propietarios de cada negocio y demostrar aislamiento absoluto mediante pruebas de API.
