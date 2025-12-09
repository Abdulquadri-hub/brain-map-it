import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { School, useAuth } from "./AuthContext";

// Laravel Inertia.js Integration:
// import { usePage, router } from '@inertiajs/react'
// 
// Get active tenant from Inertia shared data:
// const { tenant } = usePage<{ tenant: School }>().props
// 
// Switch tenant: router.post('/switch-school', { school_id: schoolId })
// This should set session data and redirect

interface TenantContextType {
  activeTenant: School | null;
  setActiveTenant: (school: School) => void;
  switchSchool: (schoolId: string) => void;
  availableSchools: School[];
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [activeTenant, setActiveTenant] = useState<School | null>(null);

  const availableSchools = user?.schools || [];

  // Auto-select first school when user logs in
  useEffect(() => {
    if (user?.schools && user.schools.length > 0 && !activeTenant) {
      setActiveTenant(user.schools[0]);
    }
    if (!user) {
      setActiveTenant(null);
    }
  }, [user, activeTenant]);

  // Laravel Inertia.js Integration:
  // Replace with: router.post('/switch-school', { school_id: schoolId }, {
  //   onSuccess: () => {
  //     // Tenant will be updated via usePage().props.tenant
  //   }
  // })
  const switchSchool = (schoolId: string) => {
    const school = availableSchools.find((s) => s.id === schoolId);
    if (school) {
      setActiveTenant(school);
    }
  };

  return (
    <TenantContext.Provider
      value={{
        activeTenant,
        setActiveTenant,
        switchSchool,
        availableSchools,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
};
