import React, { useMemo, useState } from 'react';
import { MOCK_FACILITIES } from '../constants';
import { Facility, FacilityType, AppView } from '../types';
import { Clock, MapPin, Navigation, AlertCircle } from 'lucide-react';

interface HospitalListProps {
  onNavigate: (view: AppView, facilityId?: string) => void;
}

const HospitalList: React.FC<HospitalListProps> = ({ onNavigate }) => {
  const [filter, setFilter] = useState<FacilityType | 'All'>('All');

  const filteredFacilities = useMemo(() => {
    if (filter === 'All') return MOCK_FACILITIES;
    return MOCK_FACILITIES.filter(f => f.type === filter);
  }, [filter]);

  // Sort by wait time primarily, then distance
  const sortedFacilities = useMemo(() => {
    return [...filteredFacilities].sort((a, b) => {
      // Prioritize wait time heavily
      const waitDiff = a.waitTimeMinutes - b.waitTimeMinutes;
      if (Math.abs(waitDiff) > 15) return waitDiff;
      return a.distanceMiles - b.distanceMiles;
    });
  }, [filteredFacilities]);

  const getStatusColor = (status: Facility['status']) => {
    switch (status) {
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Nearby Care</h2>
        <div className="text-sm text-gray-500 flex items-center gap-1">
          <MapPin size={16} />
          <span>Downtown, CA</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['All', FacilityType.ER, FacilityType.URGENT_CARE, FacilityType.PHARMACY].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type as FacilityType | 'All')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === type
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedFacilities.map((facility) => (
          <div
            key={facility.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-xs font-bold border-l border-b ${getStatusColor(facility.status)}`}>
              {facility.status.toUpperCase()} TRAFFIC
            </div>

            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg text-gray-900 leading-tight">{facility.name}</h3>
                <p className="text-sm text-gray-500 font-medium">{facility.type}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 my-4">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Est. Wait</span>
                <div className="flex items-center gap-1.5 text-blue-600">
                  <Clock size={20} className="stroke-[2.5px]" />
                  <span className="text-2xl font-bold">{facility.waitTimeMinutes}</span>
                  <span className="text-sm font-medium pt-1">min</span>
                </div>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Distance</span>
                <div className="flex items-center gap-1.5 text-gray-700">
                  <Navigation size={18} />
                  <span className="text-xl font-bold">{facility.distanceMiles}</span>
                  <span className="text-sm font-medium pt-1">mi</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
              <button
                onClick={() => onNavigate(AppView.PRE_CHECK_IN, facility.id)}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                Check In Now
              </button>
              <button 
                onClick={() => window.open(`https://maps.google.com/?q=${facility.address}`, '_blank')}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Get Directions"
              >
                <Navigation size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="font-semibold text-blue-900 text-sm">Not sure where to go?</h4>
          <p className="text-blue-700 text-sm mt-1">
            Use our AI Triage Bot "Sam" to analyze your symptoms and find the best care facility for you.
          </p>
          <button 
            onClick={() => onNavigate(AppView.TRIAGE)}
            className="mt-2 text-blue-700 font-bold text-sm hover:underline"
          >
            Start Triage &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default HospitalList;