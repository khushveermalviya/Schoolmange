import React, { useState } from 'react';
import { useQuery, useMutation ,gql} from '@apollo/client';
import { Link } from 'react-router-dom';
import { DollarSign, CreditCard, Wallet, TrendingUp } from 'lucide-react';
import DataTable from './componenet/DataTable';
import FilterBar from './componenet/FilterBar';


const GET_STUDENT_FEES = gql`
  query GetStudentFees($class: Int) {
    StudentFees(class: $class) {
      StudentId
      FirstName
      FatherName
      Class
      FeeStatus
      AmountPaid
      TotalFee
    }
  }
`;

const UPDATE_STUDENT_FEE = gql`
  mutation UpdateStudentFee(
    $studentId: ID!, 
    $amountPaid: Float, 
    $feeStatus: String
  ) {
    updateStudentFee(
      studentId: $studentId, 
      amountPaid: $amountPaid, 
      feeStatus: $feeStatus
    ) {
      StudentId
      AmountPaid
      FeeStatus
    }
  }
`;

export default function Finance() {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [filters, setFilters] = useState([
    {
      key: 'status',
      label: 'Payment Status',
      type: 'select',
      value: '',
      options: [
        { label: 'Paid', value: 'Paid' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Overdue', value: 'Overdue' }
      ]
    }
  ]);

  const { loading, error, data } = useQuery(GET_STUDENT_FEES, {
    variables: { class: selectedClass },
    skip: !selectedClass
  });

  const [updateStudentFee] = useMutation(UPDATE_STUDENT_FEE, {
    refetchQueries: [
      { query: GET_STUDENT_FEES, variables: { class: selectedClass } }
    ]
  });

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const calculateMetrics = (fees) => {
    if (!fees) return {
      totalRevenue: 0,
      totalExpenses: 0,
      pendingPayments: 0,
      netProfit: 0
    };

    return fees.reduce((acc, fee) => {
      acc.totalRevenue += fee.TotalFee;
      acc.amountPaid += fee.AmountPaid;
      acc.pendingPayments += (fee.TotalFee - fee.AmountPaid);
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

  const handleFilterChange = (key, value) => {
    setFilters(filters.map(filter => 
      filter.key === key ? { ...filter, value } : filter
    ));
  };



  const renderClassGrid = () => {
    const classes = Array.from({ length: 12 }, (_, i) => i + 1);
    return (
      <div className="grid grid-cols-4 gap-4">
        {classes.map(classNumber => (
          <Link 
            to={`${classNumber}`}
            key={classNumber}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg cursor-pointer hover:bg-blue-100 transition-colors text-center"
            onClick={() => setSelectedClass(classNumber)}
          >
            <p className="text-xl font-bold">Class {classNumber}</p>
          </Link>
        ))}
      </div>
    );
  };

  const columns = [
    { key: 'StudentId', label: 'Student ID' },
    { key: 'FirstName', label: 'First Name' },
    { key: 'FeeStatus', label: 'Fee Status' },
    { key: 'AmountPaid', label: 'Amount Paid (₹)' },
    { key: 'TotalFee', label: 'Total Fee (₹)' }
  ];

  const transactionData = data?.StudentFees?.map(fee => ({
    ...fee,
    AmountPaid: formatINR(fee.AmountPaid),
    TotalFee: formatINR(fee.TotalFee)
  })) || [];

  const metrics = calculateMetrics(data?.StudentFees);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Financial Management</h1>
        <div className="space-x-4">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            New Transaction
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            icon: DollarSign, 
            color: 'green', 
            label: 'Total Revenue', 
            value: metrics.totalRevenue 
          },
          { 
            icon: Wallet, 
            color: 'red', 
            label: 'Total Expenses', 
            value: metrics.totalExpenses 
          },
          { 
            icon: CreditCard, 
            color: 'blue', 
            label: 'Pending Payments', 
            value: metrics.pendingPayments 
          },
          { 
            icon: TrendingUp, 
            color: 'purple', 
            label: 'Net Profit', 
            value: metrics.netProfit 
          }
        ].map(({ icon: Icon, color, label, value }) => (
          <div key={label} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center space-x-4">
              <Icon className={`w-8 h-8 text-${color}-500`} />
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold">{formatINR(value)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!selectedClass ? (
        renderClassGrid()
      ) : (
        <>
          <button 
            onClick={() => setSelectedClass(null)}
            className="mb-4 px-4 py-2 bg-gray-200 rounded-lg"
          >
            Back to Class Selection
          </button>

          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <DataTable
            columns={columns}
            data={transactionData}
            onRowClick={(student) => {
              setSelectedStudent(student);
              setIsModalOpen(true);
            }}
          />


         
        </>
      )}
    </div>
  );
}