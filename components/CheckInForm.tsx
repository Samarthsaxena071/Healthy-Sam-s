import React, { useState, useEffect } from 'react';
import { MOCK_FACILITIES } from '../constants';
import { CheckInFormData } from '../types';
import { CheckCircle, ChevronLeft, FileText, QrCode } from 'lucide-react';

interface CheckInFormProps {
  initialFacilityId?: string;
  onBack: () => void;
}

const CheckInForm: React.FC<CheckInFormProps> = ({ initialFacilityId, onBack }) => {
  const [formData, setFormData] = useState<CheckInFormData>({
    firstName: '',
    lastName: '',
    dob: '',
    symptoms: '',
    insuranceProvider: '',
    facilityId: initialFacilityId || MOCK_FACILITIES[0].id
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmationId, setConfirmationId] = useState('');

  const selectedFacility = MOCK_FACILITIES.find(f => f.id === formData.facilityId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setConfirmationId(`HS-${Math.floor(Math.random() * 10000)}`);
      setIsSubmitted(true);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 text-center max-w-lg mx-auto mt-10">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Check-in Confirmed!</h2>
        <p className="text-gray-600 mb-6">
          You are pre-registered at <span className="font-semibold text-gray-900">{selectedFacility?.name}</span>.
        </p>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-semibold">Confirmation ID</p>
          <p className="text-3xl font-mono font-bold text-blue-600 tracking-wider">{confirmationId}</p>
        </div>

        <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg mb-6">
           <QrCode size={96} className="text-gray-800" />
           <p className="text-xs text-gray-400 mt-2">Scan at kiosk upon arrival</p>
        </div>

        <button 
          onClick={onBack}
          className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center gap-2">
        <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600">
          <ChevronLeft size={20} />
        </button>
        <h2 className="font-bold text-lg text-gray-800">Pre-Check-In Form</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start gap-3">
          <FileText className="text-blue-600 shrink-0 mt-0.5" size={20} />
          <div className="text-sm text-blue-800">
            Filling this out now saves you approximately <strong>15 minutes</strong> at the front desk.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              placeholder="Jane"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              placeholder="Doe"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              name="dob"
              required
              value={formData.dob}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facility</label>
            <select
              name="facilityId"
              value={formData.facilityId}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-white"
            >
              {MOCK_FACILITIES.map(f => (
                <option key={f.id} value={f.id}>{f.name} ({f.waitTimeMinutes}m wait)</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Primary Symptoms</label>
          <textarea
            name="symptoms"
            required
            rows={3}
            value={formData.symptoms}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
            placeholder="Describe what you are feeling..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Provider (Optional)</label>
          <input
            type="text"
            name="insuranceProvider"
            value={formData.insuranceProvider}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            placeholder="e.g. Blue Cross"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all"
          >
            Confirm & Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckInForm;