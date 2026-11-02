import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  fetchStats,
  fetchHistory,
  deleteHistoryItem,
  analyzeText,
  StatsResponse,
  AnalysisRecord
} from '../api';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileQuestion,
  Trash2,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Search,
  Scale,
  FileText,
  PlusCircle,
  RefreshCw
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickText, setQuickText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, historyData] = await Promise.all([
        fetchStats(),
        fetchHistory()
      ]);
      setStats(statsData);
      setHistory(historyData);
      setErrorMsg('');
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to connect to SecureSense backend (http://localhost:8000). Ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteHistoryItem(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
      // Refresh stats
      const updatedStats = await fetchStats();
      setStats(updatedStats);
    } catch (err) {
      alert('Failed to delete item from SQLite');
    }
  };

  const handleQuickAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickText.trim() || quickText.trim().length < 5) {
      alert('Please enter at least 5 characters to analyze.');
      return;
    }
    setSubmitting(true);
    try {
      const result = await analyzeText(quickText, 'Quick Dashboard Analysis');
      navigate(`/results/${result.id}`);
    } catch (err) {
      alert('Analysis failed. Please check backend status.');
    } finally {
      setSubmitting(false);
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFF2F2] text-[#FF3B30] border border-[#FFCCD0]">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>High Risk</span>
          </span>
        );
      case 'MODERATE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFF8EB] text-[#FF9500] border border-[#FFE2B3]">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Moderate</span>
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E8F8ED] text-[#34C759] border border-[#BDECC9]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Safe / Low</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F5F5F7] text-[#6E6E73] border border-[#E5E5EA]">
            <FileQuestion className="w-3.5 h-3.5" />
            <span>Insufficient</span>
          </span>
        );
    }
  };

  return (
    <div className="flex-1 bg-[#FAFAFC] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Heading & Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E5EA]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
              Consumer Security Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[#6E6E73] mt-0.5">
              Live inspection analytics backed by local SQLite persistence. No simulated statistics.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1D1D1F] bg-white border border-[#E5E5EA] rounded-lg hover:bg-[#F5F5F7] transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <Link
              to="/analyze"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0071E3] rounded-lg hover:bg-[#005BB5] transition-colors shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Analysis</span>
            </Link>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-[#FFF2F2] border border-[#FFCCD0] text-xs text-[#FF3B30] flex items-center justify-between">
            <span>{errorMsg}</span>
            <button onClick={loadData} className="underline font-semibold ml-2">Retry</button>
          </div>
        )}

        {/* Quick Analyze Box */}
        <div className="bg-white rounded-2xl border border-[#E5E5EA] p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0071E3]" />
              <h2 className="text-sm font-semibold text-[#1D1D1F]">Quick-Analyze Communication</h2>
            </div>
            <Link to="/analyze" className="text-xs font-medium text-[#0071E3] hover:underline">
              Audio Upload & Advanced Options →
            </Link>
          </div>
          <form onSubmit={handleQuickAnalyze} className="space-y-3">
            <textarea
              value={quickText}
              onChange={(e) => setQuickText(e.target.value)}
              placeholder="Paste suspicious SMS, WhatsApp notice, caller transcript, or refund offer here..."
              rows={2}
              className="w-full text-sm rounded-xl border border-[#E5E5EA] p-3 focus:outline-none focus:ring-2 focus:ring-[#0071E3] focus:border-transparent resize-none bg-[#FAFAFC]"
            />
            <div className="flex items-center justify-between">
              <div className="text-[11px] text-[#6E6E73]">
                Context-aware detection: OTP requests, refund fees, fake support, urgency threats.
              </div>
              <button
                type="submit"
                disabled={submitting || !quickText.trim()}
                className="px-4 py-2 bg-[#0071E3] text-white rounded-lg text-xs font-semibold hover:bg-[#005BB5] disabled:opacity-50 transition-colors"
              >
                {submitting ? 'Analyzing...' : 'Run Quick Audit'}
              </button>
            </div>
          </form>
        </div>

        {/* 4 Stat Cards (Real SQLite counts) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Total */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E5EA] shadow-sm">
            <div className="text-xs font-medium text-[#6E6E73]">Total Analyzed</div>
            <div className="text-3xl font-extrabold text-[#1D1D1F] mt-2">
              {stats?.total_analyzed ?? 0}
            </div>
            <div className="text-[11px] text-[#6E6E73] mt-1">Verified audit records</div>
          </div>

          {/* Card 2: High Risk */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E5EA] shadow-sm">
            <div className="text-xs font-medium text-[#FF3B30] flex items-center justify-between">
              <span>High Risk Scams</span>
              <ShieldAlert className="w-4 h-4 text-[#FF3B30]" />
            </div>
            <div className="text-3xl font-extrabold text-[#FF3B30] mt-2">
              {stats?.breakdown['HIGH'] ?? 0}
            </div>
            <div className="text-[11px] text-[#6E6E73] mt-1">Coercive / Advance fee</div>
          </div>

          {/* Card 3: Moderate Risk */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E5EA] shadow-sm">
            <div className="text-xs font-medium text-[#FF9500] flex items-center justify-between">
              <span>Moderate Threats</span>
              <AlertTriangle className="w-4 h-4 text-[#FF9500]" />
            </div>
            <div className="text-3xl font-extrabold text-[#FF9500] mt-2">
              {stats?.breakdown['MODERATE'] ?? 0}
            </div>
            <div className="text-[11px] text-[#6E6E73] mt-1">Unverified credentials</div>
          </div>

          {/* Card 4: Safe / Low */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E5EA] shadow-sm">
            <div className="text-xs font-medium text-[#34C759] flex items-center justify-between">
              <span>Low / Safe Notices</span>
              <ShieldCheck className="w-4 h-4 text-[#34C759]" />
            </div>
            <div className="text-3xl font-extrabold text-[#34C759] mt-2">
              {stats?.breakdown['LOW'] ?? 0}
            </div>
            <div className="text-[11px] text-[#6E6E73] mt-1">Safe advisories & normal</div>
          </div>
        </div>

        {/* Risk Distribution Breakdown Bar */}
        {stats && stats.total_analyzed > 0 && (
          <div className="bg-white p-5 rounded-2xl border border-[#E5E5EA] shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-[#1D1D1F]">
              <span>Risk Distribution Ratio</span>
              <span>{stats.total_analyzed} Communications Indexed</span>
            </div>
            <div className="w-full h-3 bg-[#F5F5F7] rounded-full overflow-hidden flex">
              <div
                style={{ width: `${((stats.breakdown.HIGH || 0) / stats.total_analyzed) * 100}%` }}
                className="bg-[#FF3B30] h-full"
                title={`High Risk: ${stats.breakdown.HIGH || 0}`}
              />
              <div
                style={{ width: `${((stats.breakdown.MODERATE || 0) / stats.total_analyzed) * 100}%` }}
                className="bg-[#FF9500] h-full"
                title={`Moderate: ${stats.breakdown.MODERATE || 0}`}
              />
              <div
                style={{ width: `${((stats.breakdown.LOW || 0) / stats.total_analyzed) * 100}%` }}
                className="bg-[#34C759] h-full"
                title={`Safe / Low: ${stats.breakdown.LOW || 0}`}
              />
              <div
                style={{ width: `${(((stats.breakdown as any)['INSUFFICIENT EVIDENCE'] || 0) / stats.total_analyzed) * 100}%` }}
                className="bg-[#8E8E93] h-full"
                title="Insufficient"
              />
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#6E6E73] pt-1">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#FF3B30]"></span> High Risk ({stats.breakdown.HIGH || 0})</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#FF9500]"></span> Moderate ({stats.breakdown.MODERATE || 0})</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#34C759]"></span> Safe ({stats.breakdown.LOW || 0})</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#8E8E93]"></span> Insufficient ({(stats.breakdown as any)['INSUFFICIENT EVIDENCE'] || 0})</span>
            </div>
          </div>
        )}

        {/* Recent Analyses List / Empty State */}
        <div className="bg-white rounded-2xl border border-[#E5E5EA] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#E5E5EA] flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#1D1D1F]">Recent Incident Audit Trail</h2>
              <p className="text-xs text-[#6E6E73] mt-0.5">Click any entry to view complete explainable risk evidence.</p>
            </div>
            <Link to="/history" className="text-xs font-semibold text-[#0071E3] hover:underline">
              View All History ({history.length}) →
            </Link>
          </div>

          {history.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F5F5F7] text-[#6E6E73] flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-base font-semibold text-[#1D1D1F]">No analyses recorded yet</h3>
                <p className="text-xs text-[#6E6E73] mt-1 leading-relaxed">
                  Start by testing a live communication in the analyzer, or run one of our 4 pre-built real sample scenarios.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  to="/analyze"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0071E3] text-white text-xs font-semibold hover:bg-[#005BB5] transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Analyze Your First Message</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-[#E5E5EA]">
              {history.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/results/${item.id}`)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F5F5F7]/60 cursor-pointer transition-colors"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      {getRiskBadge(item.risk_level)}
                      <span className="text-xs uppercase font-medium text-[#6E6E73] bg-[#F5F5F7] px-2 py-0.5 rounded">
                        {item.input_type}
                      </span>
                      <span className="text-[11px] text-[#8E8E93]">
                        {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-[#1D1D1F] line-clamp-1">
                      {item.title}
                    </div>
                    <div className="text-xs text-[#6E6E73] line-clamp-1">
                      {item.redacted_preview || item.input_text}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0 self-end sm:self-center">
                    <span className="text-xs font-mono font-semibold text-[#1D1D1F] bg-[#F5F5F7] px-2 py-1 rounded-md">
                      Score: {item.risk_score}/100
                    </span>
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-1.5 rounded-lg text-[#8E8E93] hover:text-[#FF3B30] hover:bg-[#FFF2F2] transition-colors"
                      title="Delete record from SQLite"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ArrowRight className="w-4 h-4 text-[#8E8E93]" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <Link
            to="/rights"
            className="p-5 rounded-2xl bg-white border border-[#E5E5EA] hover:border-[#0071E3] transition-colors shadow-sm flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#F5F5F7] text-[#0071E3] flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#1D1D1F]">Consumer Rights Assistant</h3>
                <p className="text-xs text-[#6E6E73]">Inspect the 6 statutory rights guaranteed under CPA 2019</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#6E6E73] group-hover:text-[#0071E3] transition-colors" />
          </Link>

          <Link
            to="/complaint"
            className="p-5 rounded-2xl bg-white border border-[#E5E5EA] hover:border-[#0071E3] transition-colors shadow-sm flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#F5F5F7] text-[#0071E3] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#1D1D1F]">Complaint Assistant</h3>
                <p className="text-xs text-[#6E6E73]">Generate formal statutory drafts for NCH 1915 or e-Jagriti</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#6E6E73] group-hover:text-[#0071E3] transition-colors" />
          </Link>
        </div>

      </div>
    </div>
  );
};
