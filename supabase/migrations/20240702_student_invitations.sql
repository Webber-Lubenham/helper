-- Create student invitations table
CREATE TABLE IF NOT EXISTS student_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guardian_id UUID NOT NULL REFERENCES profiles(id),
  email VARCHAR NOT NULL,
  full_name VARCHAR NOT NULL,
  birth_date DATE NOT NULL,
  temporary_password VARCHAR NOT NULL,
  invitation_token VARCHAR NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  accepted BOOLEAN DEFAULT FALSE,
  accepted_at TIMESTAMP WITH TIME ZONE
);

-- Enable row level security
ALTER TABLE student_invitations ENABLE ROW LEVEL SECURITY;

-- Create policy for guardians to view their own invitations
DROP POLICY IF EXISTS "Guardians can view their own invitations" ON student_invitations;
CREATE POLICY "Guardians can view their own invitations"
  ON student_invitations FOR SELECT
  USING (guardian_id = auth.uid());

-- Create policy for guardians to insert their own invitations
DROP POLICY IF EXISTS "Guardians can create invitations" ON student_invitations;
CREATE POLICY "Guardians can create invitations"
  ON student_invitations FOR INSERT
  WITH CHECK (guardian_id = auth.uid());

-- Create policy for guardians to update their own invitations
DROP POLICY IF EXISTS "Guardians can update their own invitations" ON student_invitations;
CREATE POLICY "Guardians can update their own invitations"
  ON student_invitations FOR UPDATE
  USING (guardian_id = auth.uid());

-- Enable realtime for student_invitations
alter publication supabase_realtime add table student_invitations;