"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  DEFAULT_ROLE,
  type RoleId,
  UNIVERSITY_ROLES,
  type UniversityRole,
} from "@/lib/roles";

type RoleContextValue = {
  selectedRole: UniversityRole;
  setSelectedRole: (role: UniversityRole) => void;
  setRoleById: (id: RoleId) => void;
  roles: UniversityRole[];
};

const RoleContext = createContext<RoleContextValue | null>(null);

const STORAGE_KEY = "univoice_active_department_role";

export function RoleProvider({ children }: { children: ReactNode }) {
  const [selectedRole, setSelectedRoleState] =
    useState<UniversityRole>(DEFAULT_ROLE);

  useEffect(() => {
    try {
      const savedRoleId = localStorage.getItem(STORAGE_KEY) as RoleId | null;
      if (savedRoleId) {
        const matchingRole = UNIVERSITY_ROLES.find((r) => r.id === savedRoleId);
        if (matchingRole) {
          setSelectedRoleState(matchingRole);
        }
      }
    } catch {
      // Ignore localStorage access restrictions in SSR/incognito
    }
  }, []);

  const setSelectedRole = useCallback((role: UniversityRole) => {
    setSelectedRoleState(role);
    try {
      localStorage.setItem(STORAGE_KEY, role.id);
    } catch {
      // Ignore
    }
  }, []);

  const setRoleById = useCallback((id: RoleId) => {
    const matchingRole = UNIVERSITY_ROLES.find((r) => r.id === id);
    if (matchingRole) {
      setSelectedRoleState(matchingRole);
      try {
        localStorage.setItem(STORAGE_KEY, matchingRole.id);
      } catch {
        // Ignore
      }
    }
  }, []);

  return (
    <RoleContext.Provider
      value={{
        roles: UNIVERSITY_ROLES,
        selectedRole,
        setRoleById,
        setSelectedRole,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
