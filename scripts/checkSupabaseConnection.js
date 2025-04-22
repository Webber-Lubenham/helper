import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

/**
 * Script to check connection to Supabase by querying the 'users' table.
 * 
 * Usage:
 * 1. Set environment variables VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_KEY with your Supabase project URL and service key.
 * 2. Run this script with Node.js: `node scripts/checkSupabaseConnection.js`
 */

// Supabase project URL and service key from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL or Service Key not found in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkConnection() {
  try {
    // Query the 'users' table to verify connection and access
    const { data, error } = await supabase.from('users').select('id').limit(1);

    if (error) {
      if (error.code === '42501') {
        console.error('Permission denied error: The service key does not have access to the public schema or users table.');
        console.error('Please check your Supabase role permissions and service key.');
      } else {
        console.error('Error querying users table:', error);
      }
      process.exit(1);
    }

    if (data.length === 0) {
      console.warn('No users found in the database.');
    } else {
      console.log('Connection successful. Sample user ID:', data[0].id);
    }
  } catch (err) {
    console.error('Unexpected error during connection check:', err);
    process.exit(1);
  }
}

checkConnection();
