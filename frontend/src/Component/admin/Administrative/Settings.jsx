import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { toast } from 'react-hot-toast';
import { Save, Users, School, Lock, Settings } from 'lucide-react';

const Setting = () => {
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [password, setPassword] = useState('');


  const classes = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password !== 'khushveer') {
      toast.error('Invalid authorization password');
      return;
    }

    if (!selectedClass || selectedTeachers.length === 0) {
      toast.error('Please select class and teachers');
      return;
    }

    // Here you would typically make your mutation call
    toast.success(`Teachers assigned to ${selectedClass} successfully!`);
  };

  // if (loading) return (
  //   <div className="min-h-screen flex items-center justify-center">
  //     <div className="loading loading-spinner loading-lg text-primary"></div>
  //   </div>
  // );

  // if (error) return (
  //   <div className="alert alert-error shadow-lg">
  //     <span>Error loading staff data!</span>
  //   </div>
  // );

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title flex items-center gap-2">
            <School className="w-6 h-6" />
            Class Teacher Assignment
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            {/* Teacher Selection */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Select Teachers
                </span>
              </label>
              {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data?.GetAllStaff.map((staff) => (
                  <div key={staff.id} className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={selectedTeachers.includes(staff.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTeachers([...selectedTeachers, staff.id]);
                          } else {
                            setSelectedTeachers(
                              selectedTeachers.filter((id) => id !== staff.id)
                            );
                          }
                        }}
                      />
                      <div>
                        <div className="font-medium">{staff.firstName}</div>
                        <div className="text-sm text-gray-500">{staff.department}</div>
                      </div>
                    </label>
                  </div>
                ))}
              </div> */}
            </div>

            {/* Authorization Password */}
            <div className="form-control w-full max-w-md">
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
              />
            </div>

            {/* Submit Button */}
            <div className="card-actions justify-end">
              <button 
                type="submit" 
                className="btn btn-primary gap-2"
              >
                <Save className="w-5 h-5" />
                Save Assignment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Setting;