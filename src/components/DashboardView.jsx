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
    <div className="space-y-6 sm:space-y-8 animate-fade-in-up pb-12">
      
      {/* Hero Section - Prominent Minimalist Typography */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-12 relative overflow-hidden transition-all duration-300 border theme-border">
        <div className="max-w-4xl space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blood-500/10 border border-blood-500/30 text-blood-500 text-xs font-black uppercase tracking-wider">
            <Activity className="w-4 h-4 text-blood-500 animate-pulse" />
            <span>Emergency Blood Management Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none theme-text-primary">
            Saving Lives Through <br />
            <span className="text-gradient-blood">Real-Time Blood Dispatch</span>
          </h1>

          <p className="text-base sm:text-lg theme-text-muted leading-relaxed font-medium max-w-2xl">
            HemoVerse connects verified donors, emergency hospitals, and critical patients instantly. Real-time availability, emergency dispatches, and seamless logistics.
          </p>

          <div className="flex flex-col sm:flex-row gap-3.5 pt-3">
            <button
              onClick={() => onNavigate('requests')}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blood-600 to-blood-500 hover:from-blood-500 text-white font-black text-sm shadow-xl shadow-blood-900/40 flex items-center justify-center gap-2.5 transition-all hover-lift active:scale-95"
            >
              <HeartPulse className="w-5 h-5 animate-pulse" />
              Emergency Blood Requests
            </button>
            <button
              onClick={() => onNavigate('donors')}
              className="px-8 py-4 rounded-2xl glass-panel theme-text-primary font-extrabold text-sm flex items-center justify-center gap-2.5 transition-all hover-lift"
            >
              <Users className="w-5 h-5 text-blood-500" />
              Browse Donors Directory
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Total Donors */}
        <div className="glass-panel p-5 sm:p-6 rounded-3xl flex items-center gap-4 hover-lift border theme-border transition-all">
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-blood-500/15 border border-blood-500/30 flex items-center justify-center text-blood-500 shadow-inner shrink-0">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-black theme-text-muted uppercase tracking-wider block">Registered Donors</span>
            <div className="text-3xl sm:text-4xl font-black theme-text-primary mt-0.5">{totalDonors}</div>
          </div>
        </div>

        {/* Metric 2: Active Blood Requests */}
        <div className="glass-panel p-5 sm:p-6 rounded-3xl flex items-center gap-4 hover-lift border theme-border transition-all">
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500 shadow-inner shrink-0">
            <HeartPulse className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-black theme-text-muted uppercase tracking-wider block">Active Requests</span>
            <div className="text-3xl sm:text-4xl font-black theme-text-primary mt-0.5">{totalRequests}</div>
          </div>
        </div>

        {/* Metric 3: Critical Cases */}
        <div className="glass-panel p-5 sm:p-6 rounded-3xl flex items-center gap-4 hover-lift border theme-border transition-all">
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-inner shrink-0">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-black theme-text-muted uppercase tracking-wider block">Critical Cases</span>
            <div className="text-3xl sm:text-4xl font-black text-amber-500 mt-0.5">{criticalRequestsCount}</div>
          </div>
        </div>

        {/* Metric 4: Blood Types Covered */}
        <div className="glass-panel p-5 sm:p-6 rounded-3xl flex items-center gap-4 hover-lift border theme-border transition-all">
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shadow-inner shrink-0">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-black theme-text-muted uppercase tracking-wider block">Blood Groups</span>
            <div className="text-3xl sm:text-4xl font-black text-emerald-500 mt-0.5">8 / 8 Active</div>
          </div>
        </div>

      </div>

      {/* Blood Group Matrix & Donor Match List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Blood Group Filter Grid */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between border theme-border">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black theme-text-primary flex items-center gap-2">
                <Filter className="w-5 h-5 text-blood-500" />
                Filter by Blood Group
              </h2>
              {selectedBloodType && (
                <button
                  onClick={() => setSelectedBloodType(null)}
                  className="text-xs font-black text-blood-500 hover:underline"
                >
                  Clear Filter
                </button>
              )}
            </div>

            <p className="text-xs sm:text-sm theme-text-muted mb-5">
              Select any blood group below to instantly locate matching verified donors.
            </p>

            <div className="grid grid-cols-4 gap-3">
              {BLOOD_GROUPS.map((type) => {
                const isSelected = selectedBloodType === type;
                const count = groupCounts[type] || 0;
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedBloodType(isSelected ? null : type)}
                    className={`p-3.5 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center hover-lift ${
                      isSelected
                        ? 'bg-blood-600 border-blood-400 text-white shadow-xl shadow-blood-900/50 scale-105'
                        : 'glass-panel theme-text-primary theme-border hover:bg-blood-500/10'
                    }`}
                  >
                    <span className="text-lg font-black">{type}</span>
                    <span className={`text-[11px] font-bold mt-1 ${isSelected ? 'text-white' : 'theme-text-muted'}`}>
                      {count} {count === 1 ? 'Donor' : 'Donors'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t theme-border text-xs theme-text-muted flex items-center gap-2 font-medium">
            <Droplet className="w-4 h-4 text-blood-500" />
            <span>Universal Donor: <strong className="theme-text-primary">O-</strong> | Universal Acceptor: <strong className="theme-text-primary">AB+</strong></span>
          </div>
        </div>

        {/* Right: Available Donors List */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between border theme-border">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black theme-text-primary flex items-center gap-2">
                <Search className="w-5 h-5 text-blood-500" />
                Available Donors {selectedBloodType ? `(${selectedBloodType})` : ''}
              </h2>
              <span className="text-xs theme-text-muted font-bold">
                {filteredDonors.length} {filteredDonors.length === 1 ? 'Donor' : 'Donors'} Found
              </span>
            </div>

            <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
              {filteredDonors.length === 0 ? (
                <div className="text-center py-12 theme-text-muted text-sm font-semibold">
                  No registered donors found for {selectedBloodType || 'this selection'}.
                </div>
              ) : (
                filteredDonors.slice(0, 6).map((donor) => (
                  <div
                    key={donor._id}
                    className="flex items-center justify-between p-4 rounded-2xl glass-panel border theme-border hover:border-blood-500/50 transition-all hover-lift gap-3"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-blood-500/20 border border-blood-500/40 flex items-center justify-center font-black text-blood-500 text-base shrink-0 shadow-inner">
                        {donor.bloodType}
                      </div>
                      <div className="min-w-0">
                        <div className="text-base font-black theme-text-primary truncate">
                          {donor.firstName} {donor.lastName}
                        </div>
                        <div className="text-xs theme-text-muted flex items-center gap-1 truncate mt-0.5">
                          <Hospital className="w-3.5 h-3.5 theme-text-muted shrink-0" />
                          <span className="truncate">{donor.prefferedHospital || donor.fullAddress || 'Hospital unspecified'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <a
                      href={`tel:${donor.phoneNumber}`}
                      className="px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-500 text-xs font-black flex items-center gap-1.5 hover:bg-emerald-500/25 transition-colors shrink-0"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Contact</span>
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t theme-border flex justify-end">
            <button
              onClick={() => onNavigate('donors')}
              className="text-xs font-black text-blood-500 hover:underline flex items-center gap-1.5"
            >
              View Full Donors Directory <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
