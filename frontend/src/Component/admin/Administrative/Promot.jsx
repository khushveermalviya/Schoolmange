import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const Promote = () => {
  const [studentID, setStudentID] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    Class: '',
    Email: '',
  });
  const [loading, setLoading] = useState(false);

  // Simulated fetch function (replace with actual API call)
  const fetchStudentData = async (id) => {
    setLoading(true);
    try {
      // Mock API response (replace with real fetch)
      const mockData = {
        StudentID: id,
        FirstName: 'John',
        LastName: 'Doe',
        Class: 1,
        Email: 'john.doe@example.com',
      };
      setStudentData(mockData);
      setFormData({
        FirstName: mockData.FirstName,
        LastName: mockData.LastName,
        Class: mockData.Class.toString(),
        Email: mockData.Email,
      });
      toast.success('Student data loaded successfully!');
    } catch (error) {
      toast.error('Failed to fetch student data.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulated update API call
      console.log('Updating student:', { StudentID: studentID, ...formData });
      toast.success('Student updated successfully!');
      setStudentData(null); // Reset form after success
      setStudentID('');
      setFormData({ FirstName: '', LastName: '', Class: '', Email: '' });
    } catch (error) {
      toast.error('Failed to update student.');
    } finally {
      setLoading(false);
    }
  };

  // Handle search button click
  const handleSearch = () => {
    if (studentID.trim()) {
      fetchStudentData(studentID);
    } else {
      toast.error('Please enter a valid Student ID.');
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Update Student</h1>

        {/* Search Section */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Student ID</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Enter Student ID (e.g., S001)"
                  className="input input-bordered w-full sm:flex-1"
                  value={studentID}
                  onChange={(e) => setStudentID(e.target.value)}
                />
                <button
                  className="btn btn-primary mt-2 sm:mt-0"
                  onClick={handleSearch}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Search'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Update Form (shown only if student data is fetched) */}
        {studentData && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Edit Student Details</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">First Name</span>
                    </label>
                    <input
                      type="text"
                      name="FirstName"
                      className="input input-bordered"
                      value={formData.FirstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Last Name</span>
                    </label>
                    <input
                      type="text"
                      name="LastName"
                      className="input input-bordered"
                      value={formData.LastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Class</span>
                    </label>
                    <input
                      type="number"
                      name="Class"
                      className="input input-bordered"
                      value={formData.Class}
                      onChange={handleInputChange}
                      min="1"
                      max="12"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      name="Email"
                      className="input input-bordered"
                      value={formData.Email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="card-actions justify-end mt-6">
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Student'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Promote;