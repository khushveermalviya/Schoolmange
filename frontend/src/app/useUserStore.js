import { create } from "zustand";

const useUserStore = create((set) => ({
  user: null,
  performanceData: null,
  attendanceData: null,
  setUser: (userData) => set({ user: userData }),
  setPerformanceData: (data) => set({ performanceData: data }),
  setAttendanceData: (data) => set({ attendanceData: data }),
  clearUser: () => set({ user: null, performanceData: null, attendanceData: null }),
}));

export default useUserStore;
