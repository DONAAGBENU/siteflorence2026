import { createClient } from '@supabase/supabase-js';

const supabaseUrl = ' https://dicyqbjpqggzjlftards.supabase.co ';
const supabaseKey = ' eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpY3lxYmpwcWdnempsZnRhcmRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3NDEwMTIsImV4cCI6MjA4MTMxNzAxMn0.U_9PkSbO5VPMMxgC_2qXicl-8axEyRc-2pPMdIm61hM ';

export const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
