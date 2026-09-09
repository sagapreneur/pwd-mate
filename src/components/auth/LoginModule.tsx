import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, Eye, EyeOff, Building2, UserCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

interface LoginModuleProps {
  onLoginSuccess: (user: { name: string; role: string; division: string; email: string }) => void;
}

export const LoginModule: React.FC<LoginModuleProps> = ({ onLoginSuccess }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [division, setDivision] = useState('Public Works Division, Wardha');
  const [designation, setDesignation] = useState('Sub-Divisional Engineer');
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
      const validUsers = ['admin', 'pwd.engineer@mahapwd.gov.in', 'pwd', 'engineer', 'sde.wardha@mahapwd.gov.in'];
      const validPasswords = ['PWD@Maharashtra2026', 'admin123', 'maha123', 'pwd123'];

      const isUserValid = validUsers.includes(cleanUser);
      const isPassValid = validPasswords.includes(cleanPass);

      if (isUserValid && isPassValid) {
        const userName =
          cleanUser === 'admin'
            ? 'Administrator (P.W.D.)'
            : cleanUser.includes('engineer') || cleanUser.includes('sde')
            ? 'Er. S. R. Patil'
            : 'Officer In-Charge';

        const userObj = {
          name: userName,
          role: designation,
          division: division,
          email: userId.includes('@') ? userId : `${userId}@mahapwd.gov.in`,
        };

        localStorage.setItem('maha_pwd_auth_session', JSON.stringify(userObj));
        onLoginSuccess(userObj);
      } else {
        setErrorMsg('Invalid Officer ID or Password. Please verify your department credentials or contact the Division Administrator.');
        setIsLoading(false);
        refreshCaptcha();
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#071426] flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Graphic Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(#14335C_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#14335C]/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#F4762A]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Government Banner */}
      <header className="relative z-10 bg-[#0B1F3A]/90 backdrop-blur border-b border-[#14335C] py-2 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white tracking-wide">Government of Maharashtra</span>
            <span className="text-slate-500">|</span>
            <span>महाराष्ट्र शासन ई-प्रशासन प्रणाली</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span>Standard Schedule of Rates (SSR 2022-26)</span>
            <span className="text-slate-600">•</span>
            <span>Secure SSL 256-Bit</span>
          </div>
        </div>
      </header>

      {/* Main Login Card Area */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          
          {/* Card Header with Lion Capital Emblem */}
          <div className="bg-[#0B1F3A] text-white p-6 text-center relative border-b-4 border-[#F4762A]">
            <div className="flex justify-center mb-3">
              <div className="bg-white p-2 rounded-full shadow-md">
                <img
                  src="/emblem.png"
                  alt="State Emblem of India"
                  className="h-16 w-auto object-contain"
                />
              </div>
            </div>
            <p className="text-xs font-bold tracking-widest uppercase font-devanagari text-slate-200">
              महाराष्ट्र शासन • सार्वजनिक बांधकाम विभाग
            </p>
            <h1 className="text-xl font-bold tracking-wide mt-1 text-white uppercase">
              PWD Mate
            </h1>
            <p className="text-[11px] text-slate-300 font-medium tracking-wider">
              Maharashtra PWD Technical Sanction & Estimation Portal
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
            {errorMsg && (
              <div className="bg-red-50 border-l-4 border-red-600 p-3 rounded text-xs text-red-800 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMsg}</span>
              </div>
            )}

            {/* Officer ID / Email */}
            <div>
              <label className="block text-xs font-bold text-[#0B1F3A] mb-1">
                Official User ID / Email ID *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="उदा. pwd.wardha@mahapwd.gov.in"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-lg border border-slate-300 focus:border-[#F4762A] focus:ring-2 focus:ring-[#F4762A]/20 outline-none transition-all font-medium text-slate-800"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-[#0B1F3A] mb-1 flex items-center justify-between">
                <span>Department Password *</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 text-xs rounded-lg border border-slate-300 focus:border-[#F4762A] focus:ring-2 focus:ring-[#F4762A]/20 outline-none transition-all font-medium text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Division Selector */}
            <div>
              <label className="block text-xs font-bold text-[#0B1F3A] mb-1 flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5 text-[#F4762A]" />
                <span>Division / Circle *</span>
              </label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:border-[#F4762A] outline-none font-semibold text-slate-800"
              >
                <option value="Public Works Division, Wardha">Public Works Division, Wardha (Circle: Chandrapur)</option>
                <option value="Public Works Division, Nagpur">Public Works Division, Nagpur (Circle: Nagpur)</option>
                <option value="Public Works Division, Chandrapur">Public Works Division, Chandrapur</option>
                <option value="Public Works Division, Pune">Public Works Division, Pune</option>
                <option value="Public Works Division, Amravati">Public Works Division, Amravati</option>
                <option value="Public Works Division, Nashik">Public Works Division, Nashik</option>
                <option value="Public Works Division, Chhatrapati Sambhajinagar">Public Works Division, Chhatrapati Sambhajinagar</option>
                <option value="South Mumbai P.W. Division">South Mumbai P.W. Division</option>
              </select>
            </div>

            {/* Designation Selector */}
            <div>
              <label className="block text-xs font-bold text-[#0B1F3A] mb-1 flex items-center space-x-1">
                <UserCheck className="w-3.5 h-3.5 text-[#F4762A]" />
                <span>Officer Role / Designation *</span>
              </label>
              <select
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:border-[#F4762A] outline-none font-semibold text-slate-800"
              >
                <option value="Sub-Divisional Engineer">Sub-Divisional Engineer (उपविभागीय अभियंता)</option>
                <option value="Executive Engineer">Executive Engineer (कार्यकारी अभियंता)</option>
                <option value="Junior / Sectional Engineer">Junior / Sectional Engineer (कनिष्ठ / शाखा अभियंता)</option>
                <option value="Superintending Engineer">Superintending Engineer (अधीक्षक अभियंता)</option>
                <option value="Chief Engineer">Chief Engineer (मुख्य अभियंता)</option>
              </select>
            </div>

            {/* Security Captcha */}
            <div>
              <label className="block text-xs font-bold text-[#0B1F3A] mb-1">
                Security Code Verification *
              </label>
              <div className="flex items-center space-x-3">
                <div
                  onClick={refreshCaptcha}
                  className="bg-[#0B1F3A] text-amber-300 font-mono text-base tracking-widest font-bold px-4 py-2 rounded-lg border border-slate-600 select-none cursor-pointer flex items-center space-x-2 shadow-inner"
                  title="Click to refresh security code"
                >
                  <span className="line-through decoration-amber-400/60 decoration-2">{captchaCode}</span>
                  <span className="text-[9px] text-slate-400 font-sans font-normal">(Refresh)</span>
                </div>
                <input
                  type="text"
                  required
                  maxLength={4}
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  placeholder="Enter Code"
                  className="flex-1 uppercase text-center font-mono font-bold tracking-widest text-xs py-2.5 rounded-lg border border-slate-300 focus:border-[#F4762A] outline-none"
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-300 text-[#F4762A] focus:ring-[#F4762A]"
                />
                <span>Remember session on this computer</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg bg-[#0B1F3A] hover:bg-[#14335C] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Department Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#F4762A]" />
                  <span>Sign In to Official Portal (लॉगिन करा)</span>
                </>
              )}
            </button>
          </form>

          {/* Card Footer Warning */}
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 text-center text-[10px] text-slate-500 leading-normal">
            Unauthorized access to this portal is strictly prohibited and punishable under the Information Technology Act, 2000 & Official Secrets Act.
          </div>
        </div>
      </div>

      {/* Portal Footer */}
      <footer className="relative z-10 bg-[#071426] border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-400 space-y-1">
        <p className="font-semibold text-slate-300">
          Public Works Department • Government of Maharashtra (महाराष्ट्र शासन)
        </p>
        <p className="text-[11px] text-slate-500">
          Designed for Chief Engineers, Superintending Engineers, Executive Engineers & Technical Branches.
        </p>
      </footer>
    </div>
  );
};
