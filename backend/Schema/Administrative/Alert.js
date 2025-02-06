import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLInputObjectType
} from 'graphql';
import sql from "mssql"

// Enums remain the same
const NotificationTypeEnum = new GraphQLEnumType({
  name: 'NotificationType',
  values: {
      EMERGENCY: { value: 'EMERGENCY' },
      FEES: { value: 'FEES' },
      HOLIDAY: { value: 'HOLIDAY' },
      ANNOUNCEMENT: { value: 'ANNOUNCEMENT' }
  }
});

const PriorityEnum = new GraphQLEnumType({
  name: 'Priority',
  values: {
      HIGH: { value: 'HIGH' },
      MEDIUM: { value: 'MEDIUM' },
      LOW: { value: 'LOW' }
  }
});

// Define Notification Type
const NotificationType = new GraphQLObjectType({
  name: 'Notification',
  fields: () => ({
      NotificationId: { type: new GraphQLNonNull(GraphQLID) },
      Title: { type: new GraphQLNonNull(GraphQLString) },
      Message: { type: new GraphQLNonNull(GraphQLString) },
      CreatedAt: { type: new GraphQLNonNull(GraphQLString) },
      studentId: { type: new GraphQLNonNull(GraphQLString) },
      IsRead: { type: new GraphQLNonNull(GraphQLBoolean) },
      Priority: { type: new GraphQLNonNull(PriorityEnum) },
      ExpiresAt: { type: GraphQLString },
  })
});

// Updated NotificationInput Type to match your mutation
const NotificationInputType = new GraphQLInputObjectType({
  name: 'NotificationInput',
  fields: () => ({  
      type: { type: new GraphQLNonNull(NotificationTypeEnum) },
      title: { type: new GraphQLNonNull(GraphQLString) },
      message: { type: new GraphQLNonNull(GraphQLString) },
      priority: { type: new GraphQLNonNull(PriorityEnum) },
      expiresAt: { type: GraphQLString },
      studentId: { type: new GraphQLNonNull(GraphQLID) }  // Changed from studentIds to match your use case
  })
});

const NotificationQueries = {
  notifications: {
      type: new GraphQLList(new GraphQLNonNull(NotificationType)),
      args: {
          StudentId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve: async (parent, args) => {
          const result = await sql.query`
              SELECT * FROM Notifications WHERE StudentId = ${args.StudentId}
          `;
          return result.recordset;
      }
  }
};

const NotificationMutations = {
  createNotification: {
      type: NotificationType,
      args: {
          input: { type: new GraphQLNonNull(NotificationInputType) }
      },
      resolve: async (parent, { input }) => {
          try {
              const result = await sql.query`
                  INSERT INTO Notifications (
                      Type, 
                      Title, 
                      Message, 
                      Priority, 
                      ExpiresAt,
                      StudentId
                  )
                  OUTPUT INSERTED.*
                  VALUES (
                      ${input.type},
                      ${input.title},
                      ${input.message},
                      ${input.priority},
                      ${input.expiresAt},
                      ${input.studentId}
                  )
              `;

              return result.recordset[0];
          } catch (error) {
              throw new Error(`Failed to create notification: ${error.message}`);
          }
      }
  },
  markNotificationAsRead: {
      type: NotificationType,
      args: {
          notificationId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve: async (parent, { notificationId }) => {
          await sql.query`
              UPDATE Notifications 
              SET IsRead = 1
              WHERE NotificationId = ${notificationId}
          `;

          const result = await sql.query`
              SELECT * FROM Notifications 
              WHERE NotificationId = ${notificationId}
          `;
          return result.recordset[0];
      }
  }
};

export { NotificationQueries, NotificationMutations };