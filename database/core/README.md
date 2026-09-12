# Esquema core

La migración inicial está en `001_initial_schema.sql` e incluye businesses, global_users, business_memberships, plans, subscriptions, devices, licenses, database_registry, sessions, refresh_tokens, payments, app_versions y system_logs.

Las contraseñas y claves de licencia se almacenan únicamente como hashes. La tabla `sessions` vincula usuario, negocio y dispositivo para que el backend pueda revocar sesiones y resolver el tenant sin confiar en parámetros del cliente.
