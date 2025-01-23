import { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLList, 
    GraphQLInt, 
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLBoolean 
} from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import StudentLoginType from '../StudentLogin.js';
import sql from "mssql";

const pubsub = new PubSub();
const MESSAGE_SENT = 'MESSAGE_SENT';

const GroupType = new GraphQLObjectType({
    name: 'Group',
    fields: () => ({
        GroupID: { type: GraphQLString },
        ClassNumber: { type: GraphQLInt },
        GroupName: { type: GraphQLString },
        CreatedAt: { type: GraphQLString },
        IsActive: { type: GraphQLBoolean } 
    })
});

const MessageType = new GraphQLObjectType({
    name: 'Message',
    fields: () => ({
        MessageID: { type: GraphQLString },
        GroupID: { type: GraphQLString },
        StudentID: { type: GraphQLString },
        MessageContent: { type: GraphQLString },
        MessageType: { type: GraphQLString },
        AttachmentURL: { type: GraphQLString },
        CreatedAt: { type: GraphQLString },
        IsDeleted: { type: GraphQLBoolean },
        Student: { 
            type: StudentLoginType,
            resolve: async (parent) => {
                const result = await sql.query`
                    SELECT StudentID, FirstName, LastName, Class 
                    FROM Students 
                    WHERE StudentID = ${parent.StudentID}
                `;
                return result.recordset[0];
            }
        },
        Group: {
            type: GroupType,
            resolve: async (parent) => {
                const result = await sql.query`
                    SELECT *
                    FROM ClassGroups
                    WHERE GroupID = ${parent.GroupID}
                `;
                return result.recordset[0];
            }
        }
    })
});

const MessageInputType = new GraphQLInputObjectType({
    name: 'MessageInput',
    fields: {
        MessageContent: { type: new GraphQLNonNull(GraphQLString) },
        MessageType: { type: GraphQLString },
        AttachmentURL: { type: GraphQLString }
    }
});

// Export group queries as an object
const groupQueries = {
    classMessages: {
        type: new GraphQLList(MessageType),
        args: {
            limit: { type: GraphQLInt },
            offset: { type: GraphQLInt }
        },
        resolve: async (parent, { limit = 50, offset = 0 }, context) => {
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
        }
    },
    classmates: {
        type: new GraphQLList(StudentLoginType),
        resolve: async (parent, args, context) => {
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
    }
};

// Export group mutations as an object
const groupMutations = {
    sendMessage: {
        type: MessageType,
        args: {
            input: { type: new GraphQLNonNull(MessageInputType) }
        },
        resolve: async (parent, { input }, context) => {
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
    }
};

const RootSubscription = new GraphQLObjectType({
    name: 'Subscription',
    fields: {
        messageSent: {
            type: MessageType,
            args: {
                classNumber: { type: new GraphQLNonNull(GraphQLInt) }
            },
            subscribe: (parent, { classNumber }, context) => {
                if (!context.student || context.student.Class !== classNumber) {
                    throw new Error('Not authorized to subscribe to this class');
                }
                
                return pubsub.asyncIterator([MESSAGE_SENT]);
            },
            resolve: (payload) => {
                return payload.messageSent;
            }
        }
    }
});

export { groupQueries, groupMutations, RootSubscription };