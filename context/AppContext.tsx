import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import {
  AttendanceRecord,
  AttendanceSummary,
  getAttendanceRecords,
  getAttendanceSummary,
  getSubjects,
  getTodayHours,
  login as apiLogin,
  loginWithCollegeId as apiLoginCollegeId,
  loginWithPhone as apiLoginPhone,
  markAttendance as apiMarkAttendance,
  register as apiRegister,
  Subject,
  TodayHours,
  User,
} from '../services/api';

type AppContextType = {
  user: User | null;
  authToken: string | null;
  isLoggedIn: boolean;
  summary: AttendanceSummary;
  subjects: Subject[];
  records: AttendanceRecord[];
  todayHours: TodayHours;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithCollegeId: (collegeId: string) => Promise<{ success: boolean; error?: string }>;
  loginWithPhone: (phone: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, collegeId: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  markAttendance: (payload?: { faceCaptured?: boolean; facePhotoUri?: string }) => Promise<void>;
  refreshData: () => Promise<void>;
};

const defaultSummary: AttendanceSummary = { total: 0, attended: 0, percentage: 0 };
const defaultHours: TodayHours = { completed: 0, total: 8 };

const AppContext = createContext<AppContextType>({
  user: null,
  authToken: null,
  isLoggedIn: false,
  summary: defaultSummary,
  subjects: [],
  records: [],
  todayHours: defaultHours,
  login: async () => ({ success: false }),
  loginWithCollegeId: async () => ({ success: false }),
  loginWithPhone: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: () => {},
  markAttendance: async () => {},
  refreshData: async () => {},
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser]           = useState<User | null>(null);
  const [token, setToken]         = useState<string | null>(null);
  const [summary, setSummary]     = useState<AttendanceSummary>(defaultSummary);
  const [subjects, setSubjects]   = useState<Subject[]>([]);
  const [records, setRecords]     = useState<AttendanceRecord[]>([]);
  const [todayHours, setTodayHours] = useState<TodayHours>(defaultHours);

  const loadData = useCallback(async (authToken: string) => {
    try {
      const [s, r, h, sub] = await Promise.all([
        getAttendanceSummary(authToken),
        getAttendanceRecords(authToken),
        getTodayHours(authToken),
        getSubjects(authToken),
      ]);
      setSummary(s);
      setRecords(r);
      setTodayHours(h);
      setSubjects(sub);
    } catch {}
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await apiLogin(email, password);
      if (result.success && result.user && result.token) {
        setUser(result.user);
        setToken(result.token);
        await loadData(result.token);
        return { success: true };
      }
      return { success: false, error: result.error };
    },
    [loadData],
  );

  const loginWithCollegeId = useCallback(
    async (collegeId: string) => {
      const result = await apiLoginCollegeId(collegeId);
      if (result.success && result.user && result.token) {
        setUser(result.user);
        setToken(result.token);
        await loadData(result.token);
        return { success: true };
      }
      return { success: false, error: result.error };
    },
    [loadData],
  );

  const loginWithPhone = useCallback(
    async (phone: string) => {
      const result = await apiLoginPhone(phone);
      if (result.success && result.user && result.token) {
        setUser(result.user);
        setToken(result.token);
        await loadData(result.token);
        return { success: true };
      }
      return { success: false, error: result.error };
    },
    [loadData],
  );

  const register = useCallback(
    async (name: string, collegeId: string, email: string, password: string, phone?: string) => {
      const result = await apiRegister(name, collegeId, email, password, phone);
      if (result.success && result.user && result.token) {
        setUser(result.user);
        setToken(result.token);
        await loadData(result.token);
        return { success: true };
      }
      return { success: false, error: result.error };
    },
    [loadData],
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setSummary(defaultSummary);
    setRecords([]);
    setSubjects([]);
    setTodayHours(defaultHours);
  }, []);

  const markAttendance = useCallback(async (payload?: { faceCaptured?: boolean; facePhotoUri?: string }) => {
    if (!token) return;
    await apiMarkAttendance(token, payload);
    await loadData(token);
  }, [token, loadData]);

  const refreshData = useCallback(async () => {
    if (!token) return;
    await loadData(token);
  }, [token, loadData]);

  return (
    <AppContext.Provider
      value={{
        user,
        authToken: token,
        isLoggedIn: !!user,
        summary,
        subjects,
        records,
        todayHours,
        login,
        loginWithCollegeId,
        loginWithPhone,
        register,
        logout,
        markAttendance,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
