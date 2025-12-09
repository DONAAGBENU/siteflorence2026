import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eyhlfgqlushpqiyrmxyx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5aGxmZ3FsdXNocHFpeXJteHl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5Nzk5MjAsImV4cCI6MjA4MDU1NTkyMH0.4zD9GpEdNoU-qGEta7q_9NEveUUm6dMlIzZRwGvZgIY';

export const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
