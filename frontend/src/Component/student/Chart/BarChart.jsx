import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell 
} from 'recharts';
import { Calendar, Receipt, Download, Edit, Plus, FileDown } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
// import { Bar } from 'react-chartjs-2';
// import 'chart.js/auto';

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
          expenseDate: formData.expenseDate // Already in YYYY-MM-DD format
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
          expenseDate: formData.expenseDate // Already in YYYY-MM-DD format
        }
      });
      setShowEditForm(false);
      setSelectedExpense(null);
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const downloadReceiptPDF = (expense) => {
    const doc = new jsPDF();
    const expenseDate = new Date(parseInt(expense.ExpenseDate));
    const createdAt = new Date(parseInt(expense.CreatedAt));
    const updatedAt = expense.UpdatedAt ? new Date(parseInt(expense.UpdatedAt)) : null;

    doc.text('EXPENSE RECEIPT', 20, 20);
    doc.text(`Date: ${expenseDate.toLocaleDateString()}`, 20, 30);
    doc.text(`Category: ${expense.Category.CategoryName}`, 20, 40);
    doc.text(`Amount: $${parseFloat(expense.Amount).toFixed(2)}`, 20, 50);
    doc.text(`Description: ${expense.Description || 'N/A'}`, 20, 60);
    doc.text(`Receipt ID: ${expense.ExpenseID}`, 20, 70);
    doc.text(`Created: ${createdAt.toLocaleDateString()}`, 20, 80);
    if (updatedAt) {
      doc.text(`Updated: ${updatedAt.toLocaleDateString()}`, 20, 90);
    }

    doc.save(`receipt-${expense.ExpenseID}.pdf`);
  };

  const downloadReceiptExcel = (expense) => {
    const expenseDate = new Date(parseInt(expense.ExpenseDate));
    const createdAt = new Date(parseInt(expense.CreatedAt));
    const updatedAt = expense.UpdatedAt ? new Date(parseInt(expense.UpdatedAt)) : null;

    const worksheet = XLSX.utils.json_to_sheet([{
      'Date': expenseDate.toLocaleDateString(),
      'Category': expense.Category.CategoryName,
      'Amount': parseFloat(expense.Amount).toFixed(2),
      'Description': expense.Description || 'N/A',
      'Receipt ID': expense.ExpenseID,
      'Created': createdAt.toLocaleDateString(),
      'Updated': updatedAt ? updatedAt.toLocaleDateString() : ''
    }]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Receipt');
    XLSX.writeFile(workbook, `receipt-${expense.ExpenseID}.xlsx`);
  };

  const downloadAllReceiptsPDF = () => {
    if (!data?.expenses?.length) return;

    const doc = new jsPDF();
    data.expenses.forEach((expense, index) => {
      const expenseDate = new Date(parseInt(expense.ExpenseDate));
      const createdAt = new Date(parseInt(expense.CreatedAt));
      const updatedAt = expense.UpdatedAt ? new Date(parseInt(expense.UpdatedAt)) : null;

      doc.text('EXPENSE RECEIPT', 20, 20 + (index * 100));
      doc.text(`Date: ${expenseDate.toLocaleDateString()}`, 20, 30 + (index * 100));
      doc.text(`Category: ${expense.Category.CategoryName}`, 20, 40 + (index * 100));
      doc.text(`Amount: $${parseFloat(expense.Amount).toFixed(2)}`, 20, 50 + (index * 100));
      doc.text(`Description: ${expense.Description || 'N/A'}`, 20, 60 + (index * 100));
      doc.text(`Receipt ID: ${expense.ExpenseID}`, 20, 70 + (index * 100));
      doc.text(`Created: ${createdAt.toLocaleDateString()}`, 20, 80 + (index * 100));
      if (updatedAt) {
        doc.text(`Updated: ${updatedAt.toLocaleDateString()}`, 20, 90 + (index * 100));
      }
    });

    doc.save(`all-receipts-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const downloadAllReceiptsExcel = () => {
    if (!data?.expenses?.length) return;

    const allReceipts = data.expenses.map(expense => {
      const expenseDate = new Date(parseInt(expense.ExpenseDate));
      const createdAt = new Date(parseInt(expense.CreatedAt));
      const updatedAt = expense.UpdatedAt ? new Date(parseInt(expense.UpdatedAt)) : null;

      return {
        'Date': expenseDate.toLocaleDateString(),
        'Category': expense.Category.CategoryName,
        'Amount': parseFloat(expense.Amount).toFixed(2),
        'Description': expense.Description || 'N/A',
        'Receipt ID': expense.ExpenseID,
        'Created': createdAt.toLocaleDateString(),
        'Updated': updatedAt ? updatedAt.toLocaleDateString() : ''
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(allReceipts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Receipts');
    XLSX.writeFile(workbook, `all-receipts-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const chartData = {
    labels: data?.categories.map(category => category.CategoryName),
    datasets: [
      {
        label: 'Expenses',
        data: data?.categories.map(category => {
          return data.expenses
            .filter(expense => expense.CategoryID === category.CategoryID)
            .reduce((sum, expense) => sum + parseFloat(expense.Amount), 0);
        }),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  if (error) return <div className="p-4 text-error">Error: {error.message}</div>;

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
            onClick={downloadAllReceiptsPDF}
            className="btn btn-secondary"
          >
            <FileDown className="w-4 h-4 mr-2" /> Download All PDF
          </button>
          <button
            onClick={downloadAllReceiptsExcel}
            className="btn btn-secondary"
          >
            <FileDown className="w-4 h-4 mr-2" /> Download All Excel
          </button>
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
              {/* Same form fields as Add form */}
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
            {data.expenses.map((expense) => {
              const expenseDate = new Date(parseInt(expense.ExpenseDate));
              const createdAt = new Date(parseInt(expense.CreatedAt));
              const updatedAt = expense.UpdatedAt ? new Date(parseInt(expense.UpdatedAt)) : null;

              return (
                <tr key={expense.ExpenseID}>
                  <td>{expenseDate.toLocaleDateString()}</td>
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
                          expenseDate: expenseDate.toISOString().split('T')[0]
                        });
                        setShowEditForm(true);
                      }}
                      className="btn btn-primary btn-sm"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => downloadReceiptPDF(expense)}
                      className="btn btn-secondary btn-sm"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => downloadReceiptExcel(expense)}
                      className="btn btn-secondary btn-sm"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* <div className="mt-8">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Expenses by Category',
              },
            },
          }}
        />
      </div> */}
    </div>
  );
};

export default ExpenseManagement;