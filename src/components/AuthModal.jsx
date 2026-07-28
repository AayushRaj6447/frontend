import React, { useState } from 'react';
import { X, Upload, Mail, Lock, User, Sparkles, AlertTriangle, KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { loginUserApi, registerUserApi, sendOtpApi, forgotPasswordSendOtpApi, resetPasswordApi } from '../services/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, showToast }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [registerStep, setRegisterStep] = useState(1); // 1: form details, 2: otp verification
  const [forgotStep, setForgotStep] = useState(1); // 1: enter email, 2: enter otp & new pass
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login Form State
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // Register Form State
  const [registerData, setRegisterData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    otp: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  if (!isOpen) return null;

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginUserApi(loginData.email, loginData.password);
      showToast('Logged in successfully!', 'success');
      onAuthSuccess(res.data);
      onClose();
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Send Registration OTP
  const handleRequestRegisterOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!registerData.firstName || !registerData.email || !registerData.password) {
      setError('First Name, Email, and Password are required.');
      return;
    }

    if (!avatarFile) {
      setError('Avatar photo image is required.');
      return;
    }

    setLoading(true);

    try {
      await sendOtpApi(registerData.email, 'register');
      showToast(`Verification OTP sent to ${registerData.email}! (Check console in dev mode)`, 'info');
      setRegisterStep(2);
    } catch (err) {
      setError(err.message || 'Failed to send verification OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Complete Registration with OTP
  const handleCompleteRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!registerData.otp || registerData.otp.trim().length !== 6) {
      setError('Please enter the 6-digit OTP code sent to your email.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('firstName', registerData.firstName);
      if (registerData.middleName) formData.append('middleName', registerData.middleName);
      if (registerData.lastName) formData.append('lastName', registerData.lastName);
      formData.append('email', registerData.email);
      formData.append('password', registerData.password);
      formData.append('otp', registerData.otp);
      formData.append('avatar', avatarFile);

      await registerUserApi(formData);
      showToast('Account registered successfully! Please log in.', 'success');
      setMode('login');
      setRegisterStep(1);
      setLoginData({ email: registerData.email, password: '' });
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Step 1: Send Reset OTP
  const handleForgotSendOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!forgotEmail) {
      setError('Please enter your registered email address.');
      return;
    }

    setLoading(true);

    try {
      await forgotPasswordSendOtpApi(forgotEmail);
      showToast(`Password reset OTP sent to ${forgotEmail}`, 'info');
      setForgotStep(2);
    } catch (err) {
      setError(err.message || 'Failed to send reset OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Step 2: Reset Password with OTP
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!forgotOtp || forgotOtp.trim().length !== 6) {
      setError('Please enter the 6-digit reset OTP code.');
      return;
    }

    if (!newPassword || newPassword.length < 4) {
      setError('Please enter a new password.');
      return;
    }

    setLoading(true);

    try {
      await resetPasswordApi(forgotEmail, forgotOtp, newPassword);
      showToast('Password reset successful! You can now log in.', 'success');
      setMode('login');
      setForgotStep(1);
      setLoginData({ email: forgotEmail, password: '' });
    } catch (err) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md glass-panel-glow rounded-3xl p-6 sm:p-8 shadow-2xl border border-blood-500/30 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tabs */}
        <div className="flex items-center justify-center gap-3 border-b border-white/10 pb-4 mb-6">
          <button
            onClick={() => { setMode('login'); setError(''); }}
            className={`text-sm font-bold transition-colors pb-1 border-b-2 ${
              mode === 'login'
                ? 'text-white border-blood-500'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('register'); setRegisterStep(1); setError(''); }}
            className={`text-sm font-bold transition-colors pb-1 border-b-2 ${
              mode === 'register'
                ? 'text-white border-blood-500'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            Create Account (OTP)
          </button>
          <button
            onClick={() => { setMode('forgot'); setForgotStep(1); setError(''); }}
            className={`text-sm font-bold transition-colors pb-1 border-b-2 ${
              mode === 'forgot'
                ? 'text-white border-blood-500'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            Forgot Password
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* MODE 1: LOGIN */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold uppercase text-slate-400">Password</label>
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setForgotStep(1); setError(''); }}
                  className="text-xs text-blood-400 hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-blood-600 to-blood-500 hover:from-blood-500 hover:to-blood-400 text-white font-bold text-sm shadow-lg shadow-blood-900/60 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Sign In to Dashboard
                </>
              )}
            </button>
          </form>
        )}

        {/* MODE 2: REGISTER (STEP 1 & STEP 2) */}
        {mode === 'register' && (
          <div>
            {registerStep === 1 ? (
              <form onSubmit={handleRequestRegisterOtp} className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="John"
                      value={registerData.firstName}
                      onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl glass-input text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Last Name</label>
                    <input
                      type="text"
                      placeholder="Doe"
                      value={registerData.lastName}
                      onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl glass-input text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-sm"
                  />
                </div>

                {/* Avatar Picker */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Avatar Photo *</label>
                  <div className="flex items-center gap-3">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Preview" className="w-10 h-10 rounded-xl object-cover border border-blood-500" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-dark-800 border border-slate-700 flex items-center justify-center text-slate-500">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                    <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-dashed border-blood-500/40 hover:border-blood-500 bg-blood-950/20 text-slate-300 text-xs font-medium">
                      <Upload className="w-4 h-4 text-blood-400" />
                      <span>{avatarFile ? avatarFile.name : 'Choose Avatar Image'}</span>
                      <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-blood-600 to-blood-500 hover:from-blood-500 text-white font-bold text-sm shadow-lg shadow-blood-900/60 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Sending OTP Code...' : 'Next: Send Email OTP'}
                </button>
              </form>
            ) : (
              /* REGISTER STEP 2: ENTER OTP */
              <form onSubmit={handleCompleteRegister} className="space-y-4 animate-fade-in">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blood-950/80 border border-blood-500/40 mx-auto flex items-center justify-center text-blood-400 mb-2">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-100">Enter Security Code</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    We sent a 6-digit OTP code to <span className="text-blood-400 font-semibold">{registerData.email}</span>.
                  </p>
                </div>

                <div>
                  <label className="block text-center text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">6-Digit OTP Code</label>
                  <input
                    type="text"
                    maxLength="6"
                    required
                    placeholder="123456"
                    value={registerData.otp}
                    onChange={(e) => setRegisterData({ ...registerData, otp: e.target.value })}
                    className="w-full text-center text-2xl font-mono tracking-widest py-3 rounded-xl glass-input text-blood-300"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRegisterStep(1)}
                    className="px-4 py-2.5 rounded-xl glass-panel text-slate-300 text-xs font-semibold flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blood-600 to-blood-500 hover:from-blood-500 text-white font-bold text-sm shadow-lg shadow-blood-900/60 disabled:opacity-50"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP & Create Account'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* MODE 3: FORGOT PASSWORD */}
        {mode === 'forgot' && (
          <div>
            {forgotStep === 1 ? (
              <form onSubmit={handleForgotSendOtp} className="space-y-4">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-amber-950/80 border border-amber-500/40 mx-auto flex items-center justify-center text-amber-400 mb-2">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-100">Reset Your Password</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Enter your registered email address to receive a 6-digit password reset code.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blood-600 to-blood-500 hover:from-blood-500 text-white font-bold text-sm shadow-lg shadow-blood-900/60 disabled:opacity-50"
                >
                  {loading ? 'Sending Code...' : 'Send Password Reset Code'}
                </button>
              </form>
            ) : (
              /* FORGOT STEP 2: ENTER RESET OTP & NEW PASSWORD */
              <form onSubmit={handleResetPassword} className="space-y-3 animate-fade-in">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">6-Digit Reset Code *</label>
                  <input
                    type="text"
                    maxLength="6"
                    required
                    placeholder="123456"
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    className="w-full text-center text-xl font-mono tracking-widest py-2 rounded-xl glass-input text-amber-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">New Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-sm"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="px-4 py-2.5 rounded-xl glass-panel text-slate-300 text-xs font-semibold flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blood-600 to-blood-500 hover:from-blood-500 text-white font-bold text-sm shadow-lg shadow-blood-900/60 disabled:opacity-50"
                  >
                    {loading ? 'Resetting...' : 'Reset Password & Sign In'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
