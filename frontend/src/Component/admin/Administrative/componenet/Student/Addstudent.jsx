import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { AlertCircle, CheckCircle, Info, BookOpen, User, Home, Phone } from 'lucide-react';

const ADD_STUDENT = gql`
  mutation AddStudent(
    $first_name: String!
    $last_name: String!
    $date_of_birth: String!
    $gender: String!
    $admission_class: String!
    $admission_date: String!
    $blood_group: String
    $previous_school: String
    $parent_name: String!
    $parent_occupation: String!
    $parent_email: String!
    $parent_phone: String!
    $address: String!
    $emergency_contact: String!
    $medical_conditions: String
    $documents_submitted: [String]!
  ) {
    addStudent(
      first_name: $first_name
      last_name: $last_name
      date_of_birth: $date_of_birth
      gender: $gender
      admission_class: $admission_class
      admission_date: $admission_date
      blood_group: $blood_group
      previous_school: $previous_school
      parent_name: $parent_name
      parent_occupation: $parent_occupation
      parent_email: $parent_email
      parent_phone: $parent_phone
      address: $address
      emergency_contact: $emergency_contact
      medical_conditions: $medical_conditions
      documents_submitted: $documents_submitted
    ) {
      id
    }
  }
`;

const AddStudent = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    admission_class: '',
    admission_date: '',
    blood_group: '',
    previous_school: '',
    parent_name: '',
    parent_occupation: '',
    parent_email: '',
    parent_phone: '',
    address: '',
    emergency_contact: '',
    medical_conditions: '',
    documents_submitted: []
  });

  const [addStudent, { loading, error }] = useMutation(ADD_STUDENT);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await addStudent({ variables: formData });
      if (result.data) {
        setSuccess(true);
        setFormData({
          first_name: '',
          last_name: '',
          date_of_birth: '',
          gender: '',
          admission_class: '',
          admission_date: '',
          blood_group: '',
          previous_school: '',
          parent_name: '',
          parent_occupation: '',
          parent_email: '',
          parent_phone: '',
          address: '',
          emergency_contact: '',
          medical_conditions: '',
          documents_submitted: []
        });
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error adding student:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const document = name.replace('document_', '');
      setFormData(prev => ({
        ...prev,
        documents_submitted: checked 
          ? [...prev.documents_submitted, document]
          : prev.documents_submitted.filter(doc => doc !== document)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/80 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full mx-auto space-y-8">
        <div className="bg-white/90 p-8 rounded-xl shadow-sm">
          <div className="border-b border-gray-100 pb-4 mb-8">
            <h2 className="text-3xl font-bold text-center text-gray-800">
              Student Registration
            </h2>
            <p className="text-center text-gray-500 mt-2">
              Please fill in the student's information carefully
            </p>
          </div>

          {error && (
            <div className="alert alert-error mb-4 flex items-center bg-red-50 text-red-700 p-4 rounded-lg">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>Error: {error.message}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success mb-4 flex items-center bg-green-50 text-green-700 p-4 rounded-lg">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Student registered successfully!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student Information */}
            <div className="bg-gray-50/50 p-6 rounded-lg border border-gray-100">
              <div className="flex items-center mb-4 text-gray-700">
                <User className="w-5 h-5 mr-2" />
                <h3 className="text-lg font-medium">Student Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-600">First Name</span>
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
                    <span className="label-text text-gray-600">Last Name</span>
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
                    <span className="label-text text-gray-600">Date of Birth</span>
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-white/90"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-600">Gender</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="select select-bordered w-full bg-white/90"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-600">Blood Group</span>
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

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-600">Medical Conditions</span>
                  </label>
                  <textarea
                    name="medical_conditions"
                    value={formData.medical_conditions}
                    onChange={handleChange}
                    className="textarea textarea-bordered bg-white/90"
                    placeholder="Any medical conditions or allergies"
                  />
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-gray-50/50 p-6 rounded-lg border border-gray-100">
              <div className="flex items-center mb-4 text-gray-700">
                <BookOpen className="w-5 h-5 mr-2" />
                <h3 className="text-lg font-medium">Academic Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-600">Admission Class</span>
                  </label>
                  <select
                    name="admission_class"
                    value={formData.admission_class}
                    onChange={handleChange}
                    className="select select-bordered w-full bg-white/90"
                    required
                  >
                    <option value="">Select Class</option>
                    <option value="Nursery">Nursery</option>
                    <option value="KG">KG</option>
                    <option value="1">Class 1</option>
                    <option value="2">Class 2</option>
                    <option value="3">Class 3</option>
                    <option value="4">Class 4</option>
                    <option value="5">Class 5</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-600">Admission Date</span>
                  </label>
                  <input
                    type="date"
                    name="admission_date"
                    value={formData.admission_date}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-white/90"
                    required
                  />
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text text-gray-600">Previous School (if any)</span>
                  </label>
                  <input
                    type="text"
                    name="previous_school"
                    value={formData.previous_school}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-white/90"
                    placeholder="Name and address of previous school"
                  />
                </div>
              </div>
            </div>

            {/* Parent/Guardian Information */}
            <div className="bg-gray-50/50 p-6 rounded-lg border border-gray-100">
              <div className="flex items-center mb-4 text-gray-700">
                <Phone className="w-5 h-5 mr-2" />
                <h3 className="text-lg font-medium">Parent/Guardian Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-600">Parent/Guardian Name</span>
                  </label>
                  <input
                    type="text"
                    name="parent_name"
                    value={formData.parent_name}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-white/90"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-600">Occupation</span>
                  </label>
                  <input
                    type="text"
                    name="parent_occupation"
                    value={formData.parent_occupation}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-white/90"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-600">Email</span>
                  </label>
                  <input
                    type="email"
                    name="parent_email"
                    value={formData.parent_email}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-white/90"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-600">Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    name="parent_phone"
                    value={formData.parent_phone}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-white/90"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-600">Emergency Contact</span>
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
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-gray-50/50 p-6 rounded-lg border border-gray-100">
              <div className="flex items-center mb-4 text-gray-700">
                <Home className="w-5 h-5 mr-2" />
                <h3 className="text-lg font-medium">Address Information</h3>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-600">Complete Address</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="textarea textarea-bordered h-24 bg-white/90"
                  required
                  placeholder="Enter complete residential address"
                />
              </div>
            </div>

            {/* Documents Required */}
            <div className="bg-gray-50/50 p-6 rounded-lg border border-gray-100">
              <h3 className="text-lg font-medium mb-4 text-gray-700">Required Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x">
                                    <Home className="w-5 h-5 mr-2" />
                <h3 className="text-lg font-medium">Address Details</h3>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-600">Address</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="textarea textarea-bordered bg-white/90"
                  placeholder="Full address"
                  required
                />
              </div>
            </div>
</div>
            {/* Document Submission */}
            <div className="bg-gray-50/50 p-6 rounded-lg border border-gray-100">
              <div className="flex items-center mb-4 text-gray-700">
                <Info className="w-5 h-5 mr-2" />
                <h3 className="text-lg font-medium">Document Submission</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Birth Certificate', 'Transfer Certificate', 'Aadhaar Card', 'Passport Size Photo'].map(
                  (doc, index) => (
                    <label key={index} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name={`document_${doc}`}
                        checked={formData.documents_submitted.includes(doc)}
                        onChange={handleChange}
                        className="checkbox checkbox-primary"
                      />
                      <span className="text-gray-600">{doc}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-control">
              <button
                type="submit"
                className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Register Student'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;
