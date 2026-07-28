import React, { useState } from 'react';
import { Search, Plus, UserPlus, Phone, Mail, MapPin, Hospital, Calendar, Trash2, Edit3, X, Upload, AlertCircle, ShieldCheck } from 'lucide-react';
import { addDonorApi, editDonorApi, removeDonorApi, sendDonorOtpApi } from '../services/api';

const BLOOD_GROUPS = ['All', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export default function DonorsView({ donors = [], onRefresh, currentUser, showToast }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('All');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDonor, setEditingDonor] = useState(null);
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
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  const handleSendDonorOtp = async () => {
    if (!formData.email) {
      setError('Please enter donor email first.');
      return;
    }
    setError('');
    setSendingOtp(true);
    try {
      await sendDonorOtpApi(formData.email);
      showToast(`Donor OTP code sent to ${formData.email}!`, 'info');
      setOtpSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send donor OTP.');
    } finally {
      setSendingOtp(false);
    }
  };

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
      showToast('Please log in first to add a donor.', 'error');
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
      showToast('Donor registered successfully!', 'success');
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
      showToast('Donor details updated!', 'success');
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
      showToast('Donor removed successfully.', 'success');
      onRefresh();
    } catch (err) {
      showToast(err.message || 'Failed to remove donor.', 'error');
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
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Top Title & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-blood-500" />
            Registered Donors Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse active blood donors, search by location/blood group, or register a new donor.
          </p>
        </div>

        <button
          onClick={() => {
            if (!currentUser) {
              showToast('Please log in to add a donor.', 'error');
              return;
            }
            resetForm();
            setIsAddModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blood-600 to-blood-500 hover:from-blood-500 text-white font-bold text-sm shadow-lg shadow-blood-950/80 flex items-center gap-2 transition-all transform active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add New Donor
        </button>
      </div>

      {/* Search & Blood Group Pills */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, location, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
          />
        </div>

        {/* Blood Group Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {BLOOD_GROUPS.map((bg) => (
            <button
              key={bg}
              onClick={() => setSelectedBloodGroup(bg)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedBloodGroup === bg
                  ? 'bg-blood-600 text-white shadow-md shadow-blood-950/60'
                  : 'glass-panel text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {bg}
            </button>
          ))}
        </div>

      </div>

      {/* Donors Grid */}
      {filteredDonors.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center text-slate-400">
          <AlertCircle className="w-10 h-10 mx-auto text-slate-500 mb-3" />
          <p className="font-semibold">No donors match your search or filter.</p>
          <p className="text-xs text-slate-500 mt-1">Try selecting 'All' blood groups or adding a new donor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonors.map((donor) => (
            <div
              key={donor._id}
              className="glass-panel rounded-3xl p-5 border border-white/10 hover:border-blood-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    {donor.profilePhoto ? (
                      <img
                        src={donor.profilePhoto}
                        alt={donor.firstName}
                        className="w-12 h-12 rounded-2xl object-cover border border-blood-500/40"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-blood-950 border border-blood-500/30 flex items-center justify-center font-bold text-blood-300 text-base">
                        {donor.firstName?.[0] || 'D'}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-slate-100 text-base group-hover:text-blood-400 transition-colors">
                        {donor.firstName} {donor.middleName ? donor.middleName + ' ' : ''}{donor.lastName}
                      </h3>
                      <div className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate max-w-[160px]">{donor.fullAddress || 'Address not provided'}</span>
                      </div>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-xl bg-blood-950/80 border border-blood-500/40 font-black text-blood-400 text-sm shadow-inner">
                    {donor.bloodType}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-300 bg-dark-900/60 p-3 rounded-2xl border border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Gender / Weight:</span>
                    <span className="font-semibold">{donor.Gender}, {donor.weight} kg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Hospital:</span>
                    <span className="font-semibold truncate max-w-[140px]">{donor.prefferedHospital || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Phone:</span>
                    <a href={`tel:${donor.phoneNumber}`} className="text-emerald-400 hover:underline font-semibold flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {donor.phoneNumber}
                    </a>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  Verified Donor
                </span>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(donor)}
                    title="Edit Donor"
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(donor._id)}
                    title="Delete Donor"
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT DONOR MODAL */}
      {(isAddModalOpen || editingDonor) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl glass-panel-glow rounded-3xl p-6 sm:p-8 shadow-2xl border border-blood-500/30 overflow-hidden">
            
            <button
              onClick={() => { setIsAddModalOpen(false); setEditingDonor(null); }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-100 mb-4">
              {editingDonor ? 'Edit Donor Information' : 'Register New Blood Donor'}
            </h2>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={editingDonor ? handleEditSubmit : handleAddSubmit} className="space-y-3 max-h-[75vh] overflow-y-auto pr-1">
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Middle Name</label>
                  <input
                    type="text"
                    value={formData.middleName}
                    onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Blood Type *</label>
                  <select
                    value={formData.bloodType}
                    onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bt => (
                      <option key={bt} value={bt} className="bg-dark-900">{bt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Gender *</label>
                  <select
                    value={formData.Gender}
                    onChange={(e) => setFormData({ ...formData, Gender: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  >
                    <option value="Male" className="bg-dark-900">Male</option>
                    <option value="Female" className="bg-dark-900">Female</option>
                    <option value="Other" className="bg-dark-900">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Weight (kg) *</label>
                  <input
                    type="number"
                    required
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Aadhar Number *</label>
                  <input
                    type="number"
                    required
                    placeholder="12 digit aadhar"
                    value={formData.aadhar}
                    onChange={(e) => setFormData({ ...formData, aadhar: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Phone Number *</label>
                  <input
                    type="number"
                    required
                    placeholder="Mobile number"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="donor@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Full Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Street, City, Pin Code"
                  value={formData.fullAddress}
                  onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Preferred Hospital / Clinic</label>
                <input
                  type="text"
                  placeholder="Hospital name"
                  value={formData.prefferedHospital}
                  onChange={(e) => setFormData({ ...formData, prefferedHospital: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
              </div>

              {!editingDonor && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Profile Photo Image *</label>
                  <div className="flex items-center gap-3">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-10 h-10 rounded-xl object-cover border border-blood-500" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-dark-800 border border-slate-700 flex items-center justify-center text-slate-500">
                        <Upload className="w-5 h-5" />
                      </div>
                    )}
                    <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-dashed border-blood-500/40 hover:border-blood-500 bg-blood-950/20 text-slate-300 text-xs font-medium">
                      <span>{profilePhotoFile ? profilePhotoFile.name : 'Choose Photo File'}</span>
                      <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                    </label>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 py-2.5 rounded-xl bg-gradient-to-r from-blood-600 to-blood-500 hover:from-blood-500 text-white font-bold text-sm shadow-lg shadow-blood-900/60 disabled:opacity-50"
              >
                {loading ? 'Processing...' : (editingDonor ? 'Update Donor Info' : 'Submit & Add Donor')}
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
