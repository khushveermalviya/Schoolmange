import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const useUserStore = create(
  devtools(
    persist(
      (set) => ({
        user: null,
        performanceData: [], // Initialize performance data
        setUser: (userData) =>
          set({
            user: userData,
            performanceData: userData?.WeeklyPerformance || [], // Automatically set performance data
          }),
        clearUser: () => set({ user: null, performanceData: [] }), // Clear on logout
      }),
      {
        name: 'user-storage', // Unique storage key
        getStorage: () => localStorage, // Use localStorage
      }
    )
  )
);

export default useUserStore;
