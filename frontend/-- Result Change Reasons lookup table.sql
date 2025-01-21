-- Result Change Reasons lookup table
CREATE TABLE ResultChangeReasons (
    ReasonID INT PRIMARY KEY IDENTITY(1,1),
    ReasonCode VARCHAR(20) UNIQUE NOT NULL,
    Description VARCHAR(200) NOT NULL
);
GO

-- Insert common change reasons
INSERT INTO ResultChangeReasons (ReasonCode, Description) VALUES
('CORRECTION', 'Correction of marking error'),
('RECHECK', 'Marks updated after recheck'),
('MODERATION', 'Marks changed after moderation'),
('GRACE_MARKS', 'Grace marks added'),
('OTHER', 'Other reasons');
GO

-- Enhanced Results table with original_marks columns
CREATE TABLE Results (
    ResultID INT PRIMARY KEY IDENTITY(1,1),
    StudentID VARCHAR(50) FOREIGN KEY REFERENCES Students(StudentID),
    ExamType VARCHAR(50),
    AcademicYear VARCHAR(20),
    
    -- Current marks
    English DECIMAL(5,2),
    Mathematics DECIMAL(5,2),
    Science DECIMAL(5,2),
    SocialStudies DECIMAL(5,2),
    Language DECIMAL(5,2),
    Computer DECIMAL(5,2),
    
    -- Original marks (for tracking changes)
    Original_English DECIMAL(5,2),
    Original_Mathematics DECIMAL(5,2),
    Original_Science DECIMAL(5,2),
    Original_SocialStudies DECIMAL(5,2),
    Original_Language DECIMAL(5,2),
    Original_Computer DECIMAL(5,2),
    
    TotalMarks DECIMAL(5,2),
    Percentage DECIMAL(5,2),
    Grade VARCHAR(2),
    
    LastChangeReasonID INT FOREIGN KEY REFERENCES ResultChangeReasons(ReasonID),
    LastChangeComments VARCHAR(500),
    
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE(),
    UpdatedBy VARCHAR(50),
    
    CONSTRAINT UQ_StudentResult UNIQUE (StudentID, ExamType, AcademicYear)
);
GO

-- Result Change History table
CREATE TABLE ResultChangeHistory (
    ChangeID INT PRIMARY KEY IDENTITY(1,1),
    ResultID INT FOREIGN KEY REFERENCES Results(ResultID),
    ChangeReasonID INT FOREIGN KEY REFERENCES ResultChangeReasons(ReasonID),
    Comments VARCHAR(500),
    
    -- Previous values
    Previous_English DECIMAL(5,2),
    Previous_Mathematics DECIMAL(5,2),
    Previous_Science DECIMAL(5,2),
    Previous_SocialStudies DECIMAL(5,2),
    Previous_Language DECIMAL(5,2),
    Previous_Computer DECIMAL(5,2),
    Previous_TotalMarks DECIMAL(5,2),
    Previous_Percentage DECIMAL(5,2),
    Previous_Grade VARCHAR(2),
    
    -- New values
    New_English DECIMAL(5,2),
    New_Mathematics DECIMAL(5,2),
    New_Science DECIMAL(5,2),
    New_SocialStudies DECIMAL(5,2),
    New_Language DECIMAL(5,2),
    New_Computer DECIMAL(5,2),
    New_TotalMarks DECIMAL(5,2),
    New_Percentage DECIMAL(5,2),
    New_Grade VARCHAR(2),
    
    ChangedAt DATETIME DEFAULT GETDATE(),
    ChangedBy VARCHAR(50)
);
GO

-- Updated stored procedure for result management
CREATE PROCEDURE sp_UpsertResult
    @StudentID VARCHAR(50),
    @ExamType VARCHAR(50),
    @AcademicYear VARCHAR(20),
    @English DECIMAL(5,2) = NULL,
    @Mathematics DECIMAL(5,2) = NULL,
    @Science DECIMAL(5,2) = NULL,
    @SocialStudies DECIMAL(5,2) = NULL,
    @Language DECIMAL(5,2) = NULL,
    @Computer DECIMAL(5,2) = NULL,
    @ReasonID INT = NULL,
    @Comments VARCHAR(500) = NULL,
    @UpdatedBy VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @TotalMarks DECIMAL(5,2) = 0;
    DECLARE @ValidSubjects INT = 0;
    DECLARE @Percentage DECIMAL(5,2) = 0;
    DECLARE @Grade VARCHAR(2);
    DECLARE @ResultID INT;
    DECLARE @IsUpdate BIT = 0;

    -- Calculate totals and grade
    SELECT @TotalMarks = ISNULL(@English, 0) + ISNULL(@Mathematics, 0) + 
                        ISNULL(@Science, 0) + ISNULL(@SocialStudies, 0) + 
                        ISNULL(@Language, 0) + ISNULL(@Computer, 0);

    SELECT @ValidSubjects = 
        CASE WHEN @English IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN @Mathematics IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN @Science IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN @SocialStudies IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN @Language IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN @Computer IS NOT NULL THEN 1 ELSE 0 END;

    IF @ValidSubjects > 0
        SET @Percentage = (@TotalMarks / (@ValidSubjects * 100)) * 100;

    SELECT @Grade = 
        CASE 
            WHEN @Percentage >= 90 THEN 'A+'
            WHEN @Percentage >= 80 THEN 'A'
            WHEN @Percentage >= 70 THEN 'B'
            WHEN @Percentage >= 60 THEN 'C'
            WHEN @Percentage >= 50 THEN 'D'
            ELSE 'F'
        END;

    BEGIN TRANSACTION;

    SELECT @ResultID = ResultID, @IsUpdate = 1
    FROM Results 
    WHERE StudentID = @StudentID 
    AND ExamType = @ExamType 
    AND AcademicYear = @AcademicYear;

    IF @IsUpdate = 1
    BEGIN
        -- Store previous values in history
        INSERT INTO ResultChangeHistory (
            ResultID, ChangeReasonID, Comments,
            Previous_English, Previous_Mathematics, Previous_Science,
            Previous_SocialStudies, Previous_Language, Previous_Computer,
            Previous_TotalMarks, Previous_Percentage, Previous_Grade,
            New_English, New_Mathematics, New_Science,
            New_SocialStudies, New_Language, New_Computer,
            New_TotalMarks, New_Percentage, New_Grade,
            ChangedBy
        )
        SELECT 
            ResultID, @ReasonID, @Comments,
            English, Mathematics, Science,
            SocialStudies, Language, Computer,
            TotalMarks, Percentage, Grade,
            @English, @Mathematics, @Science,
            @SocialStudies, @Language, @Computer,
            @TotalMarks, @Percentage, @Grade,
            @UpdatedBy
        FROM Results
        WHERE ResultID = @ResultID;

        -- Update result
        UPDATE Results
        SET English = @English,
            Mathematics = @Mathematics,
            Science = @Science,
            SocialStudies = @SocialStudies,
            Language = @Language,
            Computer = @Computer,
            TotalMarks = @TotalMarks,
            Percentage = @Percentage,
            Grade = @Grade,
            LastChangeReasonID = @ReasonID,
            LastChangeComments = @Comments,
            UpdatedBy = @UpdatedBy,
            UpdatedAt = GETDATE()
        WHERE ResultID = @ResultID;
    END
    ELSE
    BEGIN
        -- Insert new result
        INSERT INTO Results (
            StudentID, ExamType, AcademicYear,
            English, Mathematics, Science, 
            SocialStudies, Language, Computer,
            Original_English, Original_Mathematics, Original_Science,
            Original_SocialStudies, Original_Language, Original_Computer,
            TotalMarks, Percentage, Grade,
            UpdatedBy
        )
        VALUES (
            @StudentID, @ExamType, @AcademicYear,
            @English, @Mathematics, @Science,
            @SocialStudies, @Language, @Computer,
            @English, @Mathematics, @Science,
            @SocialStudies, @Language, @Computer,
            @TotalMarks, @Percentage, @Grade,
            @UpdatedBy
        );
        
        SET @ResultID = SCOPE_IDENTITY();
    END;

    COMMIT;

    -- Return the updated/inserted result
    SELECT * FROM Results WHERE ResultID = @ResultID;
END;
GO