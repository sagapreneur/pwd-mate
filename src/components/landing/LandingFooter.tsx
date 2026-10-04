import React from 'react';
import { ShieldCheck, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

interface LandingFooterProps {
  onOpenDemoModal: () => void;
  onOpenLogin: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onOpenDemoModal, onOpenLogin }) => {
  return (
    <footer className="bg-slate-50 text-slate-600 border-t border-slate-200 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/kardecalc-logo.png"
                alt="KardeCalc Logo"
                className="h-10 w-auto object-contain"
              />
            </div>

            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              The premier Maharashtra PWD Civil Engineering Estimation and Technical Sanction platform. Built for registered contractors, consulting civil engineers, and departmental authorities across all 6 administrative regions.
            </p>

            <div className="pt-2 flex items-center space-x-3 text-xs text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse" />
              <span className="font-medium text-slate-700">Maharashtra SSR 2024-25 • 2,380+ Items Active</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#features" className="hover:text-slate-900 transition-colors">
                  SSR Item Catalog
                </a>
              </li>
              <li>
                <a href="#templates" className="hover:text-slate-900 transition-colors">
                  Smart Construction Templates
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-slate-900 transition-colors">
                  Quarry Lead Statement (C1)
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-slate-900 transition-colors">
                  Mineral Royalty (Schedule B)
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-slate-900 transition-colors">
                  Quality Testing Register (Schedule C)
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-slate-900 transition-colors">
                  Steel Bar Bending Schedule (BBS)
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-slate-900 transition-colors">
                  18-Part Printable Dossier
                </a>
              </li>
            </ul>
          </div>

          {/* Licensing & Pricing */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Licensing & Pricing
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#pricing" className="hover:text-slate-900 transition-colors">
                  Essential Plan (₹8,000/yr)
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-slate-900 transition-colors">
                  Full Access Plan (₹12,000/yr)
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenDemoModal}
                  className="text-[#15803D] hover:underline font-bold flex items-center gap-1"
                >
                  <span>Request 3-Day Demo</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button onClick={onOpenLogin} className="hover:text-slate-900 transition-colors">
                  Officer Sign In Portal
                </button>
              </li>
              <li>
                <a href="#faq" className="hover:text-slate-900 transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Standards & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              PWD Standards
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>Maharashtra PWD Accounts Code</li>
              <li>Red Book Volume I & II Specifications</li>
              <li>MoRTH Section 1700 Testing Norms</li>
              <li>Revenue & Forest Dept Royalty Rules</li>
              <li>Bilingual English & मराठी Documentation</li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer & Compliance */}
        <div className="mt-12 pt-8 border-t border-slate-200 text-[11px] text-slate-500 space-y-3">
          <p className="leading-relaxed">
            <strong>Statutory Compliance Disclaimer:</strong> KardeCalc is an independent engineering software platform designed to assist civil engineers, contractors, and estimation consultants in preparing estimates compliant with Maharashtra Public Works Department rules, Standard Schedule of Rates, and technical sanction requirements. All item codes, unit rates, and calculation methodologies reflect official published standards.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
            <p>© {new Date().getFullYear()} KardeCalc Platform. All rights reserved.</p>
            <div className="flex items-center space-x-4">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
              <span>•</span>
              <span>Security & 256-Bit SSL</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
