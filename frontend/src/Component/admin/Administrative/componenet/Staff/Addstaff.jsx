import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

const ADD_STAFF = gql`
  mutation AddStaff(
    $first_name: String!
    $last_name: String!
    $email: String!
    $phone: String!
    $emergency_contact: String!
    $department: String!
    $role: String!
    $joining_date: String!
    $education: String!
    $specialization: String!
    $teaching_experience: String!
    $address: String!
    $blood_group: String
    $documents_submitted: [String]!
  ) {
    addStaff(
      first_name: $first_name
      last_name: $last_name
      email: $email
      phone: $phone
      emergency_contact: $emergency_contact
      department: $department
      role: $role
      joining_date: $joining_date
      education: $education
      specialization: $specialization
      teaching_experience: $teaching_experience
      address: $address
      blood_group: $blood_group
      documents_submitted: $documents_submitted
    ) {
      id
      token
    }
  }
`;

const Addstaff = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    emergency_contact: '',
    department: '',
    role: '',
    joining_date: '',
    education: '',
    specialization: '',
    teaching_experience: '',
    address: '',
    blood_group: '',
    documents_submitted: []
  });

  const [acceptedTerms, setAcceptedTerms] = useState({
    confidentiality: false,
    code_of_conduct: false,
    data_policy: false
  });

  const [addStaff, { loading, error }] = useMutation(ADD_STAFF);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!Object.values(acceptedTerms).every(Boolean)) {
      alert('Please accept all terms and conditions');
      return;
    }
    try {
      const result = await addStaff({ variables: formData });
      if (result.data) {
        setSuccess(true);
        localStorage.setItem('staffToken', result.data.addStaff.token);
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          emergency_contact: '',
          department: '',
          role: '',
          joining_date: '',
          education: '',
          specialization: '',
          teaching_experience: '',
          address: '',
          blood_group: '',
          documents_submitted: []
        });
        setAcceptedTerms({
          confidentiality: false,
          code_of_conduct: false,
          data_policy: false
        });
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error adding staff:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name.startsWith('document_')) {
        const document = name.replace('document_', '');
        setFormData(prev => ({
          ...prev,
          documents_submitted: checked 
            ? [...prev.documents_submitted, document]
            : prev.documents_submitted.filter(doc => doc !== document)
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100/80 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full mx-auto space-y-8 transform transition-all duration-500">
        <div className="bg-white/90 p-8 rounded-lg shadow-lg">
          <div className="border-b pb-4 mb-8">
            <h2 className="text-3xl font-extrabold text-center text-gray-900">
              Staff Registration Form
            </h2>
            <p className="text-center text-gray-600 mt-2">
              Please fill in all required fields and submit necessary documents
            </p>
          </div>
          
          {error && (
            <div className="alert alert-error mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>Error: {error.message}</span>
            </div>
          )}
          
          {success && (
            <div className="alert alert-success mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Staff member added successfully!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="bg-gray-50/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">First Name</span>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-white/90"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Last Name</span>
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-white/90"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-white/90"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Phone</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-white/90"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Emergency Contact</span>
                  </label>
                  <input
                    type="tel"
                    name="emergency_contact"
                    value={formData.emergency_contact}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-white/90"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Blood Group</span>
                  </label>
                  <select
                    name="blood_group"
                    value={formData.blood_group}
                    onChange={handleChange}
                    className="select select-bordered w-full bg-white/90"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="bg-gray-50/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Professional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Department</span>
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="select select-bordered w-full bg-white/90"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Sciences">Sciences</option>
                    <option value="Languages">Languages</option>
                    <option value="Social Studies">Social Studies</option>
                    <option value="Physical Education">Physical Education</option>
                    <option value="Arts">Arts</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Role</span>
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="select select-bordered w-full bg-white/90"
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="Senior Teacher">Senior Teacher</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Assistant Teacher">Assistant Teacher</option>
                    <option value="Department Head">Department Head</option>
                    <option value="Coordinator">Coordinator</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Education</span>
                  </label>
                  <input
                    type="text"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-white/90"
                    required
                    placeholder="Highest qualification"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Specialization</span>
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-white/90"
                    required
                    placeholder="Subject specialization"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Teaching Experience (years)</span>
                  </label>
                  <input
                    type="number"
                    name="teaching_experience"
                    value={formData.teaching_experience}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-white/90"
                    required
                    min="0"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Joining Date</span>
                  </label>
                  <input
                    type="date"
                    name="joining_date"
                    value={formData.joining_date}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-white/90"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Document Checklist */}
            <div className="bg-gray-50/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Required Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="document_resume"
                    onChange={handleChange}
                    className="checkbox"
                  />
                  <span>Resume/CV</span>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="document_certificates"
                    onChange={handleChange}
                    className="checkbox"
                  />
                  <span>Educational Certificates</span>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="document_id_proof"
                    onChange={handleChange}
                    className="checkbox"
                  />
                  <span>ID Proof</span>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="document_experience"
                    onChange={handleChange}
                    className="checkbox"
                  />
                  <span>Experience Letters</span>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-gray-50/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Terms and Conditions</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={acceptedTerms.confidentiality}
                    onChange={(e) => setAcceptedTerms(prev => ({...prev, confidentiality: e.target.checked}))}
                    className="checkbox"
                  />
                  <span className="text-sm">I agree to maintain confidentiality of all school-related information</span>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={acceptedTerms.code_of_conduct}
                    onChange={(e) => setAcceptedTerms(prev => ({...prev, code_of_conduct: e.target.checked}))}
                    className="checkbox"
                  />
                  <span className="text-sm">I agree to follow the school's code of conduct and policies</span>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={acceptedTerms.data_policy}
                    onChange={(e) => setAcceptedTerms(prev => ({...prev, data_policy: e.target.checked}))}
                    className="checkbox"
                  />
                  <span className="text-sm">I agree to the data protection and privacy policy</span>
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-start space-x-2">
                  <Info className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                  <p className="text-sm text-blue-700">
                    Please ensure all provided information is accurate. False information may lead to termination of employment. 
                    All documents will be verified before finalizing the appointment.
                  </p>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-gray-50/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Address Information</h3>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Complete Address</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="textarea textarea-bordered h-24 bg-white/90"
                  required
                  placeholder="Enter your complete residential address"
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-gray-50/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Additional Notes</h3>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Important Points:</h4>
                  <ul className="list-disc list-inside space-y-2 text-sm text-yellow-700">
                    <li>All original documents must be presented for verification</li>
                    <li>Two sets of photocopies of all documents are required</li>
                    <li>Background verification will be conducted</li>
                    <li>Medical fitness certificate should be submitted within 15 days of joining</li>
                    <li>Probation period will be 3 months from the date of joining</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col space-y-4">
              <button
                type="submit"
                disabled={loading || !Object.values(acceptedTerms).every(Boolean)}
                className={`btn btn-primary w-full ${loading ? 'loading' : ''} 
                  ${!Object.values(acceptedTerms).every(Boolean) ? 'btn-disabled opacity-50' : ''}`}
              >
                {loading ? 'Processing...' : 'Submit Registration'}
              </button>
              
              {!Object.values(acceptedTerms).every(Boolean) && (
                <p className="text-sm text-red-500 text-center">
                  Please accept all terms and conditions to proceed
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Addstaff;