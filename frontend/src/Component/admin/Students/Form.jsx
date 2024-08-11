import React, { useState } from 'react';

export default function Form() {
  const [formData, setFormData] = useState({
    std_name: '',
    father_name: '',
    std_id: '',
    dob: '',
    area: '',
    city: '',
    state: '',
    post_code: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3334/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        // Handle successful submission
        console.log('Form submitted successfully');
      } else {
        // Handle errors
        console.log('Failed to submit form');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center p-12">
        <div className="mx-auto w-full max-w-[550px] bg-white">
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                Full Name
              </label>
              <input
                type="text"
                name="std_name"
                value={formData.std_name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            <div className="mb-5">
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                Father Name
              </label>
              <input
                type="text"
                name="father_name"
                value={formData.father_name}
                onChange={handleChange}
                placeholder="Father Name"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            <div className="mb-5">
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                Roll no.
              </label>
              <input
                type="text"
                name="std_id"
                value={formData.std_id}
                onChange={handleChange}
                placeholder="Roll Number"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            {/* Additional Fields (like DOB, Address) */}
            <div>
              <button
                type="submit"
                className="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
