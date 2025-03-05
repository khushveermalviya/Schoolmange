import React, { useEffect, useState } from 'react';
import { useLazyQuery, useMutation, gql } from '@apollo/client';
import useUserStore from '../../app/useUserStore.jsx';
import { AlertCircle, CheckCircle, Users, Book, School, Trash2, FileText, Coffee, Home } from 'lucide-react';

// Existing query
const GET_STUDENT_DATA = gql`
  query GetStudentComplaint($Studentid: String!) {
    StudentComplaint(Studentid: $Studentid) {
      Studentid
      Complaint
      Class
    }
  }
`;

// New mutation for adding complaints
const ADD_STUDENT_COMPLAINT = gql`
  mutation AddStudentComplaint($input: StudentComplaintInput!) {
    addStudentComplaint(input: $input) {
      Studentid
      Complaint
      Class
    }
  }
`;

export default function Complain() {
  const [studentData, setStudentData] = useState(null);
  const [fetchStudentData, { data, loading, error }] = useLazyQuery(GET_STUDENT_DATA);
  const user = useUserStore((state) => state.user);
  
  // Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [complaintType, setComplaintType] = useState("");
  const [complaintText, setComplaintText] = useState("");
  const [frequency, setFrequency] = useState("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [addComplaint] = useMutation(ADD_STUDENT_COMPLAINT, {
    onCompleted: () => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setIsModalOpen(false);
        resetForm();
        // Refetch data to show the new complaint
        if (user?.StudentID) {
          fetchStudentData({
            variables: {
              Studentid: user.StudentID
            }
          });
        }
      }, 1500);
    },
    onError: (err) => {
      console.error('Mutation error:', err);
      setIsSubmitting(false);
    }
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && user?.StudentID) {
      fetchStudentData({
        variables: {
          Studentid: user.StudentID
        }
      });
    }
  }, [fetchStudentData, user]);

  useEffect(() => {
    if (data?.StudentComplaint) {
      setStudentData(data.StudentComplaint);
    }
  }, [data]);

  const complaintCategories = [
    { id: "faculty", label: "Faculty Issues", icon: <Users className="w-4 h-4" /> },
    { id: "management", label: "Management", icon: <School className="w-4 h-4" /> },
    { id: "student", label: "Student Behavior", icon: <Users className="w-4 h-4" /> },
    { id: "cleanliness", label: "Cleanliness", icon: <Trash2 className="w-4 h-4" /> },
    { id: "academics", label: "Academic Issues", icon: <Book className="w-4 h-4" /> },
    { id: "facilities", label: "Facilities", icon: <Home className="w-4 h-4" /> },
    { id: "canteen", label: "Canteen Services", icon: <Coffee className="w-4 h-4" /> },
    { id: "other", label: "Other", icon: <FileText className="w-4 h-4" /> },
  ];

  const resetForm = () => {
    setComplaintType("");
    setComplaintText("");
    setFrequency("medium");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Here we would normally send the data to the server
    addComplaint({
      variables: {
        input: {
          Studentid: user.StudentID,
          Complaint: `[${complaintType}] [Frequency: ${frequency}] ${complaintText}`,
          Class: user.Class || "Unknown"
        }
      }
    });
  };

  const frequencyOptions = [
    { value: "rare", label: "Rare (Happened once)", color: "bg-blue-100 border-blue-200" },
    { value: "low", label: "Low (Happens occasionally)", color: "bg-green-100 border-green-200" },
    { value: "medium", label: "Medium (Happens weekly)", color: "bg-yellow-100 border-yellow-200" },
    { value: "high", label: "High (Happens daily)", color: "bg-red-100 border-red-200" },
  ];

  const getComplaintColorClass = (complaint) => {
    if (complaint.includes("[faculty]")) return "border-l-4 border-l-purple-500";
    if (complaint.includes("[management]")) return "border-l-4 border-l-blue-500";
    if (complaint.includes("[student]")) return "border-l-4 border-l-green-500";
    if (complaint.includes("[cleanliness]")) return "border-l-4 border-l-yellow-500";
    if (complaint.includes("[academics]")) return "border-l-4 border-l-red-500";
    if (complaint.includes("[facilities]")) return "border-l-4 border-l-orange-500";
    if (complaint.includes("[canteen]")) return "border-l-4 border-l-pink-500";
    return "border-l-4 border-l-gray-500";
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="loading loading-spinner loading-lg text-primary"></div>
    </div>
  );
  
  if (error) {
    console.error('GraphQL Error:', error);
    return (
      <div className="bg-red-50 p-4 rounded-lg border border-red-200 flex items-center space-x-2">
        <AlertCircle className="text-red-500 w-5 h-5" />
        <p>Error fetching student data: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Complaints</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary gap-2 transition-all duration-300 hover:scale-105 animate-pulse hover:animate-none"
        >
          <AlertCircle className="w-5 h-5" />
          Add Complaint
        </button>
      </div>

      {studentData && studentData.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {studentData.map((complaint, index) => (
            <div 
              key={index} 
              className={`bg-white p-4 rounded-lg shadow hover:shadow-md transition-all ${getComplaintColorClass(complaint.Complaint)}`}
            >
              <p className="opacity-70 text-sm">{complaint.Studentid}</p>
              <p className="font-medium mt-2">{complaint.Complaint}</p>
              {complaint.Class && <p className="text-sm mt-1 opacity-70">Class: {complaint.Class}</p>}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 text-center">
          <FileText className="w-12 h-12 mx-auto text-blue-400 mb-2" />
          <p className="text-blue-700">No complaints found. Add your first complaint!</p>
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Submit a Complaint</h2>
                <button onClick={() => setIsModalOpen(false)} className="btn btn-ghost btn-sm btn-circle">×</button>
              </div>

              {submitSuccess ? (
                <div className="bg-green-50 p-6 rounded-lg text-center animate-fadeIn">
                  <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-2" />
                  <p className="text-green-700 font-medium">Complaint submitted successfully!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Complaint Category</label>
                    <div className="grid grid-cols-2 gap-2">
                      {complaintCategories.map(category => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => setComplaintType(category.id)}
                          className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                            complaintType === category.id 
                              ? 'bg-blue-50 border-blue-300' 
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          {category.icon}
                          <span className="text-sm">{category.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">How frequently does this occur?</label>
                    <div className="grid grid-cols-2 gap-2">
                      {frequencyOptions.map(option => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFrequency(option.value)}
                          className={`p-2 rounded-lg border text-sm ${
                            frequency === option.value 
                              ? option.color + ' font-medium' 
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Complaint Details</label>
                    <textarea
                      required
                      value={complaintText}
                      onChange={(e) => setComplaintText(e.target.value)}
                      className="textarea textarea-bordered w-full h-32"
                      placeholder="Please describe your complaint in detail..."
                    ></textarea>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button 
                      type="button" 
                      onClick={() => setIsModalOpen(false)}
                      className="btn btn-ghost mr-2"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      disabled={!complaintType || !complaintText || isSubmitting}
                    >
                      {isSubmitting ? <span className="loading loading-spinner loading-xs"></span> : null}
                      Submit Complaint
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}