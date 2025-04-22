import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.DATABASE_ACCOUNT_ID || '',
    databaseId: process.env.DATABASE_ID || '',
    token: process.env.DATABASE_TOKEN || ''
  }
} satisfies Config;