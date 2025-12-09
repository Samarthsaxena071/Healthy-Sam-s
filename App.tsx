
import React, { useState } from 'react';
import { Activity, MessageSquare, ClipboardCheck, LayoutDashboard } from 'lucide-react';
import HospitalList from './components/HospitalList';
import TriageBot from './components/TriageBot';
import CheckInForm from './components/CheckInForm';
import { AppView } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | undefined>(undefined);

  const handleNavigate = (view: AppView, facilityId?: string) => {
    if (facilityId) setSelectedFacilityId(facilityId);
    setCurrentView(view);
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <HospitalList onNavigate={handleNavigate} />;
      case AppView.TRIAGE:
        return <TriageBot />;
      case AppView.PRE_CHECK_IN:
        return (
          <CheckInForm 
            initialFacilityId={selectedFacilityId} 
            onBack={() => setCurrentView(AppView.DASHBOARD)} 
          />
        );
      default:
        return <HospitalList onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans text-gray-900">
      {/* Top Navigation / Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView(AppView.DASHBOARD)}>
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Activity className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Healthy <span className="text-blue-600">Sam's</span>
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setCurrentView(AppView.DASHBOARD)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === AppView.DASHBOARD 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView(AppView.TRIAGE)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === AppView.TRIAGE 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              AI Triage
            </button>
            <button
              onClick={() => setCurrentView(AppView.PRE_CHECK_IN)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === AppView.PRE_CHECK_IN 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Pre-Check-In
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6">
        {renderContent()}
      </main>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-30">
        <div className="flex justify-around items-center h-16">
          <button
            onClick={() => setCurrentView(AppView.DASHBOARD)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              currentView === AppView.DASHBOARD ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <LayoutDashboard size={24} strokeWidth={currentView === AppView.DASHBOARD ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Wait Times</span>
          </button>
          <button
            onClick={() => setCurrentView(AppView.TRIAGE)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              currentView === AppView.TRIAGE ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <MessageSquare size={24} strokeWidth={currentView === AppView.TRIAGE ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Ask Sam</span>
          </button>
          <button
            onClick={() => setCurrentView(AppView.PRE_CHECK_IN)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              currentView === AppView.PRE_CHECK_IN ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <ClipboardCheck size={24} strokeWidth={currentView === AppView.PRE_CHECK_IN ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Check-In</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
