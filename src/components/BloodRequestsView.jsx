import React, { useState } from 'react';
import { HeartPulse, Plus, Search, Phone, Hospital, AlertCircle, ShieldAlert, Clock, Trash2, Edit3, X, FileText, CheckCircle } from 'lucide-react';
import { addBloodRequestApi, editBloodRequestApi, removeBloodRequestApi } from '../services/api';

const URGENCY_LEVELS = ['All', 'Critical', 'High', 'Medium', 'Low'];

export default function BloodRequestsView({ requests = [], onRefresh, currentUser, showToast }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState('All');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    patientName: '',
    bloodType: 'O+',
    unitsNeeded: 2,
    urgency: 'Critical',
    hospital: '',
    phoneNumber: '',
    aadharNumber: '',
    email: '',
    additionalNotes: '',
  });

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!currentUser) {
      if (showToast) showToast('Please log in to submit a blood request.', 'error');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        patientName: formData.patientName,
        bloodType: formData.bloodType,
        unitsNeeded: Number(formData.unitsNeeded),
        urgency: formData.urgency,
        hospital: formData.hospital,
        phoneNumber: Number(formData.phoneNumber),
        aadharNumber: Number(formData.aadharNumber),
        additionalNotes: formData.additionalNotes || '',
      };
      await addBloodRequestApi(payload);
      if (showToast) showToast('Blood Request published successfully!', 'success');
      setIsAddModalOpen(false);
      resetForm();
      onRefresh();
    } catch (err) {
      setError(err.message || 'Failed to add blood request.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        patientName: formData.patientName,
        bloodType: formData.bloodType,
        unitsNeeded: Number(formData.unitsNeeded),
        urgency: formData.urgency,
        hospital: formData.hospital,
        phoneNumber: Number(formData.phoneNumber),
        aadharNumber: Number(formData.aadharNumber),
        additionalNotes: formData.additionalNotes || '',
      };
      await editBloodRequestApi(editingRequest._id, payload);
      if (showToast) showToast('Blood Request updated successfully!', 'success');
      setEditingRequest(null);
      resetForm();
      onRefresh();
    } catch (err) {
      setError(err.message || 'Failed to update request.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (requestId) => {
    if (!window.confirm('Delete this blood request?')) return;
    try {
      await removeBloodRequestApi(requestId);
      if (showToast) showToast('Blood request deleted.', 'success');
      onRefresh();
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to delete request.', 'error');
    }
  };

  const openEditModal = (req) => {
    setEditingRequest(req);
    setFormData({
      patientName: req.patientName || '',
      bloodType: req.bloodType || 'O+',
      unitsNeeded: req.unitsNeeded || 1,
      urgency: req.urgency || 'Medium',
      hospital: req.hospital || '',
      phoneNumber: req.phoneNumber || '',
      aadharNumber: req.aadharNumber || '',
      additionalNotes: req.additionalNotes || '',
    });
  };

  const resetForm = () => {
    setFormData({
      patientName: '',
      bloodType: 'O+',
      unitsNeeded: 2,
      urgency: 'Critical',
      hospital: '',
      phoneNumber: '',
      aadharNumber: '',
      additionalNotes: '',
    });
  };

  const filteredRequests = requests.filter((req) => {
    const matchesUrgency = selectedUrgency === 'All' || req.urgency === selectedUrgency;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (req.patientName && req.patientName.toLowerCase().includes(searchLower)) ||
      (req.hospital && req.hospital.toLowerCase().includes(searchLower)) ||
      (req.bloodType && req.bloodType.toLowerCase().includes(searchLower));
    return matchesUrgency && matchesSearch;
  });

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'Critical':
        return 'bg-rose-950/90 border-rose-500/60 text-rose-300 shadow-rose-950/50 animate-pulse';
      case 'High':
        return 'bg-amber-950/90 border-amber-500/60 text-amber-300';
      case 'Medium':
        return 'bg-sky-950/90 border-sky-500/60 text-sky-300';
      default:
        return 'bg-slate-900 border-slate-700 text-slate-400';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-4 sm:p-6 rounded-2xl sm:rounded-3xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 sm:w-6 sm:h-6 text-blood-500" />
            Emergency Blood Requests Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time emergency requests submitted by hospitals and patients requiring blood units.
          </p>
        </div>

        <button
          onClick={() => {
            if (!currentUser) {
              if (showToast) showToast('Please log in to submit a request.', 'error');
              return;
            }
            resetForm();
            setIsAddModalOpen(true);
          }}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-blood-600 to-blood-500 hover:from-blood-500 text-white font-bold text-sm shadow-lg shadow-blood-950/80 flex items-center justify-center gap-2 transition-all transform active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Blood Request
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient, hospital, group..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
          />
        </div>

        {/* Urgency Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 max-w-full">
          {URGENCY_LEVELS.map((u) => (
            <button
              key={u}
              onClick={() => setSelectedUrgency(u)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedUrgency === u
                  ? 'bg-blood-600 text-white shadow-md shadow-blood-950/60'
                  : 'glass-panel text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {u} Urgency
            </button>
          ))}
        </div>

      </div>

      {/* Requests Grid */}
      {filteredRequests.length === 0 ? (
        <div className="glass-panel p-8 sm:p-12 rounded-3xl text-center text-slate-400">
          <AlertCircle className="w-10 h-10 mx-auto text-slate-500 mb-3" />
          <p className="font-semibold text-sm sm:text-base">No blood requests match your filter.</p>
          <p className="text-xs text-slate-500 mt-1">Try changing search query or creating a request.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredRequests.map((req) => (
            <div
              key={req._id}
              className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-white/10 hover:border-blood-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Top Badge & Group */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm ${getUrgencyBadge(req.urgency)}`}>
                    <ShieldAlert className="w-3 h-3" />
                    {req.urgency}
                  </span>

                  <div className="px-2.5 py-1 rounded-xl bg-blood-950 border border-blood-500/40 font-black text-blood-400 text-sm sm:text-base shadow-inner">
                    {req.bloodType} ({req.unitsNeeded} {req.unitsNeeded > 1 ? 'Units' : 'Unit'})
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-100 mb-1 group-hover:text-blood-400 transition-colors">
                  {req.patientName}
                </h3>

                <div className="space-y-2 text-xs text-slate-300 bg-dark-900/60 p-3 rounded-2xl border border-white/5 mt-3">
                  <div className="flex items-center gap-2">
                    <Hospital className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{req.hospital || 'Hospital unspecified'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <a href={`tel:${req.phoneNumber}`} className="text-emerald-400 font-semibold hover:underline">
                      {req.phoneNumber}
                    </a>
                  </div>

                  {req.additionalNotes && (
                    <div className="pt-2 border-t border-white/5 text-slate-400 italic text-[11px] line-clamp-2">
                      "{req.additionalNotes}"
                    </div>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  Active Request
                </span>

                {currentUser && (String(currentUser._id) === String(req.createdBy?._id || req.createdBy)) && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(req)}
                      title="Edit Request"
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(req._id)}
                      title="Delete Request"
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT BLOOD REQUEST MODAL */}
      {(isAddModalOpen || editingRequest) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-dark-900/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg max-h-[90vh] glass-panel-glow rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-blood-500/30 overflow-hidden flex flex-col">
            
            <button
              onClick={() => { setIsAddModalOpen(false); setEditingRequest(null); }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg sm:text-xl font-bold text-slate-100 mb-3 pr-8">
              {editingRequest ? 'Edit Blood Request' : 'Publish Emergency Blood Request'}
            </h2>

            {error && (
              <div className="mb-3 p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={editingRequest ? handleEditSubmit : handleAddSubmit} className="space-y-3 overflow-y-auto pr-1 flex-1">
              
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Patient Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Patient Full Name"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Blood Group *</label>
                  <select
                    value={formData.bloodType}
                    onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bt => (
                      <option key={bt} value={bt} className="bg-dark-900">{bt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Units Needed *</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={formData.unitsNeeded}
                    onChange={(e) => setFormData({ ...formData, unitsNeeded: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Urgency *</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                  >
                    {['Critical', 'High', 'Medium', 'Low'].map(u => (
                      <option key={u} value={u} className="bg-dark-900">{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Hospital / Clinic *</label>
                <input
                  type="text"
                  required
                  placeholder="Hospital Name & City"
                  value={formData.hospital}
                  onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Contact Phone *</label>
                  <input
                    type="number"
                    required
                    placeholder="Mobile number"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Aadhar Number *</label>
                  <input
                    type="number"
                    required
                    placeholder="12 digit aadhar"
                    value={formData.aadharNumber}
                    onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Additional Notes</label>
                <textarea
                  rows="2"
                  placeholder="Room number, requirement details, doctor name..."
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-blood-600 to-blood-500 hover:from-blood-500 text-white font-bold text-sm shadow-lg shadow-blood-900/60 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>{editingRequest ? 'Update Request' : 'Publish Emergency Request'}</span>
                )}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
