import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fawtqairqaixpsqxbmnc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhd3RxYWlycWFpeHBzcXhibW5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2MTY3OTAsImV4cCI6MjA2NzE5Mjc5MH0.84JePVTyKZSW-IyJPZz5xIbo_lbeMnZztg0pnlbgN3Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);