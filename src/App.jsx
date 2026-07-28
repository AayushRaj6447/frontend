import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import DonorsView from './components/DonorsView';
import BloodRequestsView from './components/BloodRequestsView';
import AuthView from './components/AuthView';
import Toast from './components/Toast';
import { getAllDonorsApi, getAllBloodRequestsApi, logoutUserApi } from './services/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('auth'); // Default to auth page for non-logged in users
  const [toast, setToast] = useState(null);

  // Data states
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Load saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userObj = JSON.parse(savedUser);
        setCurrentUser(userObj);
        setActiveTab('dashboard');
        fetchData();
      } catch (e) {
        console.error('Failed to parse saved user');
        setActiveTab('auth');
      }
    } else {
      setActiveTab('auth');
    }
  }, []);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [donorsData, requestsData] = await Promise.all([
        getAllDonorsApi().catch(() => []),
        getAllBloodRequestsApi().catch(() => []),
      ]);
      setDonors(donorsData);
      setRequests(requestsData);
    } catch (err) {
      console.error('Data fetch error:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogout = () => {
    logoutUserApi();
    setCurrentUser(null);
    setActiveTab('auth');
    showToast('Logged out successfully.', 'info');
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
    fetchData();
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-900 text-slate-100 font-sans selection:bg-blood-600 selection:text-white">
      
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={() => setActiveTab('auth')}
        onLogout={handleLogout}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {!currentUser || activeTab === 'auth' ? (
          <AuthView
            onAuthSuccess={handleAuthSuccess}
            showToast={showToast}
            onCancel={() => {}}
          />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardView
                donors={donors}
                requests={requests}
                onNavigate={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'donors' && (
              <DonorsView
                donors={donors}
                onRefresh={fetchData}
                currentUser={currentUser}
                showToast={showToast}
              />
            )}

            {activeTab === 'requests' && (
              <BloodRequestsView
                requests={requests}
                onRefresh={fetchData}
                currentUser={currentUser}
                showToast={showToast}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-dark-950/80 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="font-bold text-slate-400">HemoVerse</span> &copy; 2026. Empowering healthcare with real-time blood logistics.
          </div>
          {currentUser && (
            <div className="flex items-center gap-4 text-slate-400">
              <button onClick={() => setActiveTab('dashboard')} className="hover:underline">Dashboard</button>
              <button onClick={() => setActiveTab('donors')} className="hover:underline">Donors</button>
              <button onClick={() => setActiveTab('requests')} className="hover:underline">Blood Requests</button>
            </div>
          )}
        </div>
      </footer>

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

    </div>
  );
}
