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
  
  // Filter donors and requests if blood type selected in 3D cluster
  const filteredDonors = selectedBloodType
    ? donors.filter(d => d.bloodType === selectedBloodType)
    : donors;

  const filteredRequests = selectedBloodType
    ? requests.filter(r => r.bloodType === selectedBloodType)
    : requests;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Hero 3D Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Welcome Card */}
        <div className="lg:col-span-5 glass-panel-glow rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blood-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blood-950/60 border border-blood-500/30 text-blood-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <Activity className="w-3.5 h-3.5 text-blood-400 animate-pulse" />
              Live Blood Network
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight mb-4">
              Empowering Life with <span className="text-gradient-blood">3D Precision</span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Welcome to HemoVerse 3D. Real-time emergency matching, donor network tracking, and immediate blood request orchestration.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('requests')}
              className="flex-1 min-w-[140px] px-4 py-3 rounded-xl bg-gradient-to-r from-blood-600 to-blood-500 hover:from-blood-500 hover:to-blood-400 text-white font-bold text-sm shadow-lg shadow-blood-950/80 flex items-center justify-center gap-2 transition-all transform active:scale-95"
            >
              <HeartPulse className="w-4 h-4" />
              Request Blood
            </button>
            <button
              onClick={() => onNavigate('donors')}
              className="flex-1 min-w-[140px] px-4 py-3 rounded-xl glass-panel hover:bg-white/10 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Users className="w-4 h-4 text-blood-400" />
              Register Donor
            </button>
          </div>
        </div>

        {/* Right 3D Erythrocyte Engine Canvas */}
        <div className="lg:col-span-7 h-[360px] lg:h-auto">
          <BloodCellCanvas />
        </div>

      </div>

      {/* 3D Key Metrics Vault */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Total Donors */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4 hover:border-blood-500/40 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-blood-950/80 border border-blood-500/30 flex items-center justify-center text-blood-400 shadow-inner">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Registered Donors</span>
            <div className="text-2xl font-extrabold text-slate-100">{totalDonors}</div>
          </div>
        </div>

        {/* Metric 2: Active Blood Requests */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4 hover:border-blood-500/40 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-rose-950/80 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-inner">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Requests</span>
            <div className="text-2xl font-extrabold text-slate-100">{totalRequests}</div>
          </div>
        </div>

        {/* Metric 3: Critical Cases */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4 hover:border-amber-500/40 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Urgent Needs</span>
            <div className="text-2xl font-extrabold text-amber-400">{criticalRequestsCount}</div>
          </div>
        </div>

        {/* Metric 4: Blood Types Covered */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4 hover:border-blood-500/40 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Group Coverage</span>
            <div className="text-2xl font-extrabold text-emerald-400">8 / 8</div>
          </div>
        </div>

      </div>

      {/* 3D Blood Type Matrix Interactive Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        <div className="lg:col-span-6 h-[340px]">
          <BloodTypeCluster
            selectedType={selectedBloodType}
            onSelect={setSelectedBloodType}
          />
        </div>

        {/* Dynamic Donor Match List based on selected 3D Node */}
        <div className="lg:col-span-6 glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Search className="w-5 h-5 text-blood-400" />
                Available Donors {selectedBloodType ? `(${selectedBloodType})` : ''}
              </h2>
              {selectedBloodType && (
                <button
                  onClick={() => setSelectedBloodType(null)}
                  className="text-xs text-blood-400 hover:underline font-semibold"
                >
                  Clear 3D Filter
                </button>
              )}
            </div>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {filteredDonors.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                  No registered donors found for {selectedBloodType || 'this criteria'}.
                </div>
              ) : (
                filteredDonors.slice(0, 5).map((donor) => (
                  <div
                    key={donor._id}
                    className="flex items-center justify-between p-3 rounded-xl bg-dark-800/80 border border-white/5 hover:border-blood-500/30 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blood-900 border border-blood-500/40 flex items-center justify-center font-bold text-blood-200 text-sm">
                        {donor.bloodType}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-200">
                          {donor.firstName} {donor.lastName}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-2">
                          <Hospital className="w-3 h-3 text-slate-500" />
                          {donor.prefferedHospital || donor.fullAddress || 'General Hospital'}
                        </div>
                      </div>
                    </div>
                    
                    <a
                      href={`tel:${donor.phoneNumber}`}
                      className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-900/60 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Contact
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
