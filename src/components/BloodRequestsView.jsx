import React, { useState } from 'react';
import { HeartPulse, Plus, Search, Phone, Hospital, AlertCircle, ShieldAlert, Clock, Trash2, Edit3, X, FileText, CheckCircle, Lock } from 'lucide-react';
import { addBloodRequestApi, editBloodRequestApi, removeBloodRequestApi } from '../services/api';

const URGENCY_LEVELS = ['All', 'Critical', 'High', 'Medium', 'Low'];

// Helper to safely extract user ID regardless of object nesting
const getUserId = (userObj) => {
  if (!userObj) return null;
  if (typeof userObj === 'string') return userObj;
  return userObj._id || userObj.id || userObj.userId || userObj.user?._id || userObj.user?.id || null;
};

// Bulletproof Ownership Checker
const checkIsOwner = (currentUser, item) => {
  if (!currentUser || !item) return false;
  
  const currentUserId = getUserId(currentUser);
  const creatorId = getUserId(item.createdBy) || getUserId(item.user);
  
  // Both IDs MUST exist and MUST NOT be 'undefined' string literal
  if (!currentUserId || !creatorId || String(currentUserId) === 'undefined' || String(creatorId) === 'undefined') {
    return false;
  }
  
  return String(currentUserId) === String(creatorId);
};

export default function BloodRequestsView({ requests = [], onRefresh, currentUser, showToast, onOpenAuth }) {
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
      if (onOpenAuth) onOpenAuth();
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
        return 'bg-rose-500/20 border-rose-500/60 text-rose-500 font-black animate-pulse';
      case 'High':
        return 'bg-amber-500/20 border-amber-500/60 text-amber-500 font-extrabold';
      case 'Medium':
        return 'bg-sky-500/20 border-sky-500/60 text-sky-500 font-extrabold';
      default:
        return 'glass-panel border theme-border theme-text-muted';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-5 sm:p-7 rounded-3xl border theme-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black theme-text-primary flex items-center gap-2.5">
            <HeartPulse className="w-6 h-6 sm:w-7 sm:h-7 text-blood-500 animate-pulse" />
            Emergency Blood Requests Hub
          </h1>
          <p className="text-xs sm:text-sm theme-text-muted mt-1 font-medium">
            Real-time emergency blood requests submitted by critical patients and urgent hospital care units.
          </p>
        </div>

        <button
          onClick={() => {
            if (!currentUser) {
              if (showToast) showToast('Please log in to submit a request.', 'error');
              if (onOpenAuth) onOpenAuth();
              return;
            }
            resetForm();
            setIsAddModalOpen(true);
          }}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blood-600 to-blood-500 hover:from-blood-500 text-white font-black text-sm shadow-lg shadow-blood-900/40 flex items-center justify-center gap-2 transition-all hover-lift active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Blood Request
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 theme-text-muted" />
          <input
            type="text"
            placeholder="Search patient, hospital, group..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl glass-input text-sm font-semibold"
          />
        </div>

        {/* Urgency Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 max-w-full">
          {URGENCY_LEVELS.map((u) => (
            <button
              key={u}
              onClick={() => setSelectedUrgency(u)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all shrink-0 hover-lift ${
                selectedUrgency === u
                  ? 'bg-blood-600 text-white shadow-md shadow-blood-950/50'
                  : 'glass-panel theme-text-muted hover:theme-text-primary hover:bg-blood-500/10'
              }`}
            >
              {u} Urgency
            </button>
          ))}
        </div>

      </div>

      {/* Requests Grid */}
      {filteredRequests.length === 0 ? (
        <div className="glass-panel p-8 sm:p-14 rounded-3xl text-center border theme-border">
          <AlertCircle className="w-12 h-12 mx-auto theme-text-muted mb-3" />
          <p className="font-black text-base sm:text-lg theme-text-primary">No blood requests match your filter.</p>
          <p className="text-xs sm:text-sm theme-text-muted mt-1">Try changing search query or creating a request.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredRequests.map((req) => {
            const isOwner = checkIsOwner(currentUser, req);
            return (
              <div
                key={req._id}
                className="glass-panel rounded-3xl p-5 sm:p-6 border theme-border hover:border-blood-500/50 transition-all hover-lift flex flex-col justify-between group"
              >
                <div>
                  {/* Top Badge & Group */}
                  <div className="flex items-start justify-between gap-2 mb-3.5">
                    <span className={`px-3 py-1 rounded-full border text-[11px] uppercase tracking-wider flex items-center gap-1.5 shadow-sm ${getUrgencyBadge(req.urgency)}`}>
                      <ShieldAlert className="w-3.5 h-3.5" />
                      {req.urgency}
                    </span>

                    <div className="px-3.5 py-1.5 rounded-2xl bg-blood-500/15 border border-blood-500/40 font-black text-blood-500 text-sm sm:text-base shadow-inner">
                      {req.bloodType} ({req.unitsNeeded} {req.unitsNeeded > 1 ? 'Units' : 'Unit'})
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black theme-text-primary mb-1.5 group-hover:text-blood-500 transition-colors">
                    {req.patientName}
                  </h3>

                  <div className="space-y-2.5 text-xs theme-card-sub p-3.5 rounded-2xl border theme-border mt-3.5">
                    <div className="flex items-center gap-2">
                      <Hospital className="w-4 h-4 theme-text-muted shrink-0" />
                      <span className="truncate font-semibold theme-text-primary">{req.hospital || 'Hospital unspecified'}</span>
                    </div>
                    
                    {/* Privacy Contact Phone Number */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Phone className="w-4 h-4 theme-text-muted shrink-0" />
                        {currentUser ? (
                          <a href={`tel:${req.phoneNumber}`} className="text-emerald-500 font-extrabold hover:underline truncate">
                            {req.phoneNumber}
                          </a>
                        ) : (
                          <span className="text-slate-400 font-mono font-bold flex items-center gap-1 truncate" title="Sign in to view contact details">
                            <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                            +91 ••••• •••••
                          </span>
                        )}
                      </div>

                      {!currentUser && (
                        <button
                          onClick={onOpenAuth}
                          className="text-[10px] font-black text-blood-500 hover:underline shrink-0"
                        >
                          Sign In
                        </button>
                      )}
                    </div>

                    {req.additionalNotes && (
                      <div className="pt-2 border-t theme-border theme-text-muted italic text-[11px] line-clamp-2">
                        "{req.additionalNotes}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Bar */}
                <div className="mt-4 pt-3.5 border-t theme-border flex items-center justify-between">
                  <span className="text-[11px] theme-text-muted flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5 theme-text-muted" />
                    Active Emergency Request
                  </span>

                  {/* Edit and Delete Buttons ONLY visible to Authorized Owner */}
                  {isOwner && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(req)}
                        title="Edit Request"
                        className="p-2 theme-text-muted hover:theme-text-primary hover:bg-blood-500/10 rounded-xl transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(req._id)}
                        title="Delete Request"
                        className="p-2 theme-text-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT BLOOD REQUEST MODAL */}
      {(isAddModalOpen || editingRequest) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in-up">
          <div className="relative w-full max-w-lg max-h-[90vh] glass-panel-glow rounded-3xl p-5 sm:p-7 shadow-2xl border theme-border overflow-hidden flex flex-col">
            
            <button
              onClick={() => { setIsAddModalOpen(false); setEditingRequest(null); }}
              className="absolute top-5 right-5 p-2 theme-text-muted hover:theme-text-primary rounded-full hover:bg-blood-500/10"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl sm:text-2xl font-black theme-text-primary mb-4 pr-8">
              {editingRequest ? 'Edit Blood Request' : 'Publish Emergency Blood Request'}
            </h2>

            {error && (
              <div className="mb-3 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-500 text-xs font-bold">
                {error}
              </div>
            )}

            <form onSubmit={editingRequest ? handleEditSubmit : handleAddSubmit} className="space-y-3.5 overflow-y-auto pr-1 flex-1">
              
              <div>
                <label className="block text-xs font-black uppercase theme-text-muted mb-1">Patient Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Patient Full Name"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-xs font-black uppercase theme-text-muted mb-1">Blood Group *</label>
                  <select
                    value={formData.bloodType}
                    onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-2xl glass-input text-xs font-bold"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bt => (
                      <option key={bt} value={bt} className="theme-card">{bt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase theme-text-muted mb-1">Units Needed *</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={formData.unitsNeeded}
                    onChange={(e) => setFormData({ ...formData, unitsNeeded: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2.5 rounded-2xl glass-input text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase theme-text-muted mb-1">Urgency *</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-2xl glass-input text-xs font-bold"
                  >
                    {['Critical', 'High', 'Medium', 'Low'].map(u => (
                      <option key={u} value={u} className="theme-card">{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase theme-text-muted mb-1">Hospital / Clinic *</label>
                <input
                  type="text"
                  required
                  placeholder="Hospital Name & City"
                  value={formData.hospital}
                  onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-black uppercase theme-text-muted mb-1">Contact Phone *</label>
                  <input
                    type="number"
                    required
                    placeholder="Mobile number"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase theme-text-muted mb-1">Aadhar Number *</label>
                  <input
                    type="number"
                    required
                    placeholder="12 digit aadhar"
                    value={formData.aadharNumber}
                    onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase theme-text-muted mb-1">Additional Notes</label>
                <textarea
                  rows="2"
                  placeholder="Room number, requirement details, doctor name..."
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs font-semibold"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-3.5 rounded-2xl bg-gradient-to-r from-blood-600 to-blood-500 hover:from-blood-500 text-white font-black text-sm shadow-lg shadow-blood-900/40 hover-lift disabled:opacity-50 flex items-center justify-center gap-2"
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
