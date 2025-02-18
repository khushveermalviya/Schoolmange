import React, { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const STUDENT_DETAIL = gql`
  query StudentDetail($studentId: String!) {
    StudentDetail(StudentID: $studentId) {
      StudentID
      FirstName
      LastName
      Class
      Email
      FatherName
    }
  }
`;

// Updated mutation to match exactly with backend schema
const ADD_STUDENT_RESULT = gql`
  mutation AddStudentResult(
    $StudentID: String,
    $ExamTypeID: Int,
    $ExamType: String,
    $SubjectName: String,
    $MarksObtained: Float,
    $MaxMarks: Int,
    $ExamDate: String,
    $Semester: Int,
    $AcademicYear: String,
    $Remarks: String
  ) {
    addStudentResult(
      StudentID: $StudentID,
      ExamTypeID: $ExamTypeID,
      ExamType: $ExamType,
      SubjectName: $SubjectName,
      MarksObtained: $MarksObtained,
      MaxMarks: $MaxMarks,
      ExamDate: $ExamDate,
      Semester: $Semester,
      AcademicYear: $AcademicYear,
      Remarks: $Remarks
    ) {
      ResultID
      StudentID
      ExamTypeID
      ExamType
      SubjectName
      MarksObtained
      MaxMarks
      ExamDate
      Semester
      AcademicYear
      Grade
      Remarks
    }
  }
`;
const Result = () => {
  const [studentID, setStudentID] = useState('');
  const [studentInfo, setStudentInfo] = useState(null);
  const [marks, setMarks] = useState([
    { SubjectName: '', MarksObtained: '', MaxMarks: 100, Remarks: '' }
  ]);
  const [examTypeId, setExamTypeId] = useState(1);
  const [examType, setExamType] = useState('First Term');
  const [semester, setSemester] = useState(1);
  const [academicYear, setAcademicYear] = useState('2023-2024');
  const [examDate, setExamDate] = useState('');

  const { loading: queryLoading, error: queryError, data: studentData, refetch } = useQuery(STUDENT_DETAIL, {
    variables: { studentId: studentID },
    skip: !studentID,
  });

  const [addStudentResult, { loading: mutationLoading }] = useMutation(ADD_STUDENT_RESULT);

  const handleStudentIDSubmit = async (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (!studentID.trim()) {
        toast.error('Please enter a Student ID');
        return;
      }
      try {
        const { data } = await refetch();
        if (data?.StudentDetail) {
          setStudentInfo(data.StudentDetail);
          toast.success('Student found!');
        } else {
          setStudentInfo(null);
          toast.error('Student not found');
        }
      } catch (error) {
        toast.error('Error fetching student details');
        console.error('Error:', error);
      }
    }
  };

  const handleAddSubject = () => {
    setMarks([...marks, { SubjectName: '', MarksObtained: '', MaxMarks: 100, Remarks: '' }]);
  };

  const handleRemoveSubject = (index) => {
    setMarks(marks.filter((_, i) => i !== index));
  };

  const handleMarksChange = (index, field, value) => {
    const newMarks = [...marks];
    newMarks[index] = { ...newMarks[index], [field]: value };
    setMarks(newMarks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentInfo) {
      toast.error('Please verify student ID first');
      return;
    }

    if (!examDate) {
      toast.error('Please select an exam date');
      return;
    }

    try {
      for (const mark of marks) {
        const marksObtained = parseFloat(mark.MarksObtained);
        const maxMarks = parseInt(mark.MaxMarks);

        if (!mark.SubjectName || isNaN(marksObtained) || isNaN(maxMarks)) {
          toast.error('Please fill all required fields for each subject');
          return;
        }

        if (marksObtained > maxMarks) {
          toast.error(`Marks obtained cannot be greater than maximum marks for ${mark.SubjectName}`);
          return;
        }

        await addStudentResult({
            variables: {
              StudentID: studentID,
              ExamTypeID: parseInt(examTypeId),
              ExamType: examType,
              SubjectName: mark.SubjectName,
              MarksObtained: marksObtained,
              MaxMarks: maxMarks,
              ExamDate: examDate,
              Semester: parseInt(semester),
              AcademicYear: academicYear,
              Remarks: mark.Remarks || ''
            }
          });
        }

      toast.success('Marks added successfully!');
      setMarks([{ SubjectName: '', MarksObtained: '', MaxMarks: 100, Remarks: '' }]);
    } catch (error) {
      toast.error('Error adding marks: ' + error.message);
      console.error('Mutation error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Enter Student Marks</h2>
        
        <div className="mb-6">
          <div className="flex gap-4 items-end">
            <div className="form-control flex-1">
              <label className="label">
                <span className="label-text">Student ID</span>
              </label>
              <input
                type="text"
                value={studentID}
                onChange={(e) => setStudentID(e.target.value)}
                onKeyPress={handleStudentIDSubmit}
                className="input input-bordered w-full"
                placeholder="Enter Student ID and press Enter"
                required
              />
            </div>
            <button
              onClick={handleStudentIDSubmit}
              className="btn btn-primary"
              disabled={queryLoading}
            >
              Verify Student
            </button>
          </div>

          {studentInfo && (
            <div className="mt-4 p-4 bg-base-200 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Student Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="font-medium">Name:</span> {studentInfo.FirstName} {studentInfo.LastName}
                </div>
                <div>
                  <span className="font-medium">Father's Name:</span> {studentInfo.FatherName}
                </div>
                <div>
                  <span className="font-medium">Class:</span> {studentInfo.Class}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {studentInfo.Email}
                </div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Exam Type</span>
              </label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="select select-bordered w-full"
                required
              >
                <option value="First Term">First Term</option>
                <option value="Second Term">Second Term</option>
                <option value="Mid Term">Mid Term</option>
                <option value="Final Term">Final Term</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Exam Type ID</span>
              </label>
              <input
                type="number"
                value={examTypeId}
                onChange={(e) => setExamTypeId(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Exam Date</span>
              </label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Semester</span>
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="select select-bordered w-full"
                required
              >
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Academic Year</span>
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="select select-bordered w-full"
                required
              >
                <option value="2023-2024">2023-2024</option>
                <option value="2024-2025">2024-2025</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {marks.map((mark, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Subject</span>
                  </label>
                  <input
                    type="text"
                    value={mark.SubjectName}
                    onChange={(e) => handleMarksChange(index, 'SubjectName', e.target.value)}
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Marks Obtained</span>
                  </label>
                  <input
                    type="number"
                    value={mark.MarksObtained}
                    onChange={(e) => handleMarksChange(index, 'MarksObtained', e.target.value)}
                    className="input input-bordered w-full"
                    min="0"
                    max={mark.MaxMarks}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Max Marks</span>
                  </label>
                  <input
                    type="number"
                    value={mark.MaxMarks}
                    onChange={(e) => handleMarksChange(index, 'MaxMarks', e.target.value)}
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Remarks</span>
                  </label>
                  <input
                    type="text"
                    value={mark.Remarks}
                    onChange={(e) => handleMarksChange(index, 'Remarks', e.target.value)}
                    className="input input-bordered w-full"
                  />
                </div>

                {marks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSubject(index)}
                    className="btn btn-error mt-8"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleAddSubject}
              className="btn btn-secondary"
            >
              Add Subject
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={mutationLoading || !studentInfo}
            >
              {mutationLoading ? 'Saving...' : 'Save Marks'}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Result;