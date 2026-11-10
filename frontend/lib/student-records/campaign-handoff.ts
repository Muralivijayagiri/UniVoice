import { formatCurrency } from "@/components/student-records/columns/finance-columns";
import { formatDate } from "@/components/student-records/columns/library-columns";
import type { CampaignPreviewData, CampaignStudent } from "@/lib/campaign";
import type { RoleId, UniversityRole } from "@/lib/roles";
import {
  ACADEMIC_BRANCHES,
  ACADEMIC_DEPARTMENTS,
} from "@/modules/departments/domain/academic-structure";
import type { StudentRecordsFilterState } from "@/modules/students/domain/filters";
import type {
  AdmissionsRecord,
  ClassTeacherStudentRecord,
  FinanceStudentRecord,
  LibraryStudentRecord,
  ScholarshipStudentRecord,
  StudentRecord,
} from "@/modules/students/domain/types";

/**
 * Builds a natural description of the active selection filters
 */
export function describeAudienceCriteria(
  roleId: RoleId,
  filters: StudentRecordsFilterState
): string {
  const criteria: string[] = [];

  if (filters.department && filters.department !== "all") {
    const dept = ACADEMIC_DEPARTMENTS.find(
      (d) => d.dept_id === filters.department
    );
    criteria.push(`Department: ${dept ? dept.dept_name : filters.department}`);
  }

  if (filters.branch && filters.branch !== "all") {
    const branch = ACADEMIC_BRANCHES.find(
      (b) => b.branch_id === filters.branch
    );
    criteria.push(`Branch: ${branch ? branch.branch_id : filters.branch}`);
  }

  if (roleId !== "admissions") {
    if (filters.semester && filters.semester !== "all") {
      criteria.push(`Semester: Sem ${filters.semester}`);
    }
    if (filters.section && filters.section !== "all") {
      criteria.push(`Section: ${filters.section}`);
    }
  }

  switch (roleId) {
    case "finance":
      if (filters.academicYear && filters.academicYear !== "all") {
        criteria.push(`Year: ${filters.academicYear}`);
      }
      if (filters.feeType && filters.feeType !== "all") {
        criteria.push(`Fee Type: ${filters.feeType}`);
      }
      if (filters.paymentStatus && filters.paymentStatus !== "all") {
        criteria.push(`Payment Status: ${filters.paymentStatus}`);
      }
      break;

    case "admissions":
      if (filters.quotaType && filters.quotaType !== "all") {
        criteria.push(`Quota: ${filters.quotaType}`);
      }
      if (filters.docsSubmitted && filters.docsSubmitted !== "all") {
        criteria.push(
          `Original Docs: ${
            filters.docsSubmitted === "yes" ? "Submitted" : "Pending"
          }`
        );
      }
      if (filters.admissionStatus && filters.admissionStatus !== "all") {
        criteria.push(`Status: ${filters.admissionStatus}`);
      }
      break;

    case "scholarship":
      if (filters.academicYear && filters.academicYear !== "all") {
        criteria.push(`Year: ${filters.academicYear}`);
      }
      if (filters.applicationType && filters.applicationType !== "all") {
        criteria.push(`Application Type: ${filters.applicationType}`);
      }
      if (filters.scholarshipStatus && filters.scholarshipStatus !== "all") {
        criteria.push(`Status: ${filters.scholarshipStatus}`);
      }
      break;

    case "library":
      if (filters.libraryStatus && filters.libraryStatus !== "all") {
        criteria.push(`Status: ${filters.libraryStatus}`);
      }
      break;

    case "class_teacher":
      if (filters.attendanceStatus && filters.attendanceStatus !== "all") {
        criteria.push(`Attendance: ${filters.attendanceStatus}`);
      }
      if (filters.attendanceDate && filters.attendanceDate !== "all") {
        criteria.push(`Date: ${filters.attendanceDate}`);
      }
      break;

    default:
      break;
  }

  return criteria.length > 0
    ? criteria.join(" | ")
    : "Active filtered view selection";
}

/**
 * Formats a single student record with department-relevant fields and unmasked phone number
 */
export function formatStudentDetail(
  record: StudentRecord,
  roleId: RoleId,
  index: number
): string {
  switch (roleId) {
    case "finance": {
      const fin = record as FinanceStudentRecord;
      const sem = fin.semester ?? fin.current_semester;
      const semStr = sem ? `Sem ${sem}` : "—";
      const branch = fin.branch_name ?? fin.branch_id ?? "—";
      const sec = fin.section ? `Sec ${fin.section}` : "";
      const branchInfo = [branch, semStr, sec].filter(Boolean).join(" | ");
      const hasFeeInfo =
        fin.fee_type !== undefined ||
        fin.amount_due !== undefined ||
        fin.status !== undefined;
      const feeLine = hasFeeInfo
        ? `\n   - Fee Type: ${fin.fee_type ?? "Tuition"} | Amount Due: ${formatCurrency(
            fin.amount_due
          )} | Status: ${fin.status ?? "Pending"}`
        : "";

      return `${index}. **${fin.first_name} ${fin.last_name}** (Roll No: \`${fin.roll_number}\`)
   - Academic: ${branchInfo}${feeLine}
   - Phone: ${fin.phone_number}`;
    }

    case "admissions": {
      const adm = record as AdmissionsRecord;
      const appRef = adm.application_number
        ? `App No: \`${adm.application_number}\``
        : `Roll No: \`${(adm as { roll_number?: string }).roll_number ?? "—"}\``;
      const branch = adm.branch_name ?? adm.branch_id ?? "—";
      const hasAdmInfo =
        adm.quota_type !== undefined ||
        adm.original_docs_submitted !== undefined ||
        adm.status !== undefined;
      const docs = adm.original_docs_submitted
        ? "Yes (Submitted)"
        : "No (Pending)";
      const admLine = hasAdmInfo
        ? `\n   - Quota: ${adm.quota_type ?? "—"} | Rank: ${adm.entrance_rank ?? "—"}\n   - Docs Submitted: ${docs} | Admission Status: ${adm.status ?? "—"}`
        : "";

      return `${index}. **${adm.first_name} ${adm.last_name}** (${appRef})
   - Branch: ${branch}${admLine}
   - Phone: ${adm.phone_number}`;
    }

    case "scholarship": {
      const sch = record as ScholarshipStudentRecord;
      const sem = sch.semester ?? sch.current_semester;
      const semStr = sem ? `Sem ${sem}` : "—";
      const branch = sch.branch_name ?? sch.branch_id ?? "—";
      const hasSchInfo =
        sch.application_type !== undefined ||
        sch.status !== undefined ||
        sch.missing_documents !== undefined;
      const docs = sch.missing_documents
        ? Array.isArray(sch.missing_documents)
          ? sch.missing_documents.join(", ")
          : sch.missing_documents
        : "None";
      const schLine = hasSchInfo
        ? `\n   - Scheme: ${sch.application_type ?? "—"} | Status: ${sch.status ?? "—"}\n   - Missing Documents: ${docs}`
        : "";

      return `${index}. **${sch.first_name} ${sch.last_name}** (Roll No: \`${sch.roll_number}\`)
   - Academic: ${branch} | ${semStr}${schLine}
   - Phone: ${sch.phone_number}`;
    }

    case "library": {
      const lib = record as LibraryStudentRecord;
      const branch = lib.branch_name ?? lib.branch_id ?? "—";
      const hasLibInfo =
        lib.book_title !== undefined || lib.status !== undefined;
      const libLine = hasLibInfo
        ? `\n   - Book Title: "${lib.book_title ?? "—"}"\n   - Loan Period: Issued ${formatDate(lib.issue_date)} | Due ${formatDate(lib.due_date)} | Status: ${lib.status ?? "—"}`
        : "";

      return `${index}. **${lib.first_name} ${lib.last_name}** (Roll No: \`${lib.roll_number}\`)
   - Academic: ${branch}${libLine}
   - Phone: ${lib.phone_number}`;
    }

    case "class_teacher": {
      const att = record as ClassTeacherStudentRecord;
      const sem = att.semester ?? att.current_semester;
      const semStr = sem ? `Sem ${sem}` : "—";
      const branch = att.branch_name ?? att.branch_id ?? "—";
      const sec = att.section ? `Sec ${att.section}` : "";
      const branchInfo = [branch, semStr, sec].filter(Boolean).join(" | ");
      const pct =
        att.attendance_percentage !== undefined &&
        att.attendance_percentage !== null
          ? `${att.attendance_percentage}%`
          : "—";

      let attLine = "";
      if (att.status || att.attendance_date) {
        attLine = `\n   - Attendance: ${att.status ?? "—"} on ${att.attendance_date ?? "—"} | Aggregate: ${pct}`;
      } else if (
        att.attendance_percentage !== undefined &&
        att.attendance_percentage !== null
      ) {
        attLine = `\n   - Attendance: ${pct}`;
      }

      return `${index}. **${att.first_name} ${att.last_name}** (Roll No: \`${att.roll_number}\`)
   - Academic: ${branchInfo}${attLine}
   - Phone: ${att.phone_number}`;
    }

    default:
      return `${index}. Student: \`${JSON.stringify(record)}\``;
  }
}

/**
 * Generates the structured campaign draft pre-fill for the chat composer
 */
export function generateCampaignDraft({
  filters,
  records,
  role,
}: {
  filters: StudentRecordsFilterState;
  records: StudentRecord[];
  role: UniversityRole;
}): string {
  const count = records.length;
  const audience = describeAudienceCriteria(role.id, filters);

  const studentList = records
    .map((rec, i) => formatStudentDetail(rec, role.id, i + 1))
    .join("\n\n");

  return `Prepare an automated voice outreach campaign for the following selected students from the **${role.name}**.

### Campaign Parameters
- **Issuing Department**: ${role.name}
- **Target Audience**: ${audience}
- **Selected Recipients**: ${count} student${count === 1 ? "" : "s"}

### Selected Students
${studentList}

### Instructions for Voice Agent
1. Formulate a personalized, respectful voice outreach script tailored to the ${role.name}.
2. Ensure specific details for each student are clearly communicated during the call (e.g. pending dues, required documents, or overdue catalog items).
3. Prepare a campaign preview for verification before dialing any numbers.`;
}

/**
 * Parses a structured campaign draft from the chat composer into CampaignPreviewData
 * for the simulated voice campaign workflow.
 * Returns null if the text is not a structured campaign draft.
 */
export function parseCampaignDraft(text: string): CampaignPreviewData | null {
  if (!text || typeof text !== "string") {
    return null;
  }

  const trimmed = text.trim();
  const isDraft =
    trimmed.includes("### Campaign Parameters") ||
    trimmed.includes("### Selected Students") ||
    trimmed.startsWith("Prepare an automated voice outreach campaign");

  if (!isDraft) {
    return null;
  }

  const deptMatch =
    trimmed.match(/- \*\*Issuing Department\*\*:\s*([^\n]+)/) ||
    trimmed.match(/selected students from the \*\*([^*]+)\*\*/);
  const rawDept = deptMatch ? deptMatch[1].trim() : "Outreach Section";
  const lowerDept = rawDept.toLowerCase();

  let roleId: RoleId = "finance";
  let typeKey: CampaignPreviewData["typeKey"] = "tuition";
  let extraColumnHeader = "Outstanding Balance";

  if (
    lowerDept.includes("class teacher") ||
    lowerDept.includes("teacher") ||
    lowerDept.includes("attendance")
  ) {
    roleId = "class_teacher";
    typeKey = "class_teacher";
    extraColumnHeader = "Attendance %";
  } else if (lowerDept.includes("admission")) {
    roleId = "admissions";
    typeKey = "admissions";
    extraColumnHeader = "Admission Status";
  } else if (lowerDept.includes("scholarship")) {
    roleId = "scholarship";
    typeKey = "scholarship";
    extraColumnHeader = "Missing Document";
  } else if (lowerDept.includes("library")) {
    roleId = "library";
    typeKey = "library";
    extraColumnHeader = "Overdue Item";
  }

  const audMatch = trimmed.match(/- \*\*Target Audience\*\*:\s*([^\n]+)/);
  const audience = audMatch ? audMatch[1].trim() : "Filtered View Selection";

  const countMatch = trimmed.match(/- \*\*Selected Recipients\*\*:\s*(\d+)/);
  const targetCount = countMatch ? Number.parseInt(countMatch[1], 10) : 0;

  const studentRegex =
    /(?:^|\n)\s*\d+\.\s+\*\*([^*]+)\*\*\s+\((?:Roll No|App No):\s*`?([^`)\n]+)`?\)([\s\S]*?)(?=(?:\n\s*\d+\.\s+\*\*|\n\s*###|$))/g;

  const students: CampaignStudent[] = [];
  let m: RegExpExecArray | null = null;

  while (true) {
    m = studentRegex.exec(trimmed);
    if (m === null) {
      break;
    }

    const [, rawName, rawIdNumber, body] = m;
    const name = rawName.trim();
    const idNumber = rawIdNumber.replace(/`/g, "").trim();

    const phoneM = body.match(/- Phone:\s*([^\n]+)/);
    const phone = phoneM ? phoneM[1].trim() : "—";

    const acadM =
      body.match(/- Academic:\s*([^\n]+)/) ||
      body.match(/- Branch:\s*([^\n]+)/);
    const program = acadM ? acadM[1].trim() : undefined;

    let attendancePercentage: string | undefined;
    const attM = body.match(/- Attendance:\s*([^\n]+)/);
    if (attM) {
      const aggM = attM[1].match(/Aggregate:\s*([^\s|]+)/);
      attendancePercentage = aggM ? aggM[1].trim() : attM[1].trim();
    }

    const balM = body.match(/Amount Due:\s*([^\s|\n]+)/);
    const balance = balM ? balM[1].trim() : undefined;

    const docsM = body.match(/Missing Documents:\s*([^\n|]+)/);
    const missingDocs = docsM ? docsM[1].trim() : undefined;

    const itemM = body.match(/Book Title:\s*"([^"]+)"/);
    const overdueItem = itemM ? itemM[1].trim() : undefined;

    const statM =
      body.match(/Admission Status:\s*([^\n|]+)/) ||
      body.match(/Status:\s*([^\n|]+)/);
    const admissionStatus = statM ? statM[1].trim() : undefined;

    students.push({
      admissionStatus,
      attendancePercentage,
      balance,
      id: `rec-${idNumber}`,
      idNumber,
      missingDocs,
      name,
      overdueItem,
      phone,
      program,
    });
  }

  const finalCount = students.length > 0 ? students.length : targetCount;

  return {
    callRecommended: true,
    createdAt: new Date().toISOString(),
    dataOverview: `Loaded from Student Records directory; ${finalCount} student recipient${finalCount === 1 ? "" : "s"} staged for simulated voice campaign.`,
    dataSources: ["student_master_db", "student_records_view"],
    department: rawDept,
    extraColumnHeader,
    id: `camp-${roleId}-${Date.now().toString().slice(-4)}`,
    recommendationReason:
      "Verified student contact numbers ready for outbound voice campaign dispatch.",
    roleId,
    selectionCriteria: audience,
    status: "pending_review",
    students,
    summary: `Automated voice outreach campaign targeting ${finalCount} selected student${finalCount === 1 ? "" : "s"} (${audience}).`,
    targetCount: finalCount,
    title: `${rawDept} Outreach — Draft Preview`,
    typeKey,
  };
}
