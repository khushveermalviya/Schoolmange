import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { gql } from '@apollo/client';
import client from '../../Apolloclient.jsx';

// GraphQL Queries
const DASHBOARD_QUERY = gql`
  query {
    DashBoard {
      StudentCount
      Faculty
      Department
    }
  }
`;

const STUDENTS_BY_CLASS_QUERY = gql`
  query Studentdata($Class: String!) {
    Studentdata(Class: $Class) {
      StudentID
      FirstName
      LastName
      Class
    }
  }
`;

// Zustand Store
const useUserStore = create(
  devtools(
    persist(
      (set) => ({
        // Initial State
        students: [],
        user: null,
        performanceData: [],
        Dash: [], // Dashboard data
        loading: false,
        error: null,

        // Fetch Students by Class
        fetchStudents: async (classId) => {
          set({ loading: true, error: null }); // Set loading state
          try {
            const { data: studentData } = await client.query({
              query: STUDENTS_BY_CLASS_QUERY,
              variables: { Class: classId },
            });
            set({ students: studentData.Studentdata || [], loading: false }); // Update state with students
          } catch (error) {
            set({
              error: 'An error occurred while fetching student data.',
              loading: false,
            }); // Set error state
            console.error(error);
          }
        },

        // Set User and Fetch Data
        setUser: async (userData, classId) => {
          set({ loading: true, error: null }); // Set loading state
          try {
            // Fetch both student data and dashboard data
            const fetchStudentData = client
              .query({
                query: STUDENTS_BY_CLASS_QUERY,
                variables: { Class: classId },
              })
              .catch((error) => {
                console.error('Error fetching student data:', error);
                return { data: { Studentdata: [] } }; // Default empty data
              });

            const fetchDashboardData = client
              .query({
                query: DASHBOARD_QUERY,
              })
              .catch((error) => {
                console.error('Error fetching dashboard data:', error);
                return { data: { DashBoard: [] } }; // Default empty data
              });

            // Wait for both queries to resolve
            const [studentResponse, dashboardResponse] = await Promise.all([
              fetchStudentData,
              fetchDashboardData,
            ]);

            // Update the state
            set({
              user: userData,
              performanceData: userData?.WeeklyPerformance || [],
              Dash: dashboardResponse.data.DashBoard || [],
              students: studentResponse.data.Studentdata || [],
              loading: false,
            });

            console.log('State updated successfully:', {
              user: userData,
              performanceData: userData?.WeeklyPerformance,
              Dash: dashboardResponse.data.DashBoard,
              students: studentResponse.data.Studentdata,
            });
          } catch (error) {
            // Handle unexpected errors
            set({
              error: 'An unexpected error occurred.',
              loading: false,
            });
            console.error('Unexpected error in setUser:', error);
          }
        },

        // Clear User Data
        clearUser: () => set({ students: [], user: null, performanceData: [], Dash: [] }), // Clear state
      }),
      {
        name: 'user-storage', // Unique storage key
        getStorage: () => localStorage, // Use localStorage
      }
    )
  )
);

export default useUserStore;