import React, { useState } from 'react';

const FeeUpdateModal = ({ student, onClose, onUpdate }) => {
  const [amountPaid, setAmountPaid] = useState(
    parseFloat(student.AmountPaid.replace(/[^0-9.-]+/g,""))
  );
  const [feeStatus, setFeeStatus] = useState(student.FeeStatus);

  const handleSubmit = () => {
    onUpdate(student.StudentId, amountPaid, feeStatus);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-96">
        <h2 className="text-xl font-bold mb-4">Update Fee for {student.FirstName}</h2>
        
        <div className="mb-4">
          <label className="block mb-2">Amount Paid</label>
          <input
            type="number"
            value={amountPaid}
            onChange={(e) => setAmountPaid(parseFloat(e.target.value))}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Fee Status</label>
          <select
            value={feeStatus}
            onChange={(e) => setFeeStatus(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        <div className="flex justify-between">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeeUpdateModal;