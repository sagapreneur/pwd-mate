import React from 'react';
import { HardHat, Briefcase, FileCheck2, Building2, UserCheck, Shield, CheckCircle2 } from 'lucide-react';

export const TargetAudienceSection: React.FC = () => {
  const audiences = [
    {
      icon: HardHat,
      role: 'PWD Registered Contractors',
      badge: 'Class I to Class IX',
      marathi: 'नोंदणीकृत सा.बां. कंत्राटदार',
      desc: 'Bid tenders with razor-sharp rate accuracy. Rapidly prepare Schedule B rate breakdowns, quarry lead sheets, and theoretical material consumption statements.',
      benefits: [
        'Accurate lead statements based on actual site quarries',
        'Transparent material consumption statements (Cement, Sand, Metal)',
        'Immediate estimation for routine Grampanchayat & ZP works',
      ],
    },
    {
      icon: Briefcase,
      role: 'Consulting Civil Engineers',
      badge: 'DPR & Valuation Consultants',
      marathi: 'सल्लागार स्थापत्य अभियंता',
      desc: 'Deliver standardized, audit-ready Detailed Project Reports (DPRs) and cost estimates for government departments, local bodies, and private infrastructure clients.',
      benefits: [
        '18-Part Technical Sanction format accepted across Maharashtra',
        'Audit-proof calculations compliant with PWD Accounts Code',
        'Official Marathi outward correspondence and checklists',
      ],
    },
    {
      icon: FileCheck2,
      role: 'PWD & Government Engineering Officials',
      badge: 'SE / SDE / EE Offices',
      marathi: 'सा.बां. विभाग व स्थानिक स्वराज्य संस्था',
      desc: 'Sectional, Sub-Divisional, and Executive Engineers preparing or verifying administrative approvals and Technical Sanction dossiers.',
      benefits: [
        'Pre-configured cascading Maharashtra territorial jurisdictions',
        'Standardized digital stamp and signature blocks',
        'Elimination of cross-schedule discrepancy queries',
      ],
    },
    {
      icon: UserCheck,
      role: 'Estimation & Billing Engineers',
      badge: 'Costing & Quantity Surveyors',
      marathi: 'अंदाजपत्रक व बिलिंग अभियंता',
      desc: 'Professionals responsible for taking off quantities from architectural drawings and compiling comprehensive Schedule A abstracts.',
      benefits: [
        'Multi-row L×B×D take-offs with deduction rows for openings',
        'Integrated Bar Bending Schedule (BBS) pushing directly to rebar item',
        'Fast SSR code search across all 112 chapters',
      ],
    },
    {
      icon: Building2,
      role: 'Infrastructure & Construction Firms',
      badge: 'EPC & Road Builders',
      marathi: 'पायाभूत सुविधा व बांधकाम कंपन्या',
      desc: 'Agencies executing CC road works, asphalt resurfacing, storm water drainage channels, and public building projects.',
      benefits: [
        'Ready Smart Templates for immediate project initialization',
        'Statutory area surcharge & SCADA plant rebate modeling',
        'Direct export to full-featured Excel workbooks (.xlsx)',
      ],
    },
  ];

  return (
    <section id="audience" className="py-16 sm:py-24 bg-[#F8FAFC] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white text-slate-800 text-xs font-bold uppercase tracking-wider mb-3 border border-slate-200 shadow-2xs">
            <Shield className="w-3.5 h-3.5 text-[#81C303]" />
            <span>Target Professional Profiles</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Built Exclusively for the Maharashtra Civil & PWD Ecosystem
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#64748B]">
            Whether you are bidding your next PWD tender or sanctioning a Gram Panchayat CC road, KardeCalc provides the exact engineering tools you need.
          </p>
        </div>

        {/* Audience Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audiences.map((aud, idx) => {
            const Icon = aud.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-[#81C303] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-lime-50 text-[#15803D] border border-[#81C303]/40 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {aud.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900">
                    {aud.role}
                  </h3>
                  <p className="text-xs font-devanagari text-[#15803D] font-semibold mt-0.5">
                    {aud.marathi}
                  </p>

                  <p className="text-xs text-[#64748B] mt-3 leading-relaxed">
                    {aud.desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                  {aud.benefits.map((b, bIdx) => (
                    <div key={bIdx} className="flex items-start space-x-2 text-[11px] text-[#111827]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0 mt-0.5" />
                      <span className="leading-snug">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
