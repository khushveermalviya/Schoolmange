-- -- First, create ExamTypes table
-- CREATE TABLE ExamTypes (
--     ExamTypeID INT IDENTITY(1,1) PRIMARY KEY,
--     ExamName NVARCHAR(100) NOT NULL,
--     Description NVARCHAR(255),
--     WeightagePercentage INT DEFAULT 100
-- );

-- GO

-- -- Create ClassSubjects table
-- CREATE TABLE ClassSubjects (
--     ClassSubjectID INT IDENTITY(1,1) PRIMARY KEY,
--     Class INT NOT NULL,
--     SubjectName NVARCHAR(100) NOT NULL,
--     IsCore BIT DEFAULT 1,
--     MaxMarks INT DEFAULT 100,
--     UNIQUE (Class, SubjectName)
-- );

-- GO

-- -- Create StudentResults table with matching VARCHAR(50) for StudentID
-- CREATE TABLE StudentResults (
--     ResultID INT IDENTITY(1,1) PRIMARY KEY,
--     StudentID VARCHAR(50),  -- Matched with Students table
--     ExamTypeID INT,
--     SubjectName NVARCHAR(100),
--     MarksObtained DECIMAL(5,2),
--     MaxMarks INT DEFAULT 100,
--     ExamDate DATE,
--     Semester INT,
--     AcademicYear NVARCHAR(20),
--     Grade NVARCHAR(2),
--     Remarks NVARCHAR(255),
--     CreatedAt DATETIME DEFAULT GETDATE(),
--     UpdatedAt DATETIME DEFAULT GETDATE()
-- );

-- GO

-- -- Add foreign key constraints
-- ALTER TABLE StudentResults
-- ADD CONSTRAINT FK_StudentResults_Students
-- FOREIGN KEY (StudentID) REFERENCES Students(StudentID);

-- ALTER TABLE StudentResults
-- ADD CONSTRAINT FK_StudentResults_ExamTypes
-- FOREIGN KEY (ExamTypeID) REFERENCES ExamTypes(ExamTypeID);

-- GO

-- -- Create the ClassRankings view
-- CREATE OR ALTER VIEW ClassRankings AS
-- WITH AverageScores AS (
--     SELECT 
--         sr.StudentID,
--         s.Class,
--         s.FirstName,
--         s.LastName,
--         AVG(sr.MarksObtained) as AverageScore,
--         COUNT(DISTINCT sr.SubjectName) as SubjectsCount
--     FROM StudentResults sr
--     JOIN Students s ON sr.StudentID = s.StudentID
--     GROUP BY sr.StudentID, s.Class, s.FirstName, s.LastName
-- )
-- SELECT 
--     StudentID,
--     Class,
--     FirstName + ' ' + LastName as StudentName,
--     AverageScore,
--     RANK() OVER (PARTITION BY Class ORDER BY AverageScore DESC) as ClassRank
-- FROM AverageScores
-- WHERE SubjectsCount >= (
--     SELECT COUNT(*) 
--     FROM ClassSubjects cs 
--     WHERE cs.Class = AverageScores.Class AND cs.IsCore = 1
-- );

-- GO

-- -- Insert default exam types
-- INSERT INTO ExamTypes (ExamName, Description, WeightagePercentage) VALUES
-- ('Mid Term', 'Mid Term Examination', 30),
-- ('Final Term', 'Final Term Examination', 70);

-- GO

-- -- Insert subjects for different classes
-- -- Primary Classes (1-5)
-- INSERT INTO ClassSubjects (Class, SubjectName, IsCore) 
-- SELECT c.Class, s.SubjectName, 1
-- FROM (VALUES (1),(2),(3),(4),(5)) AS c(Class)
-- CROSS APPLY (
--     VALUES 
--     ('Hindi'),('English'),('Mathematics'),
--     ('EVS'),('GK'),('Computer')
-- ) AS s(SubjectName);

-- -- Middle Classes (6-10)
-- INSERT INTO ClassSubjects (Class, SubjectName, IsCore)
-- SELECT c.Class, s.SubjectName, 1
-- FROM (VALUES (6),(7),(8),(9),(10)) AS c(Class)
-- CROSS APPLY (
--     VALUES 
--     ('Hindi'),('English'),('Mathematics'),
--     ('Science'),('Social Science'),('Sanskrit'),('Computer')
-- ) AS s(SubjectName);

-- -- Higher Classes (11-12)
-- INSERT INTO ClassSubjects (Class, SubjectName, IsCore)
-- SELECT c.Class, s.SubjectName, 1
-- FROM (VALUES (11),(12)) AS c(Class)
-- CROSS APPLY (
--     VALUES 
--     ('Physics'),('Chemistry'),('Mathematics'),
--     ('English'),('Computer Science')
-- ) AS s(SubjectName);
-- Insert specified students


-- -- Insert random student results for the specified students
-- INSERT INTO StudentResults (StudentID, ExamTypeID, SubjectName, MarksObtained, MaxMarks, ExamDate, Semester, AcademicYear, Grade, Remarks) VALUES
-- ('khushveer', 1, 'Hindi', 85, 100, '2023-01-15', 1, '2022-2023', 'A', 'Good'),
-- ('khushveer', 1, 'English', 78, 100, '2023-01-15', 1, '2022-2023', 'B', 'Satisfactory'),
-- ('khushveer', 1, 'Mathematics', 92, 100, '2023-01-15', 1, '2022-2023', 'A', 'Excellent'),
-- ('khushveer', 1, 'Science', 88, 100, '2023-01-15', 1, '2022-2023', 'A', 'Good'),
-- ('nikita', 1, 'Physics', 75, 100, '2023-01-15', 1, '2022-2023', 'B', 'Satisfactory'),
-- ('nikita', 1, 'Chemistry', 80, 100, '2023-01-15', 1, '2022-2023', 'B', 'Good'),
-- ('nikita', 1, 'Mathematics', 65, 100, '2023-01-15', 1, '2022-2023', 'C', 'Needs Improvement'),
-- ('nikita', 1, 'English', 70, 100, '2023-01-15', 1, '2022-2023', 'B', 'Satisfactory'),
-- ('krishna', 1, 'Physics', 95, 100, '2023-01-15', 1, '2022-2023', 'A', 'Excellent'),
-- ('krishna', 1, 'Chemistry', 90, 100, '2023-01-15', 1, '2022-2023', 'A', 'Good'),
-- ('krishna', 1, 'Mathematics', 85, 100, '2023-01-15', 1, '2022-2023', 'A', 'Good'),
-- ('krishna', 1, 'English', 88, 100, '2023-01-15', 1, '2022-2023', 'A', 'Good'),
-- ('lisa', 1, 'Hindi', 78, 100, '2023-01-15', 1, '2022-2023', 'B', 'Satisfactory'),
-- ('lisa', 1, 'English', 82, 100, '2023-01-15', 1, '2022-2023', 'B', 'Good'),
-- ('lisa', 1, 'Mathematics', 89, 100, '2023-01-15', 1, '2022-2023', 'A', 'Good'),
-- ('lisa', 1, 'Science', 85, 100, '2023-01-15', 1, '2022-2023', 'A', 'Good');

-- -- Insert more results for the second exam type (Final Term)
-- INSERT INTO StudentResults (StudentID, ExamTypeID, SubjectName, MarksObtained, MaxMarks, ExamDate, Semester, AcademicYear, Grade, Remarks) VALUES
-- ('khushveer', 2, 'Hindi', 88, 100, '2023-05-15', 2, '2022-2023', 'A', 'Good'),
-- ('khushveer', 2, 'English', 80, 100, '2023-05-15', 2, '2022-2023', 'B', 'Satisfactory'),
-- ('khushveer', 2, 'Mathematics', 95, 100, '2023-05-15', 2, '2022-2023', 'A', 'Excellent'),
-- ('khushveer', 2, 'Science', 90, 100, '2023-05-15', 2, '2022-2023', 'A', 'Good'),
-- ('nikita', 2, 'Physics', 78, 100, '2023-05-15', 2, '2022-2023', 'B', 'Satisfactory'),
-- ('nikita', 2, 'Chemistry', 85, 100, '2023-05-15', 2, '2022-2023', 'B', 'Good'),
-- ('nikita', 2, 'Mathematics', 70, 100, '2023-05-15', 2, '2022-2023', 'B', 'Satisfactory'),
-- ('nikita', 2, 'English', 75, 100, '2023-05-15', 2, '2022-2023', 'B', 'Satisfactory'),
-- ('krishna', 2, 'Physics', 98, 100, '2023-05-15', 2, '2022-2023', 'A', 'Excellent'),
-- ('krishna', 2, 'Chemistry', 92, 100, '2023-05-15', 2, '2022-2023', 'A', 'Good'),
-- ('krishna', 2, 'Mathematics', 88, 100, '2023-05-15', 2, '2022-2023', 'A', 'Good'),
-- ('krishna', 2, 'English', 90, 100, '2023-05-15', 2, '2022-2023', 'A', 'Good'),
-- ('lisa', 2, 'Hindi', 80, 100, '2023-05-15', 2, '2022-2023', 'B', 'Satisfactory'),
-- ('lisa', 2, 'English', 85, 100, '2023-05-15', 2, '2022-2023', 'B', 'Good'),
-- ('lisa', 2, 'Mathematics', 92, 100, '2023-05-15', 2, '2022-2023', 'A', 'Good'),
-- ('lisa', 2, 'Science', 88, 100, '2023-05-15', 2, '2022-2023', 'A', 'Good');
SELECT * FROM TopPerformers;