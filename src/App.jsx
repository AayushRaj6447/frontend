import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import DonorsView from './components/DonorsView';
import BloodRequestsView from './components/BloodRequestsView';
import AuthView from './components/AuthView';
import ProfileView from './components/ProfileView';
import Toast from './components/Toast';
import SplashScreen from './components/SplashScreen';
import { getAllDonorsApi, getAllBloodRequestsApi, logoutUserApi } from './services/api';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('auth'); // Default to starter auth/register page
  const [toast, setToast] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  // Intro Splash text animation timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2300);
    return () => clearTimeout(timer);
  }, []);

  // Sync theme with body class
  useEffect(() => {
    document.body.classList.remove('dark-mode', 'light-mode');
    document.body.classList.add(`${theme}-mode`);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

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

  // Load saved user and fetch public data on mount
  useEffect(() => {
    fetchData();
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userObj = JSON.parse(savedUser);
        setCurrentUser(userObj);
        setActiveTab('dashboard');
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
    <div className="min-h-screen min-h-[100dvh] flex flex-col justify-between theme-bg theme-text-primary font-sans selection:bg-blood-600 selection:text-white relative overflow-x-hidden transition-colors duration-300">
      
      {/* Intro Text Animation Splash Screen Overlay */}
      {showSplash && <SplashScreen />}

      {/* Ambient Decorative Floating Gradient Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-blood-600/10 blur-[130px] pointer-events-none animate-float-slow z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blood-800/10 blur-[150px] pointer-events-none animate-float-slow z-0" style={{ animationDelay: '-3.5s' }} />

      {/* Navigation Bar - Only rendered when user is logged in */}
      {currentUser && activeTab !== 'auth' && (
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentUser={currentUser}
          onOpenAuth={() => setActiveTab('auth')}
          onLogout={handleLogout}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 pb-8 z-10 flex flex-col">
        {activeTab === 'auth' || !currentUser ? (
          <AuthView
            onAuthSuccess={handleAuthSuccess}
            showToast={showToast}
            onCancel={() => setActiveTab('dashboard')}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardView
                donors={donors}
                requests={requests}
                currentUser={currentUser}
                onNavigate={(tab) => setActiveTab(tab)}
                onOpenAuth={() => setActiveTab('auth')}
              />
            )}

            {activeTab === 'donors' && (
              <DonorsView
                donors={donors}
                onRefresh={fetchData}
                currentUser={currentUser}
                showToast={showToast}
                onOpenAuth={() => setActiveTab('auth')}
              />
            )}

            {activeTab === 'requests' && (
              <BloodRequestsView
                requests={requests}
                onRefresh={fetchData}
                currentUser={currentUser}
                showToast={showToast}
                onOpenAuth={() => setActiveTab('auth')}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileView
                currentUser={currentUser}
                donors={donors}
                requests={requests}
                onRefresh={fetchData}
                showToast={showToast}
                onNavigate={(tab) => setActiveTab(tab)}
                onLogout={handleLogout}
                theme={theme}
                onToggleTheme={toggleTheme}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto w-full border-t theme-border py-5 px-4 text-center text-xs theme-text-muted z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="font-bold theme-text-secondary">HemoVerse</span> &copy; 2026. Empowering healthcare with real-time blood logistics.
          </div>
          {currentUser && (
            <div className="flex items-center gap-4 theme-text-secondary">
              <button onClick={() => setActiveTab('dashboard')} className="hover:underline">Dashboard</button>
              <button onClick={() => setActiveTab('donors')} className="hover:underline">Donors</button>
              <button onClick={() => setActiveTab('requests')} className="hover:underline">Blood Requests</button>
              <button onClick={() => setActiveTab('profile')} className="hover:underline font-bold text-blood-500">My Profile</button>
            </div>
          )}
        </div>
      </footer>

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

    </div>
  );
}
