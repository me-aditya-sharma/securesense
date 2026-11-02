import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Shield, Menu, X, ArrowRight, AlertTriangle, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Analyze', path: '/analyze' },
    { name: 'Scam Awareness', path: '/awareness' },
    { name: 'Consumer Rights', path: '/rights' },
    { name: 'Complaint Assistant', path: '/complaint' },
    { name: 'History', path: '/history' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-[#E5E5EA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#0071E3] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform duration-200">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[17px] font-semibold tracking-tight text-[#1D1D1F] leading-tight">
              SecureSense <span className="text-[#0071E3]">2.0</span>
            </div>
            <div className="text-[11px] font-medium text-[#6E6E73] tracking-normal leading-none hidden sm:block">
              Know Your Rights. Prevent the Fraud.
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `px-2.5 lg:px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-[#0071E3] bg-[#F5F5F7] font-semibold'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7]/60'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Right Action Button */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="tel:1930"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#FF3B30] bg-[#FFF2F2] rounded-lg border border-[#FFCCD0] hover:bg-[#FFE5E5] transition-colors"
            title="National Cyber Financial Fraud Helpline"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Cyber Helpline 1930</span>
          </a>
          <Link
            to="/analyze"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0071E3] text-white text-xs font-semibold hover:bg-[#005BB5] transition-all shadow-sm active:scale-[0.98] hover-lift"
          >
            <span>Analyze Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            to="/analyze"
            className="px-3 py-1.5 rounded-lg bg-[#0071E3] text-white text-xs font-medium"
          >
            Analyze
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E5E5EA] bg-white px-4 pt-2 pb-4 space-y-1 animate-fade-in">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                  isActive
                    ? 'text-[#0071E3] bg-[#F5F5F7] font-semibold'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7]'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <div className="pt-2 border-t border-[#E5E5EA] flex flex-col gap-2">
            <a
              href="tel:1930"
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#FF3B30] bg-[#FFF2F2] rounded-lg border border-[#FFCCD0]"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Emergency Cyber Helpline: 1930</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
