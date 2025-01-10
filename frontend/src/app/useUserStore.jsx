import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { gql } from '@apollo/client';
import cnt from '../../Apolloclient';


const DASHBOARD_QUERY = gql`
  query DashBoard {
    DashBoard {
      StudentCount
      Faculty
      Department
    }
  }
`;

const useUserStore = create(
  devtools(
    persist(
      (set) => ({
        user: null,
        performanceData: [],
        Dash: [], // Initialize dashboard data
        setUser: async (userData) => {
          try {
            // Fetch the dashboard data
            const { data } = await cnt.query({ query: DASHBOARD_QUERY });
            set({
              user: userData,
              performanceData: userData?.WeeklyPerformance || [],
              Dash: data.DashBoard || [], // Set the fetched dashboard data
            });
          } catch (error) {
            console.error('An error occurred while fetching dashboard data:', error);
          }
        },
        clearUser: () => set({ user: null, performanceData: [], Dash: [] }), // Clear on logout
      }),
      {
        name: 'user-storage', // Unique storage key
        getStorage: () => localStorage, // Use localStorage
      }
    )
  )
);

export default useUserStore;