import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Configure connection pool with better settings for stability
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 5, // Reduce connection pool size for better stability
  idleTimeoutMillis: 30000, // Keep connections alive longer
  connectionTimeoutMillis: 10000, // Longer connection timeout
});
export const db = drizzle({ client: pool, schema });