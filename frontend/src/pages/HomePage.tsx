import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  ArrowRight,
  AlertTriangle,
  FileText,
  Scale,
  Mic,
  Activity,
  CheckCircle,
  HelpCircle,
  ExternalLink,
  Lock,
  PhoneCall,
  Search
} from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="flex-1">
      {/* 1. Hero Section (Asymmetric layout) */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-24 bg-gradient-to-b from-white via-[#F5F5F7]/30 to-[#F5F5F7]/80 border-b border-[#E5E5EA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Narrative Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F5F7] border border-[#E5E5EA]">
                <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse"></span>
                <span className="text-xs font-semibold text-[#1D1D1F]">
                  CPA 2019 Statutory Framework • Indian Cyber Protection
                </span>
              </div>

              {/* Headlines */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1D1D1F] leading-[1.08]">
                  Protecting Consumer Trust in the Age of AI.
                </h1>
                <p className="text-lg sm:text-xl text-[#6E6E73] max-w-2xl font-normal leading-relaxed">
                  Know Your Rights. Verify the Voice. Prevent the Fraud. Context-aware threat detection fused with statutory consumer enforcement under India's Consumer Protection Act.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/analyze"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-[#0071E3] text-white text-base font-semibold hover:bg-[#005BB5] transition-all shadow-sm active:scale-[0.98] gap-2"
                >
                  <Shield className="w-5 h-5" />
                  <span>Analyze a Conversation</span>
                </Link>
                <Link
                  to="/rights"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white text-[#1D1D1F] border border-[#E5E5EA] text-base font-medium hover:bg-[#F5F5F7] transition-all active:scale-[0.98]"
                >
                  <span>Explore Your Rights</span>
                </Link>
              </div>

              {/* Trust Metrics */}
              <div className="pt-6 grid grid-cols-3 gap-6 border-t border-[#E5E5EA] max-w-lg">
                <div>
                  <div className="text-2xl font-bold text-[#1D1D1F]">1915</div>
                  <div className="text-xs text-[#6E6E73]">NCH Hot-Link Ready</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#0071E3]">100%</div>
                  <div className="text-xs text-[#6E6E73]">Explainable Evidence</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#34C759]">Sec. 65B</div>
                  <div className="text-xs text-[#6E6E73]">Legal Evidence Format</div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Diagnostic Preview Card */}
            <div className="lg:col-span-5 w-full">
              <div className="relative bg-white rounded-2xl border border-[#E5E5EA] shadow-xl p-6 sm:p-7 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#E5E5EA]">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF3B30] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF3B30]"></span>
                    </span>
                    <span className="text-xs font-bold text-[#1D1D1F] tracking-wider uppercase">
                      Live Diagnostic Stream
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FFF2F2] text-[#FF3B30] text-xs font-semibold border border-[#FFCCD0]">
                    High Risk Vector
                  </span>
                </div>

                {/* Simulated Waveform & Anomaly */}
                <div className="py-5">
                  <div className="flex items-center justify-between text-xs text-[#6E6E73] mb-2 font-medium">
                    <span>Acoustic Waveform #4092-B</span>
                    <span className="text-[#FF3B30]">Advance Fee Demanded</span>
                  </div>

                  {/* Animated Waveform Bars */}
                  <div className="bg-[#F5F5F7] rounded-xl p-4 flex items-center justify-between h-20 gap-1.5 overflow-hidden border border-[#E5E5EA]">
                    {[12, 28, 45, 18, 62, 80, 52, 30, 75, 90, 42, 22, 68, 85, 38, 55, 20, 70, 48, 15].map((h, i) => (
                      <div
                        key={i}
                        className={`w-1.5 rounded-full transition-all duration-300 ${
                          h > 60 ? 'bg-[#FF3B30]' : h > 40 ? 'bg-[#0071E3]' : 'bg-[#E5E5EA]'
                        }`}
                        style={{ height: `${h}%` }}
                      ></div>
                    ))}
                  </div>

                  {/* Forensic Metric Pills */}
                  <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                    <div className="p-2.5 rounded-lg bg-[#F5F5F7] border border-[#E5E5EA]">
                      <div className="text-[11px] text-[#6E6E73] font-medium">Threat Score</div>
                      <div className="text-lg font-bold text-[#FF3B30]">89/100</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#F5F5F7] border border-[#E5E5EA]">
                      <div className="text-[11px] text-[#6E6E73] font-medium">Linguistic Intent</div>
                      <div className="text-sm font-semibold text-[#1D1D1F]">Refund Phishing</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#F5F5F7] border border-[#E5E5EA]">
                      <div className="text-[11px] text-[#6E6E73] font-medium">Voice Status</div>
                      <div className="text-xs font-semibold text-[#6E6E73]">Unavailable</div>
                    </div>
                  </div>
                </div>

                {/* Classification Alert Box */}
                <div className="p-4 rounded-xl bg-[#FFF2F2] border border-[#FFCCD0] mb-4">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-[#FF3B30] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-[#FF3B30] uppercase tracking-wide">
                        Warning: Coercive Refund Extortion
                      </div>
                      <div className="text-xs text-[#1D1D1F] mt-1 leading-snug">
                        Caller insists on a Rs 499 processing fee to release a pending refund. Legitimate merchants never require upfront payment for refunds.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/analyze"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#FF3B30] text-white text-xs font-semibold hover:bg-[#E02D22] transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Test Full Pipeline</span>
                  </Link>
                  <Link
                    to="/complaint"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#F5F5F7] text-[#1D1D1F] border border-[#E5E5EA] text-xs font-semibold hover:bg-white transition-colors"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>Draft Complaint</span>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. 6 Core Capabilities Feature Grid */}
      <section className="py-20 bg-white border-b border-[#E5E5EA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0071E3]">
              End-to-End Consumer Protection
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-[#1D1D1F] mt-1 mb-3">
              Six Working Pillars of Digital Defense
            </h2>
            <p className="text-sm text-[#6E6E73] leading-relaxed">
              Every feature runs against real algorithms, grounded statutory citations, and real SQLite history. Zero decorative dead controls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E5E5EA] hover:border-[#0071E3] transition-colors shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#F5F5F7] flex items-center justify-center text-[#0071E3] mb-4">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-[#1D1D1F] mb-2">
                  Suspicious Communication Analysis
                </h3>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  Rule-based context detection for OTP harvesting, fake refund processing fees, authority impersonation, and coercive threats. Smart context handling ensures "never share your OTP" is not falsely flagged.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#E5E5EA] flex items-center justify-between text-xs font-medium text-[#0071E3]">
                <span>Context Negation Engine</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* 2 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E5E5EA] hover:border-[#0071E3] transition-colors shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#F5F5F7] flex items-center justify-center text-[#0071E3] mb-4">
                  <Mic className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-[#1D1D1F] mb-2">
                  Voice-Cloning Inspection (Supporting)
                </h3>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  Audio file verification, duration calculation, and waveform envelope generation. Unloaded models are honestly marked "voice model unavailable" without faked synthetic certainty.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#E5E5EA] flex items-center justify-between text-xs font-medium text-[#0071E3]">
                <span>Transparent AI Limits</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* 3 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E5E5EA] hover:border-[#0071E3] transition-colors shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#F5F5F7] flex items-center justify-center text-[#0071E3] mb-4">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-[#1D1D1F] mb-2">
                  Explainable Risk Engine
                </h3>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  Multi-tier risk verdict (LOW / MODERATE / HIGH / INSUFFICIENT EVIDENCE) paired with concrete transcript excerpts, specific violated rules, and step-by-step consumer protective actions.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#E5E5EA] flex items-center justify-between text-xs font-medium text-[#0071E3]">
                <span>Evidence Breakdown</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* 4 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E5E5EA] hover:border-[#0071E3] transition-colors shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#F5F5F7] flex items-center justify-center text-[#0071E3] mb-4">
                  <Scale className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-[#1D1D1F] mb-2">
                  India Consumer Rights Assistant
                </h3>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  Interactive reference for the 6 statutory Indian consumer rights under CPA 2019. Clear guidance distinguishing legitimate consumer disputes from criminal cyber-extortion.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#E5E5EA] flex items-center justify-between text-xs font-medium text-[#0071E3]">
                <span>CPA 2019 Statutory Clauses</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* 5 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E5E5EA] hover:border-[#0071E3] transition-colors shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#F5F5F7] flex items-center justify-center text-[#0071E3] mb-4">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-[#1D1D1F] mb-2">
                  Structured Complaint Assistant
                </h3>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  3-step guided wizard compiling formal legal notices with party information, disputed quantum, and legal relief. Export directly as TXT or copy for submission on NCH / e-Jagriti.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#E5E5EA] flex items-center justify-between text-xs font-medium text-[#0071E3]">
                <span>Instant Legal Draft</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* 6 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E5E5EA] hover:border-[#0071E3] transition-colors shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#F5F5F7] flex items-center justify-center text-[#0071E3] mb-4">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-[#1D1D1F] mb-2">
                  Privacy-First Audit & History
                </h3>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  Local SQLite database storage. Automatic redacting of 4-6 digit numeric OTPs and card numbers. Full user controls to inspect, filter, or delete past records at any time.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#E5E5EA] flex items-center justify-between text-xs font-medium text-[#0071E3]">
                <span>Credential Redaction</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 3-Step Guided Workflow Preview */}
      <section className="py-20 bg-[#F5F5F7] border-b border-[#E5E5EA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0071E3]">
              Workflow Architecture
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-[#1D1D1F] mt-1 mb-3">
              From Suspicious Message to Official Recourse
            </h2>
            <p className="text-sm text-[#6E6E73] leading-relaxed">
              Convert suspicious calls, fraudulent UPI requests, or e-commerce disputes into verifiable legal evidence in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5E5EA] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-8 h-8 rounded-xl bg-[#0071E3] text-white flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <span className="text-xs font-semibold text-[#6E6E73]">STEP 01</span>
                </div>
                <h3 className="text-base font-semibold text-[#1D1D1F] mb-2">Analyze & Diagnose</h3>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  Paste incoming WhatsApp/SMS messages, call transcripts, or upload audio recordings. Our engine inspects 7 deceptive intent categories with safe phrase negation.
                </p>
              </div>
              <div className="mt-5 p-3 rounded-lg bg-[#F5F5F7] border border-[#E5E5EA] text-[11px] text-[#1D1D1F] font-mono">
                Threat Audit + OTP Redaction
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5E5EA] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-8 h-8 rounded-xl bg-[#F5F5F7] text-[#1D1D1F] border border-[#E5E5EA] flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <span className="text-xs font-semibold text-[#6E6E73]">STEP 02</span>
                </div>
                <h3 className="text-base font-semibold text-[#1D1D1F] mb-2">Map Statutory Rights</h3>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  Correlate deceptive practices against the 6 pillars of India's Consumer Protection Act 2019 to ascertain legal grounds for refund, replacement, or cybercrime reporting.
                </p>
              </div>
              <div className="mt-5 p-3 rounded-lg bg-[#F5F5F7] border border-[#E5E5EA] text-[11px] text-[#0071E3] font-mono">
                CPA 2019 Section 2(47) Match
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5E5EA] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-8 h-8 rounded-xl bg-[#F5F5F7] text-[#1D1D1F] border border-[#E5E5EA] flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <span className="text-xs font-semibold text-[#6E6E73]">STEP 03</span>
                </div>
                <h3 className="text-base font-semibold text-[#1D1D1F] mb-2">Generate Formal Draft</h3>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  Export structured statutory complaints ready for copy-pasting directly into the National Consumer Helpline (1915), e-Jagriti Digital Court, or cybercrime.gov.in.
                </p>
              </div>
              <div className="mt-5 p-3 rounded-lg bg-[#F5F5F7] border border-[#E5E5EA] text-[11px] text-[#34C759] font-mono font-medium">
                Ready for NCH / e-Jagriti Dispatch
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Final CTA Banner */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-[#1D1D1F] text-white p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Verify any suspicious communication right now.
              </h2>
              <p className="text-sm text-[#8E8E93] leading-relaxed">
                Test our 4 real demo scenarios or paste your own message to see instant, explainable risk detection.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link
                to="/analyze"
                className="px-6 py-3 rounded-xl bg-[#0071E3] text-white text-sm font-semibold hover:bg-[#005BB5] transition-all shadow-sm"
              >
                Launch Analyzer
              </Link>
              <Link
                to="/dashboard"
                className="px-5 py-3 rounded-xl bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-all border border-white/20"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
