import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./db/drizzle",
    schema: "./db/schema/*.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL || 'postgres://localhost:5432/mydb',
    }
})