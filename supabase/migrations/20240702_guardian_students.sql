-- Create guardian_students relationship table
CREATE TABLE IF NOT EXISTS guardian_students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guardian_id UUID NOT NULL REFERENCES profiles(id),
  student_id UUID NOT NULL REFERENCES profiles(id),
  relationship VARCHAR,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(guardian_id, student_id)
);

-- Enable row level security
ALTER TABLE guardian_students ENABLE ROW LEVEL SECURITY;

-- Create policy for guardians to view their own student relationships
DROP POLICY IF EXISTS "Guardians can view their own student relationships" ON guardian_students;
CREATE POLICY "Guardians can view their own student relationships"
  ON guardian_students FOR SELECT
  USING (guardian_id = auth.uid());

-- Create policy for students to view their own guardian relationships
DROP POLICY IF EXISTS "Students can view their own guardian relationships" ON guardian_students;
CREATE POLICY "Students can view their own guardian relationships"
  ON guardian_students FOR SELECT
  USING (student_id = auth.uid());

-- Enable realtime for guardian_students
alter publication supabase_realtime add table guardian_students;