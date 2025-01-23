import { gql } from 'graphql-tag';

const typeDefs = gql`
    type Student {
        StudentID: ID!
        FirstName: String!
        LastName: String!
        Class: Int!
    }

    type Group {
        GroupID: ID!
        ClassNumber: Int!
        GroupName: String!
        CreatedAt: String!
        IsActive: Boolean!
    }

    type Message {
        MessageID: ID!
        GroupID: ID!
        StudentID: ID!
        MessageContent: String!
        MessageType: String
        AttachmentURL: String
        CreatedAt: String!
        IsDeleted: Boolean!
        Student: Student!
        Group: Group!
    }

    input MessageInput {
        MessageContent: String!
        MessageType: String
        AttachmentURL: String
    }

    type Query {
        classMessages(limit: Int, offset: Int): [Message!]!
        classmates: [Student!]!
    }

    type Mutation {
        sendMessage(input: MessageInput!): Message!
    }

    type Subscription {
        messageSent(classNumber: Int!): Message!
    }
`;

export default typeDefs;