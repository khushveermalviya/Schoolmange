import React, { useState } from 'react';
import { 
  Shield, 
  User, 
  Phone, 
  Mail, 
  Clock, 
  HelpCircle,
  MessageCircle
} from 'lucide-react';

const Forgot = () => {
  const [selectedIssue, setSelectedIssue] = useState('');

  const passwordRecoveryOptions = [
    {
      id: 'initial-password',
      title: 'Get Initial Password',
      description: 'Receive your first-time login credentials',
      icon: Shield
    },
    {
      id: 'reset-password',
      title: 'Reset Forgotten Password',
      description: 'Request password reset through administration',
      icon: User
    },
    {
      id: 'account-unlock',
      title: 'Unlock Account',
      description: 'Resolve account access issues',
      icon: HelpCircle
    }
  ];

  const adminContacts = [
    {
      name: 'Student Services Desk',
      role: 'Credential Support',
      email: 'studenthelp@school.edu',
      phone: '+1 (555) 123-4567',
      availableHours: '8 AM - 4 PM'
    },
    {
      name: 'IT Support',
      role: 'Technical Assistance',
      email: 'it-support@school.edu',
      phone: '+1 (555) 987-6543',
      availableHours: '9 AM - 5 PM'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden grid md:grid-cols-2 gap-6 p-6">
        {/* Password Recovery Options */}
        {/* <div className="space-y-4">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">
            Password Recovery Options
          </h2>
          
          {passwordRecoveryOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div 
                key={option.id}
                onClick={() => setSelectedIssue(option.id)}
                className={`
                  flex items-center p-4 rounded-lg cursor-pointer transition 
                  ${selectedIssue === option.id 
                    ? 'bg-blue-100 border-2 border-blue-500' 
                    : 'bg-gray-50 hover:bg-blue-50'}
                `}
              >
                <Icon className="mr-4 text-blue-500" size={24} />
                <div>
                  <h3 className="font-semibold text-gray-800">{option.title}</h3>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
              </div>
            );
          })}
        </div> */}

        {/* Administrative Contacts */}
        <div className="bg-blue-50 p-6 rounded-lg space-y-4">
          <h3 className="text-xl font-semibold text-blue-600 mb-4">
            Contact Administration
          </h3>
          
          {adminContacts.map((admin, index) => (
            <div 
              key={index} 
              className="bg-white p-4 rounded-lg shadow-md"
            >
              <div className="flex items-center mb-2">
                <User className="mr-2 text-blue-500" />
                <h4 className="font-bold">{admin.name}</h4>
              </div>
              
              <div className="flex items-center mb-1">
                <Mail className="mr-2 text-gray-400 w-4 h-4" />
                <p className="text-sm">{admin.email}</p>
              </div>
              
              <div className="flex items-center mb-1">
                <Phone className="mr-2 text-gray-400 w-4 h-4" />
                <p className="text-sm">{admin.phone}</p>
              </div>
              
              <div className="flex items-center">
                <Clock className="mr-2 text-gray-400 w-4 h-4" />
                <p className="text-sm text-gray-500">{admin.availableHours}</p>
              </div>
            </div>
          ))}

          <div className="bg-blue-100 p-4 rounded-lg text-blue-800 text-sm">
            <MessageCircle className="inline mr-2" size={16} />
            Always have your Student ID ready when contacting support.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forgot;