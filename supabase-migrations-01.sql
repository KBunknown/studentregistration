-- 1. Add new columns to registrations table
ALTER TABLE public.registrations
ADD COLUMN IF NOT EXISTS study_type TEXT,
ADD COLUMN IF NOT EXISTS academic_stage TEXT,
ADD COLUMN IF NOT EXISTS room_number TEXT,
ADD COLUMN IF NOT EXISTS english_certificate_pathway TEXT,
ADD COLUMN IF NOT EXISTS programme_status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS requires_academic_review BOOLEAN DEFAULT false;

-- 2. Backfill existing data
UPDATE public.registrations
SET 
  study_type = 'bsc',
  academic_stage = CASE 
    WHEN level = 'Level 100' THEN 'level_100'
    WHEN level = 'Level 200' THEN 'level_200'
    WHEN level = 'Level 300' THEN 'level_300'
    WHEN level = 'Level 400' THEN 'level_400'
    ELSE 'level_100'
  END
WHERE study_type IS NULL;

-- 3. Create student_academic_history table
CREATE TABLE IF NOT EXISTS public.student_academic_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
  study_type TEXT NOT NULL,
  programme_name TEXT NOT NULL,
  academic_stage TEXT NOT NULL,
  status TEXT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  transition_source TEXT,
  transition_destination TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  approved_by UUID
);

ALTER TABLE public.student_academic_history ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for the initial record
CREATE POLICY "anon_can_insert_history"
ON public.student_academic_history FOR INSERT
TO anon
WITH CHECK (true);

-- Allow anonymous SELECT to read history
CREATE POLICY "anon_can_select_history"
ON public.student_academic_history FOR SELECT
TO anon
USING (true);

-- 4. Create an RPC to safely approve transitions for English Certificate students
CREATE OR REPLACE FUNCTION approve_english_certificate_transition(
  p_student_id UUID,
  p_new_study_type TEXT,
  p_new_academic_stage TEXT,
  p_new_programme_name TEXT
) RETURNS VOID AS $$
DECLARE
  v_current_programme TEXT;
  v_current_study_type TEXT;
  v_current_stage TEXT;
  v_pathway TEXT;
BEGIN
  -- Fetch current status
  SELECT program, study_type, academic_stage, english_certificate_pathway
  INTO v_current_programme, v_current_study_type, v_current_stage, v_pathway
  FROM public.registrations
  WHERE id = p_student_id;

  -- Ensure they are currently an English Certificate student
  IF v_current_study_type != 'english_certificate' THEN
    RAISE EXCEPTION 'Student is not currently enrolled in the English Certificate programme.';
  END IF;

  -- Log the completed certificate into history
  INSERT INTO public.student_academic_history (
    student_id, study_type, programme_name, academic_stage, status, completed_at, transition_destination
  ) VALUES (
    p_student_id, v_current_study_type, v_current_programme, v_current_stage, 'completed', now(), p_new_study_type
  );

  -- Update the student's active registration to the new programme
  UPDATE public.registrations
  SET 
    study_type = p_new_study_type,
    academic_stage = p_new_academic_stage,
    program = p_new_programme_name,
    "otherProgram" = NULL,
    english_certificate_pathway = NULL,
    programme_status = 'active'
  WHERE id = p_student_id;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
