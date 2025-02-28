import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import toast, { Toaster } from 'react-hot-toast';
import { Save, Users, School, Lock, Loader, Check, X } from 'lucide-react';

const CLASS_TEACHER_QUERY = gql`
  query ClassTeacherQuery {
    ClassTeacherQuery {
      first_name
      last_name
      Class
      role
    }
  }
`;

const UPDATE_TEACHER = gql`
  mutation ClassMutation($input: ClassInputd!) {
    ClassMutation(input: $input) {
      first_name
      Class
    }
  }
`;

const Setting = () => {
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [password, setPassword] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { data: classteacher, loading: teacherLoading, error, refetch } = useQuery(CLASS_TEACHER_QUERY);

  const [updateTeacher, { loading: updating }] = useMutation(UPDATE_TEACHER, {
    onCompleted: () => {
      toast.success(
        <div className="flex items-center gap-2">
          <Check className="w-5 h-5" />
          <span>Successfully updated teacher class!</span>
        </div>,
        {
          duration: 3000,
          className: 'bg-success text-white',
          position: 'top-center',
          icon: null
        }
      );
      setSelectedTeacher('');
      setSelectedClass('');
      setPassword('');
      setShowConfirmation(false);
      refetch();
    },
    onError: (error) => {
      toast.error(
        <div className="flex items-center gap-2">
          <X className="w-5 h-5" />
          <span>{error.message || 'Failed to update teacher class'}</span>
        </div>,
        {
          duration: 3000,
          className: 'bg-error text-white',
          position: 'top-center',
          icon: null
        }
      );
    }
  });

  const classes = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `Class ${i + 1}`,
  }));

  // Handle Enter key press in modal
  useEffect(() => {

    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && showConfirmation) {
        handleConfirmUpdate();
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
    
  }, [showConfirmation, password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedClass || !selectedTeacher) {
      toast.error(
        <div className="flex items-center gap-2">
          <X className="w-5 h-5" />
          <span>Please select both teacher and class</span>
        </div>,
        {
          position: 'top-center',
          className: 'bg-error text-white',
          icon: null
        }
      );
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmUpdate = async () => {
    if (password !== 'khushveer') {
      toast.error(
        <div className="flex items-center gap-2">
          <X className="w-5 h-5" />
          <span>Invalid authorization password</span>
        </div>,
        {
          position: 'top-center',
          className: 'bg-error text-white',
          icon: null
        }
      );
      return;
    }
    if(classteacher.ClassTeacherQuery.Class == "none"){
      <div> you overwriteing this  ?</div>
    }

    try {
      await updateTeacher({
        variables: {
          input: {
            first_name: selectedTeacher,
            Class: parseInt(selectedClass),
          },
        },
      });
    } catch (err) {
      console.error('Error updating teacher:', err);
    }
  };

  if (teacherLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>Error loading teachers: {error.message}</span>
      </div>
    );
  }

  const selectedTeacherInfo = classteacher?.ClassTeacherQuery.find(
    (teacher) => teacher.first_name === selectedTeacher
  );

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title flex items-center gap-2">
            <School className="w-6 h-6" />
            Update Teacher Class
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Teacher Selection */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Select Teacher
                </span>
              </label>
              <select
                className="select select-bordered w-full"
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
              >
                <option value="">Select a teacher</option>
                {classteacher?.ClassTeacherQuery.map((teacher, index) => (
                  <option key={index} value={teacher.first_name}>
                    {teacher.first_name} {teacher.last_name} - Current Class: {teacher.Class || 'None'}
                  </option>
                ))}
              </select>
            </div>

            {/* Class Selection */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Select Class</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">Select a class</option>
                {classes.map((cls) => (
                  <option key={cls.value} value={cls.value}>
                    {cls.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="card-actions justify-end">
              <button
                type="submit"
                className="btn btn-primary gap-2"
                disabled={updating}
              >
                <Save className="w-5 h-5" />
                Assign Class
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="modal modal-open">
            <div className="modal-box relative">
              <h3 className="font-bold text-lg">Confirm Class Assignment</h3>
              {selectedTeacherInfo && (
                <p className="py-4">
                  Are you sure you want to assign {selectedTeacherInfo.first_name} {selectedTeacherInfo.last_name} to Class {selectedClass}?
                </p>
              )}
              
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Authorization Password
                  </span>
                </label>
                <input
                  type="password"
                  placeholder="Enter password"
                  className="input input-bordered w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="modal-action">
                <button
                  className="btn btn-error"
                  onClick={() => {
                    setShowConfirmation(false);
                    setPassword('');
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleConfirmUpdate}
                  disabled={updating}
                >
                  {updating ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Confirming...
                    </>
                  ) : (
                    'Confirm'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Configuration */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
          },
          success: {
            duration: 3000,
            style: {
              background: 'rgb(34 197 94)',
            },
          },
          error: {
            duration: 3000,
            style: {
              background: 'rgb(239 68 68)',
            },
          },
        }}
      />
    </div>
  );
};

export default Setting;