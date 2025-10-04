import { Pool } from "pg";
import { drizzle } from 'drizzle-orm/node-postgres';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

let pool: Pool | null = null;
let dbInstance: NodePgDatabase | null = null;

export function getDb() {
  if (!dbInstance) {
    if (!pool) {
      // Only load config when actually needed
      const databaseUrl = process.env.DATABASE_URL;
      
      if (!databaseUrl) {
        throw new Error('DATABASE_URL environment variable is not set');
      }

      pool = new Pool({
        connectionString: databaseUrl,
        max: 1, // Critical for serverless - only 1 connection
        connectionTimeoutMillis: 5000, // Fail fast
        idleTimeoutMillis: 30000,
      });

      pool.on('error', (err) => {
        console.error('Unexpected pool error:', err);
      });
    }
    
    dbInstance = drizzle(pool);
  }
  
  return dbInstance;
}

// For backwards compatibility - allows using db directly
export const db = new Proxy({} as NodePgDatabase, {
  get(target, prop) {
    return getDb()[prop as keyof NodePgDatabase];
  }
});