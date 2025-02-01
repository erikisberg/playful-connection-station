// supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qkpjovgifplrposowyiz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrcGpvdmdpZnBscnBvc293eWl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MDQ4NzksImV4cCI6MjA1Mzk4MDg3OX0.7vRcZc7EEfc80zzC0tkEzbV8M8MgAGzc9fg0glWXraQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);