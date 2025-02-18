import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';

// GraphQL Queries
const GET_CLASSES = gql`
  query GetAllClasses {
    getAllClasses {
      id
      class_name
      section
    }
  }
`;

const GET_SUBJECTS = gql`
  query GetAllSubjects {
    getAllSubjects {
      id
      subject_name
    }
  }
`;

const GET_TEACHERS = gql`
  query GetAllStaff {
    GetAllStaff {
      id
      firstName
      lastName
      email
      department
    }
  }
`;

const GET_TIMETABLE_ENTRIES = gql`
  query GetTimetableEntries {
    getTimetableEntries {
      id
      created_at
      class_id
      period
      subject_id
      teacher_id
      updated_at
    }
  }
`;

const ADD_TIMETABLE_ENTRY = gql`
  mutation AddTimetableEntry(
    $class_id: ID!
    $subject_id: ID!
    $teacher_id: ID!
    $period: String!
  ) {
    addTimetableEntry(
      class_id: $class_id
      subject_id: $subject_id
      teacher_id: $teacher_id
      period: $period
    ) {
      id
      class_id
      subject_id
      teacher_id
      period
    }
  }
`;

const UPDATE_TIMETABLE_ENTRY = gql`
  mutation UpdateTimetableEntry(
    $id: ID!
    $class_id: ID
    $subject_id: ID
    $teacher_id: ID
    $period: String
  ) {
    updateTimetableEntry(
      id: $id
      class_id: $class_id
      subject_id: $subject_id
      teacher_id: $teacher_id
      period: $period
    ) {
      id
      class_id
      subject_id
      teacher_id
      period
    }
  }
`;

const DELETE_TIMETABLE_ENTRY = gql`
  mutation DeleteTimetableEntry($id: ID!) {
    deleteTimetableEntry(id: $id)
  }
`;

const TimetableManagement = () => {
  const [formData, setFormData] = useState({
    id: '', // Added for editing
    class_id: '',
    subject_id: '',
    teacher_id: '',
    period: '',
  });
  const [isEditing, setIsEditing] = useState(false); // Track editing state

  // Fetch queries
  const { data: classData } = useQuery(GET_CLASSES);
  const { data: teacherData, loading: teacherLoading } = useQuery(GET_TEACHERS);
  const { data: subjectData, loading: subjectLoading } = useQuery(GET_SUBJECTS);
  const { data: timetableData, refetch: refetchTimetable } = useQuery(GET_TIMETABLE_ENTRIES);

  // Mutations
  const [addTimetableEntry] = useMutation(ADD_TIMETABLE_ENTRY);
  const [updateTimetableEntry] = useMutation(UPDATE_TIMETABLE_ENTRY, {
    refetchQueries: [{ query: GET_TIMETABLE_ENTRIES }],
  });
  const [deleteTimetableEntry] = useMutation(DELETE_TIMETABLE_ENTRY);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add timetable title
    doc.setFontSize(18);
    doc.text('Timetable Entry Details', 10, 10);

    // Add timetable data
    doc.setFontSize(12);
    let yPos = 20;

    // Class details
    const selectedClass = classData?.getAllClasses.find((cls) => cls.id === formData.class_id);
    doc.text(`Class: ${selectedClass?.class_name || ''} (${selectedClass?.section || ''})`, 10, yPos);
    yPos += 10;

    // Subject details
    const selectedSubject = subjectData?.getAllSubjects.find((sub) => sub.id === formData.subject_id);
    doc.text(`Subject: ${selectedSubject?.subject_name || ''}`, 10, yPos);
    yPos += 10;

    // Teacher details
    const selectedTeacher = teacherData?.GetAllStaff.find((teacher) => teacher.id === formData.teacher_id);
    doc.text(`Teacher: ${selectedTeacher?.firstName || ''} (${selectedTeacher?.department || ''})`, 10, yPos);
    yPos += 10;

    // Period
    doc.text(`Period: ${formData.period}`, 10, yPos);

    // Save the PDF
    doc.save('timetable_entry.pdf');
    toast.success('PDF generated successfully!');
  };

  const handleEdit = (entry) => {
    setIsEditing(true);
    setFormData({
      id: entry.id,
      class_id: entry.class_id,
      subject_id: entry.subject_id,
      teacher_id: entry.teacher_id,
      period: entry.period,
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteTimetableEntry({ variables: { id } });
      toast.success('Timetable entry deleted successfully!');
      refetchTimetable();
    } catch (error) {
      toast.error(`Error deleting timetable entry: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields are filled
    if (!formData.class_id || !formData.subject_id || !formData.teacher_id || !formData.period) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      if (isEditing) {
        // Update existing entry
        await updateTimetableEntry({
          variables: {
            id: formData.id,
            class_id: formData.class_id,
            subject_id: formData.subject_id,
            teacher_id: formData.teacher_id,
            period: formData.period,
          },
        });
        toast.success('Timetable entry updated successfully!');
      } else {
        // Add new entry
        await addTimetableEntry({
          variables: formData,
        });
        toast.success('Timetable entry added successfully!');
        // Generate PDF after successful submission
        generatePDF();
      }

      // Refetch timetable data and reset form
      refetchTimetable();
      setFormData({
        id: '',
        class_id: '',
        subject_id: '',
        teacher_id: '',
        period: '',
      });
      setIsEditing(false);
    } catch (error) {
      toast.error(`Error ${isEditing ? 'updating' : 'adding'} timetable entry: ${error.message}`);
    }
  };

  // Create a mapping from teacher_id to teacher_name
  const teacherMap = {};
  if (teacherData?.GetAllStaff) {
    teacherData.GetAllStaff.forEach((teacher) => {
      teacherMap[teacher.id] = `${teacher.firstName} ${teacher.lastName} (${teacher.department})`;
    });
  }

  // Create a mapping from subject_id to subject_name
  const subjectMap = {};
  if (subjectData?.getAllSubjects) {
    subjectData.getAllSubjects.forEach((subject) => {
      subjectMap[subject.id] = subject.subject_name;
    });
  }

  if (teacherLoading || subjectLoading) {
    return <div>Loading...</div>;
  }

  if (!classData || !subjectData || !teacherData || !timetableData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Timetable Management</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {/* Class Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Class
            <select
              name="class_id"
              value={formData.class_id}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            >
              <option value="">Select Class</option>
              {classData.getAllClasses.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.class_name} {cls.section}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Subject Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Subject
            <select
              name="subject_id"
              value={formData.subject_id}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            >
              <option value="">Select Subject</option>
              {subjectData.getAllSubjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.subject_name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Teacher Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Teacher
            <select
              name="teacher_id"
              value={formData.teacher_id}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            >
              <option value="">Select Teacher</option>
              {teacherData.GetAllStaff.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.firstName} ({teacher.department})
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Period Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Period
            <select
              name="period"
              value={formData.period}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            >
              <option value="">Select Period</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((period) => (
                <option key={period} value={period.toString()}>
                  Period {period}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {isEditing ? 'Update Timetable Entry' : 'Add Timetable Entry'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  id: '',
                  class_id: '',
                  subject_id: '',
                  teacher_id: '',
                  period: '',
                });
              }}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Timetable Entries List */}
      <div className="bg-white shadow-md rounded">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">Class</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">Subject</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">Teacher</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">Period</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {timetableData.getTimetableEntries.map((entry) => (
              <tr key={entry.id} className="border-b border-gray-200">
                <td className="px-6 py-4 whitespace-no-wrap">{entry.class_id}</td>
                <td className="px-6 py-4 whitespace-no-wrap">{subjectMap[entry.subject_id]}</td>
                <td className="px-6 py-4 whitespace-no-wrap">{teacherMap[entry.teacher_id]}</td>
                <td className="px-6 py-4 whitespace-no-wrap">Period {entry.period}</td>
                <td className="px-6 py-4 whitespace-no-wrap">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="text-blue-600 hover:text-blue-900 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default TimetableManagement;