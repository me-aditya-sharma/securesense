import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { AnalyzePage } from './pages/AnalyzePage';
import { ResultsPage } from './pages/ResultsPage';
import { RightsAssistantPage } from './pages/RightsAssistantPage';
import { ComplaintAssistantPage } from './pages/ComplaintAssistantPage';
import { HistoryPage } from './pages/HistoryPage';
import { AwarenessHubPage } from './pages/AwarenessHubPage';

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-white text-[#1D1D1F]">
        <Navbar />
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/analyze" element={<AnalyzePage />} />
            <Route path="/results/:id" element={<ResultsPage />} />
            <Route path="/awareness" element={<AwarenessHubPage />} />
            <Route path="/scam-awareness" element={<AwarenessHubPage />} />
            <Route path="/rights" element={<RightsAssistantPage />} />
            <Route path="/complaint" element={<ComplaintAssistantPage />} />
            <Route path="/history" element={<HistoryPage />} />
            {/* Fallback to Home */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
