import config from "./config/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./db/drizzle",
    schema: "./db/schema/auth.schema.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: config.databaseUrl,
    }
})