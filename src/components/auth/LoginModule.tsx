import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface LoginModuleProps {
  onLoginSuccess: (user: { name: string; role: string; division: string; email: string }) => void;
  onBackToLanding?: () => void;
}

export const LoginModule: React.FC<LoginModuleProps> = ({ onLoginSuccess, onBackToLanding }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('7H8K');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Generate a randomized 4-char alphanumeric captcha
  const refreshCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanUser = userId.trim().toLowerCase();
    const cleanPass = password.trim();

    // Check Captcha
    if (captchaInput.trim().toUpperCase() !== captchaCode) {
      setErrorMsg('Security verification code does not match. Please re-enter the characters.');
      refreshCaptcha();
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Valid credential sets
      const validUsers = ['admin', 'pwd.engineer@mahapwd.gov.in', 'pwd', 'engineer', 'contractor', 'contractor@mahapwd.in'];
      const validPasswords = ['PWD@Maharashtra2026', 'admin123', 'maha123', 'pwd123'];

      const isUserValid = validUsers.includes(cleanUser);
      const isPassValid = validPasswords.includes(cleanPass);

      if (isUserValid && isPassValid) {
        const userName =
          cleanUser === 'admin'
            ? 'Administrator'
            : cleanUser.includes('contractor')
            ? 'Contractor User'
            : 'Authorized User';

        const userObj = {
          name: userName,
          role: 'Contractor',
          division: 'All Maharashtra Divisions',
          email: userId.includes('@') ? userId : `${userId}@contractor.mahapwd.in`,
        };

        localStorage.setItem('maha_pwd_auth_session', JSON.stringify(userObj));
        onLoginSuccess(userObj);
      } else {
        setErrorMsg('Invalid User ID or Password. Please verify your credentials and try again.');
        setIsLoading(false);
        refreshCaptcha();
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between relative overflow-hidden font-sans text-[#111827]">
      {/* Background Graphic Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5E7EB_1px,transparent_1px)] [background-size:24px_24px] opacity-70 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#02013F]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#81C303]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Government Banner */}
      <header className="relative z-10 bg-[#02013F] border-b border-[#14136e] py-2 px-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center space-x-2">
            {onBackToLanding && (
              <button
                type="button"
                onClick={onBackToLanding}
                className="hover:text-white flex items-center gap-1 transition-colors text-slate-300 font-semibold mr-2 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20"
                title="Return to Marketing Landing Page"
              >
                <span>← Back to Website</span>
              </button>
            )}
            <span className="inline-block w-2 h-2 rounded-full bg-[#81C303] animate-pulse" />
            <span className="font-semibold text-white tracking-wide">Government of Maharashtra</span>
            <span className="text-slate-400">|</span>
            <span>महाराष्ट्र शासन ई-प्रशासन प्रणाली</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] text-slate-300">
            <span>Standard Schedule of Rates (SSR 2022-26)</span>
            <span className="text-slate-500">•</span>
            <span>Secure SSL 256-Bit</span>
          </div>
        </div>
      </header>

      {/* Main Login Card Area */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#E5E7EB] overflow-hidden">
          
          {/* Card Header with KardeCalc Logo */}
          <div className="bg-white p-6 pb-4 text-center border-b border-[#E5E7EB]">
            <div className="flex justify-center mb-3">
              <img
                src="/kardecalc-logo.png"
                alt="KardeCalc"
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-xs font-bold tracking-widest uppercase font-devanagari text-[#64748B]">
              महाराष्ट्र शासन • सार्वजनिक बांधकाम विभाग
            </p>
            <h1 className="text-sm font-bold tracking-wide mt-1 text-[#02013F] uppercase">
              Technical Sanction & Estimation Portal
            </h1>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
            {errorMsg && (
              <div className="bg-red-50 border-l-4 border-[#DC2626] p-3 rounded text-xs text-[#DC2626] flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMsg}</span>
              </div>
            )}

            {/* Officer ID / Email */}
            <div>
              <label className="block text-xs font-bold text-[#02013F] mb-1">
                Official User ID / Email ID *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="उदा. pwd.wardha@mahapwd.gov.in / admin"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-lg border border-[#E5E7EB] focus:border-[#81C303] focus:ring-2 focus:ring-[#81C303]/20 outline-none transition-all font-medium text-[#111827] bg-white"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-[#02013F] mb-1 flex items-center justify-between">
                <span>Department Password *</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 text-xs rounded-lg border border-[#E5E7EB] focus:border-[#81C303] focus:ring-2 focus:ring-[#81C303]/20 outline-none transition-all font-medium text-[#111827] bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#94A3B8] hover:text-[#64748B]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Security Captcha */}
            <div>
              <label className="block text-xs font-bold text-[#02013F] mb-1">
                Security Code Verification *
              </label>
              <div className="flex items-center space-x-3">
                <div
                  onClick={refreshCaptcha}
                  className="bg-[#02013F] text-[#81C303] font-mono text-base tracking-widest font-bold px-4 py-2 rounded-lg border border-[#14136e] select-none cursor-pointer flex items-center space-x-2 shadow-inner"
                  title="Click to refresh security code"
                >
                  <span className="line-through decoration-[#81C303]/60 decoration-2">{captchaCode}</span>
                  <span className="text-[9px] text-slate-300 font-sans font-normal">(Refresh)</span>
                </div>
                <input
                  type="text"
                  required
                  maxLength={4}
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  placeholder="Enter Code"
                  className="flex-1 uppercase text-center font-mono font-bold tracking-widest text-xs py-2.5 rounded-lg border border-[#E5E7EB] focus:border-[#81C303] outline-none text-[#111827] bg-white"
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 text-[#64748B] cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-[#E5E7EB] text-[#81C303] focus:ring-[#81C303]"
                />
                <span>Remember session on this computer</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg bg-[#02013F] hover:bg-[#14136e] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Department Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#81C303]" />
                  <span>Sign In to KardeCalc (लॉगिन करा)</span>
                </>
              )}
            </button>
          </form>

          {/* Card Footer Warning */}
          <div className="bg-[#F8FAFC] border-t border-[#E5E7EB] px-6 py-3 text-center text-[10px] text-[#64748B] leading-normal">
            Unauthorized access to this portal is strictly prohibited and punishable under the Information Technology Act, 2000 & Official Secrets Act.
          </div>
        </div>
      </div>

      {/* Portal Footer */}
      <footer className="relative z-10 bg-white border-t border-[#E5E7EB] py-4 px-6 text-center text-xs text-[#64748B] space-y-1">
        <p className="font-semibold text-[#111827]">
          Public Works Department • Government of Maharashtra (महाराष्ट्र शासन)
        </p>
        <p className="text-[11px] text-[#64748B]">
          KardeCalc Platform — Designed for Chief Engineers, Superintending Engineers, Executive Engineers & Contractors.
        </p>
      </footer>
    </div>
  );
};
