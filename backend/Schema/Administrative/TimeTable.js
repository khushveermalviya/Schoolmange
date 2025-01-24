import { GraphQLList, GraphQLID, GraphQLString, GraphQLNonNull } from 'graphql';
import sql from 'mssql';
import { TimetableType, SubjectType, ClassType, StaffTypess } from './TimeTableTypes.js';

// Add Timetable Entry
const GetAllClasses = {
  type: new GraphQLList(ClassType),
  async resolve() {
    try {
      const result = await sql.query`SELECT * FROM Classes`;
      return result.recordset;
    } catch (err) {
      throw new Error("Error fetching classes: " + err.message);
    }
  },
};

const GetAllSubjects = {
  type: new GraphQLList(SubjectType),
  async resolve() {
    try {
      const result = await sql.query`SELECT * FROM Subjects`;
      return result.recordset;
    } catch (err) {
      throw new Error("Error fetching subjects: " + err.message);
    }
  },
};

const GetAllTeachers = {
  type: new GraphQLList(StaffTypess), // Assuming StaffType is defined
  async resolve() {
    try {
      const result = await sql.query`SELECT * FROM Staff WHERE role = 'teacher'`;
      return result.recordset;
    } catch (err) {
      throw new Error("Error fetching teachers: " + err.message);
    }
  },
};

const GetTimetableByClass = {
  type: new GraphQLList(TimetableType),
  args: {
    class_id: { type: new GraphQLNonNull(GraphQLID) },
  },
  async resolve(parent, args) {
    try {
      const result = await sql.query`
        SELECT * FROM Timetable
        WHERE class_id = ${args.class_id}
      `;
      return result.recordset;
    } catch (err) {
      throw new Error("Error fetching timetable: " + err.message);
    }
  },
};

const GetTimetableByTeacher = {
  type: new GraphQLList(TimetableType),
  args: {
    teacher_id: { type: new GraphQLNonNull(GraphQLID) },
  },
  async resolve(parent, args) {
    try {
      const result = await sql.query`
        SELECT * FROM Timetable
        WHERE teacher_id = ${args.teacher_id}
      `;
      return result.recordset;
    } catch (err) {
      throw new Error("Error fetching timetable: " + err.message);
    }
  },
};

const AddTimetableEntry = {
  type: TimetableType,
  args: {
    class_id: { type: new GraphQLNonNull(GraphQLID) },
    subject_id: { type: new GraphQLNonNull(GraphQLID) },
    teacher_id: { type: new GraphQLNonNull(GraphQLID) },
    period: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent, args) {
    try {
      // Check for conflicts
      const conflictCheck = await sql.query`
        SELECT * FROM Timetable
        WHERE (class_id = ${args.class_id} OR teacher_id = ${args.teacher_id})
        AND period = ${args.period}
      `;

      if (conflictCheck.recordset.length > 0) {
        throw new Error("Conflict: Class or teacher already assigned to this period.");
      }

      // Insert new timetable entry
      await sql.query`
        INSERT INTO Timetable (class_id, subject_id, teacher_id, period)
        VALUES (${args.class_id}, ${args.subject_id}, ${args.teacher_id}, ${args.period})
      `;

      // Fetch the newly inserted entry
      const newEntry = await sql.query`
        SELECT TOP 1 * FROM Timetable 
        WHERE class_id = ${args.class_id} 
        AND subject_id = ${args.subject_id}
        AND teacher_id = ${args.teacher_id}
        AND period = ${args.period}
        ORDER BY id DESC
      `;

      return newEntry.recordset[0];
    } catch (err) {
      throw new Error("Error adding timetable entry: " + err.message);
    }
  },
};

const GetTimetableEntries = {
  type: new GraphQLList(TimetableType),
  async resolve() {
    try {
      const result = await sql.query`
        SELECT 
          t.id, 
          t.class_id, 
          t.subject_id, 
          t.teacher_id, 
          t.period, 
          t.created_at,
          t.updated_at
        FROM Timetable t
      `;
      return result.recordset;
    } catch (err) {
      throw new Error("Error fetching timetable entries: " + err.message);
    }
  }
};

const UpdateTimetableEntry = {
  type: TimetableType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    class_id: { type: GraphQLID },
    subject_id: { type: GraphQLID },
    teacher_id: { type: GraphQLID },
    period: { type: GraphQLString },
  },
  async resolve(parent, args) {
    try {
      // Prepare the update query dynamically
      const updateFields = [];
      const values = [];

      if (args.class_id) {
        updateFields.push('class_id = @class_id');
        values.push({ name: 'class_id', type: sql.Int, value: args.class_id });
      }
      if (args.subject_id) {
        updateFields.push('subject_id = @subject_id');
        values.push({ name: 'subject_id', type: sql.Int, value: args.subject_id });
      }
      if (args.teacher_id) {
        updateFields.push('teacher_id = @teacher_id');
        values.push({ name: 'teacher_id', type: sql.Int, value: args.teacher_id });
      }
      if (args.period) {
        updateFields.push('period = @period');
        values.push({ name: 'period', type: sql.NVarChar, value: args.period });
      }

      if (updateFields.length === 0) {
        throw new Error("No update fields provided");
      }

      // Construct the dynamic SQL query
      const request = new sql.Request();
      request.input('id', sql.Int, args.id); // Declare the @id variable
      values.forEach(val => request.input(val.name, val.type, val.value));

      await request.query(`
        UPDATE Timetable 
        SET ${updateFields.join(', ')} 
        WHERE id = @id
      `);

      // Fetch and return the updated entry
      const result = await sql.query`
        SELECT * FROM Timetable WHERE id = ${args.id}
      `;

      return result.recordset[0];
    } catch (err) {
      throw new Error("Error updating timetable entry: " + err.message);
    }
  }
};

const DeleteTimetableEntry = {
  type: GraphQLString,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) }
  },
  async resolve(parent, args) {
    try {
      await sql.query`DELETE FROM Timetable WHERE id = ${args.id}`;
      return "Timetable entry deleted successfully";
    } catch (err) {
      throw new Error("Error deleting timetable entry: " + err.message);
    }
  }
};

export {
  GetTimetableByTeacher,
  GetAllClasses,
  GetTimetableByClass,
  GetAllTeachers,
  GetAllSubjects,
  AddTimetableEntry,
  GetTimetableEntries,
  UpdateTimetableEntry,
  DeleteTimetableEntry
};