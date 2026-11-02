import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchHistory, deleteHistoryItem, AnalysisRecord } from '../api';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileQuestion,
  Trash2,
  Search,
  ArrowRight,
  Download,
  RefreshCw,
  PlusCircle,
  Clock
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'HIGH' | 'MODERATE' | 'LOW' | 'INSUFFICIENT EVIDENCE'>('ALL');

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await fetchHistory();
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Permanently delete this analysis record from SQLite?')) {
      try {
        await deleteHistoryItem(id);
        setHistory((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        alert('Failed to delete item.');
      }
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `securesense_audit_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filtered = history.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.redacted_preview && item.redacted_preview.toLowerCase().includes(search.toLowerCase()));

    const matchesRisk = riskFilter === 'ALL' || item.risk_level === riskFilter;

    return matchesSearch && matchesRisk;
  });

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
            <span>Safe</span>
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E5EA]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
              Local Audit History
            </h1>
            <p className="text-xs sm:text-sm text-[#6E6E73] mt-0.5">
              Evidentiary log of all past threat audits persisted in local SQLite. Sensitive OTPs redacted.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              disabled={history.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1D1D1F] bg-white border border-[#E5E5EA] rounded-lg hover:bg-[#F5F5F7] disabled:opacity-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={loadHistory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1D1D1F] bg-white border border-[#E5E5EA] rounded-lg hover:bg-[#F5F5F7] transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-[#8E8E93] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search audit trail..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E5E5EA] bg-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
            />
          </div>

          {/* Risk Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['ALL', 'HIGH', 'MODERATE', 'LOW', 'INSUFFICIENT EVIDENCE'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setRiskFilter(filter)}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                  riskFilter === filter
                    ? 'bg-[#0071E3] text-white shadow-sm'
                    : 'bg-white border border-[#E5E5EA] text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                {filter === 'ALL' ? 'All Records' : filter}
              </button>
            ))}
          </div>
        </div>

        {/* History Records List */}
        <div className="bg-white rounded-2xl border border-[#E5E5EA] shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs text-[#6E6E73]">
              Loading records from SQLite...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Clock className="w-8 h-8 text-[#8E8E93] mx-auto" />
              <div className="text-sm font-semibold text-[#1D1D1F]">No records found</div>
              <p className="text-xs text-[#6E6E73]">
                {history.length === 0
                  ? 'No communications analyzed yet. Run an analysis to populate audit records.'
                  : 'No records matched your search filter.'}
              </p>
              {history.length === 0 && (
                <div className="pt-2">
                  <Link
                    to="/analyze"
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-[#0071E3] text-white text-xs font-semibold"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Run First Analysis</span>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="divide-y divide-[#E5E5EA]">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/results/${item.id}`)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F5F5F7]/70 cursor-pointer transition-colors"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getRiskBadge(item.risk_level)}
                      <span className="text-xs font-mono font-medium text-[#6E6E73] bg-[#F5F5F7] px-2 py-0.5 rounded">
                        #{item.id}
                      </span>
                      <span className="text-xs uppercase font-medium text-[#6E6E73] bg-[#F5F5F7] px-2 py-0.5 rounded">
                        {item.input_type}
                      </span>
                      <span className="text-[11px] text-[#8E8E93]">
                        {new Date(item.created_at).toLocaleString()}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#1D1D1F] line-clamp-1">
                      {item.title}
                    </h3>

                    <p className="text-xs text-[#6E6E73] line-clamp-2 leading-relaxed">
                      {item.redacted_preview}
                    </p>

                    {item.categories && item.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {item.categories.map((c, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-medium bg-[#FAFAFC] text-[#6E6E73] border border-[#E5E5EA] px-2 py-0.5 rounded"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center flex-shrink-0">
                    <div className="text-right">
                      <div className="text-sm font-bold font-mono text-[#1D1D1F]">
                        {item.risk_score}/100
                      </div>
                      <div className="text-[10px] text-[#8E8E93]">Risk Score</div>
                    </div>

                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-2 rounded-lg text-[#8E8E93] hover:text-[#FF3B30] hover:bg-[#FFF2F2] transition-colors"
                      title="Delete record"
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

      </div>
    </div>
  );
};
