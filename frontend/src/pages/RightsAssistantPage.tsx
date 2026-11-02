import React, { useState, useEffect } from 'react';
import { fetchRights, ConsumerRight } from '../api';
import {
  Scale,
  ShieldCheck,
  Info,
  ListFilter,
  Volume2,
  GraduationCap,
  Search,
  AlertTriangle,
  ExternalLink,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const iconMap: Record<string, React.ElementType> = {
  ShieldCheck,
  Info,
  ListFilter,
  Volume2,
  Scale,
  GraduationCap
};

export const RightsAssistantPage: React.FC = () => {
  const [rights, setRights] = useState<ConsumerRight[]>([]);
  const [disputeVsCyber, setDisputeVsCyber] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRights()
      .then((data) => {
        setRights(data.rights);
        setDisputeVsCyber(data.dispute_vs_cybercrime);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredRights = rights.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.summary.toLowerCase().includes(q) ||
      r.digital_context.toLowerCase().includes(q) ||
      r.remedy.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex-1 bg-[#FAFAFC] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E5E5EA] text-xs font-semibold text-[#0071E3]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Consumer Protection Act, 2019 (CPA 2019)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#1D1D1F]">
            Indian Consumer Rights Assistant
          </h1>
          <p className="text-sm text-[#6E6E73] leading-relaxed">
            Statutory guarantees protecting Indian citizens against unfair trade practices, algorithmic deception, dark patterns, and fraudulent digital debits.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-[#8E8E93] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rights (e.g. refund, dark pattern, pricing, safety)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E5EA] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3] shadow-sm"
          />
        </div>

        {/* 6 Rights Cards Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1D1D1F]">
              The Six Statutory Pillars (Section 2(9) CPA 2019)
            </h2>
            <span className="text-xs text-[#6E6E73] font-medium">
              Showing {filteredRights.length} of {rights.length} Rights
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRights.map((right) => {
              const IconComp = iconMap[right.icon] || Scale;
              return (
                <div
                  key={right.id}
                  className="p-6 rounded-2xl bg-white border border-[#E5E5EA] shadow-sm flex flex-col justify-between hover:border-[#0071E3] transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#F5F5F7] text-[#0071E3] flex items-center justify-center">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-[#6E6E73] bg-[#F5F5F7] px-2 py-0.5 rounded">
                        Section 2(9)
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#1D1D1F]">{right.name}</h3>

                    <p className="text-xs text-[#6E6E73] leading-relaxed">
                      {right.summary}
                    </p>

                    <div className="pt-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#0071E3] mb-1">
                        Digital AI & Cyber Context:
                      </div>
                      <p className="text-xs text-[#1D1D1F] leading-relaxed bg-[#FAFAFC] p-2.5 rounded-lg border border-[#E5E5EA]">
                        {right.digital_context}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#E5E5EA]">
                    <div className="text-[10px] uppercase font-semibold text-[#6E6E73] mb-0.5">
                      Statutory Recourse:
                    </div>
                    <div className="text-xs font-semibold text-[#1D1D1F]">
                      {right.remedy}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Consumer Dispute vs Cybercrime Guide Card */}
        {disputeVsCyber && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E5EA] shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0071E3]">
                Jurisdiction & Escalation Guide
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1D1D1F] mt-1">
                Consumer Dispute vs Cyber Crime: Where Do You File?
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
                Filing in the wrong forum delays recovery. Understand the legal distinction between commercial disputes and criminal cyber extortion.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Box 1: Consumer Dispute */}
              <div className="p-5 rounded-2xl bg-[#FAFAFC] border border-[#E5E5EA] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#1D1D1F]">
                    {disputeVsCyber.consumer_dispute?.title}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F8ED] text-[#34C759]">
                    Civil Redressal
                  </span>
                </div>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  {disputeVsCyber.consumer_dispute?.definition}
                </p>
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-[#1D1D1F]">Common Scenarios:</span>
                  <ul className="text-xs text-[#6E6E73] space-y-1 list-disc pl-4">
                    {disputeVsCyber.consumer_dispute?.examples?.map((ex: string, i: number) => (
                      <li key={i}>{ex}</li>
                    ))}
                  </ul>
                </div>
                <div className="pt-2 border-t border-[#E5E5EA] text-xs font-semibold text-[#0071E3]">
                  Proper Channel: {disputeVsCyber.consumer_dispute?.proper_channel}
                </div>
              </div>

              {/* Box 2: Cybercrime */}
              <div className="p-5 rounded-2xl bg-[#FFF2F2] border border-[#FFCCD0] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#FF3B30]">
                    {disputeVsCyber.cyber_crime?.title}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-[#FF3B30] border border-[#FFCCD0]">
                    Criminal Law
                  </span>
                </div>
                <p className="text-xs text-[#1D1D1F] leading-relaxed">
                  {disputeVsCyber.cyber_crime?.definition}
                </p>
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-[#1D1D1F]">Common Scenarios:</span>
                  <ul className="text-xs text-[#1D1D1F] space-y-1 list-disc pl-4">
                    {disputeVsCyber.cyber_crime?.examples?.map((ex: string, i: number) => (
                      <li key={i}>{ex}</li>
                    ))}
                  </ul>
                </div>
                <div className="pt-2 border-t border-[#FFCCD0] text-xs font-semibold text-[#FF3B30]">
                  Proper Channel: {disputeVsCyber.cyber_crime?.proper_channel}
                </div>
              </div>
            </div>

            {/* Direct CTA to Complaint Assistant */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-[#6E6E73]">
                Ready to prepare an official statutory complaint document?
              </span>
              <Link
                to="/complaint"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0071E3] text-white text-xs font-semibold hover:bg-[#005BB5] transition-colors"
              >
                <span>Launch Complaint Assistant</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
