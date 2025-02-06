import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { AlertTriangle, Bell, Calendar, Info } from 'lucide-react';
import { format } from 'date-fns';

const CREATE_NOTIFICATION = gql`
  mutation CreateNotification($input: NotificationInput!) {
    createNotification(input: $input) {
      NotificationId
      Title
      Message
      CreatedAt
      IsRead
      Priority
      ExpiresAt
    }
  }
`;

const Notification = () => {
  const [formState, setFormState] = useState({
    type: 'ANNOUNCEMENT',
    title: '',
    message: '',
    priority: 'MEDIUM',
    expiresAt: '',
    studentId: ''
  });

  const [errors, setErrors] = useState({});
  const [createNotification, { loading, error }] = useMutation(CREATE_NOTIFICATION);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formState.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formState.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!formState.message.trim()) {
      newErrors.message = 'Message is required';
    }

    if (!formState.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
    }

    if (formState.expiresAt) {
      const expiryDate = new Date(formState.expiresAt);
      if (isNaN(expiryDate.getTime())) {
        newErrors.expiresAt = 'Invalid date format';
      } else if (expiryDate < new Date()) {
        newErrors.expiresAt = 'Expiry date must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatDateForSQL = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    // Format date as 'YYYY-MM-DD HH:mm:ss' which SQL Server can parse
    return format(date, 'yyyy-MM-dd HH:mm:ss');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const formattedExpiryDate = formatDateForSQL(formState.expiresAt);
      
      const result = await createNotification({
        variables: {
          input: {
            ...formState,
            expiresAt: formattedExpiryDate
          }
        }
      });

      // Reset form on success
      setFormState({
        type: 'ANNOUNCEMENT',
        title: '',
        message: '',
        priority: 'MEDIUM',
        expiresAt: '',
        studentId: ''
      });

      // Show success toast
      alert('Notification created successfully!');
    } catch (err) {
      console.error('Error creating notification:', err);
      setErrors({
        submit: err.message || 'Failed to create notification. Please try again.'
      });
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-base-200 rounded-lg shadow-xl">
      <div className="flex items-center gap-2 mb-6">
        <Bell className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Create Notification</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Selection */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Notification Type</span>
          </label>
          <select 
            className="select select-bordered w-full"
            value={formState.type}
            onChange={(e) => setFormState({...formState, type: e.target.value})}
          >
            <option value="ANNOUNCEMENT">Announcement</option>
            <option value="EMERGENCY">Emergency</option>
            <option value="FEES">Fees</option>
            <option value="HOLIDAY">Holiday</option>
          </select>
        </div>

        {/* Title Input */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input 
            type="text"
            className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
            value={formState.title}
            onChange={(e) => setFormState({...formState, title: e.target.value})}
            placeholder="Enter notification title"
            maxLength={200} // Match SQL constraint
          />
          {errors.title && (
            <label className="label">
              <span className="label-text-alt text-error flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {errors.title}
              </span>
            </label>
          )}
        </div>

        {/* Message Input */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Message</span>
          </label>
          <textarea 
            className={`textarea textarea-bordered h-24 ${errors.message ? 'textarea-error' : ''}`}
            value={formState.message}
            onChange={(e) => setFormState({...formState, message: e.target.value})}
            placeholder="Enter notification message"
          />
          {errors.message && (
            <label className="label">
              <span className="label-text-alt text-error flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {errors.message}
              </span>
            </label>
          )}
        </div>

        {/* Priority Selection */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Priority</span>
          </label>
          <select 
            className="select select-bordered w-full"
            value={formState.priority}
            onChange={(e) => setFormState({...formState, priority: e.target.value})}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        {/* Student ID Input */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Student ID</span>
          </label>
          <input 
            type="text"
            className={`input input-bordered w-full ${errors.studentId ? 'input-error' : ''}`}
            value={formState.studentId}
            onChange={(e) => setFormState({...formState, studentId: e.target.value})}
            placeholder="Enter student ID"
            maxLength={50} // Match SQL constraint
          />
          {errors.studentId && (
            <label className="label">
              <span className="label-text-alt text-error flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {errors.studentId}
              </span>
            </label>
          )}
        </div>

        {/* Expiry Date Input */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Expiry Date (Optional)</span>
          </label>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <input 
              type="datetime-local"
              className={`input input-bordered w-full ${errors.expiresAt ? 'input-error' : ''}`}
              value={formState.expiresAt}
              onChange={(e) => setFormState({...formState, expiresAt: e.target.value})}
            />
          </div>
          {errors.expiresAt && (
            <label className="label">
              <span className="label-text-alt text-error flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {errors.expiresAt}
              </span>
            </label>
          )}
        </div>

        {/* Error Display */}
        {(error || errors.submit) && (
          <div className="alert alert-error">
            <Info className="w-5 h-5" />
            <span>Error: {error?.message || errors.submit}</span>
          </div>
        )}

        {/* Submit Button */}
        <button 
          type="submit" 
          className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Notification'}
        </button>
      </form>
    </div>
  );
};

export default Notification;