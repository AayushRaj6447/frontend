import React, { useState } from 'react';
import { Mail, Lock, User, Upload, Sparkles, KeyRound, ArrowLeft, ShieldCheck, HeartPulse, AlertTriangle, Eye, EyeOff, LockKeyhole, Droplet, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { loginUserApi, registerUserApi, sendOtpApi, forgotPasswordSendOtpApi, resetPasswordApi } from '../services/api';

export default function AuthView({ onAuthSuccess, showToast }) {
  const [isFlipped, setIsFlipped] = useState(false); // false = Sign In (Front), true = Register (Back)
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [registerStep, setRegisterStep] = useState(1);
  const [forgotStep, setForgotStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sign In State
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
      if (showToast) showToast('Welcome back! Sign in successful.', 'success');
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
      setError('Please upload a profile avatar image.');
      return;
    }

    setLoading(true);

    try {
      await sendOtpApi(registerData.email, 'register');
      if (showToast) showToast(`Verification OTP code sent to ${registerData.email}!`, 'info');
      setRegisterStep(2);
    } catch (err) {
      console.error('OTP request error:', err);
      setError(err.message || 'Failed to send verification OTP.');
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
      formData.append('otp', registerData.otp.trim());
      formData.append('avatar', avatarFile);

      await registerUserApi(formData);
      if (showToast) showToast('Account created! Signing you in...', 'success');

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
      setError('Please enter your registered email address.');
      return;
    }

    setLoading(true);

    try {
      await forgotPasswordSendOtpApi(forgotEmail);
      if (showToast) showToast(`Password reset OTP code sent to ${forgotEmail}`, 'info');
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
      await resetPasswordApi(forgotEmail, forgotOtp.trim(), newPassword);
      if (showToast) showToast('Password reset successfully! You can now sign in.', 'success');
      setIsForgotMode(false);
      setForgotStep(1);
      setLoginData({ email: forgotEmail, password: '' });
    } catch (err) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[82vh] flex items-center justify-center py-6 px-2 sm:px-4">
      <div className="w-full max-w-4xl perspective-container">
        
        {/* 3D Animated Flip Container */}
        <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
          
          {/* ========================================================================= */}
          {/* FRONT SIDE: SIGN IN PORTAL */}
          {/* ========================================================================= */}
          <div className="flip-card-front">
            <div className="glass-panel-glow rounded-3xl overflow-hidden shadow-2xl border border-blood-500/30 grid grid-cols-1 md:grid-cols-12 min-h-[520px]">
              
              {/* Left Sub-Pane: Register Promo Banner */}
              <div className="md:col-span-5 bg-gradient-to-br from-blood-800 via-blood-900 to-dark-950 p-8 flex flex-col justify-between text-white relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                    <HeartPulse className="w-4 h-4 text-rose-300 animate-pulse" />
                    <span>HemoVerse Network</span>
                  </div>

                  <h2 className="text-3xl font-black leading-tight tracking-tight">
                    Don't Have an Account Yet?
                  </h2>

                  <p className="text-xs text-rose-100/80 leading-relaxed font-normal">
                    Join our emergency blood logistics network. Register as a donor or patient to post & fulfill emergency requests instantly.
                  </p>
                </div>

                <div className="relative z-10 pt-6">
                  <button
                    type="button"
                    onClick={() => { setIsFlipped(true); setIsForgotMode(false); setError(''); }}
                    className="w-full py-3.5 px-6 rounded-2xl bg-white text-blood-900 font-extrabold text-sm shadow-xl hover:bg-slate-100 transition-all transform active:scale-95 flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Register Account ➔
                  </button>
                </div>
              </div>

              {/* Right Sub-Pane: Sign In Form Credentials */}
              <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
                    <div>
                      <h2 className="text-2xl font-black text-slate-100">
                        {isForgotMode ? 'Password Reset' : 'Sign In to Portal'}
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        {isForgotMode ? 'Recover your account access' : 'Enter your registered credentials to manage requests.'}
                      </p>
                    </div>

                    {!isForgotMode && (
                      <button
                        type="button"
                        onClick={() => { setIsForgotMode(true); setError(''); }}
                        className="text-xs font-bold text-blood-400 hover:underline"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>

                  {error && (
                    <div className="mb-4 p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {!isForgotMode ? (
                    /* SIGN IN FORM */
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-extrabold uppercase text-slate-400 mb-1.5">Email Address *</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                          <input
                            type="email"
                            required
                            placeholder="user@example.com"
                            value={loginData.email}
                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold uppercase text-slate-400 mb-1.5">Password *</label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            placeholder="••••••••"
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            className="w-full pl-10 pr-10 py-3 rounded-xl glass-input text-sm font-medium"
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
                        className="w-full mt-4 py-3.5 rounded-2xl bg-gradient-to-r from-blood-600 to-blood-500 hover:from-blood-500 text-white font-black text-sm shadow-xl shadow-blood-950/80 transition-all transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <LogIn className="w-4 h-4" />
                            Sign In Now
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    /* FORGOT PASSWORD FORM */
                    <div>
                      {forgotStep === 1 ? (
                        <form onSubmit={handleForgotSendOtp} className="space-y-4">
                          <div>
                            <label className="block text-xs font-extrabold uppercase text-slate-400 mb-1.5">Registered Email Address</label>
                            <input
                              type="email"
                              required
                              placeholder="user@example.com"
                              value={forgotEmail}
                              onChange={(e) => setForgotEmail(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl glass-input text-sm font-medium"
                            />
                          </div>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setIsForgotMode(false)}
                              className="px-4 py-3 rounded-xl glass-panel text-slate-300 text-xs font-extrabold hover:text-white"
                            >
                              Back
                            </button>
                            <button
                              type="submit"
                              disabled={loading}
                              className="flex-1 py-3.5 rounded-xl bg-blood-600 text-white font-extrabold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2"
                            >
                              {loading ? 'Sending OTP...' : 'Send Reset Code'}
                            </button>
                          </div>
                        </form>
                      ) : (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                          <div>
                            <label className="block text-xs font-extrabold text-slate-400 mb-1">6-Digit Reset Code *</label>
                            <input
                              type="text"
                              maxLength="6"
                              required
                              placeholder="123456"
                              value={forgotOtp}
                              onChange={(e) => setForgotOtp(e.target.value)}
                              className="w-full text-center text-xl font-mono tracking-widest py-2.5 rounded-xl glass-input text-amber-400"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-extrabold text-slate-400 mb-1">New Password *</label>
                            <input
                              type="password"
                              required
                              placeholder="••••••••"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                            />
                          </div>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setForgotStep(1)}
                              className="px-4 py-3 rounded-xl glass-panel text-slate-300 text-xs font-extrabold hover:text-white"
                            >
                              Back
                            </button>
                            <button
                              type="submit"
                              disabled={loading}
                              className="flex-1 py-3.5 rounded-xl bg-blood-600 text-white font-extrabold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2"
                            >
                              {loading ? 'Resetting...' : 'Reset & Sign In'}
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

          {/* ========================================================================= */}
          {/* BACK SIDE: REGISTER PORTAL (FLIPPED 180 DEG) */}
          {/* ========================================================================= */}
          <div className="flip-card-back">
            <div className="glass-panel-glow rounded-3xl overflow-hidden shadow-2xl border border-blood-500/30 grid grid-cols-1 md:grid-cols-12 min-h-[520px]">
              
              {/* Left Sub-Pane: Credentials Form for Registration */}
              <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between order-2 md:order-1">
                <div>
                  <div className="mb-4 pb-3 border-b border-white/10">
                    <h2 className="text-2xl font-black text-slate-100">Create New Account</h2>
                    <p className="text-xs text-slate-400 mt-1">Register to start requesting and donating blood.</p>
                  </div>

                  {error && (
                    <div className="mb-3 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {registerStep === 1 ? (
                    <form onSubmit={handleRequestRegisterOtp} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-xs font-extrabold text-slate-400 mb-1">First Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="John"
                            value={registerData.firstName}
                            onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-extrabold text-slate-400 mb-1">Last Name</label>
                          <input
                            type="text"
                            placeholder="Doe"
                            value={registerData.lastName}
                            onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-slate-400 mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="john@example.com"
                          value={registerData.email}
                          onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-slate-400 mb-1">Password *</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={registerData.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-medium"
                        />
                      </div>

                      {/* Avatar Upload */}
                      <div>
                        <label className="block text-xs font-extrabold text-slate-400 mb-1">Profile Photo *</label>
                        <div className="flex items-center gap-3">
                          {avatarPreview ? (
                            <img src={avatarPreview} alt="Avatar" className="w-10 h-10 rounded-xl object-cover border-2 border-blood-500 shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-dark-800 border border-slate-700 flex items-center justify-center text-slate-500 shrink-0">
                              <User className="w-5 h-5" />
                            </div>
                          )}
                          <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-dashed border-blood-500/50 hover:border-blood-500 bg-blood-950/20 text-slate-300 text-xs font-bold truncate">
                            <Upload className="w-4 h-4 text-blood-400 shrink-0" />
                            <span className="truncate">{avatarFile ? avatarFile.name : 'Choose Avatar Image'}</span>
                            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                          </label>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-3 py-3 rounded-2xl bg-gradient-to-r from-blood-600 to-blood-500 text-white font-black text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2"
                      >
                        {loading ? 'Sending OTP Code...' : 'Send 6-Digit Email OTP ➔'}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleCompleteRegister} className="space-y-4 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-blood-950/90 border border-blood-500/50 mx-auto flex items-center justify-center text-blood-400 shadow-lg">
                        <KeyRound className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-100">Verify Email Address</h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Enter the 6-digit OTP code sent to <strong className="text-blood-400">{registerData.email}</strong>
                        </p>
                      </div>
                      <input
                        type="text"
                        maxLength="6"
                        required
                        placeholder="123456"
                        value={registerData.otp}
                        onChange={(e) => setRegisterData({ ...registerData, otp: e.target.value })}
                        className="w-full text-center text-2xl font-mono font-black tracking-widest py-3 rounded-xl glass-input text-blood-300"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setRegisterStep(1)}
                          className="px-4 py-2.5 rounded-xl glass-panel text-xs font-extrabold text-slate-300 hover:text-white"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 py-3 rounded-xl bg-blood-600 text-white font-black text-xs shadow-lg"
                        >
                          {loading ? 'Verifying...' : 'Verify OTP & Register'}
                        </button>
                      </div>
                    </form>
                  )}

                </div>
              </div>

              {/* Right Sub-Pane: Already Have Account Promo Banner */}
              <div className="md:col-span-5 bg-gradient-to-bl from-blood-900 via-blood-950 to-dark-950 p-8 flex flex-col justify-between text-white relative overflow-hidden order-1 md:order-2">
                <div className="relative z-10 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Member Access</span>
                  </div>

                  <h2 className="text-3xl font-black leading-tight tracking-tight">
                    Already Have an Account?
                  </h2>

                  <p className="text-xs text-rose-100/80 leading-relaxed font-normal">
                    Sign in with your existing email and password to view your active blood requests and manage donor listings.
                  </p>
                </div>

                <div className="relative z-10 pt-6">
                  <button
                    type="button"
                    onClick={() => { setIsFlipped(false); setIsForgotMode(false); setError(''); }}
                    className="w-full py-3.5 px-6 rounded-2xl bg-white text-blood-950 font-extrabold text-sm shadow-xl hover:bg-slate-100 transition-all transform active:scale-95 flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    Flip to Sign In ➔
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
