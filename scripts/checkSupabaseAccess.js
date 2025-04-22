import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://rsvjnndhbyyxktbczlnk.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdmpubmRoYnl5eGt0YmN6bG5rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzQwOTc3OSwiZXhwIjoyMDU4OTg1Nzc5fQ.cnmSutfsHLOWHqMpgIOv5fCHBI0jZG4AN5YJSeHDsEA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAccess() {
  try {
    const { data, error } = await supabase.from('users').select('id').limit(1);

    if (error) {
      console.error('Access check failed:', error);
      return;
    }

    console.log('Access to database confirmed. Sample user ID:', data[0]?.id);
  } catch (err) {
    console.error('Unexpected error during access check:', err);
  }
}

checkAccess();
