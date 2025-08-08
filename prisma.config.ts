
import { defineConfig } from '@prisma/config';
import path from 'path';
import dotenv from 'dotenv';

// Load .env manually
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  schema: './src/prisma/schema.prisma',
});
