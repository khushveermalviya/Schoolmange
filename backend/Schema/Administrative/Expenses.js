import sql from "mssql";
import { GraphQLSchema, GraphQLObjectType, GraphQLID, GraphQLString, GraphQLFloat, GraphQLList, GraphQLNonNull, GraphQLInt } from "graphql";

// Define ExpenseCategoryType
const ExpenseCategoryType = new GraphQLObjectType({
    name: 'ExpenseCategory',
    fields: () => ({
        CategoryID: { type: new GraphQLNonNull(GraphQLID) },
        CategoryName: { type: new GraphQLNonNull(GraphQLString) },
        Description: { type: GraphQLString }
    })
});

// Define ExpenseType, including the relationship to ExpenseCategoryType
const ExpenseType = new GraphQLObjectType({
    name: 'Expense',
    fields: () => ({
        ExpenseID: { type: new GraphQLNonNull(GraphQLID) },
        CategoryID: { type: new GraphQLNonNull(GraphQLInt) },
        Category: {
            type: ExpenseCategoryType, // Use the defined type, not a new one
            resolve: async (parent) => {
                //  Fetch the category for the current expense
                try {
                    const result = await sql.query`SELECT * FROM ExpenseCategories WHERE CategoryID = ${parent.CategoryID}`;
                    return result.recordset[0];
                } catch (err) {
                    console.error("Error fetching category:", err);
                    throw new Error('Failed to fetch category for expense');
                }
            }
        },
        Amount: { type: new GraphQLNonNull(GraphQLFloat) },
        Description: { type: GraphQLString },
        ReceiptURL: { type: GraphQLString },
        ExpenseDate: { type: new GraphQLNonNull(GraphQLString) },
        CreatedAt: { type: new GraphQLNonNull(GraphQLString) },
        UpdatedAt: { type: new GraphQLNonNull(GraphQLString) }
    })
});

// Define the Root Query
const Expenses = {
        expenses: {
            type: new GraphQLList(ExpenseType),
            resolve: async () => {
                try {
                    const result = await sql.query`SELECT * FROM Expenses ORDER BY ExpenseDate DESC`;
                    return result.recordset;
                } catch (err) {
                    console.error("Error fetching expenses:", err); // More detailed error logging
                    throw new Error('Failed to fetch expenses');
                }
            }
        },
        expensesByCategory: {
            type: new GraphQLList(ExpenseType),
            args: { categoryId: { type: new GraphQLNonNull(GraphQLInt) } },
            resolve: async (_, { categoryId }) => {
                try {
                    const result = await sql.query`SELECT * FROM Expenses WHERE CategoryID = ${categoryId} ORDER BY ExpenseDate DESC`;
                    return result.recordset;
                } catch (err) {
                     console.error("Error fetching expenses by category:", err);
                    throw new Error('Failed to fetch expenses by category');
                }
            }
        },
        categories: {
            type: new GraphQLList(ExpenseCategoryType),
            resolve: async () => {
                try {
                    const result = await sql.query`SELECT * FROM ExpenseCategories`;
                    return result.recordset;
                } catch (err) {
                    console.error("Error fetching categories:", err);
                    throw new Error('Failed to fetch categories');
                }
            }
        }
    }


// Define the Root Mutation
const ExpenseMutation ={
        createExpense: {
            type: ExpenseType,
            args: {
                categoryId: { type: new GraphQLNonNull(GraphQLInt) },
                amount: { type: new GraphQLNonNull(GraphQLFloat) },
                description: { type: GraphQLString },
                receiptUrl: { type: GraphQLString },
                expenseDate: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: async (_, { categoryId, amount, description, receiptUrl, expenseDate }) => {
                try {
                    const result = await sql.query`
                        INSERT INTO Expenses (CategoryID, Amount, Description, ReceiptURL, ExpenseDate)
                        VALUES (${categoryId}, ${amount}, ${description}, ${receiptUrl}, ${expenseDate});
                        SELECT * FROM Expenses WHERE ExpenseID = SCOPE_IDENTITY();
                    `;
                     return result.recordset[0];
                } catch (err) {
                     console.error("Error creating expense:", err);
                    throw new Error('Failed to create expense');
                }
            }
        },
        updateExpense: {
           type: ExpenseType,
            args: {
                expenseId: { type: new GraphQLNonNull(GraphQLID) },
                categoryId: { type: GraphQLInt },  // Allow optional updates
                amount: { type: GraphQLFloat },
                description: { type: GraphQLString },
                receiptUrl: { type: GraphQLString },
                expenseDate: { type: GraphQLString }
            },
            resolve: async (_, { expenseId, ...updates }) => {
                try {
                    const setClauseParts = [];
                    const parameters = {};

                    // Build the SET clause and parameters dynamically
                    for (const key in updates) {
                        if (updates[key] !== undefined) {
                            setClauseParts.push(`${key} = @${key}`);
                            parameters[key] = updates[key];
                        }
                    }

                    if (setClauseParts.length === 0) {
                        // No updates provided, return the existing expense
                        const existingResult = await sql.query`SELECT * FROM Expenses WHERE ExpenseID = ${expenseId}`;
                        return existingResult.recordset[0];
                    }

                    const setClause = setClauseParts.join(', ');

                    // Build the dynamic query
                    const query = `
                        UPDATE Expenses
                        SET ${setClause}, UpdatedAt = GETDATE()
                        WHERE ExpenseID = @expenseId;

                        SELECT * FROM Expenses WHERE ExpenseID = @expenseId;
                    `;
                  parameters.expenseId = expenseId;
                    // Pass parameters to the query
                  const request = new sql.Request();
                    for (const key in parameters) {
                      request.input(key, parameters[key]);
                    }

                  const result = await request.query(query);


                    return result.recordset[0];

                } catch (err) {
                  console.error("Error updating expense:", err);
                    throw new Error('Failed to update expense');
                }
            }
        },

        deleteExpense: {
            type: GraphQLString,
            args: { expenseId: { type: new GraphQLNonNull(GraphQLID) } },
            resolve: async (_, { expenseId }) => {
                try {
                    await sql.query`DELETE FROM Expenses WHERE ExpenseID = ${expenseId}`;
                    return 'Expense deleted successfully';
                } catch (err) {
                    console.error("Error deleting expense:", err);
                    throw new Error('Failed to delete expense');
                }
            }
        }
    }




// Create the schema

export { Expenses,ExpenseMutation};