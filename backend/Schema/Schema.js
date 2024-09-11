  import { buildSchema } from 'graphql';
  import Studentlist from  "../admin/Studentlist.js"
  const schema = buildSchema(`
    type Student {
      std_id: ID
      std_name: String
      father_name: String
      class: String
      address: String
      mobile_number: String
    }

    type Query {
      students: [Student]
    }
  `);


  const root = {
    students: Studentlist,
  };

  export { schema, root };
