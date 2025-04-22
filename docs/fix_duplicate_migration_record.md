# How to Fix Duplicate Migration Record in Supabase Database

This document provides step-by-step instructions to fix the issue of duplicate migration records in your Supabase PostgreSQL database, which can cause migration failures.

## Problem

When running database migrations, you may encounter an error like:

```
duplicate key value violates unique constraint "schema_migrations_pkey"
```

This means a migration record with the same version already exists in the database.

## Solution

Follow these steps to delete the duplicate migration record and allow migrations to proceed:

### 1. Locate Your Database Connection String

Find your `DATABASE_URL` in your `.env` file or Supabase project settings. It looks like:

```
postgresql://postgres.<project_id>:<password>@<host>:<port>/postgres
```

Example:

```
postgresql://postgres.rsvjnndhbyyxktbczlnk:P+-@@6CUDUJSUpy@aws-0-eu-west-2.pooler.supabase.com:6543/postgres
```

### 2. URL-Encode Special Characters in Password

If your password contains special characters (e.g., `+`, `@`), URL-encode them:

| Character | URL Encoded |
|-----------|-------------|
| +         | %2B         |
| @         | %40         |

For example, password `P+-@@6CUDUJSUpy` becomes `P%2B-%40%406CUDUJSUpy`.

### 3. Connect to the Database Using psql

Run the following command in your terminal, replacing the connection string with your URL-encoded password:

```bash
psql "postgresql://postgres.<project_id>:<encoded_password>@<host>:<port>/postgres"
```

### 4. Delete the Duplicate Migration Record

Run the SQL command to delete the duplicate migration record by version:

```sql
DELETE FROM supabase_migrations.schema_migrations WHERE version = '20240702';
```

### 5. Verify Deletion

Optionally, verify the record is deleted:

```sql
SELECT * FROM supabase_migrations.schema_migrations WHERE version = '20240702';
```

### 6. Retry Migration

After deletion, rerun your migration command.

## Notes

- Always backup your database before running delete commands.
- If you encounter connection issues, verify your connection string and password encoding.
- This document should be kept for future reference to quickly resolve similar issues.

---

Document created to help remember the fix for duplicate migration records in Supabase.
