import React, { useState } from 'react';
import { Mail, Lock, User, Upload, Sparkles, KeyRound, ArrowLeft, ShieldCheck, HeartPulse, CheckCircle2, AlertTriangle, Eye, EyeOff, LockKeyhole } from 'lucide-react';
import BloodCellCanvas from './3d/BloodCellCanvas';
import { loginUserApi, registerUserApi, sendOtpApi, forgotPasswordSendOtpApi, resetPasswordApi } from '../services/api';

export default function AuthView({ onAuthSuccess, showToast, onCancel }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [registerStep, setRegisterStep] = useState(1);
  const [forgotStep, setForgotStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Login State
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // Register State
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
      showToast('Welcome back! Sign in successful.', 'success');
      onAuthSuccess(res.data);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestRegisterOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!registerData.firstName || !registerData.email || !registerData.password) {
      setError('First Name, Email, and Password are required.');
      return;
    }

    if (!avatarFile) {
      setError('Please upload an avatar image.');
      return;
    }

    setLoading(true);

    try {
      await sendOtpApi(registerData.email, 'register');
      showToast(`Verification OTP sent to ${registerData.email}!`, 'info');
      setRegisterStep(2);
    } catch (err) {
      setError(err.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!registerData.otp || registerData.otp.trim().length !== 6) {
      setError('Please enter the 6-digit OTP code.');
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
      showToast('Account created! Logging you in...', 'success');

      // Auto login after registration
      const loginRes = await loginUserApi(registerData.email, registerData.password);
      onAuthSuccess(loginRes.data);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSendOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!forgotEmail) {
      setError('Please enter your email.');
      return;
    }

    setLoading(true);

    try {
      await forgotPasswordSendOtpApi(forgotEmail);
      showToast(`Password reset OTP sent to ${forgotEmail}`, 'info');
      setForgotStep(2);
    } catch (err) {
      setError(err.message || 'Failed to send reset code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!forgotOtp || forgotOtp.trim().length !== 6) {
      setError('Please enter the 6-digit reset code.');
      return;
    }

    setLoading(true);

    try {
      await resetPasswordApi(forgotEmail, forgotOtp, newPassword);
      showToast('Password reset successfully! You can now sign in.', 'success');
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
    <div className="min-h-[85vh] flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LEFT COLUMN: 3D Telemetry & Visual Hero */}
        <div className="lg:col-span-6 hidden lg:flex flex-col justify-between h-full p-8 rounded-3xl glass-panel relative overflow-hidden border border-blood-500/20 shadow-2xl">
          
          {/* Background 3D Canvas Embed */}
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <BloodCellCanvas />
          </div>

          <div className="relative z-10 space-y-6">
            
            {/* Top Brand Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blood-950/80 border border-blood-500/40 text-blood-400 text-xs font-extrabold uppercase tracking-wider shadow-lg">
              <HeartPulse className="w-4 h-4 text-blood-500 animate-pulse" />
              <span>HemoVerse 3D Security Portal</span>
            </div>

            <div>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-100 leading-tight">
                Empowering Life-Saving <br />
                <span className="bg-gradient-to-r from-blood-400 via-rose-500 to-amber-400 bg-clip-text text-transparent">
                  Blood Logistics & Donors
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                Connect directly with hospitals, emergency blood request centers, and donors verified in real-time.
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-slate-300 font-medium">
                <div className="w-6 h-6 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span>Mandatory 2-Factor Email OTP Verification</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-300 font-medium">
                <div className="w-6 h-6 rounded-full bg-blood-950/80 border border-blood-500/40 flex items-center justify-center text-blood-400 shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span>Interactive 3D Erythrocyte & Group Telemetry Matrix</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-300 font-medium">
                <div className="w-6 h-6 rounded-full bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <LockKeyhole className="w-3.5 h-3.5" />
                </div>
                <span>JWT Authentication & Cloudinary Photo Storage</span>
              </div>
            </div>

          </div>

          {/* Bottom Live Metric Footer */}
          <div className="relative z-10 pt-8 mt-8 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <div>
              <span className="block font-bold text-slate-200 text-sm">1,250+</span>
              <span>Active Donors</span>
            </div>
            <div>
              <span className="block font-bold text-slate-200 text-sm">45+</span>
              <span>Hospitals Connected</span>
            </div>
            <div>
              <span className="block font-bold text-emerald-400 text-sm">24/7</span>
              <span>Emergency Dispatch</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Dedicated Auth Portal Card */}
        <div className="lg:col-span-6 w-full">
          <div className="glass-panel-glow rounded-3xl p-6 sm:p-10 shadow-2xl border border-blood-500/30 relative overflow-hidden">
            
            {/* Top Navigation Mode Tabs */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => { setMode('login'); setError(''); }}
                  className={`text-base font-bold transition-all pb-1 border-b-2 ${
                    mode === 'login'
                      ? 'text-white border-blood-500'
                      : 'text-slate-400 border-transparent hover:text-slate-200'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setMode('register'); setRegisterStep(1); setError(''); }}
                  className={`text-base font-bold transition-all pb-1 border-b-2 ${
                    mode === 'register'
                      ? 'text-white border-blood-500'
                      : 'text-slate-400 border-transparent hover:text-slate-200'
                  }`}
                >
                  Register (OTP)
                </button>
              </div>

              <button
                onClick={() => { setMode('forgot'); setForgotStep(1); setError(''); }}
                className={`text-xs font-semibold transition-colors ${
                  mode === 'forgot' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Forgot Password?
              </button>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2.5 shadow-lg">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* TAB 1: SIGN IN */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm focus:border-blood-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="w-full pl-10 pr-10 py-3 rounded-xl glass-input text-sm focus:border-blood-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-blood-600 via-blood-500 to-rose-600 hover:from-blood-500 text-white font-extrabold text-sm shadow-xl shadow-blood-950/80 transition-all transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Sign In to Platform
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB 2: REGISTER (2-STEP OTP) */}
            {mode === 'register' && (
              <div>
                {registerStep === 1 ? (
                  <form onSubmit={handleRequestRegisterOtp} className="space-y-3.5">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">First Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="John"
                          value={registerData.firstName}
                          onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">Last Name</label>
                        <input
                          type="text"
                          placeholder="Doe"
                          value={registerData.lastName}
                          onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Password *</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
                      />
                    </div>

                    {/* Avatar Picker */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Avatar Profile Image *</label>
                      <div className="flex items-center gap-3">
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="Avatar" className="w-11 h-11 rounded-xl object-cover border-2 border-blood-500 shadow-md" />
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-dark-800 border border-slate-700 flex items-center justify-center text-slate-500 shrink-0">
                            <User className="w-5 h-5" />
                          </div>
                        )}
                        <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-blood-500/50 hover:border-blood-500 bg-blood-950/20 text-slate-300 text-xs font-semibold">
                          <Upload className="w-4 h-4 text-blood-400" />
                          <span className="truncate">{avatarFile ? avatarFile.name : 'Select Avatar Image'}</span>
                          <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-3 py-3.5 rounded-xl bg-gradient-to-r from-blood-600 to-blood-500 hover:from-blood-500 text-white font-extrabold text-sm shadow-lg shadow-blood-900/60 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? 'Dispatching OTP...' : 'Next: Send 6-Digit Email OTP ➔'}
                    </button>
                  </form>
                ) : (
                  /* STEP 2: VERIFY 6-DIGIT OTP */
                  <form onSubmit={handleCompleteRegister} className="space-y-5 animate-fade-in text-center">
                    <div className="w-14 h-14 rounded-2xl bg-blood-950/90 border border-blood-500/50 mx-auto flex items-center justify-center text-blood-400 shadow-lg">
                      <KeyRound className="w-7 h-7" />
                    </div>

                    <div>
                      <h3 className="text-lg font-extrabold text-slate-100">Verify Email Address</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Enter the 6-digit OTP sent to <span className="text-blood-400 font-bold">{registerData.email}</span>.
                      </p>
                    </div>

                    <div>
                      <input
                        type="text"
                        maxLength="6"
                        required
                        placeholder="123456"
                        value={registerData.otp}
                        onChange={(e) => setRegisterData({ ...registerData, otp: e.target.value })}
                        className="w-full text-center text-3xl font-mono font-black tracking-[0.4em] py-3.5 rounded-xl glass-input text-blood-300 border-blood-500/40"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setRegisterStep(1)}
                        className="px-4 py-3 rounded-xl glass-panel text-slate-300 text-xs font-bold flex items-center gap-1 hover:text-white"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>
                      
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blood-600 to-blood-500 hover:from-blood-500 text-white font-extrabold text-sm shadow-xl shadow-blood-900/60 disabled:opacity-50"
                      >
                        {loading ? 'Verifying...' : 'Verify OTP & Complete Registration'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB 3: FORGOT PASSWORD */}
            {mode === 'forgot' && (
              <div>
                {forgotStep === 1 ? (
                  <form onSubmit={handleForgotSendOtp} className="space-y-4">
                    <div className="text-center">
                      <div className="w-14 h-14 rounded-2xl bg-amber-950/90 border border-amber-500/50 mx-auto flex items-center justify-center text-amber-400 mb-2 shadow-lg">
                        <KeyRound className="w-7 h-7" />
                      </div>
                      <h3 className="text-lg font-extrabold text-slate-100">Password Recovery</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Enter your registered email address to receive a 6-digit password reset code.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          placeholder="you@example.com"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-blood-600 hover:from-amber-500 text-white font-extrabold text-sm shadow-xl shadow-amber-950/60 disabled:opacity-50"
                    >
                      {loading ? 'Sending Code...' : 'Send Password Reset Code'}
                    </button>
                  </form>
                ) : (
                  /* FORGOT STEP 2: ENTER RESET OTP & NEW PASSWORD */
                  <form onSubmit={handleResetPassword} className="space-y-4 animate-fade-in">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">6-Digit Reset Code *</label>
                      <input
                        type="text"
                        maxLength="6"
                        required
                        placeholder="123456"
                        value={forgotOtp}
                        onChange={(e) => setForgotOtp(e.target.value)}
                        className="w-full text-center text-2xl font-mono tracking-widest py-3 rounded-xl glass-input text-amber-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">New Password *</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setForgotStep(1)}
                        className="px-4 py-3 rounded-xl glass-panel text-slate-300 text-xs font-bold flex items-center gap-1 hover:text-white"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blood-600 to-blood-500 hover:from-blood-500 text-white font-extrabold text-sm shadow-xl shadow-blood-900/60 disabled:opacity-50"
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

      </div>
    </div>
  );
}
