import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dtdijdopizqtdkpurpop.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0ZGlqZG9waXpxdGRrcHVycG9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NDg2NjEsImV4cCI6MjA4MDAyNDY2MX0.Vou2lrLINAb5SrZpRZka2Hg4AZh_MZFh3lK1Mb5mrSI';

export const supabase = createClient(supabaseUrl, supabaseKey);