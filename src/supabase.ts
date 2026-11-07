import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pcfdrglvvmlrjzhwuvze.supabase.co';
const SUPABASE_KEY = 'sb_publishable_btfQ4JKEiDvRm89qO8TZFg_n1rBqVGz';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);