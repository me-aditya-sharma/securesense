import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  analyzeText,
  analyzeFormData,
  fetchSamples,
  fetchSampleAudioList,
  analyzeSampleAudio,
  SampleScenario,
  SampleAudioItem
} from '../api';
import {
  Shield,
  FileText,
  Mic,
  Upload,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Info,
  Play,
  Volume2,
  FileAudio
} from 'lucide-react';

export const AnalyzePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'text' | 'audio'>('text');
  const [inputText, setInputText] = useState('');
  const [inputTitle, setInputTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [samples, setSamples] = useState<SampleScenario[]>([]);
  const [audioSamples, setAudioSamples] = useState<SampleAudioItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  useEffect(() => {
    fetchSamples()
      .then((data) => setSamples(data))
      .catch((err) => console.error('Could not load samples', err));

    fetchSampleAudioList()
      .then((data) => setAudioSamples(data))
      .catch((err) => console.error('Could not load sample audio', err));
  }, []);

  const handleSelectSample = (sample: SampleScenario) => {
    setActiveTab('text');
    setInputTitle(sample.title);
    setInputText(sample.text);
    setErrorMsg('');
  };

  const handleRunSampleAudio = async (sampleItem: SampleAudioItem) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const result = await analyzeSampleAudio(sampleItem.id);
      navigate(`/results/${result.id}`);
    } catch (err) {
      setErrorMsg('Failed to process sample audio file.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAudio = (filename: string) => {
    const audioUrl = `http://localhost:8000/api/audio/stream/${filename}`;
    const audio = new Audio(audioUrl);
    setPlayingAudio(filename);
    audio.play();
    audio.onended = () => setPlayingAudio(null);
    audio.onerror = () => setPlayingAudio(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (activeTab === 'text') {
      if (!inputText.trim() || inputText.trim().length < 5) {
        setErrorMsg('Please enter at least 5 characters to analyze.');
        return;
      }

      setLoading(true);
      try {
        const result = await analyzeText(inputText, inputTitle || 'Manual Communication Audit');
        navigate(`/results/${result.id}`);
      } catch (err: any) {
        setErrorMsg('Analysis failed. Ensure the FastAPI backend is running on http://localhost:8000.');
      } finally {
        setLoading(false);
      }
    } else {
      if (!selectedFile && !inputText.trim()) {
        setErrorMsg('Please select an audio file (or provide a transcript text) to analyze.');
        return;
      }

      setLoading(true);
      try {
        const formData = new FormData();
        if (selectedFile) {
          formData.append('audio_file', selectedFile);
        }
        if (inputText.trim()) {
          formData.append('text', inputText);
        }
        formData.append('title', inputTitle || (selectedFile ? selectedFile.name : 'Audio Threat Audit'));

        const result = await analyzeFormData(formData);
        navigate(`/results/${result.id}`);
      } catch (err: any) {
        setErrorMsg('Audio upload analysis failed. Check file size (< 25MB) or backend logs.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex-1 bg-[#FAFAFC] py-8 sm:py-12 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E5E5EA] text-xs font-semibold text-[#0071E3] shadow-sm">
            <Shield className="w-3.5 h-3.5" />
            <span>Rule-Based Context Threat Diagnostics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
            Analyze a Suspicious Communication
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed">
            Screen incoming calls, SMS messages, WhatsApp requests, or audio clips. Context-aware engine never confuses legitimate warnings with malicious intent.
          </p>
        </div>

        {/* 4 Sample Scenarios (Clearly labeled samples going through real API) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6E6E73]">
              Sample Scenarios (Click to test through real pipeline)
            </span>
            <span className="text-[11px] text-[#0071E3] font-medium">Real Algorithmic Analysis</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {samples.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="text-left p-4 rounded-2xl bg-white border border-[#E5E5EA] hover:border-[#0071E3] hover-lift transition-all group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors">
                    {sample.title}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F5F5F7] text-[#6E6E73]">
                    {sample.badge}
                  </span>
                </div>
                <p className="text-xs text-[#6E6E73] line-clamp-2 leading-relaxed">
                  "{sample.text}"
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Real Audio Samples Row */}
        {audioSamples.length > 0 && (
          <div className="p-4 rounded-2xl bg-white border border-[#E5E5EA] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#0071E3]" />
                <span className="text-xs font-bold text-[#1D1D1F]">Sample Audio Clips (SIH Audio Dataset)</span>
              </div>
              <span className="text-[11px] text-[#6E6E73]">Play clip or analyze directly</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {audioSamples.map((aud) => (
                <div
                  key={aud.id}
                  className="p-3 rounded-xl bg-[#FAFAFC] border border-[#E5E5EA] flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5 max-w-[240px]">
                    <div className="text-xs font-bold text-[#1D1D1F] truncate">{aud.title}</div>
                    <div className="text-[11px] text-[#6E6E73] truncate">"{aud.transcript}"</div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handlePlayAudio(aud.filename)}
                      className="p-2 rounded-lg bg-white border border-[#E5E5EA] text-[#0071E3] hover:bg-[#F5F5F7] transition-colors"
                      title="Play Audio"
                    >
                      <Play className={`w-3.5 h-3.5 ${playingAudio === aud.filename ? 'animate-bounce text-[#34C759]' : ''}`} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRunSampleAudio(aud)}
                      className="px-3 py-1.5 rounded-lg bg-[#0071E3] text-white text-xs font-semibold hover:bg-[#005BB5] transition-colors"
                    >
                      Analyze Audio
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Analysis Form Card */}
        <div className="relative bg-white rounded-3xl border border-[#E5E5EA] p-6 sm:p-8 shadow-sm space-y-6 overflow-hidden">
          
          {/* Animated Scanner Laser when loading */}
          {loading && (
            <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#0071E3] to-transparent animate-scanner pointer-events-none z-10 shadow-[0_0_12px_#0071E3]" />
          )}

          {/* Mode Switcher Tabs */}
          <div className="flex items-center border-b border-[#E5E5EA] pb-3 gap-6">
            <button
              type="button"
              onClick={() => setActiveTab('text')}
              className={`flex items-center gap-2 pb-2 text-sm font-semibold border-b-2 transition-all ${
                activeTab === 'text'
                  ? 'border-[#0071E3] text-[#0071E3]'
                  : 'border-transparent text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Paste Text / Transcript</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('audio')}
              className={`flex items-center gap-2 pb-2 text-sm font-semibold border-b-2 transition-all ${
                activeTab === 'audio'
                  ? 'border-[#0071E3] text-[#0071E3]'
                  : 'border-transparent text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              <FileAudio className="w-4 h-4" />
              <span>Upload Audio Clip (.WAV / .MP3)</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-[#FFF2F2] border border-[#FFCCD0] text-xs text-[#FF3B30] flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title / Reference Label */}
            <div>
              <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
                Incident Reference / Label <span className="text-[#8E8E93] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={inputTitle}
                onChange={(e) => setInputTitle(e.target.value)}
                placeholder="e.g. Caller claiming to be SBI Card Dept, WhatsApp refund message, etc."
                className="w-full text-sm rounded-xl border border-[#E5E5EA] px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0071E3] focus:border-transparent bg-[#FAFAFC]"
              />
            </div>

            {/* Tab 1: Text Input */}
            {activeTab === 'text' && (
              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
                  Communication Payload / Transcript Text
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste verbatim call transcript, SMS body, or WhatsApp message payload here..."
                  rows={6}
                  className="w-full text-sm rounded-xl border border-[#E5E5EA] p-3.5 focus:outline-none focus:ring-2 focus:ring-[#0071E3] focus:border-transparent bg-[#FAFAFC] resize-y leading-relaxed font-mono text-xs"
                />
                <div className="flex items-center justify-between text-[11px] text-[#6E6E73] mt-1.5">
                  <span>Sensitive OTP numbers and cards are automatically redacted before storage.</span>
                  <span>{inputText.length} characters</span>
                </div>
              </div>
            )}

            {/* Tab 2: Audio Upload */}
            {activeTab === 'audio' && (
              <div className="space-y-4">
                <label className="block text-xs font-semibold text-[#1D1D1F]">
                  Upload Call Audio Recording (WAV, MP3, M4A up to 25MB)
                </label>
                
                <div className="border-2 border-dashed border-[#E5E5EA] rounded-2xl p-6 text-center hover:border-[#0071E3] transition-colors bg-[#FAFAFC]">
                  <input
                    type="file"
                    id="audio-file-input"
                    accept="audio/*,.wav,.mp3,.m4a"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                  <label htmlFor="audio-file-input" className="cursor-pointer space-y-2 block">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#E5E5EA] flex items-center justify-center mx-auto text-[#0071E3] shadow-sm">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-[#0071E3] hover:underline">Click to browse audio</span>
                      <span className="text-xs text-[#6E6E73]"> or drop file here</span>
                    </div>
                    <div className="text-[11px] text-[#8E8E93]">
                      Standard telephone format 16kHz or 44.1kHz PCM accepted.
                    </div>
                  </label>
                </div>

                {selectedFile && (
                  <div className="p-3 rounded-xl bg-white border border-[#0071E3]/30 flex items-center justify-between animate-fade-in">
                    <div className="flex items-center gap-2 text-xs">
                      <FileAudio className="w-4 h-4 text-[#0071E3]" />
                      <span className="font-semibold text-[#1D1D1F]">{selectedFile.name}</span>
                      <span className="text-[#6E6E73]">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="text-xs text-[#FF3B30] hover:underline font-medium"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
                    Optional Audio Transcript (if available)
                  </label>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Provide transcript dialogue if you know what was said..."
                    rows={3}
                    className="w-full text-sm rounded-xl border border-[#E5E5EA] p-3 focus:outline-none focus:ring-2 focus:ring-[#0071E3] bg-[#FAFAFC] text-xs resize-none"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#E5E5EA]">
              <div className="flex items-center gap-2 text-xs text-[#6E6E73]">
                <Info className="w-4 h-4 text-[#0071E3]" />
                <span>Deterministic rule-based heuristics. Real acoustic waveform extraction.</span>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0071E3] text-white text-sm font-semibold hover:bg-[#005BB5] disabled:opacity-50 transition-all shadow-sm active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>Scanning Threats & Audio Telemetry...</span>
                  </>
                ) : (
                  <>
                    <span>Run Verification Pipeline</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
