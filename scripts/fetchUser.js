import { createClient } from '@supabase/supabase-js';

// MCP server configuration
const MCP_ACCESS_TOKEN = 'sbp_5846ad02afffcbddf30ff9a6b55798e54caa83ac';
const MCP_URL = 'https://mcp.supabase.io'; // Replace with actual MCP server URL if different

const supabase = createClient(MCP_URL, MCP_ACCESS_TOKEN, {
  global: {
    headers: {
      'Authorization': `Bearer ${MCP_ACCESS_TOKEN}`,
    },
  },
});

async function fetchUserByEmail(email) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    console.log('User data:', data);
    return data;
  } catch (err) {
    console.error('Unexpected error:', err);
    return null;
  }
}

// Example usage: node scripts/fetchUser.js franklima.flm@gmail.com
const emailArg = process.argv[2];
if (!emailArg) {
  console.error('Please provide an email as the first argument.');
  process.exit(1);
}

fetchUserByEmail(emailArg).then(user => {
  if (user) {
    console.log('Fetched user:', user);
  } else {
    console.log('User not found.');
  }
});