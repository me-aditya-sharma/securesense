import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchHistoryDetail, AnalysisRecord } from '../api';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileQuestion,
  ArrowLeft,
  Scale,
  Copy,
  Check,
  Info,
  Mic,
  Activity,
  Play,
  Volume2,
  Lock,
  ListChecks
} from 'lucide-react';

export const ResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<AnalysisRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchHistoryDetail(id)
        .then((data) => {
          setRecord(data);
          setErrorMsg('');
        })
        .catch((err) => {
          console.error(err);
          setErrorMsg('Failed to load analysis record. It may have been deleted or the backend was restarted.');
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleCopy = () => {
    if (record?.redacted_preview || record?.input_text) {
      navigator.clipboard.writeText(record.redacted_preview || record.input_text || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePlayUploadedAudio = () => {
    if (!record?.audio_filename) return;
    const url = `http://localhost:8000/api/audio/stream/${record.audio_filename}`;
    const audio = new Audio(url);
    setIsPlayingAudio(true);
    audio.play();
    audio.onended = () => setIsPlayingAudio(false);
    audio.onerror = () => setIsPlayingAudio(false);
  };

  const handleDraftComplaint = () => {
    if (!record) return;
    navigate('/complaint', {
      state: {
        incident_type: record.categories && record.categories.length > 0 ? record.categories[0] : 'Deceptive Communication',
        description: record.redacted_preview || record.input_text,
        evidence_points: record.evidence || []
      }
    });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24 bg-[#FAFAFC]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-[#0071E3] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="text-sm font-semibold text-[#1D1D1F]">Loading Forensic Assessment...</div>
        </div>
      </div>
    );
  }

  if (errorMsg || !record) {
    return (
      <div className="flex-1 flex items-center justify-center py-24 bg-[#FAFAFC] px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#E5E5EA] text-center space-y-4 shadow-sm">
          <AlertTriangle className="w-10 h-10 text-[#FF9500] mx-auto" />
          <h2 className="text-base font-bold text-[#1D1D1F]">Record Not Available</h2>
          <p className="text-xs text-[#6E6E73]">{errorMsg || 'Could not find the specified analysis.'}</p>
          <Link
            to="/analyze"
            className="inline-block px-4 py-2 bg-[#0071E3] text-white text-xs font-semibold rounded-lg hover:bg-[#005BB5]"
          >
            Start New Analysis
          </Link>
        </div>
      </div>
    );
  }

  const getVerdictStyle = () => {
    switch (record.risk_level) {
      case 'HIGH':
        return {
          bg: 'bg-[#FFF2F2]',
          border: 'border-[#FFCCD0]',
          text: 'text-[#FF3B30]',
          colorHex: '#FF3B30',
          icon: ShieldAlert,
          title: 'High Risk — Deceptive Threat Detected',
          sub: 'Coercive tactics, unauthorized fee requests, or credential harvesting identified.'
        };
      case 'MODERATE':
        return {
          bg: 'bg-[#FFF8EB]',
          border: 'border-[#FFE2B3]',
          text: 'text-[#FF9500]',
          colorHex: '#FF9500',
          icon: AlertTriangle,
          title: 'Moderate Risk — Exercise Caution',
          sub: 'Suspicious urgency or unverified claims detected. Verify through official channels.'
        };
      case 'LOW':
        return {
          bg: 'bg-[#E8F8ED]',
          border: 'border-[#BDECC9]',
          text: 'text-[#34C759]',
          colorHex: '#34C759',
          icon: ShieldCheck,
          title: 'Low Risk — Safe Communication',
          sub: 'No coercive patterns detected. Contextual negation indicates protective or standard advisory.'
        };
      default:
        return {
          bg: 'bg-[#F5F5F7]',
          border: 'border-[#E5E5EA]',
          text: 'text-[#8E8E93]',
          colorHex: '#8E8E93',
          icon: FileQuestion,
          title: 'Insufficient Evidence',
          sub: 'Input payload was too brief to perform a reliable forensic evaluation.'
        };
    }
  };

  const verdict = getVerdictStyle();
  const VerdictIcon = verdict.icon;

  // SVG Circular Gauge parameters
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (record.risk_score / 100) * circumference;

  return (
    <div className="flex-1 bg-[#FAFAFC] py-8 sm:py-12 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <span className="text-xs text-[#8E8E93] font-mono">
            Audit ID: #{record.id} • {new Date(record.created_at).toLocaleString()}
          </span>
        </div>

        {/* 1. Main Visual Verdict Card with Animated Circular Gauge */}
        <div className={`p-6 sm:p-8 rounded-3xl border ${verdict.border} ${verdict.bg} shadow-sm space-y-4 hover-lift`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-white flex items-center justify-center ${verdict.text} shadow-sm flex-shrink-0`}>
                <VerdictIcon className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E6E73]">
                  Diagnostic Verdict
                </span>
                <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${verdict.text}`}>
                  {record.risk_level}: {verdict.title}
                </h1>
              </div>
            </div>

            {/* Circular Risk Gauge Display */}
            <div className="bg-white px-5 py-3.5 rounded-2xl border border-white/80 shadow-sm flex items-center gap-4 flex-shrink-0 self-start sm:self-auto">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    stroke="#E5E5EA"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    stroke={verdict.colorHex}
                    strokeWidth="6"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className={`text-sm font-extrabold font-mono ${verdict.text}`}>
                    {record.risk_score}
                  </span>
                  <span className="text-[9px] text-[#8E8E93] leading-none">/100</span>
                </div>
              </div>

              <div className="space-y-0.5">
                <div className="text-[10px] uppercase font-semibold text-[#6E6E73]">Confidence</div>
                <div className="text-sm font-bold text-[#1D1D1F]">{record.confidence}</div>
                <div className="text-[10px] text-[#8E8E93]">{record.input_type.toUpperCase()} Payload</div>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#1D1D1F] leading-relaxed">
            {verdict.sub}
          </p>

          <div className="pt-2 flex items-center gap-2 text-[11px] text-[#6E6E73] border-t border-[#E5E5EA]/40">
            <Info className="w-3.5 h-3.5 text-[#0071E3] flex-shrink-0" />
            <span>
              Heuristic scores are generated via context rules and are <strong>NOT presented as validated probabilities</strong>.
            </span>
          </div>
        </div>

        {/* 2. Flagged Evidence Breakdown */}
        <div className="bg-white rounded-3xl border border-[#E5E5EA] p-6 sm:p-7 shadow-sm space-y-4 hover-lift">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E5EA]">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#0071E3]" />
              <h2 className="text-sm font-bold text-[#1D1D1F]">Flagged Forensic Evidence</h2>
            </div>
            <span className="text-xs text-[#6E6E73] font-medium">
              {record.evidence?.length ?? 0} Indicator{(record.evidence?.length ?? 0) === 1 ? '' : 's'} Logged
            </span>
          </div>

          {record.evidence && record.evidence.length > 0 ? (
            <div className="space-y-2.5">
              {record.evidence.map((point, index) => (
                <div
                  key={index}
                  className="p-3.5 rounded-xl bg-[#FAFAFC] border border-[#E5E5EA] text-xs text-[#1D1D1F] flex items-start gap-3"
                >
                  <span className="w-5 h-5 rounded-full bg-white border border-[#E5E5EA] flex items-center justify-center text-[10px] font-bold text-[#0071E3] flex-shrink-0 mt-0.5 shadow-xs">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#F5F5F7] text-xs text-[#6E6E73] text-center">
              No suspicious patterns or deceptive triggers flagged in this communication.
            </div>
          )}

          {/* Categories Pill Grid */}
          {record.categories && record.categories.length > 0 && (
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#6E6E73]">Identified Categories:</span>
              {record.categories.map((cat, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-[#F5F5F7] text-[#1D1D1F] border border-[#E5E5EA] text-xs font-medium"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 3. Real Waveform & Acoustic Telemetry Card */}
        <div className="bg-white rounded-3xl border border-[#E5E5EA] p-6 sm:p-7 shadow-sm space-y-4 hover-lift">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E5EA]">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-[#0071E3]" />
              <h2 className="text-sm font-bold text-[#1D1D1F]">Acoustic & Voice Cloning Status</h2>
            </div>
            <div className="flex items-center gap-2">
              {record.audio_filename && (
                <button
                  type="button"
                  onClick={handlePlayUploadedAudio}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0071E3] text-white text-xs font-semibold hover:bg-[#005BB5] transition-colors"
                >
                  <Play className={`w-3 h-3 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                  <span>{isPlayingAudio ? 'Playing...' : 'Play Audio'}</span>
                </button>
              )}
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F5F5F7] text-[#6E6E73] border border-[#E5E5EA]">
                {record.voice_result?.label || 'Voice Analysis Unavailable'}
              </span>
            </div>
          </div>

          <div className="text-xs text-[#6E6E73] leading-relaxed">
            {record.voice_result?.details ||
              'Audio analysis was not run or deepfake model was not loaded. In adherence to transparency rules, synthetic certainty is never fabricated. Synthetic voices do not automatically imply fraud.'}
          </div>

          {/* Genuine Waveform Display with Animated Pulsing Bars */}
          {record.voice_result?.waveform_data && (
            <div className="bg-[#F5F5F7] p-4 rounded-2xl border border-[#E5E5EA] flex items-center justify-between h-20 gap-1 overflow-hidden">
              {record.voice_result.waveform_data.map((val, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 rounded-full transition-all duration-300 ${
                    isPlayingAudio ? 'animate-wave-bar' : ''
                  } ${val > 65 ? 'bg-[#FF3B30]' : val > 40 ? 'bg-[#0071E3]' : 'bg-[#C7C7CC]'}`}
                  style={{
                    height: `${Math.max(15, val)}%`,
                    animationDelay: `${(idx % 10) * 0.1}s`
                  }}
                />
              ))}
            </div>
          )}

          {/* Real Audio Parameters if extracted */}
          {record.voice_result?.sample_rate && (
            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
              <div className="p-2 rounded-lg bg-[#FAFAFC] border border-[#E5E5EA]">
                <div className="text-[10px] text-[#6E6E73]">Sample Rate</div>
                <div className="font-bold text-[#1D1D1F]">{record.voice_result.sample_rate} Hz</div>
              </div>
              <div className="p-2 rounded-lg bg-[#FAFAFC] border border-[#E5E5EA]">
                <div className="text-[10px] text-[#6E6E73]">Duration</div>
                <div className="font-bold text-[#1D1D1F]">{record.voice_result.duration_seconds}s</div>
              </div>
              <div className="p-2 rounded-lg bg-[#FAFAFC] border border-[#E5E5EA]">
                <div className="text-[10px] text-[#6E6E73]">RMS Energy</div>
                <div className="font-bold text-[#1D1D1F]">{record.voice_result.rms_energy || 'N/A'}</div>
              </div>
            </div>
          )}
        </div>

        {/* 4. Sanitized Transcript & Credential Redaction */}
        <div className="bg-white rounded-3xl border border-[#E5E5EA] p-6 sm:p-7 shadow-sm space-y-3 hover-lift">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#0071E3]" />
              <h2 className="text-sm font-bold text-[#1D1D1F]">
                Sanitized Payload (Sensitive OTP/PINs Redacted)
              </h2>
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-[#0071E3] bg-[#F5F5F7] rounded-lg hover:bg-[#E5E5EA] transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#34C759]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAFAFC] border border-[#E5E5EA] font-mono text-xs text-[#1D1D1F] whitespace-pre-wrap leading-relaxed">
            {record.redacted_preview || record.input_text || 'No text stored.'}
          </div>
        </div>

        {/* 5. Recommended Consumer Actions Checklist */}
        <div className="bg-white rounded-3xl border border-[#E5E5EA] p-6 sm:p-7 shadow-sm space-y-4 hover-lift">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E5EA]">
            <ListChecks className="w-4 h-4 text-[#0071E3]" />
            <h2 className="text-sm font-bold text-[#1D1D1F]">Immediate Consumer Protection Actions</h2>
          </div>

          <div className="space-y-2.5">
            {record.recommended_actions && record.recommended_actions.length > 0 ? (
              record.recommended_actions.map((action, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-[#1D1D1F]">
                  <span className="w-4 h-4 rounded-full bg-[#E8F8ED] text-[#34C759] flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span className="leading-relaxed">{action}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#6E6E73]">Maintain general awareness and verify caller numbers on official websites.</p>
            )}
          </div>
        </div>

        {/* 6. Primary Action Buttons */}
        <div className="p-6 rounded-3xl bg-white border border-[#E5E5EA] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-[#1D1D1F]">Take Statutory Action</h3>
            <p className="text-xs text-[#6E6E73] mt-0.5">
              Transfer this evidence directly to the formal legal complaint draft engine.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/analyze"
              className="flex-1 sm:flex-initial text-center px-4 py-2.5 rounded-xl bg-[#F5F5F7] text-[#1D1D1F] text-xs font-semibold hover:bg-[#E5E5EA] transition-colors"
            >
              Analyze Another
            </Link>
            <button
              onClick={handleDraftComplaint}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0071E3] text-white text-xs font-semibold hover:bg-[#005BB5] transition-all shadow-sm active:scale-[0.98]"
            >
              <Scale className="w-4 h-4" />
              <span>Draft Complaint with this Evidence</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
