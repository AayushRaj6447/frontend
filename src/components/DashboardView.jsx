import React, { useState } from 'react';
import BloodCellCanvas from './3d/BloodCellCanvas';
import BloodTypeCluster from './3d/BloodTypeCluster';
import { Users, HeartPulse, ShieldAlert, Activity, ArrowRight, Phone, Hospital, Award, Search } from 'lucide-react';

export default function DashboardView({ donors = [], requests = [], onNavigate }) {
  const [selectedBloodType, setSelectedBloodType] = useState(null);

  // Compute Statistics
  const totalDonors = donors.length;
  const totalRequests = requests.length;
  const criticalRequestsCount = requests.filter(r => r.urgency === 'Critical' || r.urgency === 'High').length;
  
  // Filter donors and requests if blood type selected
  const filteredDonors = selectedBloodType
    ? donors.filter(d => d.bloodType === selectedBloodType)
    : donors;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Welcome Card */}
        <div className="lg:col-span-6 glass-panel-glow rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blood-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blood-950/60 border border-blood-500/30 text-blood-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <Activity className="w-3.5 h-3.5 text-blood-400 animate-pulse" />
              Live Blood Network
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight mb-3">
              Empowering Life with <span className="text-gradient-blood">Precision & Speed</span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
              Welcome to HemoVerse Blood Management System. Real-time emergency matching, donor network tracking, and immediate blood request orchestration.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3">
            <button
              onClick={() => onNavigate('requests')}
              className="w-full sm:w-1/2 px-4 py-3 rounded-xl bg-gradient-to-r from-blood-600 to-blood-500 hover:from-blood-500 text-white font-bold text-sm shadow-lg shadow-blood-950/80 flex items-center justify-center gap-2 transition-all transform active:scale-95"
            >
              <HeartPulse className="w-4 h-4" />
              Request Blood
            </button>
            <button
              onClick={() => onNavigate('donors')}
              className="w-full sm:w-1/2 px-4 py-3 rounded-xl glass-panel hover:bg-white/10 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Users className="w-4 h-4 text-blood-400" />
              Register Donor
            </button>
          </div>
        </div>

        {/* Right Canvas Visualization */}
        <div className="lg:col-span-6 h-[260px] sm:h-[340px]">
          <BloodCellCanvas />
        </div>

      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Metric 1: Total Donors */}
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 hover:border-blood-500/40 transition-colors">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blood-950/80 border border-blood-500/30 flex items-center justify-center text-blood-400 shadow-inner shrink-0">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider block">Registered Donors</span>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-100">{totalDonors}</div>
          </div>
        </div>

        {/* Metric 2: Active Blood Requests */}
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 hover:border-blood-500/40 transition-colors">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-rose-950/80 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-inner shrink-0">
            <HeartPulse className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider block">Active Requests</span>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-100">{totalRequests}</div>
          </div>
        </div>

        {/* Metric 3: Critical Cases */}
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 hover:border-amber-500/40 transition-colors">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner shrink-0">
            <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider block">Urgent Needs</span>
            <div className="text-xl sm:text-2xl font-extrabold text-amber-400">{criticalRequestsCount}</div>
          </div>
        </div>

        {/* Metric 4: Blood Types Covered */}
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 hover:border-blood-500/40 transition-colors">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner shrink-0">
            <Award className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider block">Group Coverage</span>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-400">8 / 8</div>
          </div>
        </div>

      </div>

      {/* Blood Group Matrix & Donor List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        <div className="lg:col-span-6 h-[280px] sm:h-[340px]">
          <BloodTypeCluster
            selectedType={selectedBloodType}
            onSelect={setSelectedBloodType}
          />
        </div>

        {/* Dynamic Donor Match List */}
        <div className="lg:col-span-6 glass-panel rounded-2xl p-4 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-blood-400" />
                Available Donors {selectedBloodType ? `(${selectedBloodType})` : ''}
              </h2>
              {selectedBloodType && (
                <button
                  onClick={() => setSelectedBloodType(null)}
                  className="text-xs text-blood-400 hover:underline font-semibold"
                >
                  Clear Filter
                </button>
              )}
            </div>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {filteredDonors.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs sm:text-sm">
                  No registered donors found for {selectedBloodType || 'this criteria'}.
                </div>
              ) : (
                filteredDonors.slice(0, 5).map((donor) => (
                  <div
                    key={donor._id}
                    className="flex items-center justify-between p-3 rounded-xl bg-dark-800/80 border border-white/5 hover:border-blood-500/30 transition-all gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blood-900 border border-blood-500/40 flex items-center justify-center font-bold text-blood-200 text-xs sm:text-sm shrink-0">
                        {donor.bloodType}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-semibold text-slate-200 truncate">
                          {donor.firstName} {donor.lastName}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                          <Hospital className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate">{donor.prefferedHospital || donor.fullAddress || 'General Hospital'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <a
                      href={`tel:${donor.phoneNumber}`}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1 hover:bg-emerald-900/60 transition-colors shrink-0"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Contact</span>
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
            <button
              onClick={() => onNavigate('donors')}
              className="text-xs font-semibold text-blood-400 hover:text-blood-300 flex items-center gap-1"
            >
              View All Donors Directory <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
