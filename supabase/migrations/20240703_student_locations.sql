-- Create student_locations table
CREATE TABLE IF NOT EXISTS student_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES auth.users(id),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    accuracy DOUBLE PRECISION,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS student_locations_student_id_idx ON student_locations(student_id);
CREATE INDEX IF NOT EXISTS student_locations_timestamp_idx ON student_locations(timestamp);

-- Enable row level security
ALTER TABLE student_locations ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Students can insert their own location
DROP POLICY IF EXISTS "Students can insert their own location" ON student_locations;
CREATE POLICY "Students can insert their own location"
    ON student_locations FOR INSERT
    WITH CHECK (auth.uid() = student_id);

-- Students can view their own location
DROP POLICY IF EXISTS "Students can view their own location" ON student_locations;
CREATE POLICY "Students can view their own location"
    ON student_locations FOR SELECT
    USING (auth.uid() = student_id);

-- Guardians can view locations of their students
DROP POLICY IF EXISTS "Guardians can view locations of their students" ON student_locations;
CREATE POLICY "Guardians can view locations of their students"
    ON student_locations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM guardian_students gs
            WHERE gs.guardian_id = auth.uid()
            AND gs.student_id = student_locations.student_id
        )
    );

-- Enable realtime for this table
alter publication supabase_realtime add table student_locations;