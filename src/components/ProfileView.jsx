import React, { useState } from 'react';
import { 
  User, Mail, ShieldCheck, Copy, Check, Calendar, HeartPulse, 
  Users, Edit3, Trash2, LogOut, Sun, Moon, Sparkles, MapPin, 
  Phone, Plus, Eye, KeyRound, CheckCircle2
} from 'lucide-react';
import { editDonorApi, removeDonorApi, editBloodRequestApi, removeBloodRequestApi } from '../services/api';

const getUserId = (userObj) => {
  if (!userObj) return null;
  if (typeof userObj === 'string') return userObj;
  return userObj._id || userObj.id || userObj.userId || userObj.user?._id || userObj.user?.id || null;
};

const checkIsOwner = (currentUser, item) => {
  if (!currentUser || !item) return false;
  const currentUserId = getUserId(currentUser);
  const creatorId = getUserId(item.createdBy) || getUserId(item.user);
  if (!currentUserId || !creatorId || String(currentUserId) === 'undefined' || String(creatorId) === 'undefined') {
    return false;
  }
  return String(currentUserId) === String(creatorId);
};

export default function ProfileView({ 
  currentUser, 
  donors = [], 
  requests = [], 
  onRefresh, 
  showToast, 
  onNavigate, 
  onLogout,
  theme,
  onToggleTheme 
}) {
  const [copiedId, setCopiedId] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('details'); // 'details', 'donors', 'requests'
  const [viewingImage, setViewingImage] = useState(false);

  if (!currentUser) {
    return (
      <div className="glass-panel p-10 sm:p-14 rounded-3xl text-center border theme-border my-12 animate-fade-in-up">
        <User className="w-16 h-16 mx-auto text-blood-500 mb-4 animate-bounce" />
        <h2 className="text-2xl font-black theme-text-primary">No User Account Found</h2>
        <p className="text-sm theme-text-muted mt-2 mb-6">Please sign in to view your account profile details.</p>
        <button
          onClick={() => onNavigate && onNavigate('auth')}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blood-600 to-blood-500 text-white font-black text-sm shadow-lg hover-lift"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  const userId = getUserId(currentUser) || 'N/A';
  const fullName = `${currentUser.firstName || ''} ${currentUser.middleName ? currentUser.middleName + ' ' : ''}${currentUser.lastName || ''}`.trim() || 'User Profile';

  // Filter items owned by the user
  const userDonors = donors.filter(d => checkIsOwner(currentUser, d));
  const userRequests = requests.filter(r => checkIsOwner(currentUser, r));

  const handleCopyId = () => {
    if (userId && userId !== 'N/A') {
      navigator.clipboard.writeText(userId);
      setCopiedId(true);
      if (showToast) showToast('User ID copied to clipboard!', 'info');
      setTimeout(() => setCopiedId(false), 3000);
    }
  };

  const handleDeleteDonor = async (donorId) => {
    if (!window.confirm('Are you sure you want to remove this donor entry?')) return;
    try {
      await removeDonorApi(donorId);
      if (showToast) showToast('Donor entry removed successfully.', 'success');
      if (onRefresh) onRefresh();
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to remove donor.', 'error');
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel and remove this blood request?')) return;
    try {
      await removeBloodRequestApi(requestId);
      if (showToast) showToast('Blood request removed successfully.', 'success');
      if (onRefresh) onRefresh();
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to remove request.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up pb-12">
      
      {/* ========================================================================= */}
      {/* HERO / PROFILE HEADER CARD */}
      {/* ========================================================================= */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border theme-border relative overflow-hidden shadow-2xl">
        {/* Background glow accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blood-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative z-10">
          
          {/* Avatar and Basic User Details */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
            <div className="relative group cursor-pointer" onClick={() => currentUser.avatar && setViewingImage(true)}>
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={fullName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-blood-500/60 shadow-xl group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-blood-700 to-blood-900 border-4 border-blood-500/60 flex items-center justify-center text-white text-3xl font-black shadow-xl">
                  {currentUser.firstName?.[0] || 'U'}
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-emerald-500 text-white shadow-lg border-2 theme-border" title="Verified Account">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black theme-text-primary tracking-tight">
                  {fullName}
                </h1>
                <span className="px-3 py-1 rounded-full bg-blood-500/15 border border-blood-500/40 text-blood-500 text-xs font-extrabold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Verified User
                </span>
              </div>

              <p className="text-sm font-semibold theme-text-muted flex items-center justify-center sm:justify-start gap-2">
                <Mail className="w-4 h-4 text-blood-500" />
                {currentUser.email}
              </p>

              {/* User ID display with copy feature */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl theme-card-sub border theme-border text-xs font-mono">
                <span className="theme-text-muted font-bold">User ID:</span>
                <span className="theme-text-primary font-black truncate max-w-[140px] sm:max-w-[200px]">{userId}</span>
                <button
                  onClick={handleCopyId}
                  title="Copy User ID"
                  className="p-1 hover:text-blood-500 transition-colors"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Header Actions & Theme Toggle */}
          <div className="flex items-center gap-2.5 shrink-0">
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className="p-3 rounded-2xl glass-panel theme-text-primary hover:scale-105 active:scale-95 transition-all shadow-md flex items-center gap-2 font-bold text-xs"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span>Light Theme</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-indigo-600" />
                    <span>Dark Theme</span>
                  </>
                )}
              </button>
            )}

            {onLogout && (
              <button
                onClick={onLogout}
                className="px-4 py-3 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-500 font-extrabold text-xs flex items-center gap-2 transition-all hover-lift"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            )}
          </div>

        </div>

        {/* Contribution Counter Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-6 pt-6 border-t theme-border">
          <div className="glass-panel p-3.5 sm:p-4 rounded-2xl border theme-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blood-500/20 text-blood-500 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black theme-text-primary">{userDonors.length}</div>
              <div className="text-[11px] font-bold theme-text-muted">Donors Registered</div>
            </div>
          </div>

          <div className="glass-panel p-3.5 sm:p-4 rounded-2xl border theme-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black theme-text-primary">{userRequests.length}</div>
              <div className="text-[11px] font-bold theme-text-muted">Blood Requests</div>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 glass-panel p-3.5 sm:p-4 rounded-2xl border theme-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black text-emerald-500">Active</div>
              <div className="text-[11px] font-bold theme-text-muted">Account Status</div>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* NAVIGATION SUB-TABS */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 border-b theme-border pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('details')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all shrink-0 ${
            activeSubTab === 'details'
              ? 'bg-blood-600 text-white shadow-lg shadow-blood-950/40'
              : 'glass-panel theme-text-muted hover:theme-text-primary hover:bg-blood-500/10'
          }`}
        >
          <User className="w-4 h-4" />
          Full Personal Details
        </button>

        <button
          onClick={() => setActiveSubTab('donors')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all shrink-0 ${
            activeSubTab === 'donors'
              ? 'bg-blood-600 text-white shadow-lg shadow-blood-950/40'
              : 'glass-panel theme-text-muted hover:theme-text-primary hover:bg-blood-500/10'
          }`}
        >
          <Users className="w-4 h-4" />
          My Registered Donors ({userDonors.length})
        </button>

        <button
          onClick={() => setActiveSubTab('requests')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all shrink-0 ${
            activeSubTab === 'requests'
              ? 'bg-blood-600 text-white shadow-lg shadow-blood-950/40'
              : 'glass-panel theme-text-muted hover:theme-text-primary hover:bg-blood-500/10'
          }`}
        >
          <HeartPulse className="w-4 h-4" />
          My Blood Requests ({userRequests.length})
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: FULL USER DETAILS & INFORMATION */}
      {/* ========================================================================= */}
      {activeSubTab === 'details' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
          
          {/* Personal Info Grid Card */}
          <div className="glass-panel p-6 sm:p-7 rounded-3xl border theme-border space-y-5">
            <div className="flex items-center justify-between border-b theme-border pb-3">
              <h2 className="text-lg font-black theme-text-primary flex items-center gap-2">
                <User className="w-5 h-5 text-blood-500" />
                Personal Profile Information
              </h2>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30">
                Verified
              </span>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b theme-border gap-1">
                <span className="theme-text-muted font-bold">First Name:</span>
                <span className="theme-text-primary font-black text-base">{currentUser.firstName || 'Not Specified'}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b theme-border gap-1">
                <span className="theme-text-muted font-bold">Middle Name:</span>
                <span className="theme-text-primary font-extrabold">{currentUser.middleName || 'N/A'}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b theme-border gap-1">
                <span className="theme-text-muted font-bold">Last Name:</span>
                <span className="theme-text-primary font-extrabold">{currentUser.lastName || 'N/A'}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b theme-border gap-1">
                <span className="theme-text-muted font-bold">Registered Email:</span>
                <span className="theme-text-primary font-extrabold text-blood-500 break-all">{currentUser.email}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b theme-border gap-1">
                <span className="theme-text-muted font-bold">Database ID:</span>
                <span className="theme-text-primary font-mono font-bold text-xs">{userId}</span>
              </div>
            </div>
          </div>

          {/* Account Security & Platform Role */}
          <div className="glass-panel p-6 sm:p-7 rounded-3xl border theme-border space-y-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b theme-border pb-3 mb-4">
                <h2 className="text-lg font-black theme-text-primary flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-indigo-500" />
                  Account Security & Access
                </h2>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm">
                <div className="p-4 rounded-2xl theme-card-sub border theme-border space-y-1">
                  <div className="font-extrabold theme-text-primary flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Authentication Protocol
                  </div>
                  <p className="text-xs theme-text-muted">
                    Your account is secured via standard JWT authentication and OTP-verified registration.
                  </p>
                </div>

                <div className="p-4 rounded-2xl theme-card-sub border theme-border space-y-1">
                  <div className="font-extrabold theme-text-primary flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Ownership & Permissions
                  </div>
                  <p className="text-xs theme-text-muted">
                    You have sole edit & deletion rights over donor profiles and emergency requests created under your ID.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="pt-4 border-t theme-border flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onNavigate && onNavigate('donors')}
                className="flex-1 py-3 px-4 rounded-2xl glass-panel theme-text-primary hover:bg-blood-500/10 border theme-border text-xs font-black flex items-center justify-center gap-2 transition-all hover-lift"
              >
                <Plus className="w-4 h-4 text-blood-500" />
                Register Donor
              </button>
              <button
                onClick={() => onNavigate && onNavigate('requests')}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-blood-600 to-blood-500 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg hover-lift"
              >
                <HeartPulse className="w-4 h-4" />
                Post Request
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MY REGISTERED DONORS */}
      {/* ========================================================================= */}
      {activeSubTab === 'donors' && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black theme-text-primary">Donors Registered by You</h2>
            <button
              onClick={() => onNavigate && onNavigate('donors')}
              className="px-4 py-2 rounded-xl bg-blood-600 text-white text-xs font-bold flex items-center gap-1 hover-lift"
            >
              <Plus className="w-3.5 h-3.5" /> Add New Donor
            </button>
          </div>

          {userDonors.length === 0 ? (
            <div className="glass-panel p-10 rounded-3xl text-center border theme-border">
              <Users className="w-12 h-12 mx-auto theme-text-muted mb-2" />
              <p className="font-bold theme-text-primary">No donors registered by your account yet.</p>
              <p className="text-xs theme-text-muted mt-1 mb-4">Registering donors helps save lives in real-time emergencies.</p>
              <button
                onClick={() => onNavigate && onNavigate('donors')}
                className="px-5 py-2.5 rounded-xl bg-blood-600 text-white text-xs font-black"
              >
                Register a Donor Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userDonors.map((donor) => (
                <div key={donor._id} className="glass-panel p-5 rounded-3xl border theme-border space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        {donor.profilePhoto ? (
                          <img src={donor.profilePhoto} alt={donor.firstName} className="w-10 h-10 rounded-xl object-cover border border-blood-500" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-blood-500/20 text-blood-500 font-bold flex items-center justify-center text-sm">
                            {donor.firstName?.[0]}
                          </div>
                        )}
                        <div>
                          <h4 className="font-black theme-text-primary text-sm">
                            {donor.firstName} {donor.lastName}
                          </h4>
                          <p className="text-[11px] theme-text-muted truncate max-w-[140px]">{donor.fullAddress || 'No address'}</p>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-xl bg-blood-500/20 text-blood-500 font-black text-xs">
                        {donor.bloodType}
                      </span>
                    </div>

                    <div className="text-xs theme-card-sub p-3 rounded-xl border theme-border space-y-1.5">
                      <div className="flex justify-between">
                        <span className="theme-text-muted">Gender/Weight:</span>
                        <span className="font-bold theme-text-primary">{donor.Gender}, {donor.weight}kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="theme-text-muted">Phone:</span>
                        <span className="font-bold text-emerald-500">{donor.phoneNumber}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t theme-border flex items-center justify-between">
                    <span className="text-[10px] theme-text-muted font-bold">Owner Access Enabled</span>
                    <button
                      onClick={() => handleDeleteDonor(donor._id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: MY BLOOD REQUESTS */}
      {/* ========================================================================= */}
      {activeSubTab === 'requests' && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black theme-text-primary">Emergency Requests Created by You</h2>
            <button
              onClick={() => onNavigate && onNavigate('requests')}
              className="px-4 py-2 rounded-xl bg-blood-600 text-white text-xs font-bold flex items-center gap-1 hover-lift"
            >
              <Plus className="w-3.5 h-3.5" /> Post New Request
            </button>
          </div>

          {userRequests.length === 0 ? (
            <div className="glass-panel p-10 rounded-3xl text-center border theme-border">
              <HeartPulse className="w-12 h-12 mx-auto theme-text-muted mb-2" />
              <p className="font-bold theme-text-primary">You haven't posted any emergency blood requests.</p>
              <p className="text-xs theme-text-muted mt-1 mb-4">Need urgent blood supplies for a hospital patient?</p>
              <button
                onClick={() => onNavigate && onNavigate('requests')}
                className="px-5 py-2.5 rounded-xl bg-blood-600 text-white text-xs font-black"
              >
                Post Emergency Blood Request
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userRequests.map((req) => (
                <div key={req._id} className="glass-panel p-5 rounded-3xl border theme-border space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center font-black">
                          <HeartPulse className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-black theme-text-primary text-sm">{req.patientName}</h4>
                          <p className="text-[11px] theme-text-muted truncate max-w-[130px]">{req.hospitalName}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="px-2.5 py-1 rounded-xl bg-blood-600 text-white font-black text-xs block">
                          {req.bloodGroup}
                        </span>
                        <span className="text-[10px] font-bold text-amber-500 mt-0.5 block">{req.units} Unit(s)</span>
                      </div>
                    </div>

                    <div className="text-xs theme-card-sub p-3 rounded-xl border theme-border space-y-1.5">
                      <div className="flex justify-between">
                        <span className="theme-text-muted">Urgency:</span>
                        <span className="font-extrabold text-rose-500 uppercase text-[11px]">{req.urgency || 'High'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="theme-text-muted">Attendant Contact:</span>
                        <span className="font-bold text-emerald-500">{req.contactNumber || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t theme-border flex items-center justify-between">
                    <span className="text-[10px] theme-text-muted font-bold">Owner Access Enabled</span>
                    <button
                      onClick={() => handleDeleteRequest(req._id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Cancel Request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* AVATAR IMAGE ZOOM MODAL */}
      {/* ========================================================================= */}
      {viewingImage && currentUser.avatar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in-up" onClick={() => setViewingImage(false)}>
          <div className="relative max-w-lg w-full bg-slate-900 rounded-3xl p-4 border border-blood-500/40 shadow-2xl" onClick={e => e.stopPropagation()}>
            <img src={currentUser.avatar} alt={fullName} className="w-full h-auto max-h-[70vh] rounded-2xl object-contain mx-auto" />
            <div className="text-center mt-3">
              <p className="font-black text-white text-base">{fullName}</p>
              <p className="text-xs text-slate-400 mt-0.5">{currentUser.email}</p>
              <button
                onClick={() => setViewingImage(false)}
                className="mt-3 px-5 py-2 rounded-xl bg-blood-600 text-white font-bold text-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
