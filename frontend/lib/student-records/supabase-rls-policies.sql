-- ==============================================================================
-- UNIVOICE: Least-Privilege Read-Only Row Level Security (RLS) Policies
-- Tables: students, student_fees, branches, departments, college_admissions,
--         scholarship_applications, library_transactions
-- ==============================================================================

-- 1. Enable Row Level Security (RLS) across all required tables
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarship_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_transactions ENABLE ROW LEVEL SECURITY;

-- 2. Drop any legacy/unsecured public policies if they exist
DROP POLICY IF EXISTS "Public select departments" ON public.departments;
DROP POLICY IF EXISTS "Public select branches" ON public.branches;
DROP POLICY IF EXISTS "Public select students" ON public.students;
DROP POLICY IF EXISTS "Public select student_fees" ON public.student_fees;
DROP POLICY IF EXISTS "Public select college_admissions" ON public.college_admissions;
DROP POLICY IF EXISTS "Public select scholarship_applications" ON public.scholarship_applications;
DROP POLICY IF EXISTS "Public select library_transactions" ON public.library_transactions;

-- 3. Reference Data Policies (Public Read-Only)
-- Departments and branches contain non-sensitive academic structure metadata
CREATE POLICY "Allow read access to departments"
  ON public.departments
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow read access to branches"
  ON public.branches
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 4. Sensitive Student Records Policies (Authenticated Read-Only, Anon Denied)
-- Unauthenticated anon requests are strictly denied access to student personal info
CREATE POLICY "Allow authenticated read-only access to students"
  ON public.students
  FOR SELECT
  TO authenticated
  USING (true);

-- 5. Student Fees Ledger Policies (Authenticated Read-Only, Anon Denied)
-- Fee ledger and dues are restricted strictly to authenticated university roles
CREATE POLICY "Allow authenticated read-only access to student_fees"
  ON public.student_fees
  FOR SELECT
  TO authenticated
  USING (true);

-- 6. College Admissions Policies (Authenticated Read-Only, Anon Denied)
-- Applicant entrance ranks, quotas, and document submissions restricted
CREATE POLICY "Allow authenticated read-only access to college_admissions"
  ON public.college_admissions
  FOR SELECT
  TO authenticated
  USING (true);

-- 7. Scholarship Applications Policies (Authenticated Read-Only, Anon Denied)
-- Aid schemes, verification state, and missing documents restricted
CREATE POLICY "Allow authenticated read-only access to scholarship_applications"
  ON public.scholarship_applications
  FOR SELECT
  TO authenticated
  USING (true);

-- 8. Library Transactions Policies (Authenticated Read-Only, Anon Denied)
-- Circulation history, overdue books, and transaction records restricted
CREATE POLICY "Allow authenticated read-only access to library_transactions"
  ON public.library_transactions
  FOR SELECT
  TO authenticated
  USING (true);

