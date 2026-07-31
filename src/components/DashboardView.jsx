import React, { useState } from 'react';
import { Users, HeartPulse, ShieldAlert, Activity, ArrowRight, Phone, Hospital, Award, Search, Droplet, Filter } from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export default function DashboardView({ donors = [], requests = [], onNavigate }) {
  const [selectedBloodType, setSelectedBloodType] = useState(null);

  // Compute Statistics
  const totalDonors = donors.length;
  const totalRequests = requests.length;
  const criticalRequestsCount = requests.filter(r => r.urgency === 'Critical' || r.urgency === 'High').length;
  
  // Counts by group
  const groupCounts = BLOOD_GROUPS.reduce((acc, group) => {
    acc[group] = donors.filter(d => d.bloodType === group).length;
    return acc;
  }, {});

  // Filter donors if blood type selected
  const filteredDonors = selectedBloodType
    ? donors.filter(d => d.bloodType === selectedBloodType)
    : donors;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      
      {/* Hero Section - Classic Clean Typography */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-10 relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blood-950/60 border border-blood-500/30 text-blood-400 text-xs font-bold uppercase tracking-wider">
            <Activity className="w-4 h-4 text-blood-500 animate-pulse" />
            <span>Emergency Blood Management System</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Saving Lives Through <br />
            <span className="text-gradient-blood">Real-Time Blood Dispatch</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-normal">
            HemoVerse connects donors, hospitals, and critical patients instantly. View live donor availability, post emergency requests, and manage requests with total transparency.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => onNavigate('requests')}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blood-600 to-blood-500 hover:from-blood-500 text-white font-extrabold text-sm shadow-xl shadow-blood-950/80 flex items-center justify-center gap-2 transition-all transform active:scale-95"
            >
              <HeartPulse className="w-5 h-5" />
              Emergency Blood Requests
            </button>
            <button
              onClick={() => onNavigate('donors')}
              className="px-6 py-3.5 rounded-2xl glass-panel hover:bg-white/10 text-slate-200 font-bold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Users className="w-5 h-5 text-blood-400" />
              Browse Registered Donors
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Total Donors */}
        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 hover:border-blood-500/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-blood-950/80 border border-blood-500/30 flex items-center justify-center text-blood-400 shadow-inner shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Registered Donors</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-100">{totalDonors}</div>
          </div>
        </div>

        {/* Metric 2: Active Blood Requests */}
        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 hover:border-blood-500/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-inner shrink-0">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Active Requests</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-100">{totalRequests}</div>
          </div>
        </div>

        {/* Metric 3: Critical Cases */}
        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 hover:border-amber-500/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Critical Cases</span>
            <div className="text-2xl sm:text-3xl font-black text-amber-400">{criticalRequestsCount}</div>
          </div>
        </div>

        {/* Metric 4: Blood Types Covered */}
        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 hover:border-emerald-500/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Blood Groups</span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">8 / 8 Active</div>
          </div>
        </div>

      </div>

      {/* Blood Group Matrix & Donor Match List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Blood Group Filter Grid */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
                <Filter className="w-5 h-5 text-blood-400" />
                Filter Donors by Blood Group
              </h2>
              {selectedBloodType && (
                <button
                  onClick={() => setSelectedBloodType(null)}
                  className="text-xs font-bold text-blood-400 hover:underline"
                >
                  Clear Filter
                </button>
              )}
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Select any blood group below to instantly locate matching verified donors.
            </p>

            <div className="grid grid-cols-4 gap-2.5">
              {BLOOD_GROUPS.map((type) => {
                const isSelected = selectedBloodType === type;
                const count = groupCounts[type] || 0;
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedBloodType(isSelected ? null : type)}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-blood-600 border-blood-400 text-white shadow-lg shadow-blood-950/60 scale-105'
                        : 'glass-panel hover:bg-white/5 text-slate-200 border-white/10'
                    }`}
                  >
                    <span className="text-base font-black">{type}</span>
                    <span className={`text-[10px] font-bold mt-1 ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                      {count} {count === 1 ? 'Donor' : 'Donors'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 text-xs text-slate-400 flex items-center gap-2">
            <Droplet className="w-4 h-4 text-blood-500" />
            <span>Universal Donor: <strong>O-</strong> | Universal Acceptor: <strong>AB+</strong></span>
          </div>
        </div>

        {/* Right: Available Donors List */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
                <Search className="w-5 h-5 text-blood-400" />
                Available Donors {selectedBloodType ? `(${selectedBloodType})` : ''}
              </h2>
              <span className="text-xs text-slate-400 font-semibold">
                {filteredDonors.length} {filteredDonors.length === 1 ? 'Donor' : 'Donors'} Found
              </span>
            </div>

            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
              {filteredDonors.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm font-medium">
                  No registered donors found for {selectedBloodType || 'this selection'}.
                </div>
              ) : (
                filteredDonors.slice(0, 6).map((donor) => (
                  <div
                    key={donor._id}
                    className="flex items-center justify-between p-3.5 rounded-2xl glass-panel border border-white/5 hover:border-blood-500/30 transition-all gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-blood-900/90 border border-blood-500/40 flex items-center justify-center font-black text-blood-300 text-sm shrink-0 shadow-inner">
                        {donor.bloodType}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-extrabold text-slate-100 truncate">
                          {donor.firstName} {donor.lastName}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 truncate mt-0.5">
                          <Hospital className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">{donor.prefferedHospital || donor.fullAddress || 'Hospital unspecified'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <a
                      href={`tel:${donor.phoneNumber}`}
                      className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-extrabold flex items-center gap-1.5 hover:bg-emerald-900/60 transition-colors shrink-0"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Contact</span>
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
            <button
              onClick={() => onNavigate('donors')}
              className="text-xs font-extrabold text-blood-400 hover:text-blood-300 flex items-center gap-1.5"
            >
              View Full Donors Directory <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
