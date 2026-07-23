const SUPABASE_URL = "https://ickkvxkangkjmfxiwltf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlja2t2eGthbmdram1meGl3bHRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NTA1NzksImV4cCI6MjEwMDEyNjU3OX0.9LNleuf6sUN9p61ALa-v4v4o25k2B8kIAQK-kJoEwnk";

window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);