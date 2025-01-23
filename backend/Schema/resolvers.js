import { PubSub } from 'graphql-subscriptions';
import sql from 'mssql';

const pubsub = new PubSub();
const MESSAGE_SENT = 'MESSAGE_SENT';

const resolvers = {
    Query: {
        classMessages: async (_, { limit = 50, offset = 0 }, context) => {
            if (!context.student) {
                throw new Error('Not authenticated');
            }

            const result = await sql.query`
                SELECT m.*, s.FirstName, s.LastName, s.Class
                FROM ChatMessages m
                JOIN Students s ON m.StudentID = s.StudentID
                WHERE m.IsDeleted = 0
                AND EXISTS (
                    SELECT 1 FROM Students
                    WHERE StudentID = ${context.student.StudentID}
                    AND Class = s.Class
                )
                ORDER BY m.CreatedAt DESC
                OFFSET ${offset} ROWS
                FETCH NEXT ${limit} ROWS ONLY
            `;

            return result.recordset;
        },
        classmates: async (_, __, context) => {
            if (!context.student) {
                throw new Error('Not authenticated');
            }
            const result = await sql.query`
                SELECT StudentID, FirstName, LastName, Class
                FROM Students 
                WHERE Class = ${context.student.Class} 
                AND StudentID != ${context.student.StudentID}
            `;
            return result.recordset;
        }
    },
    Mutation: {
        sendMessage: async (_, { input }, context) => {
            if (!context.student) {
                throw new Error('Not authenticated');
            }

            const groupResult = await sql.query`
                SELECT GroupID 
                FROM ClassGroups 
                WHERE ClassNumber = ${context.student.Class}
            `;
            
            const groupID = groupResult.recordset[0].GroupID;
            
            const result = await sql.query`
                INSERT INTO ChatMessages (
                    GroupID, StudentID, MessageContent, MessageType, AttachmentURL
                ) 
                OUTPUT INSERTED.*
                VALUES (
                    ${groupID}, ${context.student.StudentID}, ${input.MessageContent}, ${input.MessageType || 'text'}, ${input.AttachmentURL}
                )
            `;

            const newMessage = {
                ...result.recordset[0],
                Student: context.student
            };

            pubsub.publish(MESSAGE_SENT, {
                messageSent: newMessage,
                classNumber: context.student.Class
            });

            return newMessage;
        }
    },
    Subscription: {
        messageSent: {
            subscribe: (_, { classNumber }, context) => {
                if (!context.student || context.student.Class !== classNumber) {
                    throw new Error('Not authorized to subscribe to this class');
                }
                
                return pubsub.asyncIterator([MESSAGE_SENT]);
            }
        }
    },
    Message: {
        Student: async (parent) => {
            const result = await sql.query`
                SELECT StudentID, FirstName, LastName, Class 
                FROM Students 
                WHERE StudentID = ${parent.StudentID}
            `;
            return result.recordset[0];
        },
        Group: async (parent) => {
            const result = await sql.query`
                SELECT *
                FROM ClassGroups
                WHERE GroupID = ${parent.GroupID}
            `;
            return result.recordset[0];
        }
    }
};

export default resolvers;