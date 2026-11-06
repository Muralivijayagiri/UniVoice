export type RoleId =
  | "finance"
  | "admissions"
  | "scholarship"
  | "library"
  | "class_teacher";

export type UniversityRole = {
  id: RoleId;
  name: string;
  shortName: string;
  description: string;
  badge: string;
  accentColor: string;
};

export const UNIVERSITY_ROLES: UniversityRole[] = [
  {
    accentColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    badge: "Dues & Fees",
    description: "Tuition fees, dues, installment tracking & penalties",
    id: "finance",
    name: "Finance Department",
    shortName: "Finance",
  },
  {
    accentColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    badge: "Enrollment",
    description: "Enrollment verification, document intake & counseling",
    id: "admissions",
    name: "Admissions Department",
    shortName: "Admissions",
  },
  {
    accentColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    badge: "Aid & Grants",
    description: "Merit grants, aid disbursement & renewals",
    id: "scholarship",
    name: "Scholarship Section",
    shortName: "Scholarship",
  },
  {
    accentColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    badge: "Circulation",
    description: "Overdue catalog returns, loan renewals & fines",
    id: "library",
    name: "Library Administration",
    shortName: "Library",
  },
  {
    accentColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    badge: "Attendance",
    description:
      "Daily class attendance, absentees, parent alerts & percentage",
    id: "class_teacher",
    name: "Class Teacher",
    shortName: "Class Teacher",
  },
];

export const [DEFAULT_ROLE] = UNIVERSITY_ROLES;
