import React, { useState } from 'react';
import DataTable from './componenet/DataTable';
import FilterBar from './componenet/FilterBar';
import { DollarSign, CreditCard, Wallet, TrendingUp } from 'lucide-react';

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
    { key: 'id', label: 'Transaction ID' },
    { key: 'date', label: 'Date' },
    { key: 'type', label: 'Type' },
    { key: 'amount', label: 'Amount' },
    { key: 'category', label: 'Category' },
    { key: 'status', label: 'Status' }
  ];

  const transactionData = [
    {
      id: 'TRX-001',
      date: '2024-01-09',
      type: 'Fee Payment',
      amount: '$1,200',
      category: 'Tuition',
      status: 'Paid'
    }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(filters.map(filter => 
      filter.key === key ? { ...filter, value } : filter
    ));
  };

  const handleFilterSubmit = () => {
    console.log('Applying filters:', filters);
  };

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
              <p className="text-2xl font-bold">$125,000</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-4">
            <Wallet className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-sm text-gray-500">Total Expenses</p>
              <p className="text-2xl font-bold">$45,000</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-4">
            <CreditCard className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Pending Payments</p>
              <p className="text-2xl font-bold">$15,000</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-4">
            <TrendingUp className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-sm text-gray-500">Net Profit</p>
              <p className="text-2xl font-bold">$80,000</p>
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