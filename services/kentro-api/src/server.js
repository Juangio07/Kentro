"use strict";

// Punto de entrada reservado para la API REST.
// La implementación debe iniciar aquí y mantener PostgreSQL fuera de Electron.
const host = process.env.API_HOST || "127.0.0.1";
const port = Number(process.env.API_PORT || 3000);

console.log(`Kentro API preparada para ${host}:${port}`);
