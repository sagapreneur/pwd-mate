import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Shield, Sparkles, LogIn, LayoutDashboard } from 'lucide-react';

interface LandingNavbarProps {
  onOpenDemoModal: () => void;
  onOpenLogin: () => void;
  onLaunchApp?: () => void;
  currentUser?: { name: string; role: string; division: string } | null;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  onOpenDemoModal,
  onOpenLogin,
  onLaunchApp,
  currentUser,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'How It Works', href: '#workflow' },
    { label: 'Core Features', href: '#features' },
    { label: 'Smart Templates', href: '#templates' },
    { label: 'Why KardeCalc', href: '#comparison' },
    { label: 'Who Is It For', href: '#audience' },
    { label: 'Pricing Plans', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#E5E7EB] py-2.5'
          : 'bg-white/90 backdrop-blur-xs border-b border-slate-100 py-4'
      }`}
    >
      <div className="max-w-7xl 2xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 lg:gap-4">
        {/* Brand Logo */}
        <a href="#" className="flex items-center space-x-3 group shrink-0">
          <img
            src="/kardecalc-logo.png"
            alt="KardeCalc Logo"
            className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-transform group-hover:scale-102 shrink-0"
          />
          <div className="hidden lg:flex flex-col justify-center border-l border-slate-200 pl-3 whitespace-nowrap shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] font-devanagari leading-none whitespace-nowrap">
              महाराष्ट्र शासन • PWD
            </span>
            <span className="text-[11px] font-semibold text-slate-900 leading-snug whitespace-nowrap">
              Estimation Platform
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center space-x-3.5 2xl:space-x-5 text-xs font-semibold text-[#64748B] shrink-0 whitespace-nowrap">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-slate-900 transition-colors py-1 px-1 whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center space-x-2 lg:space-x-2.5 shrink-0">
          {currentUser ? (
            <button
              onClick={onLaunchApp}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold shadow-sm transition-all whitespace-nowrap shrink-0"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#81C303] shrink-0" />
              <span className="truncate max-w-[140px] whitespace-nowrap">{currentUser.name}</span>
              <span className="w-2 h-2 rounded-full bg-[#81C303] animate-pulse shrink-0" />
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-300 hover:border-slate-800 text-slate-800 hover:bg-slate-50 text-xs font-bold transition-all whitespace-nowrap shrink-0"
            >
              <LogIn className="w-3.5 h-3.5 text-slate-700 shrink-0" />
              <span className="whitespace-nowrap">Officer Sign In</span>
            </button>
          )}

          <button
            onClick={onOpenDemoModal}
            className="flex items-center space-x-1.5 lg:space-x-2 px-3.5 lg:px-4 py-2 lg:py-2.5 rounded-xl bg-[#81C303] hover:bg-[#72ad02] text-black text-xs font-black uppercase tracking-wider shadow-sm hover:shadow-md transition-all hover:scale-102 active:scale-98 border border-[#72ad02] whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-black shrink-0" />
            <span className="whitespace-nowrap">Request 3-Day Demo</span>
            <ArrowRight className="w-3.5 h-3.5 text-black shrink-0" />
          </button>
        </div>

        {/* Mobile & Tablet Hamburger Button */}
        <div className="flex items-center xl:hidden space-x-2">
          <button
            onClick={onOpenDemoModal}
            className="sm:hidden px-3 py-1.5 rounded-lg bg-[#81C303] text-black text-[11px] font-bold whitespace-nowrap border border-[#72ad02]"
          >
            3-Day Demo
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-black focus:outline-none rounded-lg hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-xl animate-fadeIn">
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-800 border-b border-slate-100 pb-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            {currentUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onLaunchApp) onLaunchApp();
                }}
                className="w-full py-2.5 px-4 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-2"
              >
                <LayoutDashboard className="w-4 h-4 text-[#81C303]" />
                <span>Go to Workspace ({currentUser.name})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="w-full py-2.5 px-4 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center space-x-2 hover:bg-slate-50"
              >
                <LogIn className="w-4 h-4" />
                <span>Officer Sign In (लॉगिन करा)</span>
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemoModal();
              }}
              className="w-full py-3 px-4 bg-[#81C303] hover:bg-[#72ad02] text-black text-xs font-black uppercase tracking-wider rounded-xl shadow flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>Request 3-Day Free Demo</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
