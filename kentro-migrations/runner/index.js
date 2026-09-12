"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { Client } = require("pg");

const connectionString = process.env.CORE_DATABASE_URL;
if (!connectionString) {
    throw new Error("CORE_DATABASE_URL es obligatorio para ejecutar migraciones.");
}

const migrationDirectory = path.resolve(__dirname, "../../database/core");
const migrations = fs.readdirSync(migrationDirectory)
    .filter((file) => /^\d+_.+\.sql$/.test(file))
    .sort();

async function migrate() {
    const client = new Client({ connectionString });
    await client.connect();
    try {
        await client.query("CREATE TABLE IF NOT EXISTS schema_migrations (version VARCHAR(100) PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())");
        for (const file of migrations) {
            const version = file.split("_")[0];
            const applied = await client.query("SELECT 1 FROM schema_migrations WHERE version = $1", [version]);
            if (applied.rowCount) continue;
            await client.query("BEGIN");
            try {
                await client.query(fs.readFileSync(path.join(migrationDirectory, file), "utf8"));
                await client.query("INSERT INTO schema_migrations (version) VALUES ($1)", [version]);
                await client.query("COMMIT");
                console.log(`Migración aplicada: ${file}`);
            } catch (error) {
                await client.query("ROLLBACK");
                throw error;
            }
        }
    } finally {
        await client.end();
    }
}

migrate().catch((error) => {
    console.error("Error ejecutando migraciones:", error.message);
    process.exitCode = 1;
});
