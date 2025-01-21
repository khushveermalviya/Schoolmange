-- -- Create a single Result table that contains all necessary information
-- CREATE TABLE Results (
--     ResultID INT PRIMARY KEY IDENTITY(1,1),
--     StudentID VARCHAR(50) FOREIGN KEY REFERENCES Students(StudentID),
--     ExamType VARCHAR(50),  -- 'First Term', 'Second Term', 'Third Term', 'Half Yearly', 'Final'
--     AcademicYear VARCHAR(20),
    
--     -- Subject marks (allowing NULL for flexibility)
--     English DECIMAL(5,2),
--     Mathematics DECIMAL(5,2),
--     Science DECIMAL(5,2),
--     SocialStudies DECIMAL(5,2),
--     Language DECIMAL(5,2),
--     Computer DECIMAL(5,2),
    
--     TotalMarks DECIMAL(5,2),
--     Percentage DECIMAL(5,2),
--     Grade VARCHAR(2),
    
--     CreatedAt DATETIME DEFAULT GETDATE(),
--     UpdatedAt DATETIME DEFAULT GETDATE(),
--     UpdatedBy VARCHAR(50),
    
--     -- Prevent duplicate results for same student, exam type and year
--     CONSTRAINT UQ_StudentResult UNIQUE (StudentID, ExamType, AcademicYear)
-- );
SELECT *  FROM Results;