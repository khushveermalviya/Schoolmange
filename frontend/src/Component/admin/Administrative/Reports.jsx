import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { UserSearch, Camera, Download } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast'; // Import Toaster
import jsPDF from 'jspdf';

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

const GET_STUDENT_ATTENDANCE = gql`
  query GetStudentAttendance($StudentID: String!) {
    GetStudentAttendance(StudentID: $StudentID) {
      StudentID
      Date
      Status
      AttendanceID
      Remarks
    }
  }
`;

const initialStudentState = {
  StudentID: '',
  FirstName: '',
  LastName: '',
  Class: '',
  Email: '',
  FatherName: '',
  Photo: null,
};

const getSubjectsForClass = (classLevel) => {
  const classNum = parseInt(classLevel);
  if (classNum >= 1 && classNum <= 5) {
    return ['Hindi', 'English', 'Mathematics', 'GK', 'EVS', 'SST', 'Computer'];
  } else if (classNum >= 6 && classNum <= 10) {
    return [
      'Hindi',
      'English',
      'Mathematics',
      'SST',
      'Science',
      'GK',
      'Sanskrit',
      'Computer',
    ];
  } else if (classNum >= 11 && classNum <= 12) {
    return [
      'Hindi',
      'English',
      'Physics',
      'Chemistry',
      'Mathematics',
      'Computer Science',
    ];
  }
  return [];
};

const Reports = () => {
  const [searchId, setSearchId] = useState('');
  const [studentData, setStudentData] = useState(initialStudentState);
  const [marks, setMarks] = useState({});
  const [attendance, setAttendance] = useState({
    present: 0,
    absent: 0,
    total: 0,
  });
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const shouldSkipQuery = !searchId;
  const { refetch: fetchStudent } = useQuery(STUDENT_DETAIL, {
    skip: shouldSkipQuery,
    onCompleted: (data) => {
      if (data?.StudentDetail) {
        setStudentData(data.StudentDetail);
        setSelectedClass(data.StudentDetail.Class);
        toast.success('Student data fetched successfully');
      }
    },
   
  });

  const { refetch: fetchAttendance } = useQuery(GET_STUDENT_ATTENDANCE, {
    skip: shouldSkipQuery,
    onCompleted: (data) => {
      if (data?.GetStudentAttendance) {
        const present = data.GetStudentAttendance.filter(
          (a) => a.Status === 'Present'
        ).length;
        const total = data.GetStudentAttendance.length;
        setAttendance({
          present,
          absent: total - present,
          total,
        });
      }
    },
  
  });

  // Now fetchStudent and fetchAttendance are defined within the scope of handleSearch
// Now fetchStudent and fetchAttendance are defined within the scope of handleSearch
const handleSearch = async () => {
  if (!searchId) {
    toast.error('Please enter a student ID');
    return;
  }
  try {
    // Attempt to fetch student data
    const studentResult = await fetchStudent({ studentId: searchId });
    if (!studentResult.data || !studentResult.data.StudentDetail) {
      // If no data is returned, inform the user that the ID was not found
      toast.error('Student ID not found');
    } else {
      // If student data is found, proceed to fetch attendance
      await fetchAttendance({ StudentID: searchId });
    }
  } catch (error) {
    // If an error occurs during the fetch, it will be caught here

  }
};



  const handleStudentDataChange = (field, value) => {
    setStudentData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMarkChange = (subject, value) => {
    setMarks((prev) => ({
      ...prev,
      [subject]: value,
    }));
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStudentData((prev) => ({
          ...prev,
          Photo: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadPDF = () => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const primaryColor = "#007bff"; // Example primary color - adjust as needed
        const textColor = "#000000"; // Example text color - adjust as needed
    
        const addText = (text, x, y, styles = {}) => {
            if (styles.font) {
                pdf.setFont(styles.font);
            }
            pdf.setFontSize(styles.size || 12);
            if (styles.color) {
                pdf.setTextColor(styles.color);
            } else {
                pdf.setTextColor(textColor);
            }
            pdf.text(text, x, y, { align: styles.align || 'left' });
            pdf.setFont('helvetica');
            pdf.setTextColor(textColor);
        };
    
        const addLine = (x1, y1, x2, y2, color = '#000000') => {
            pdf.setDrawColor(color);
            pdf.line(x1, y1, x2, y2);
        };
    
        // Title
        addText('Academic Report Card', 105, 15, { size: 20, color: primaryColor, font: 'times', align: 'center' });
        addText('Academic Year 2024-25', 105, 22, { size: 14, color: textColor, font: 'times', align: 'center' });
    
        let yOffset = 40;
    
        // Student Details
        const studentDetails = [
            { label: "Name:", value: `${studentData.FirstName} ${studentData.LastName}` },
            { label: "Class:", value: selectedClass },
            { label: "Father's Name:", value: studentData.FatherName },
            { label: "Student ID:", value: studentData.StudentID },
        ];
    
        studentDetails.forEach((detail) => {
            addText(`${detail.label} ${detail.value}`, 20, yOffset);
            yOffset += 10;
        });
    
        // Add student's photo if available
        if (studentData.Photo) {
            try {
                pdf.addImage(studentData.Photo, 'JPEG', 150, 40, 40, 40);
                yOffset = 90; // Adjust yOffset based on where you want the next section to start
            } catch (error) {
                console.error('Error adding image to PDF', error);
                toast.error('Error adding image to PDF');
            }
        } else {
            yOffset += 10; // Extra space if no photo
        }
    
        // Attendance Record
        addText('Attendance Record', 20, yOffset, { size: 16, color: primaryColor, font: 'times' });
        yOffset += 10;
        addLine(20, yOffset, 190, yOffset);
        yOffset += 5;
        const attendanceDetails = [
            { label: "Present Days:", value: attendance.present },
            { label: "Absent Days:", value: attendance.absent },
            {
                label: "Attendance %:",
                value: attendance.total
                    ? ((attendance.present / attendance.total) * 100).toFixed(1) + '%'
                    : '0%',
            },
        ];
    
        attendanceDetails.forEach((detail) => {
            addText(`${detail.label} ${detail.value}`, 20, yOffset);
            yOffset += 10;
        });
    
        // Academic Performance
        addText('Academic Performance', 20, yOffset, { size: 16, color: primaryColor, font: 'times' });
        yOffset += 10;
        addLine(20, yOffset, 190, yOffset);
        yOffset += 5;
        const subjects = getSubjectsForClass(selectedClass);
        const maxMarks = 100;
    
        addText('Subject', 20, yOffset, { size: 12, font: 'helvetica', weight: 'bold' });
        addText('Marks Obtained', 80, yOffset, { size: 12, font: 'helvetica', weight: 'bold' });
        addText('Max Marks', 120, yOffset, { size: 12, font: 'helvetica', weight: 'bold' });
        addText('Grade', 160, yOffset, { size: 12, font: 'helvetica', weight: 'bold' });
        yOffset += 5;
        addLine(20, yOffset, 190, yOffset);
        yOffset += 5;
    
        subjects.forEach((subject) => {
            const mark = marks[subject] || 0;
            const grade = calculateGrade(mark);
            addText(subject, 20, yOffset);
            addText(mark.toString(), 80, yOffset);
            addText(maxMarks.toString(), 120, yOffset);
            addText(grade, 160, yOffset);
            yOffset += 10;
        });
    
        // Calculate total marks, percentage, and final grade
        const totalMarks = calculateTotal();
        const percentage = calculatePercentage();
        const finalGrade = calculateOverallGrade(percentage);
    
        addLine(20, yOffset, 190, yOffset);
        yOffset += 5;
        addText(`Total Marks: ${totalMarks}`, 20, yOffset, { size: 12, font: 'helvetica', weight: 'bold' });
        addText(`Percentage: ${percentage}%`, 80, yOffset, { size: 12, font: 'helvetica', weight: 'bold' });
        addText(`Grade: ${finalGrade}`, 140, yOffset, { size: 12, font: 'helvetica', weight: 'bold' });
    
        // Teacher's and Principal's Remarks (Optional)
        yOffset += 20; // Adjust spacing as needed
    
        // Remarks
        addText("Class Teacher's Remarks", 20, yOffset, { size: 14, color: primaryColor, font: 'times' });
        yOffset += 5;
        addLine(20, yOffset, 95, yOffset);
        yOffset += 5;
        addText("Signature: _________________________", 20, yOffset, { size: 12, font: 'helvetica' });
    
        addText("Principal's Remarks", 120, yOffset-10, { size: 14, color: primaryColor, font: 'times' });
        yOffset += 5;
        addLine(120, yOffset, 190, yOffset);
        yOffset += 5;
        addText("Signature: _________________________", 120, yOffset, { size: 12, font: 'helvetica' });
    
        // Save the PDF
        const filename = `Report_Card_${studentData.FirstName || 'Student'}_${studentData.Class || 'Class'}.pdf`;
        pdf.save(filename);
    
        toast.dismiss();
        toast.success('Report card downloaded successfully');
      };
    
      const calculateGrade = (mark) => {
        if (mark >= 90) return 'A+';
        if (mark >= 80) return 'A';
        if (mark >= 70) return 'B';
        if (mark >= 60) return 'C';
        if (mark >= 50) return 'D';
        if (mark > 0) return 'F';
        return '-';
      };
    
      const calculateTotal = () => {
        return subjects.reduce(
          (total, subject) => total + (parseInt(marks[subject]) || 0),
          0
        );
      };
    
      const calculatePercentage = () => {
        const total = calculateTotal();
        const maxMarks = subjects.length * 100;
        return ((total / maxMarks) * 100).toFixed(2);
      };
    
      const calculateOverallGrade = (percentage) => {
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B';
        if (percentage >= 60) return 'C';
        if (percentage >= 50) return 'D';
        return 'F';
      };

  const subjects = selectedClass ? getSubjectsForClass(selectedClass) : [];

  return (
    <div className="p-4 max-w-6xl mx-auto">
    {/* Toaster for Notifications */}
    <Toaster position="top-center" reverseOrder={false} />

    {/* Control Panel */}
    <div className="card bg-base-100 shadow-xl mb-6">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h2 className="card-title">Student Marksheet Generator</h2>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text mr-2">Manual Entry</span>
              <input
                type="checkbox"
                className="toggle"
                checked={isManualEntry}
                onChange={(e) => setIsManualEntry(e.target.checked)}
              />
            </label>
          </div>
        </div>

        {!isManualEntry && (
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Enter Student ID"
              className="input input-bordered w-full"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleSearch}>
              <UserSearch className="w-5 h-5 mr-2" />
              Search
            </button>
          </div>
        )}

        {/* Student Details Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">Student ID</label>
            <input
              type="text"
              className="input input-bordered"
              value={studentData.StudentID || ''}
              onChange={(e) =>
                handleStudentDataChange('StudentID', e.target.value)
              }
              disabled={!isManualEntry}
            />
          </div>
          <div className="form-control">
            <label className="label">Class</label>
            <select
              className="select select-bordered"
              value={selectedClass || ''}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">Select Class</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Class {i + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control">
            <label className="label">First Name</label>
            <input
              type="text"
              className="input input-bordered"
              value={studentData.FirstName || ''}
              onChange={(e) =>
                handleStudentDataChange('FirstName', e.target.value)
              }
            />
          </div>
          <div className="form-control">
            <label className="label">Last Name</label>
            <input
              type="text"
              className="input input-bordered"
              value={studentData.LastName || ''}
              onChange={(e) =>
                handleStudentDataChange('LastName', e.target.value)
              }
            />
          </div>
          <div className="form-control">
            <label className="label">Father's Name</label>
            <input
              type="text"
              className="input input-bordered"
              value={studentData.FatherName || ''}
              onChange={(e) =>
                handleStudentDataChange('FatherName', e.target.value)
              }
            />
          </div>
          <div className="form-control">
            <label className="label">Email</label>
            <input
              type="email"
              className="input input-bordered"
              value={studentData.Email || ''}
              onChange={(e) =>
                handleStudentDataChange('Email', e.target.value)
              }
            />
          </div>
        </div>

        {/* Photo Upload */}
        <div className="mt-4">
          <label className="label">Student Photo</label>
          <div className="flex items-center gap-4">
            {studentData.Photo ? (
              <div className="avatar">
                <div className="w-24 rounded">
                  <img src={studentData.Photo} alt="Student" />
                </div>
              </div>
            ) : (
              <div className="avatar placeholder">
                <div className="w-24 rounded bg-neutral text-neutral-content">
                  <Camera size={32} />
                </div>
              </div>
            )}
            <input
              type="file"
              className="file-input file-input-bordered w-full max-w-xs"
              accept="image/*"
              onChange={handlePhotoUpload}
            />
          </div>
        </div>
      </div>
    </div>

    {/* Attendance Section */}
    <div className="card bg-base-100 shadow-xl mb-6">
      <div className="card-body">
        <h3 className="card-title">Attendance</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="form-control">
            <label className="label">Present Days</label>
            <input
              type="number"
              className="input input-bordered"
              value={attendance.present || 0}
              onChange={(e) =>
                setAttendance((prev) => ({
                  ...prev,
                  present: parseInt(e.target.value) || 0,
                }))
              }
            />
          </div>
          <div className="form-control">
            <label className="label">Absent Days</label>
            <input
              type="number"
              className="input input-bordered"
              value={attendance.absent || 0}
              onChange={(e) =>
                setAttendance((prev) => ({
                  ...prev,
                  absent: parseInt(e.target.value) || 0,
                }))
              }
            />
          </div>
          <div className="form-control">
            <label className="label">Total Days</label>
            <input
              type="number"
              className="input input-bordered"
              value={attendance.total || 0}
              onChange={(e) =>
                setAttendance((prev) => ({
                  ...prev,
                  total: parseInt(e.target.value) || 0,
                }))
              }
            />
          </div>
        </div>
      </div>
    </div>

    {/* Marks Entry */}
    {subjects.length > 0 && (
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h3 className="card-title">Marks Entry</h3>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Marks Obtained</th>
                  <th>Max Marks</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => (
                  <tr key={subject}>
                    <td>{subject}</td>
                    <td>
                      <input
                        type="number"
                        className="input input-bordered w-24"
                        value={marks[subject] || ''}
                        onChange={(e) =>
                          handleMarkChange(subject, e.target.value)
                        }
                        max="100"
                      />
                    </td>
                    <td>100</td>
                    <td>
                      {marks[subject] >= 90
                        ? 'A+'
                        : marks[subject] >= 80
                        ? 'A'
                        : marks[subject] >= 70
                        ? 'B'
                        : marks[subject] >= 60
                        ? 'C'
                        : marks[subject] >= 50
                        ? 'D'
                        : marks[subject]
                        ? 'F'
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="2">Total Marks: {calculateTotal()}</td>
                  <td colSpan="2">
                    Percentage: {calculatePercentage()}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    )}

    {/* Result Analysis */}
    <div className="card bg-base-100 shadow-xl mt-6">
      <div className="card-body">
        <h3 className="card-title">Result Analysis</h3>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total Marks</div>
            <div className="stat-value">{calculateTotal()}</div>
            <div className="stat-desc">Out of {subjects.length * 100}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Percentage</div>
            <div className="stat-value">{calculatePercentage()}%</div>
            <div className="stat-desc">Overall Performance</div>
          </div>
          <div className="stat">
            <div className="stat-title">Grade</div>
            <div className="stat-value">
              {calculatePercentage() >= 90
                ? 'A+'
                : calculatePercentage() >= 80
                ? 'A'
                : calculatePercentage() >= 70
                ? 'B'
                : calculatePercentage() >= 60
                ? 'C'
                : calculatePercentage() >= 50
                ? 'D'
                : 'F'}
            </div>
            <div className="stat-desc">Final Grade</div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            className="btn btn-secondary"
            onClick={() => {
              setStudentData(initialStudentState);
              setMarks({});
              setAttendance({ present: 0, absent: 0, total: 0 });
              setSelectedClass('');
              setSearchId('');
              toast.success('Form cleared successfully');
            }}
          >
            Clear Form
          </button>

          <button
            className="btn btn-primary"
            onClick={() => downloadPDF(studentData)}
            disabled={!studentData.FirstName}
          >
            <Download className="w-5 h-5 mr-2" />
            Download Report
          </button>
        </div>
      </div>
    </div>
  </div>
);
};

export default Reports;