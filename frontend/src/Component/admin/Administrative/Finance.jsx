import React, { useState, useEffect } from 'react';
import DataTable from './componenet/DataTable';
import FilterBar from './componenet/FilterBar';
import { DollarSign, CreditCard, Wallet, TrendingUp } from 'lucide-react';
import { useQuery, gql } from '@apollo/client';

const GET_STUDENT_FEES = gql`
  query {
    StudentFees {
      StudentId
      FirstName
      FeeStatus
      AmountPaid
      TotalFee
    }
  }
`;

export default function Finance() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState([
    {
      key: 'type',
      label: 'Transaction Type',
      type: 'select',
      value: '',
      options: [
        { label: 'Income', value: 'income' },
        { label: 'Expense', value: 'expense' },
        { label: 'Fee Payment', value: 'fee' }
      ]
    },
    {
      key: 'status',
      label: 'Payment Status',
      type: 'select',
      value: '',
      options: [
        { label: 'Paid', value: 'paid' },
        { label: 'Pending', value: 'pending' },
        { label: 'Overdue', value: 'overdue' }
      ]
    }
  ]);

  const columns = [
    { key: 'StudentId', label: 'Student ID' },
    { key: 'FirstName', label: 'First Name' },
    { key: 'FeeStatus', label: 'Fee Status' },
    { key: 'AmountPaid', label: 'Amount Paid (₹)' },
    { key: 'TotalFee', label: 'Total Fee (₹)' }
  ];

  const { loading, error, data } = useQuery(GET_STUDENT_FEES);

  const handleFilterChange = (key, value) => {
    setFilters(filters.map(filter => 
      filter.key === key ? { ...filter, value } : filter
    ));
  };

  const handleFilterSubmit = () => {
    console.log('Applying filters:', filters);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Format currency to INR
  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate metrics from all student fees
  const calculateMetrics = () => {
    if (!data?.StudentFees) return {
      totalRevenue: 0,
      totalExpenses: 0,
      pendingPayments: 0,
      netProfit: 0
    };

    return data.StudentFees.reduce((acc, fee) => {
      acc.totalRevenue += fee.TotalFee;
      acc.amountPaid += fee.AmountPaid;
      acc.pendingPayments += (fee.TotalFee - fee.AmountPaid);
      // Assuming 30% expenses
      acc.totalExpenses = acc.totalRevenue * 0.3;
      acc.netProfit = acc.amountPaid - acc.totalExpenses;
      return acc;
    }, {
      totalRevenue: 0,
      amountPaid: 0,
      pendingPayments: 0,
      totalExpenses: 0,
      netProfit: 0
    });
  };

  const metrics = calculateMetrics();

  // Format the transaction data
  const transactionData = data?.StudentFees?.map(fee => ({
    StudentId: fee.StudentId,
    FirstName: fee.FirstName,
    FeeStatus: fee.FeeStatus,
    AmountPaid: formatINR(fee.AmountPaid),
    TotalFee: formatINR(fee.TotalFee)
  })) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Financial Management</h1>
        <div className="space-x-4">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            New Transaction
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-4">
            <DollarSign className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">{formatINR(metrics.totalRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-4">
            <Wallet className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-sm text-gray-500">Total Expenses</p>
              <p className="text-2xl font-bold">{formatINR(metrics.totalExpenses)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-4">
            <CreditCard className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Pending Payments</p>
              <p className="text-2xl font-bold">{formatINR(metrics.pendingPayments)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-4">
            <TrendingUp className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-sm text-gray-500">Net Profit</p>
              <p className="text-2xl font-bold">{formatINR(metrics.netProfit)}</p>
            </div>
          </div>
        </div>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterSubmit={handleFilterSubmit}
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <DataTable
          columns={columns}
          data={transactionData}
          onRowClick={(row) => console.log('Clicked row:', row)}
        />
      </div>
    </div>
  );
}