const { createClient } = supabase;

const sb = createClient(
  'https://gnsgrtqclhxkjosjrjat.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imduc2dydHFjbGh4a2pvc2pyamF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxNjQxNzIsImV4cCI6MjA4OTc0MDE3Mn0.YyfKZtkSxlQFos3s8uFXmKWPWKgppwOI7pWqoypCqhY'
);

window.sb = sb;