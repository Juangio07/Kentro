const { Client } = require("pg");

const businessId = process.env.BUSINESS_ID;
const databaseName = process.env.TENANT_DATABASE_NAME;
const adminUrl = process.env.POSTGRES_ADMIN_URL;
const coreUrl = process.env.CORE_DATABASE_URL;

if (!businessId || !databaseName || !adminUrl || !coreUrl) {
    throw new Error("BUSINESS_ID, TENANT_DATABASE_NAME, POSTGRES_ADMIN_URL y CORE_DATABASE_URL son obligatorios.");
}

if (!/^[a-z][a-z0-9_]{0,62}$/.test(databaseName)) {
    throw new Error("TENANT_DATABASE_NAME contiene caracteres no permitidos.");
}

async function provisionTenant() {
    const admin = new Client({ connectionString: adminUrl });
    await admin.connect();
    try {
        const exists = await admin.query("SELECT 1 FROM pg_database WHERE datname = $1", [databaseName]);
        if (!exists.rowCount) {
            await admin.query(`CREATE DATABASE "${databaseName}"`);
            console.log(`Base tenant creada: ${databaseName}`);
        }
    } finally {
        await admin.end();
    }

    const core = new Client({ connectionString: coreUrl });
    await core.connect();
    try {
        await core.query(
            `INSERT INTO database_registry (business_id, host_alias, database_name, status)
             VALUES ($1, $2, $3, 'provisioning')
             ON CONFLICT (business_id) DO UPDATE SET database_name = EXCLUDED.database_name,
                 updated_at = now()`,
            [businessId, process.env.TENANT_HOST_ALIAS || "primary", databaseName]
        );
    } finally {
        await core.end();
    }
}

provisionTenant().catch((error) => {
    console.error("Error provisionando tenant:", error.message);
    process.exitCode = 1;
});
