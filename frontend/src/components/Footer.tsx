import React from 'react';
import { Shield, ExternalLink, Phone, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F5F5F7] border-t border-[#E5E5EA] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#0071E3] flex items-center justify-center text-white">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-semibold text-[#1D1D1F] tracking-tight">SecureSense 2.0</span>
            </div>
            <p className="text-xs text-[#6E6E73] leading-relaxed">
              Know Your Rights. Verify the Voice. Prevent the Fraud. Built for Indian consumers navigating the era of AI impersonation and dark patterns.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-white text-[#1D1D1F] border border-[#E5E5EA]">
                CPA 2019 Framework Aligned
              </span>
            </div>
          </div>

          {/* Quick Platform Routes */}
          <div>
            <h4 className="text-xs font-semibold text-[#1D1D1F] tracking-wider uppercase mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/dashboard" className="text-[#6E6E73] hover:text-[#0071E3] transition-colors">Interactive Dashboard</Link></li>
              <li><Link to="/analyze" className="text-[#6E6E73] hover:text-[#0071E3] transition-colors">Analyze Communication</Link></li>
              <li><Link to="/rights" className="text-[#6E6E73] hover:text-[#0071E3] transition-colors">Consumer Rights Guide</Link></li>
              <li><Link to="/complaint" className="text-[#6E6E73] hover:text-[#0071E3] transition-colors">Complaint Assistant</Link></li>
              <li><Link to="/history" className="text-[#6E6E73] hover:text-[#0071E3] transition-colors">Local Audit History</Link></li>
            </ul>
          </div>

          {/* Official Portals */}
          <div>
            <h4 className="text-xs font-semibold text-[#1D1D1F] tracking-wider uppercase mb-3">Verified Official Portals</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="https://consumerhelpline.gov.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[#6E6E73] hover:text-[#0071E3] transition-colors">
                  <span>National Consumer Helpline (1915)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://edaakhil.nic.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[#6E6E73] hover:text-[#0071E3] transition-colors">
                  <span>e-Jagriti (e-Daakhil Court Portal)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[#6E6E73] hover:text-[#0071E3] transition-colors">
                  <span>National Cyber Crime Portal (1930)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://cms.rbi.org.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[#6E6E73] hover:text-[#0071E3] transition-colors">
                  <span>RBI Banking Ombudsman CMS</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Emergency Helpline Numbers */}
          <div>
            <h4 className="text-xs font-semibold text-[#1D1D1F] tracking-wider uppercase mb-3">Emergency Response</h4>
            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-[#E5E5EA]">
                <div className="font-semibold text-[#1D1D1F] flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#FF3B30]" />
                  <span>1930 — Cyber Fraud Golden Hour</span>
                </div>
                <div className="text-[11px] text-[#6E6E73] mt-0.5">
                  Call within 2 hours of unauthorized financial debit to freeze accounts.
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-[#E5E5EA]">
                <div className="font-semibold text-[#1D1D1F] flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-[#0071E3]" />
                  <span>1915 — National Consumer Care</span>
                </div>
                <div className="text-[11px] text-[#6E6E73] mt-0.5">
                  Toll-free consumer dispute registration under Ministry of Consumer Affairs.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Evidentiary Disclaimer */}
        <div className="pt-6 border-t border-[#E5E5EA] text-[11px] text-[#6E6E73] leading-relaxed flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p>
            <strong>Evidentiary Notice:</strong> SecureSense generates structured statutory drafts conforming to the Consumer Protection Act, 2019 and digital evidentiary standards (Section 65B Indian Evidence Act / Section 63 BSA). SecureSense does not file complaints automatically on government servers.
          </p>
          <div className="text-right whitespace-nowrap">
            © {new Date().getFullYear()} SecureSense 2.0. Clean White Architecture.
          </div>
        </div>
      </div>
    </footer>
  );
};
