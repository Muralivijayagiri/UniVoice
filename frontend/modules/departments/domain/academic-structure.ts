export interface AcademicDepartment {
  dept_id: string;
  dept_name: string;
}

export interface AcademicBranch {
  branch_id: string;
  branch_name: string;
  dept_id: string;
}

/**
 * Academic Departments aligned with live Supabase database
 */
export const ACADEMIC_DEPARTMENTS: AcademicDepartment[] = [
  { dept_id: "CIVIL", dept_name: "Civil Engineering" },
  { dept_id: "MECH", dept_name: "Mechanical Engineering" },
  { dept_id: "CSE", dept_name: "Computer Science & Engineering" },
  { dept_id: "EEE", dept_name: "Electrical & Electronics Engineering" },
  { dept_id: "ET", dept_name: "Emerging Technologies" },
  {
    dept_id: "ECE",
    dept_name: "Electronics & Communication Engineering",
  },
  { dept_id: "IT", dept_name: "Information Technology" },
  {
    dept_id: "MME",
    dept_name: "Metallurgical & Materials Engineering",
  },
];

/**
 * Academic Branches with strict MGIT acronym tags for branch_id
 */
export const ACADEMIC_BRANCHES: AcademicBranch[] = [
  { branch_id: "CIVIL", branch_name: "Civil Engineering", dept_id: "CIVIL" },
  { branch_id: "MEC", branch_name: "Mechanical Engineering", dept_id: "MECH" },
  { branch_id: "MCT", branch_name: "Mechatronics", dept_id: "MECH" },
  {
    branch_id: "CSE",
    branch_name: "Computer Science & Eng.",
    dept_id: "CSE",
  },
  {
    branch_id: "EEE",
    branch_name: "Electrical & Electronics",
    dept_id: "EEE",
  },
  {
    branch_id: "ECE",
    branch_name: "Electronics & Comm.",
    dept_id: "ECE",
  },
  {
    branch_id: "IT",
    branch_name: "Information Technology",
    dept_id: "IT",
  },
  {
    branch_id: "CSB",
    branch_name: "Computer Science & Business Systems",
    dept_id: "IT",
  },
  {
    branch_id: "MME",
    branch_name: "Metallurgical & Materials",
    dept_id: "MME",
  },
  {
    branch_id: "CSD",
    branch_name: "CSE - Data Science",
    dept_id: "ET",
  },
  { branch_id: "CSM", branch_name: "CSE - AI & ML", dept_id: "ET" },
];
