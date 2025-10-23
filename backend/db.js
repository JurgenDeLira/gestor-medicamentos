import 'dotenv/config';
import pkg from "pg";
const { Pool } = pkg;
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from 'url';

// Reemplazar a path.dirname()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Configurar conexión con la base de datos
const connectionString = process.env.DATABASE_URL;

const pool = connectionString
? new Pool({
    connectionString,
    ssl: connectionString.includes("neon.tech")
    ? {rejectUnauthorized: false }
    :undefined,
})
: new Pool({
    host: process.env.PGHOST || "localhost",
    port: +(process.env.PGPORT || 5432),
    user: process.env.PGUSER || "postgres",
    password: process.env.PGPASSWORD || "postgres",
    database: process.env.PGDATABASE || "inventario",
});

// Ejecutar migraciones y seeder si se indica
if (process.env.RUN_MIGRATIONS === "true") {
    try {
        // Se ejecuta script de creación de tablas
        const initialMigration = await fs.readFile(
            path.join(__dirname, "sql", "Initial.sql"),
            "utf-8"
        );
        
        await pool.query(initialMigration);
        console.log("Migración inicial ejecutada");

        //Ejecutar script con datos iniciales

        const seeder = await fs.readFile(
            path.join(__dirname, "sql", "seeder.sql"),
            "utf-8"
        );

        await pool.query(seeder);
        console.log("Datos iniciales insertados");
    } catch (err) {
        console.error("Error al ejecutar migraciones o seeder:", err);
    }
}

export default pool;
