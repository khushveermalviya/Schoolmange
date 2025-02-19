// types/StudentResult.js
import { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLFloat, 
    GraphQLInt, 
    GraphQLList 
  } from 'graphql';
  import sql from "mssql"
   const StudentResultType = new GraphQLObjectType({
    name: 'StudentResult',
    fields: () => ({
      ResultID: { type: GraphQLInt },
      StudentID: { type: GraphQLString },
      ExamTypeID: { type: GraphQLInt },
      ExamType: { type: GraphQLString }, // Add ExamType field
      SubjectName: { type: GraphQLString },
      MarksObtained: { type: GraphQLFloat },
      MaxMarks: { type: GraphQLInt },
      ExamDate: { type: GraphQLString },
      Semester: { type: GraphQLInt },
      AcademicYear: { type: GraphQLString },
      Grade: { type: GraphQLString },
      Remarks: { type: GraphQLString }
    })
  });
  
  const TopPerformerType = new GraphQLObjectType({
    name: 'TopPerformer',
    fields: () => ({
      Class: { type: GraphQLInt },
      StudentID: { type: GraphQLString },
      StudentName: { type: GraphQLString },
      TotalSubjects: { type: GraphQLInt },
      AverageMarks: { type: GraphQLFloat },
      Rank: { type: GraphQLInt }
    })
  });
  // resolvers/studentResults.js

  
  const getStudentResults = {
    type: new GraphQLList(StudentResultType),
    args: {
      StudentID: { type: GraphQLString },
      ExamType: { type: GraphQLString }
    },
    resolve: async (parent, args) => {
      try {
        // Create a new request with parameterized query
        const request = new sql.Request();
        
        let query = `
          SELECT * FROM StudentResults 
          WHERE StudentID = @StudentID
        `;
        
        // Add parameters
        request.input('StudentID', sql.VarChar, args.StudentID);
        
        if (args.ExamType) {
          query += ` AND ExamType = @ExamType`;
          request.input('ExamType', sql.VarChar, args.ExamType);
        }
        
        const result = await request.query(query);
        return result.recordset;
      } catch (error) {
        console.error('Database error:', error);
        throw new Error('Failed to fetch student results');
      }
    }
  };
  
  
  const getClassRankings = {
    type: new GraphQLList(TopPerformerType),
    args: {
      Class: { type: GraphQLInt }
    },
    resolve: async (parent, args) => {
      const result = await sql.query`
        SELECT TOP 10 
          StudentID,
          Class,
          StudentName,
           AverageMarks,
          Rank,
        TotalSubjects
        FROM TopPerformers 
        WHERE Class = ${args.Class}
        ORDER BY Class, Rank
      `;
      return result.recordset;
    }
  };
  const addStudentResult = {
    type: StudentResultType,
    args: {
      StudentID: { type: GraphQLString },
      ExamTypeID: { type: GraphQLInt },
      ExamType: { type: GraphQLString }, // Add ExamType argument
      SubjectName: { type: GraphQLString },
      MarksObtained: { type: GraphQLFloat },
      MaxMarks: { type: GraphQLInt },
      ExamDate: { type: GraphQLString },
      Semester: { type: GraphQLInt },
      AcademicYear: { type: GraphQLString },
      Remarks: { type: GraphQLString }
    },
    resolve: async (parent, args) => {
      // Calculate grade based on marks
      const percentage = (args.MarksObtained / args.MaxMarks) * 100;
      let grade = 'F';
      if (percentage >= 90) grade = 'A+';
      else if (percentage >= 80) grade = 'A';
      else if (percentage >= 70) grade = 'B';
      else if (percentage >= 60) grade = 'C';
      else if (percentage >= 50) grade = 'D';
  
      const result = await sql.query`
        INSERT INTO StudentResults (
          StudentID, ExamTypeID, ExamType, SubjectName, MarksObtained, 
          MaxMarks, ExamDate, Semester, AcademicYear, 
          Grade, Remarks
        )
        OUTPUT INSERTED.*
        VALUES (
          ${args.StudentID}, ${args.ExamTypeID}, ${args.ExamType}, ${args.SubjectName},
          ${args.MarksObtained}, ${args.MaxMarks}, ${args.ExamDate},
          ${args.Semester}, ${args.AcademicYear}, ${grade},
          ${args.Remarks}
        )
      `;
      
      return result.recordset[0];
    }
  };
  export {addStudentResult,getStudentResults,getClassRankings}