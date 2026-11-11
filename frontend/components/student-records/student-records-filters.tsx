"use client";

import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  GitBranch,
  GraduationCap,
  Layers,
  RotateCcw,
  Tag,
  UserCheck,
} from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RoleId } from "@/lib/roles";
import { cn } from "@/lib/utils";
import {
  ACADEMIC_BRANCHES,
  ACADEMIC_DEPARTMENTS,
} from "@/modules/departments/domain/academic-structure";
import {
  ADMISSION_STATUSES,
  FINANCE_STATUSES,
  LIBRARY_STATUSES,
  SCHOLARSHIP_STATUSES,
} from "@/modules/students/configurations";
import {
  extractDistinctSemesters,
  extractDistinctValues,
  hasActiveFilters,
  type StudentRecordsFilterState,
} from "@/modules/students/domain/filters";
import type { StudentRecord } from "@/modules/students/domain/types";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterSelectProps {
  activeFilter: keyof StudentRecordsFilterState | null;
  filterKey: keyof StudentRecordsFilterState;
  icon?: React.ReactNode;
  minWidth?: string;
  onDropdownOpenChange: (
    filterKey: keyof StudentRecordsFilterState,
    open: boolean
  ) => void;
  onFilterChange: (key: keyof StudentRecordsFilterState, value: string) => void;
  options: FilterOption[];
  placeholder: string;
  value: string;
}

const FilterSelect = memo(function FilterSelectInner({
  activeFilter,
  filterKey,
  icon,
  minWidth = "min-w-[130px]",
  onDropdownOpenChange,
  onFilterChange,
  options,
  placeholder,
  value,
}: FilterSelectProps) {
  const handleValueChange = useCallback(
    (newVal: string) => {
      onFilterChange(filterKey, newVal);
    },
    [filterKey, onFilterChange]
  );
  const handleOpenChange = useCallback(
    (open: boolean) => onDropdownOpenChange(filterKey, open),
    [filterKey, onDropdownOpenChange]
  );

  return (
    <Select
      onOpenChange={handleOpenChange}
      onValueChange={handleValueChange}
      open={activeFilter === filterKey}
      value={value}
    >
      <SelectTrigger
        className={cn(
          "h-8.5 w-auto rounded-lg border border-border/60 bg-card px-2.5 text-xs font-normal text-foreground cursor-pointer transition-colors hover:border-border",
          value !== "all" && "border-primary/50 bg-primary/5 font-medium",
          minWidth
        )}
        size="sm"
      >
        {icon}
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        avoidCollisions={false}
        className="[&_[data-radix-select-viewport]]:h-auto [&_[data-radix-select-viewport]]:max-h-[max(0px,calc(var(--radix-select-content-available-height)_-_3rem))]"
        position="popper"
        side="bottom"
      >
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
});

export interface StudentRecordsFiltersProps {
  filters: StudentRecordsFilterState;
  onClearAll: () => void;
  onFilterChange: (key: keyof StudentRecordsFilterState, value: string) => void;
  records: StudentRecord[];
  roleId: RoleId;
}

export function StudentRecordsFilters({
  filters,
  onClearAll,
  onFilterChange,
  records,
  roleId,
}: StudentRecordsFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<
    keyof StudentRecordsFilterState | null
  >(null);
  const handleFilterDropdownChange = useCallback(
    (filterKey: keyof StudentRecordsFilterState, open: boolean) => {
      setActiveFilter(open ? filterKey : null);
    },
    []
  );
  const filterDropdownProps = {
    activeFilter,
    onDropdownOpenChange: handleFilterDropdownChange,
  };

  // 1. Academic Department: display full name (dept.dept_name), value mapped to dept.dept_id
  const departmentOptions: FilterOption[] = useMemo(
    () => [
      { label: "All Departments", value: "all" },
      ...ACADEMIC_DEPARTMENTS.map((dept) => ({
        label: dept.dept_name,
        value: dept.dept_id,
      })),
    ],
    []
  );

  // 2. Branch: display strictly acronym tag (branch.branch_id), value mapped to branch.branch_id
  const branchOptions: FilterOption[] = useMemo(() => {
    const list =
      filters.department && filters.department !== "all"
        ? ACADEMIC_BRANCHES.filter((b) => b.dept_id === filters.department)
        : ACADEMIC_BRANCHES;

    return [
      { label: "All Branches", value: "all" },
      ...list.map((branch) => ({
        label: branch.branch_id,
        value: branch.branch_id,
      })),
    ];
  }, [filters.department]);

  const semesterOptions: FilterOption[] = useMemo(() => {
    const distinct = extractDistinctSemesters(records);
    return [
      { label: "All Semesters", value: "all" },
      ...distinct.map((sem) => ({
        label: `Sem ${sem}`,
        value: sem,
      })),
    ];
  }, [records]);

  const sectionOptions: FilterOption[] = useMemo(() => {
    const distinct = extractDistinctValues(records, "section");
    return [
      { label: "All Sections", value: "all" },
      ...distinct.map((sec) => ({
        label: `Sec ${sec}`,
        value: sec,
      })),
    ];
  }, [records]);

  // Department-specific dynamic filter options
  const academicYearOptions: FilterOption[] = useMemo(() => {
    const distinct = extractDistinctValues(records, "academic_year");
    return [
      { label: "All Years", value: "all" },
      ...distinct.map((yr) => ({ label: yr, value: yr })),
    ];
  }, [records]);

  const feeTypeOptions: FilterOption[] = useMemo(() => {
    const distinct = extractDistinctValues(records, "fee_type");
    return [
      { label: "All Fee Types", value: "all" },
      ...distinct.map((fee) => ({ label: fee, value: fee })),
    ];
  }, [records]);

  const quotaTypeOptions: FilterOption[] = useMemo(() => {
    const distinct = extractDistinctValues(records, "quota_type");
    return [
      { label: "All Quotas", value: "all" },
      ...distinct.map((q) => ({ label: q, value: q })),
    ];
  }, [records]);

  const applicationTypeOptions: FilterOption[] = useMemo(() => {
    const distinct = extractDistinctValues(records, "application_type");
    return [
      { label: "All App Types", value: "all" },
      ...distinct.map((app) => ({ label: app, value: app })),
    ];
  }, [records]);

  // Fixed status options
  const financeStatusOptions: FilterOption[] = useMemo(
    () => [
      { label: "All Payment Statuses", value: "all" },
      ...FINANCE_STATUSES.map((st) => ({ label: st, value: st })),
    ],
    []
  );

  const admissionStatusOptions: FilterOption[] = useMemo(
    () => [
      { label: "All Admission Statuses", value: "all" },
      ...ADMISSION_STATUSES.map((st) => ({ label: st, value: st })),
    ],
    []
  );

  const docsSubmittedOptions: FilterOption[] = useMemo(
    () => [
      { label: "All Documents", value: "all" },
      { label: "Yes (Submitted)", value: "yes" },
      { label: "No (Pending)", value: "no" },
    ],
    []
  );

  const scholarshipStatusOptions: FilterOption[] = useMemo(
    () => [
      { label: "All Scholarship Statuses", value: "all" },
      ...SCHOLARSHIP_STATUSES.map((st) => ({ label: st, value: st })),
    ],
    []
  );

  const libraryStatusOptions: FilterOption[] = useMemo(
    () => [
      { label: "All Transaction Statuses", value: "all" },
      ...LIBRARY_STATUSES.map((st) => ({ label: st, value: st })),
    ],
    []
  );

  const isFiltering = hasActiveFilters(filters, roleId);

  const handleAttendanceMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onFilterChange("attendanceMin", e.target.value);
    },
    [onFilterChange]
  );

  const handleAttendanceMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onFilterChange("attendanceMax", e.target.value);
    },
    [onFilterChange]
  );

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      data-testid="student-records-filters"
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none fixed inset-0 z-40 bg-black/10 backdrop-blur-[2px] transition-[opacity,backdrop-filter] duration-150 ease-out dark:bg-black/25",
          activeFilter
            ? "pointer-events-auto opacity-100"
            : "opacity-0 backdrop-blur-0"
        )}
        data-testid="student-records-filter-backdrop"
      />
      {/* 1. Global: Academic Department */}
      <FilterSelect
        {...filterDropdownProps}
        filterKey="department"
        icon={
          <GraduationCap className="mr-1.5 size-3.5 shrink-0 text-muted-foreground" />
        }
        minWidth="min-w-[155px]"
        onFilterChange={onFilterChange}
        options={departmentOptions}
        placeholder="Academic Department"
        value={filters.department ?? "all"}
      />

      {/* 2. Global: Branch */}
      <FilterSelect
        {...filterDropdownProps}
        filterKey="branch"
        icon={
          <GitBranch className="mr-1.5 size-3.5 shrink-0 text-muted-foreground" />
        }
        minWidth="min-w-[125px]"
        onFilterChange={onFilterChange}
        options={branchOptions}
        placeholder="Branch"
        value={filters.branch ?? "all"}
      />

      {/* 3. Global: Semester — Completely hidden for Admissions */}
      {roleId !== "admissions" && (
        <FilterSelect
          {...filterDropdownProps}
          filterKey="semester"
          icon={
            <BookOpen className="mr-1.5 size-3.5 shrink-0 text-muted-foreground" />
          }
          minWidth="min-w-[120px]"
          onFilterChange={onFilterChange}
          options={semesterOptions}
          placeholder="Semester"
          value={filters.semester ?? "all"}
        />
      )}

      {/* 4. Global: Section — Completely hidden for Admissions */}
      {roleId !== "admissions" && (
        <FilterSelect
          {...filterDropdownProps}
          filterKey="section"
          icon={
            <Layers className="mr-1.5 size-3.5 shrink-0 text-muted-foreground" />
          }
          minWidth="min-w-[110px]"
          onFilterChange={onFilterChange}
          options={sectionOptions}
          placeholder="Section"
          value={filters.section ?? "all"}
        />
      )}

      {/* 5. Department-Specific Filters */}
      {roleId === "finance" && (
        <>
          <FilterSelect
            {...filterDropdownProps}
            filterKey="academicYear"
            icon={
              <Calendar className="mr-1.5 size-3.5 shrink-0 text-muted-foreground" />
            }
            minWidth="min-w-[120px]"
            onFilterChange={onFilterChange}
            options={academicYearOptions}
            placeholder="Academic Year"
            value={filters.academicYear ?? "all"}
          />
          <FilterSelect
            {...filterDropdownProps}
            filterKey="feeType"
            icon={
              <Tag className="mr-1.5 size-3.5 shrink-0 text-muted-foreground" />
            }
            minWidth="min-w-[120px]"
            onFilterChange={onFilterChange}
            options={feeTypeOptions}
            placeholder="Fee Type"
            value={filters.feeType ?? "all"}
          />
          <FilterSelect
            {...filterDropdownProps}
            filterKey="paymentStatus"
            icon={
              <CreditCard className="mr-1.5 size-3.5 shrink-0 text-muted-foreground" />
            }
            minWidth="min-w-[130px]"
            onFilterChange={onFilterChange}
            options={financeStatusOptions}
            placeholder="Payment Status"
            value={filters.paymentStatus ?? "all"}
          />
        </>
      )}

      {roleId === "admissions" && (
        <>
          <FilterSelect
            {...filterDropdownProps}
            filterKey="quotaType"
            icon={
              <Tag className="mr-1.5 size-3.5 shrink-0 text-muted-foreground" />
            }
            minWidth="min-w-[120px]"
            onFilterChange={onFilterChange}
            options={quotaTypeOptions}
            placeholder="Quota"
            value={filters.quotaType ?? "all"}
          />
          <FilterSelect
            {...filterDropdownProps}
            filterKey="docsSubmitted"
            icon={
              <CheckCircle2 className="mr-1.5 size-3.5 shrink-0 text-muted-foreground" />
            }
            minWidth="min-w-[135px]"
            onFilterChange={onFilterChange}
            options={docsSubmittedOptions}
            placeholder="Docs Submitted"
            value={filters.docsSubmitted ?? "all"}
          />
          <FilterSelect
            {...filterDropdownProps}
            filterKey="admissionStatus"
            icon={
              <UserCheck className="mr-1.5 size-3.5 shrink-0 text-muted-foreground" />
            }
            minWidth="min-w-[145px]"
            onFilterChange={onFilterChange}
            options={admissionStatusOptions}
            placeholder="Admission Status"
            value={filters.admissionStatus ?? "all"}
          />
        </>
      )}

      {roleId === "scholarship" && (
        <>
          <FilterSelect
            {...filterDropdownProps}
            filterKey="academicYear"
            icon={
              <Calendar className="mr-1.5 size-3.5 shrink-0 text-muted-foreground" />
            }
            minWidth="min-w-[120px]"
            onFilterChange={onFilterChange}
            options={academicYearOptions}
            placeholder="Academic Year"
            value={filters.academicYear ?? "all"}
          />
          <FilterSelect
            {...filterDropdownProps}
            filterKey="applicationType"
            icon={
              <Award className="mr-1.5 size-3.5 shrink-0 text-muted-foreground" />
            }
            minWidth="min-w-[135px]"
            onFilterChange={onFilterChange}
            options={applicationTypeOptions}
            placeholder="Application Type"
            value={filters.applicationType ?? "all"}
          />
          <FilterSelect
            {...filterDropdownProps}
            filterKey="scholarshipStatus"
            icon={
              <FileText className="mr-1.5 size-3.5 shrink-0 text-muted-foreground" />
            }
            minWidth="min-w-[145px]"
            onFilterChange={onFilterChange}
            options={scholarshipStatusOptions}
            placeholder="Scholarship Status"
            value={filters.scholarshipStatus ?? "all"}
          />
        </>
      )}

      {roleId === "library" && (
        <FilterSelect
          {...filterDropdownProps}
          filterKey="libraryStatus"
          icon={
            <Clock className="mr-1.5 size-3.5 shrink-0 text-muted-foreground" />
          }
          minWidth="min-w-[145px]"
          onFilterChange={onFilterChange}
          options={libraryStatusOptions}
          placeholder="Transaction Status"
          value={filters.libraryStatus ?? "all"}
        />
      )}

      {/* 6. Class Teacher: Attendance Percentage Filter */}
      {roleId === "class_teacher" && (
        <>
          <FilterSelect
            {...filterDropdownProps}
            filterKey="attendanceFilter"
            icon={
              <UserCheck className="mr-1.5 size-3.5 shrink-0 text-muted-foreground" />
            }
            minWidth="min-w-[150px]"
            onFilterChange={onFilterChange}
            options={[
              { label: "All Attendance", value: "all" },
              { label: "Below 65%", value: "below65" },
              { label: "Below 75%", value: "below75" },
              { label: "Custom Range", value: "custom" },
            ]}
            placeholder="Attendance"
            value={filters.attendanceFilter ?? "all"}
          />
          {filters.attendanceFilter === "custom" && (
            <div className="flex items-center gap-1.5">
              <Input
                className="w-20"
                max={100}
                min={0}
                onChange={handleAttendanceMinChange}
                placeholder="Min %"
                type="number"
                value={filters.attendanceMin ?? ""}
              />
              <span className="text-sm">-</span>
              <Input
                className="w-20"
                max={100}
                min={0}
                onChange={handleAttendanceMaxChange}
                placeholder="Max %"
                type="number"
                value={filters.attendanceMax ?? ""}
              />
            </div>
          )}
        </>
      )}

      {isFiltering && (
        <Button
          className="h-8.5 px-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 gap-1.5"
          onClick={onClearAll}
          size="sm"
          type="button"
          variant="ghost"
        >
          <RotateCcw className="size-3.5" />
          <span>Clear all</span>
        </Button>
      )}
    </div>
  );
}
