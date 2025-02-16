import React, { useState, useRef } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import { Calendar, Receipt, Download, Edit, Plus, FileDown } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const GET_EXPENSES = gql`
  query GetExpenses {
    expenses {
      ExpenseID
      CategoryID
      Amount
      Description
      ReceiptURL
      ExpenseDate
      CreatedAt
      UpdatedAt
      Category {
        CategoryID
        CategoryName
      }
    }
    categories {
      CategoryID
      CategoryName
    }
  }
`;

const CREATE_EXPENSE = gql`
  mutation CreateExpense(
    $categoryId: Int!
    $amount: Float!
    $description: String
    $receiptUrl: String
    $expenseDate: String!
  ) {
    createExpense(
      categoryId: $categoryId
      amount: $amount
      description: $description
      receiptUrl: $receiptUrl
      expenseDate: $expenseDate
    ) {
      ExpenseID
      Amount
      Description
    }
  }
`;

const UPDATE_EXPENSE = gql`
  mutation UpdateExpense(
    $expenseId: ID!
    $categoryId: Int
    $amount: Float
    $description: String
    $receiptUrl: String
    $expenseDate: String
  ) {
    updateExpense(
      expenseId: $expenseId
      categoryId: $categoryId
      amount: $amount
      description: $description
      receiptUrl: $receiptUrl
      expenseDate: $expenseDate
    ) {
      ExpenseID
      Amount
      Description
    }
  }
`;

const ExpenseManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    description: '',
    receiptUrl: '',
    expenseDate: new Date().toISOString().split('T')[0]
  });

  const { loading, error, data } = useQuery(GET_EXPENSES);
  const [createExpense] = useMutation(CREATE_EXPENSE, {
    refetchQueries: [{ query: GET_EXPENSES }]
  });
  const [updateExpense] = useMutation(UPDATE_EXPENSE, {
    refetchQueries: [{ query: GET_EXPENSES }]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createExpense({
        variables: {
          ...formData,
          categoryId: parseInt(formData.categoryId),
          amount: parseFloat(formData.amount),
          expenseDate: formData.expenseDate
        }
      });
      setShowForm(false);
      setFormData({
        categoryId: '',
        amount: '',
        description: '',
        receiptUrl: '',
        expenseDate: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error creating expense:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateExpense({
        variables: {
          expenseId: selectedExpense.ExpenseID,
          ...formData,
          categoryId: parseInt(formData.categoryId),
          amount: parseFloat(formData.amount),
          expenseDate: formData.expenseDate
        }
      });
      setShowEditForm(false);
      setSelectedExpense(null);
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const generateExpenseReport = (expense) => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("Your School/Company Name", 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text("Address Line 1, City, State, ZIP", 105, 30, { align: 'center' });
    doc.text("Phone: (123) 456-7890 | Email: info@yourschool.com", 105, 37, { align: 'center' });

    doc.setFontSize(16);
    doc.text("Expense Receipt", 105, 50, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 60);
    doc.text(`Receipt ID: ${expense.ExpenseID}`, 15, 67);

    const tableData = [
      ["Category", expense.Category.CategoryName],
      ["Amount", `$${parseFloat(expense.Amount).toFixed(2)}`],
      ["Description", expense.Description || 'N/A'],
      ["Expense Date", new Date(parseInt(expense.ExpenseDate)).toLocaleDateString()],
      ["Created At", new Date(parseInt(expense.CreatedAt)).toLocaleDateString()],
      ["Updated At", expense.UpdatedAt ? new Date(parseInt(expense.UpdatedAt)).toLocaleDateString() : 'N/A'],
    ];

    doc.autoTable({
      startY: 75,
      head: [['Field', 'Value']],
      body: tableData,
      theme: 'grid',
      columnStyles: {
        0: { fontStyle: 'bold' }
      }
    });

    doc.text("_____________________________", 140, doc.autoTable.previous.finalY + 30);
    doc.text("Signature", 150, doc.autoTable.previous.finalY + 40);

    doc.setFontSize(10);
    doc.text("Thank you for your business!", 105, doc.internal.pageSize.getHeight() - 10, { align: 'center' });

    doc.save(`receipt-${expense.ExpenseID}.pdf`);
  };

  const downloadAllReceipts = () => {
    if (!data?.expenses?.length) return;

    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("Your School/Company Name", 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text("Address Line 1, City, State, ZIP", 105, 30, { align: 'center' });
    doc.text("Phone: (123) 456-7890 | Email: info@yourschool.com", 105, 37, { align: 'center' });

    doc.setFontSize(16);
    doc.text("Expense Receipts Summary", 105, 50, { align: 'center' });

    let startY = 60;

    data.expenses.forEach((expense, index) => {
      const tableData = [
        ["Receipt ID", expense.ExpenseID],
        ["Date", new Date(expense.ExpenseDate).toLocaleDateString()],
        ["Category", expense.Category.CategoryName],
        ["Amount", `$${parseFloat(expense.Amount).toFixed(2)}`],
        ["Description", expense.Description || 'N/A'],
        ["Created", new Date(parseInt(expense.CreatedAt)).toLocaleDateString()],
        ["Updated", expense.UpdatedAt ? new Date(parseInt(expense.UpdatedAt)).toLocaleDateString() : 'N/A'],
      ];

      if (index > 0) {
        startY += 10;
        if (startY >= doc.internal.pageSize.getHeight() - 40) {
          doc.addPage();
          startY = 20;
        }
      }

      doc.autoTable({
        startY: startY,
        head: [['Field', 'Value']],
        body: tableData,
        theme: 'grid',
        columnStyles: {
          0: { fontStyle: 'bold' }
        }
      });
      startY = doc.autoTable.previous.finalY;
    });

    doc.save(`all-receipts-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  if (error) return <div className="p-4 text-error">Error: {error.message}</div>;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19A3'];

  const categoryData = data.categories.map(category => {
    const expensesInCategory = data.expenses.filter(expense => expense.CategoryID === category.CategoryID);
    const totalAmount = expensesInCategory.reduce((sum, expense) => sum + parseFloat(expense.Amount), 0);
    return {
      name: category.CategoryName,
      value: totalAmount
    };
  });

  const expensesByCategory = data.expenses.reduce((acc, expense) => {
    const categoryName = expense.Category.CategoryName;
    if (!acc[categoryName]) {
      acc[categoryName] = 0;
    }
    acc[categoryName] += parseFloat(expense.Amount);
    return acc;
  }, {});

  const barChartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    category,
    amount
  }));

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Expense Management</h1>
        <div className="space-x-2">
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Expense
          </button>
          <button
            onClick={downloadAllReceipts}
            className="btn btn-secondary"
          >
            <FileDown className="w-4 h-4 mr-2" /> Download All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Expenses by Category (Bar Chart)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={barChartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Expenses by Category (Pie Chart)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4">Add New Expense</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  className="select select-bordered w-full"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {data.categories.map((category) => (
                    <option key={category.CategoryID} value={category.CategoryID}>
                      {category.CategoryName}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Amount"
                  className="input input-bordered w-full"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  step="0.01"
                />

                <input
                  type="text"
                  placeholder="Description"
                  className="input input-bordered w-full"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />

                <input
                  type="text"
                  placeholder="Receipt URL"
                  className="input input-bordered w-full"
                  value={formData.receiptUrl}
                  onChange={(e) => setFormData({ ...formData, receiptUrl: e.target.value })}
                />

                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={formData.expenseDate}
                  onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditForm && selectedExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4">Edit Expense</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  className="select select-bordered w-full"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {data.categories.map((category) => (
                    <option key={category.CategoryID} value={category.CategoryID}>
                      {category.CategoryName}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Amount"
                  className="input input-bordered w-full"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  step="0.01"
                />

                <input
                  type="text"
                  placeholder="Description"
                  className="input input-bordered w-full"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />

                <input
                  type="text"
                  placeholder="Receipt URL"
                  className="input input-bordered w-full"
                  value={formData.receiptUrl}
                  onChange={(e) => setFormData({ ...formData, receiptUrl: e.target.value })}
                />

                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={formData.expenseDate}
                  onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false);
                    setSelectedExpense(null);
                  }}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.expenses.map((expense) => (
              <tr key={expense.ExpenseID}>
   <td>{new Date(parseInt(expense.ExpenseDate)).toLocaleDateString()}</td>
                <td>{expense.Category.CategoryName}</td>
                <td>{expense.Description}</td>
                <td className="text-right">
                  ${parseFloat(expense.Amount).toFixed(2)}
                </td>
                <td className="space-x-2">
                  <button
                    onClick={() => {
                      setSelectedExpense(expense);
                      setFormData({
                        categoryId: expense.CategoryID,
                        amount: expense.Amount,
                        description: expense.Description,
                        receiptUrl: expense.ReceiptURL,
                        expenseDate: expense.ExpenseDate.split('T')[0]
                      });
                      setShowEditForm(true);
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => generateExpenseReport(expense)}
                    className="btn btn-secondary btn-sm"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseManagement;