import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { createComplaintDraft } from '../api';
import {
  FileText,
  Scale,
  Copy,
  Download,
  Check,
  ExternalLink,
  Info,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Phone,
  CheckCircle2
} from 'lucide-react';

export const ComplaintAssistantPage: React.FC = () => {
  const location = useLocation();
  const stateData = (location.state as any) || {};

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    complainant_name: '',
    complainant_phone: '',
    complainant_city: '',
    opposite_party: '',
    incident_type: stateData.incident_type || 'Advance Fee / Phishing Scam',
    transaction_ref: '',
    disputed_amount: '',
    incident_date: new Date().toISOString().split('T')[0],
    description: stateData.description || '',
    evidence_points: stateData.evidence_points || []
  });

  const [draftResult, setDraftResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [newEvidence, setNewEvidence] = useState('');

  // If evidence points were passed from results page, load them
  useEffect(() => {
    if (stateData.description || (stateData.evidence_points && stateData.evidence_points.length > 0)) {
      setFormData((prev) => ({
        ...prev,
        incident_type: stateData.incident_type || prev.incident_type,
        description: stateData.description || prev.description,
        evidence_points: stateData.evidence_points || prev.evidence_points
      }));
    }
  }, [stateData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddEvidence = () => {
    if (newEvidence.trim()) {
      setFormData({
        ...formData,
        evidence_points: [...formData.evidence_points, newEvidence.trim()]
      });
      setNewEvidence('');
    }
  };

  const handleRemoveEvidence = (index: number) => {
    setFormData({
      ...formData,
      evidence_points: formData.evidence_points.filter((_, i) => i !== index)
    });
  };

  const handleGenerateDraft = async () => {
    setLoading(true);
    try {
      const res = await createComplaintDraft(formData);
      setDraftResult(res);
      setStep(3);
    } catch (err) {
      alert('Failed to generate legal draft. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyDraft = () => {
    if (draftResult?.draft_text) {
      navigator.clipboard.writeText(draftResult.draft_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadTxt = () => {
    if (draftResult?.draft_text) {
      const element = document.createElement('a');
      const file = new Blob([draftResult.draft_text], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `SecureSense_Statutory_Complaint_${Date.now()}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <div className="flex-1 bg-[#FAFAFC] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E5E5EA] text-xs font-semibold text-[#0071E3]">
            <Scale className="w-3.5 h-3.5" />
            <span>Statutory Grievance Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
            Structured Complaint Assistant
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed">
            Convert forensic audit logs and dispute facts into formal legal notices tailored for the National Consumer Helpline, e-Jagriti Digital Court, or cybercrime.gov.in.
          </p>
        </div>

        {/* Multi-step progress tracker */}
        <div className="bg-white rounded-2xl border border-[#E5E5EA] p-4 shadow-sm">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <button
              onClick={() => setStep(1)}
              className={`py-2 px-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
                step === 1 ? 'bg-[#0071E3] text-white shadow-sm' : 'bg-[#F5F5F7] text-[#1D1D1F]'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px]">1</span>
              <span>Dispute Details</span>
            </button>

            <button
              onClick={() => setStep(2)}
              className={`py-2 px-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
                step === 2 ? 'bg-[#0071E3] text-white shadow-sm' : 'bg-[#F5F5F7] text-[#1D1D1F]'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px]">2</span>
              <span>Evidence & Facts</span>
            </button>

            <button
              onClick={() => draftResult && setStep(3)}
              disabled={!draftResult}
              className={`py-2 px-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
                step === 3 ? 'bg-[#0071E3] text-white shadow-sm' : 'bg-[#F5F5F7] text-[#6E6E73] disabled:opacity-60'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px]">3</span>
              <span>Review & Export</span>
            </button>
          </div>
        </div>

        {/* Step 1: Details */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-[#E5E5EA] pb-3">
              <h2 className="text-base font-bold text-[#1D1D1F]">Step 1: Party & Incident Information</h2>
              <p className="text-xs text-[#6E6E73] mt-0.5">Enter particulars of the aggrieved consumer and the opposing party or caller.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">Your Full Name</label>
                <input
                  type="text"
                  name="complainant_name"
                  value={formData.complainant_name}
                  onChange={handleChange}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full text-sm rounded-xl border border-[#E5E5EA] px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0071E3] bg-[#FAFAFC]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">Contact Phone</label>
                <input
                  type="text"
                  name="complainant_phone"
                  value={formData.complainant_phone}
                  onChange={handleChange}
                  placeholder="+91 98XXX XXXXX"
                  className="w-full text-sm rounded-xl border border-[#E5E5EA] px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0071E3] bg-[#FAFAFC]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">City & State</label>
                <input
                  type="text"
                  name="complainant_city"
                  value={formData.complainant_city}
                  onChange={handleChange}
                  placeholder="e.g. New Delhi, Delhi"
                  className="w-full text-sm rounded-xl border border-[#E5E5EA] px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0071E3] bg-[#FAFAFC]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">Opposite Party / Merchant Name</label>
                <input
                  type="text"
                  name="opposite_party"
                  value={formData.opposite_party}
                  onChange={handleChange}
                  placeholder="e.g. ABC E-Commerce Ltd / SBI Impersonator"
                  className="w-full text-sm rounded-xl border border-[#E5E5EA] px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0071E3] bg-[#FAFAFC]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">Incident Category</label>
                <select
                  name="incident_type"
                  value={formData.incident_type}
                  onChange={handleChange}
                  className="w-full text-sm rounded-xl border border-[#E5E5EA] px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0071E3] bg-[#FAFAFC]"
                >
                  <option value="Fake Refund Processing Fee Scam">Fake Refund Processing Fee Scam</option>
                  <option value="OTP / Credential Phishing Call">OTP / Credential Phishing Call</option>
                  <option value="Authority Impersonation (Police / CBI / RBI)">Authority Impersonation (Police / CBI / RBI)</option>
                  <option value="E-Commerce Defective Product & Refund Denial">E-Commerce Defective Product & Refund Denial</option>
                  <option value="Utility Bill Disconnection Threat">Utility Bill Disconnection Threat</option>
                  <option value="Remote Access App (AnyDesk / TeamViewer)">Remote Access App (AnyDesk / TeamViewer)</option>
                  <option value="General Consumer Dispute (CPA 2019)">General Consumer Dispute (CPA 2019)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">Transaction Ref / Phone / UPI ID</label>
                <input
                  type="text"
                  name="transaction_ref"
                  value={formData.transaction_ref}
                  onChange={handleChange}
                  placeholder="e.g. UPI/2026/09482716 or +91 98765 43210"
                  className="w-full text-sm rounded-xl border border-[#E5E5EA] px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0071E3] bg-[#FAFAFC]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">Disputed Amount in INR</label>
                <input
                  type="number"
                  name="disputed_amount"
                  value={formData.disputed_amount}
                  onChange={handleChange}
                  placeholder="e.g. 4999"
                  className="w-full text-sm rounded-xl border border-[#E5E5EA] px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0071E3] bg-[#FAFAFC]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">Date of Incident</label>
                <input
                  type="date"
                  name="incident_date"
                  value={formData.incident_date}
                  onChange={handleChange}
                  className="w-full text-sm rounded-xl border border-[#E5E5EA] px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0071E3] bg-[#FAFAFC]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#E5E5EA]">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#0071E3] text-white rounded-xl text-xs font-semibold hover:bg-[#005BB5] transition-colors"
              >
                <span>Continue to Evidence</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Evidence & Description */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-[#E5E5EA] pb-3">
              <h2 className="text-base font-bold text-[#1D1D1F]">Step 2: Statement of Facts & Evidence Excerpts</h2>
              <p className="text-xs text-[#6E6E73] mt-0.5">Narrate what transpired and attach specific statements made by the opposing party.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                Factual Narrative
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe clearly how the call or transaction occurred, what promises were made, and why this represents unfair trade practice or fraud..."
                className="w-full text-sm rounded-xl border border-[#E5E5EA] p-3.5 focus:outline-none focus:ring-2 focus:ring-[#0071E3] bg-[#FAFAFC] resize-y leading-relaxed text-xs"
              />
            </div>

            {/* Evidence items list */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[#1D1D1F]">
                Key Forensic Evidence Points / Violations
              </label>

              {formData.evidence_points.map((pt: string, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-[#FAFAFC] border border-[#E5E5EA] text-xs">
                  <span className="text-[#1D1D1F]">{pt}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveEvidence(idx)}
                    className="text-xs text-[#FF3B30] hover:underline ml-2"
                  >
                    Delete
                  </button>
                </div>
              ))}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newEvidence}
                  onChange={(e) => setNewEvidence(e.target.value)}
                  placeholder="Add an evidence point (e.g. Demanded Rs 499 before refund could be unlocked)..."
                  className="flex-1 text-xs rounded-xl border border-[#E5E5EA] px-3 py-2 bg-[#FAFAFC]"
                />
                <button
                  type="button"
                  onClick={handleAddEvidence}
                  className="px-4 py-2 bg-[#F5F5F7] text-[#1D1D1F] border border-[#E5E5EA] rounded-xl text-xs font-semibold hover:bg-[#E5E5EA]"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E5E5EA]">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#F5F5F7] text-[#1D1D1F] rounded-xl text-xs font-semibold hover:bg-[#E5E5EA] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleGenerateDraft}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#0071E3] text-white rounded-xl text-xs font-semibold hover:bg-[#005BB5] transition-colors"
              >
                {loading ? 'Compiling Legal Clauses...' : 'Generate Formal Legal Draft'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review Draft & Export */}
        {step === 3 && draftResult && (
          <div className="space-y-6">
            {/* Jurisdiction Banner */}
            <div className="p-5 rounded-2xl bg-[#E8F8ED] border border-[#BDECC9] flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#34C759] flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="text-xs font-bold text-[#34C759] uppercase tracking-wide">
                  Jurisdiction Mapped: {draftResult.primary_forum}
                </div>
                <div className="text-xs text-[#1D1D1F] leading-relaxed">
                  Statutory Grounds: <strong>{draftResult.statutory_act}</strong>. Draft compiled and ready for dispatch.
                </div>
              </div>
            </div>

            {/* Editable Draft Text Card */}
            <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E5EA]">
                <div>
                  <h2 className="text-base font-bold text-[#1D1D1F]">Editable Statutory Legal Notice Draft</h2>
                  <p className="text-xs text-[#6E6E73]">Review or customize text before dispatching to government portals.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyDraft}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5F5F7] text-[#0071E3] text-xs font-semibold hover:bg-[#E5E5EA] transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#34C759]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Draft'}</span>
                  </button>

                  <button
                    onClick={handleDownloadTxt}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0071E3] text-white text-xs font-semibold hover:bg-[#005BB5] transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download TXT</span>
                  </button>
                </div>
              </div>

              <textarea
                value={draftResult.draft_text}
                onChange={(e) => setDraftResult({ ...draftResult, draft_text: e.target.value })}
                rows={16}
                className="w-full text-xs font-mono rounded-xl border border-[#E5E5EA] p-4 focus:outline-none focus:ring-2 focus:ring-[#0071E3] bg-[#FAFAFC] leading-relaxed"
              />

              {/* Crucial Statutory Warning */}
              <div className="p-3.5 rounded-xl bg-[#FFF8EB] border border-[#FFE2B3] text-xs text-[#B36B00] flex items-start gap-2">
                <Info className="w-4 h-4 text-[#FF9500] flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Important Notice:</strong> SecureSense prepares an evidentiary legal draft for your dispute. <strong>SecureSense does NOT automatically submit complaints to government servers.</strong> You must lodge this text directly on the verified official channels below.
                </div>
              </div>
            </div>

            {/* Official Submission Portals */}
            <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-[#1D1D1F]">
                Lodge This Draft on Official Government Portals
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {draftResult.official_channels?.map((portal: any) => (
                  <a
                    key={portal.id}
                    href={portal.portal_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl bg-[#FAFAFC] border border-[#E5E5EA] hover:border-[#0071E3] transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-[#E5E5EA] text-[#6E6E73]">
                          {portal.badge}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-[#6E6E73] group-hover:text-[#0071E3]" />
                      </div>
                      <h4 className="text-xs font-bold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors">
                        {portal.name}
                      </h4>
                      <p className="text-[11px] text-[#6E6E73] mt-1 line-clamp-2">
                        {portal.purpose}
                      </p>
                    </div>

                    {portal.toll_free && (
                      <div className="mt-3 pt-2 border-t border-[#E5E5EA] text-[11px] font-semibold text-[#0071E3] flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>Helpline: {portal.toll_free}</span>
                      </div>
                    )}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F5F5F7] text-[#1D1D1F] rounded-xl text-xs font-semibold hover:bg-[#E5E5EA]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Edit Facts</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setDraftResult(null);
                }}
                className="text-xs text-[#0071E3] hover:underline font-semibold"
              >
                Start Another Complaint Draft
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
