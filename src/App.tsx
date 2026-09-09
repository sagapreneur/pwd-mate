import React, { useState, useEffect } from 'react';
import { useEstimatorStore } from './store/useEstimatorStore';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { LoginModule } from './components/auth/LoginModule';

// Module Components
import { FacesheetModule } from './components/modules/FacesheetModule';
import { SSRCatalogModule } from './components/modules/SSRCatalogModule';
import { MeasurementModule } from './components/modules/MeasurementModule';
import { LeadChartModule } from './components/modules/LeadChartModule';
import { RateAnalysisModule } from './components/modules/RateAnalysisModule';
import { AbstractModule } from './components/modules/AbstractModule';
import { ConsumptionModule } from './components/modules/ConsumptionModule';
import { RoyaltyModule } from './components/modules/RoyaltyModule';
import { TestingRegisterModule } from './components/modules/TestingRegisterModule';
import { SteelBBSModule } from './components/modules/SteelBBSModule';
import { GeneralAbstractModule } from './components/modules/GeneralAbstractModule';
import { StampManagerModule } from './components/modules/StampManagerModule';
import { MarathiDocsModule } from './components/modules/MarathiDocsModule';
import { AdminCMSModule } from './components/modules/AdminCMSModule';
import { PrintableDossierModule } from './components/modules/PrintableDossierModule';
import { MyEstimatesModule } from './components/modules/MyEstimatesModule';

interface UserSession {
  name: string;
  role: string;
  division: string;
  email: string;
}

export function App() {
  const { activeTab, recalculateAll, items, loadGoldenMasterDemo, savedEstimates, saveCurrentEstimate, updateFacesheet } = useEstimatorStore();

  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('maha_pwd_auth_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const handleLoginSuccess = (user: UserSession) => {
    setCurrentUser(user);
    if (user.division) {
      updateFacesheet({ division: user.division });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('maha_pwd_auth_session');
    setCurrentUser(null);
  };

  useEffect(() => {
    recalculateAll();
    const saved = localStorage.getItem('maha_pwd_saved_estimates');
    if (!saved && items.length === 0) {
      loadGoldenMasterDemo();
      setTimeout(() => {
        saveCurrentEstimate();
      }, 300);
    }
  }, []);

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'myEstimates':
        return <MyEstimatesModule />;
      case 'facesheet':
        return <FacesheetModule />;
      case 'catalog':
        return <SSRCatalogModule />;
      case 'measurements':
        return <MeasurementModule />;
      case 'lead':
        return <LeadChartModule />;
      case 'rateAnalysis':
        return <RateAnalysisModule />;
      case 'abstract':
        return <AbstractModule />;
      case 'consumption':
        return <ConsumptionModule />;
      case 'royalty':
        return <RoyaltyModule />;
      case 'testing':
        return <TestingRegisterModule />;
      case 'steelBbs':
        return <SteelBBSModule />;
      case 'generalAbstract':
        return <GeneralAbstractModule />;
      case 'stamps':
        return <StampManagerModule />;
      case 'marathiDocs':
        return <MarathiDocsModule />;
      case 'admin':
        return <AdminCMSModule />;
      case 'dossier':
        return <PrintableDossierModule />;
      default:
        return <GeneralAbstractModule />;
    }
  };

  if (!currentUser) {
    return <LoginModule onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen bg-[#F7F8FA] overflow-hidden print:h-auto print:min-h-0 print:overflow-visible print:block print:bg-white">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden print:h-auto print:min-h-0 print:overflow-visible print:block print:w-full">
        {/* Top Pinned Bar */}
        <TopBar currentUser={currentUser} onLogout={handleLogout} />

        {/* Workspace Canvas */}
        <main className="flex-1 overflow-y-auto p-6 print:p-0 print:m-0 print:overflow-visible print:h-auto print:block print:w-full">
          <div className="max-w-7xl mx-auto pb-12 print:max-w-none print:p-0 print:m-0 print:w-full">
            {renderActiveModule()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
