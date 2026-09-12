import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://novcnzltmwoudbaonmbn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vdmNuemx0bXdvdWRiYW9ubWJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyMTkxMjcsImV4cCI6MjEwNDc5NTEyN30.c8jtuXNrJmSdWVR8MGlj4_B2Ig29_wANwtBlhLeCUmQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)