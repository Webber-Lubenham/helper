-- Create student_locations table
CREATE TABLE IF NOT EXISTS student_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  accuracy FLOAT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint if the referenced table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
    ALTER TABLE student_locations ADD CONSTRAINT fk_student_id FOREIGN KEY (student_id) REFERENCES profiles(id);
  END IF;
END
$$;

-- Enable row level security
ALTER TABLE student_locations ENABLE ROW LEVEL SECURITY;

-- Create policy for students to insert their own location
DROP POLICY IF EXISTS "Students can insert their own location" ON student_locations;
CREATE POLICY "Students can insert their own location"
  ON student_locations FOR INSERT
  WITH CHECK (student_id = auth.uid());

-- Create policy for students to view their own location
DROP POLICY IF EXISTS "Students can view their own location" ON student_locations;
CREATE POLICY "Students can view their own location"
  ON student_locations FOR SELECT
  USING (student_id = auth.uid());

-- Create policy for guardians to view their students' locations
DROP POLICY IF EXISTS "Guardians can view their students' locations" ON student_locations;
CREATE POLICY "Guardians can view their students' locations"
  ON student_locations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM guardian_students
      WHERE guardian_students.guardian_id = auth.uid()
      AND guardian_students.student_id = student_locations.student_id
    )
  );

-- Enable realtime for student_locations
alter publication supabase_realtime add table student_locations;