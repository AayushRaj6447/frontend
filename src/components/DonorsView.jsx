import React, { useState } from 'react';
import { Search, Plus, UserPlus, Phone, Mail, MapPin, Hospital, Calendar, Trash2, Edit3, X, Upload, AlertCircle, ShieldCheck, Eye, Lock } from 'lucide-react';
import { addDonorApi, editDonorApi, removeDonorApi } from '../services/api';

const BLOOD_GROUPS = ['All', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export default function DonorsView({ donors = [], onRefresh, currentUser, showToast, onOpenAuth }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('All');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDonor, setEditingDonor] = useState(null);
  const [viewingDonor, setViewingDonor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Add Donor Form State
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    Gender: 'Male',
    bloodType: 'O+',
    weight: '65',
    lastDonationDate: '',
    aadhar: '',
    fullAddress: '',
    prefferedHospital: '',
    email: '',
    phoneNumber: '',
  });
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!currentUser) {
      if (showToast) showToast('Please log in first to add a donor.', 'error');
      if (onOpenAuth) onOpenAuth();
      return;
    }

    if (!profilePhotoFile) {
      setError('Profile photo image is required.');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      data.append('profilePhoto', profilePhotoFile);

      await addDonorApi(data);
      if (showToast) showToast('Donor registered successfully!', 'success');
      setIsAddModalOpen(false);
      resetForm();
      onRefresh();
    } catch (err) {
      setError(err.message || 'Failed to add donor.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await editDonorApi(editingDonor._id, formData);
      if (showToast) showToast('Donor details updated!', 'success');
      setEditingDonor(null);
      resetForm();
      onRefresh();
    } catch (err) {
      setError(err.message || 'Failed to update donor.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (donorId) => {
    if (!window.confirm('Are you sure you want to remove this donor?')) return;
    try {
      await removeDonorApi(donorId);
      if (showToast) showToast('Donor removed successfully.', 'success');
      onRefresh();
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to remove donor.', 'error');
    }
  };

  const openEditModal = (donor) => {
    setEditingDonor(donor);
    setFormData({
      firstName: donor.firstName || '',
      middleName: donor.middleName || '',
      lastName: donor.lastName || '',
      dateOfBirth: donor.dateOfBirth ? donor.dateOfBirth.split('T')[0] : '',
      Gender: donor.Gender || 'Male',
      bloodType: donor.bloodType || 'O+',
      weight: donor.weight || '',
      lastDonationDate: donor.lastDonationDate || '',
      aadhar: donor.aadhar || '',
      fullAddress: donor.fullAddress || '',
      prefferedHospital: donor.prefferedHospital || '',
      email: donor.email || '',
      phoneNumber: donor.phoneNumber || '',
    });
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: '',
      Gender: 'Male',
      bloodType: 'O+',
      weight: '65',
      lastDonationDate: '',
      aadhar: '',
      fullAddress: '',
      prefferedHospital: '',
      email: '',
      phoneNumber: '',
    });
    setProfilePhotoFile(null);
    setPhotoPreview(null);
  };

  // Filter donors
  const filteredDonors = donors.filter((donor) => {
    const matchesGroup = selectedBloodGroup === 'All' || donor.bloodType === selectedBloodGroup;
    const fullName = `${donor.firstName || ''} ${donor.lastName || ''}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      (donor.fullAddress && donor.fullAddress.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (donor.email && donor.email.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesGroup && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in-up pb-12">
      
      {/* Top Title & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-5 sm:p-7 rounded-3xl border theme-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black theme-text-primary flex items-center gap-2.5">
            <UserPlus className="w-6 h-6 sm:w-7 sm:h-7 text-blood-500" />
            Registered Donors Directory
          </h1>
          <p className="text-xs sm:text-sm theme-text-muted mt-1 font-medium">
            Browse verified blood donors, view donor profiles, or register a new donor.
          </p>
        </div>

        <button
          onClick={() => {
            if (!currentUser) {
              if (showToast) showToast('Please log in to add a donor.', 'error');
              if (onOpenAuth) onOpenAuth();
              return;
            }
            resetForm();
            setIsAddModalOpen(true);
          }}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blood-600 to-blood-500 hover:from-blood-500 text-white font-black text-sm shadow-lg shadow-blood-900/40 flex items-center justify-center gap-2 transition-all hover-lift active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add New Donor
        </button>
      </div>

      {/* Search & Blood Group Pills */}
      <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 theme-text-muted" />
          <input
            type="text"
            placeholder="Search name, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl glass-input text-sm font-semibold"
          />
        </div>

        {/* Blood Group Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 max-w-full">
          {BLOOD_GROUPS.map((bg) => (
            <button
              key={bg}
              onClick={() => setSelectedBloodGroup(bg)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all shrink-0 hover-lift ${
                selectedBloodGroup === bg
                  ? 'bg-blood-600 text-white shadow-md shadow-blood-950/50'
                  : 'glass-panel theme-text-muted hover:theme-text-primary hover:bg-blood-500/10'
              }`}
            >
              {bg}
            </button>
          ))}
        </div>

      </div>

      {/* Donors Grid */}
      {filteredDonors.length === 0 ? (
        <div className="glass-panel p-8 sm:p-14 rounded-3xl text-center border theme-border">
          <AlertCircle className="w-12 h-12 mx-auto theme-text-muted mb-3" />
          <p className="font-black text-base sm:text-lg theme-text-primary">No donors match your search or filter.</p>
          <p className="text-xs sm:text-sm theme-text-muted mt-1">Try selecting 'All' blood groups or registering a new donor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredDonors.map((donor) => {
            const isOwner = currentUser && String(currentUser._id) === String(donor.createdBy?._id || donor.createdBy);
            return (
              <div
                key={donor._id}
                className="glass-panel rounded-3xl p-5 sm:p-6 border theme-border hover:border-blood-500/50 transition-all hover-lift flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      {donor.profilePhoto ? (
                        <img
                          src={donor.profilePhoto}
                          alt={donor.firstName}
                          className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl object-cover border-2 border-blood-500/40 shrink-0 shadow-md"
                        />
                      ) : (
                        <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-blood-500/20 border border-blood-500/30 flex items-center justify-center font-black text-blood-500 text-lg shrink-0">
                          {donor.firstName?.[0] || 'D'}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-black theme-text-primary text-base sm:text-lg group-hover:text-blood-500 transition-colors truncate">
                          {donor.firstName} {donor.middleName ? donor.middleName + ' ' : ''}{donor.lastName}
                        </h3>
                        <div className="text-xs theme-text-muted flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 theme-text-muted shrink-0" />
                          <span className="truncate">{donor.fullAddress || 'Address unspecified'}</span>
                        </div>
                      </div>
                    </div>

                    <span className="px-3 py-1.5 rounded-2xl bg-blood-500/15 border border-blood-500/40 font-black text-blood-500 text-xs sm:text-sm shadow-inner shrink-0">
                      {donor.bloodType}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs theme-card-sub p-3.5 rounded-2xl border theme-border">
                    <div className="flex items-center justify-between">
                      <span className="theme-text-muted font-medium">Gender / Weight:</span>
                      <span className="font-bold theme-text-primary">{donor.Gender}, {donor.weight} kg</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="theme-text-muted font-medium">Hospital:</span>
                      <span className="font-bold theme-text-primary truncate max-w-[150px]">{donor.prefferedHospital || 'N/A'}</span>
                    </div>

                    {/* Phone Number Display Privacy Rule */}
                    <div className="flex items-center justify-between">
                      <span className="theme-text-muted font-medium">Phone:</span>
                      {currentUser ? (
                        <a href={`tel:${donor.phoneNumber}`} className="text-emerald-500 hover:underline font-extrabold flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {donor.phoneNumber}
                        </a>
                      ) : (
                        <span className="text-slate-400 font-mono font-bold flex items-center gap-1" title="Sign in to view contact details">
                          <Lock className="w-3 h-3 text-amber-500" />
                          +91 ••••• •••••
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons Bar */}
                <div className="mt-4 pt-3.5 border-t theme-border flex items-center justify-between">
                  <button
                    onClick={() => setViewingDonor(donor)}
                    className="px-3 py-1.5 rounded-xl bg-blood-500/10 hover:bg-blood-500/20 border border-blood-500/30 text-blood-500 text-xs font-black flex items-center gap-1.5 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Profile
                  </button>

                  {/* Edit and Delete Buttons ONLY visible to Authorized Owner */}
                  {isOwner && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(donor)}
                        title="Edit Donor"
                        className="p-2 theme-text-muted hover:theme-text-primary hover:bg-blood-500/10 rounded-xl transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(donor._id)}
                        title="Delete Donor"
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

      {/* DONOR PROFILE DETAIL MODAL (Available to all loggers) */}
      {viewingDonor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in-up">
          <div className="relative w-full max-w-md glass-panel-glow rounded-3xl p-6 sm:p-7 shadow-2xl border theme-border overflow-hidden flex flex-col space-y-5">
            
            <button
              onClick={() => setViewingDonor(null)}
              className="absolute top-5 right-5 p-2 theme-text-muted hover:theme-text-primary rounded-full hover:bg-blood-500/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 border-b theme-border pb-4">
              {viewingDonor.profilePhoto ? (
                <img src={viewingDonor.profilePhoto} alt={viewingDonor.firstName} className="w-16 h-16 rounded-2xl object-cover border-2 border-blood-500 shadow-md shrink-0" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-blood-500/20 border border-blood-500/40 flex items-center justify-center font-black text-blood-500 text-2xl shrink-0">
                  {viewingDonor.firstName?.[0] || 'D'}
                </div>
              )}
              <div>
                <h3 className="text-xl font-black theme-text-primary">
                  {viewingDonor.firstName} {viewingDonor.middleName ? viewingDonor.middleName + ' ' : ''}{viewingDonor.lastName}
                </h3>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blood-500/15 border border-blood-500/40 text-blood-500 text-xs font-black mt-1">
                  <span>Group: {viewingDonor.bloodType}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between py-1.5 border-b theme-border">
                <span className="theme-text-muted font-bold">Gender & Weight:</span>
                <span className="theme-text-primary font-extrabold">{viewingDonor.Gender}, {viewingDonor.weight} kg</span>
              </div>
              <div className="flex justify-between py-1.5 border-b theme-border">
                <span className="theme-text-muted font-bold">Preferred Hospital:</span>
                <span className="theme-text-primary font-extrabold truncate max-w-[200px]">{viewingDonor.prefferedHospital || 'Unspecified'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b theme-border">
                <span className="theme-text-muted font-bold">Full Address:</span>
                <span className="theme-text-primary font-extrabold truncate max-w-[200px]">{viewingDonor.fullAddress || 'Unspecified'}</span>
              </div>

              {/* Privacy Contact Info */}
              <div className="py-2.5 px-3.5 rounded-2xl theme-card-sub border theme-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="theme-text-muted font-bold flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> Phone:
                  </span>
                  {currentUser ? (
                    <a href={`tel:${viewingDonor.phoneNumber}`} className="text-emerald-500 font-black hover:underline">
                      {viewingDonor.phoneNumber}
                    </a>
                  ) : (
                    <span className="text-slate-400 font-mono font-bold">
                      +91 ••••• •••••
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="theme-text-muted font-bold flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" /> Email:
                  </span>
                  {currentUser ? (
                    <a href={`mailto:${viewingDonor.email}`} className="text-blood-500 font-black hover:underline truncate max-w-[180px]">
                      {viewingDonor.email}
                    </a>
                  ) : (
                    <span className="text-slate-400 font-mono font-bold">
                      •••••@••••.com
                    </span>
                  )}
                </div>
              </div>

              {!currentUser && (
                <div className="pt-2 text-center">
                  <button
                    onClick={() => { setViewingDonor(null); if (onOpenAuth) onOpenAuth(); }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-blood-600 to-blood-500 text-white font-black text-xs shadow-lg flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Sign In to Unlock Phone & Email Details
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ADD / EDIT DONOR MODAL (Only available to creator/logged-in users) */}
      {(isAddModalOpen || editingDonor) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in-up">
          <div className="relative w-full max-w-xl max-h-[90vh] glass-panel-glow rounded-3xl p-5 sm:p-7 shadow-2xl border theme-border overflow-hidden flex flex-col">
            
            <button
              onClick={() => { setIsAddModalOpen(false); setEditingDonor(null); }}
              className="absolute top-5 right-5 p-2 theme-text-muted hover:theme-text-primary rounded-full hover:bg-blood-500/10"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl sm:text-2xl font-black theme-text-primary mb-4 pr-8">
              {editingDonor ? 'Edit Donor Information' : 'Register New Blood Donor'}
            </h2>

            {error && (
              <div className="mb-3 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-500 text-xs font-bold">
                {error}
              </div>
            )}

            <form onSubmit={editingDonor ? handleEditSubmit : handleAddSubmit} className="space-y-3.5 overflow-y-auto pr-1 flex-1">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-black uppercase theme-text-muted mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase theme-text-muted mb-1">Middle Name</label>
                  <input
                    type="text"
                    value={formData.middleName}
                    onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase theme-text-muted mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-black uppercase theme-text-muted mb-1">Blood Type *</label>
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
                  <label className="block text-[11px] font-black uppercase theme-text-muted mb-1">Gender *</label>
                  <select
                    value={formData.Gender}
                    onChange={(e) => setFormData({ ...formData, Gender: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-2xl glass-input text-xs font-bold"
                  >
                    <option value="Male" className="theme-card">Male</option>
                    <option value="Female" className="theme-card">Female</option>
                    <option value="Other" className="theme-card">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase theme-text-muted mb-1">Weight (kg) *</label>
                  <input
                    type="number"
                    required
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-black uppercase theme-text-muted mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase theme-text-muted mb-1">Aadhar Number *</label>
                  <input
                    type="number"
                    required
                    placeholder="12 digit aadhar"
                    value={formData.aadhar}
                    onChange={(e) => setFormData({ ...formData, aadhar: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-black uppercase theme-text-muted mb-1">Phone Number *</label>
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
                  <label className="block text-[11px] font-black uppercase theme-text-muted mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="donor@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase theme-text-muted mb-1">Full Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Street, City, Pin Code"
                  value={formData.fullAddress}
                  onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase theme-text-muted mb-1">Preferred Hospital / Clinic</label>
                <input
                  type="text"
                  placeholder="Hospital name"
                  value={formData.prefferedHospital}
                  onChange={(e) => setFormData({ ...formData, prefferedHospital: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs font-semibold"
                />
              </div>

              {!editingDonor && (
                <div>
                  <label className="block text-[11px] font-black uppercase theme-text-muted mb-1">Profile Photo Image *</label>
                  <div className="flex items-center gap-3">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-10 h-10 rounded-2xl object-cover border border-blood-500 shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-2xl glass-panel border theme-border flex items-center justify-center theme-text-muted shrink-0">
                        <Upload className="w-5 h-5" />
                      </div>
                    )}
                    <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl border border-dashed border-blood-500/40 hover:border-blood-500 bg-blood-500/10 theme-text-secondary text-xs font-extrabold truncate">
                      <span className="truncate">{profilePhotoFile ? profilePhotoFile.name : 'Choose Photo File'}</span>
                      <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                    </label>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-3.5 rounded-2xl bg-gradient-to-r from-blood-600 to-blood-500 hover:from-blood-500 text-white font-black text-sm shadow-lg shadow-blood-900/40 hover-lift disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>{editingDonor ? 'Update Donor Info' : 'Submit & Add Donor'}</span>
                )}
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
