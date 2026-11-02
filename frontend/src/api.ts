const API_BASE = 'http://localhost:8000/api';

export interface AnalysisRecord {
  id: number;
  created_at: string;
  input_type: 'text' | 'audio';
  title: string;
  input_text?: string;
  audio_filename?: string;
  risk_level: 'LOW' | 'MODERATE' | 'HIGH' | 'INSUFFICIENT EVIDENCE';
  risk_score: number;
  confidence: string;
  categories: string[];
  evidence?: string[];
  recommended_actions?: string[];
  voice_result?: {
    status: string;
    is_available: boolean;
    label: string;
    details: string;
    duration_seconds?: number;
    channels?: number;
    sample_rate?: number;
    rms_energy?: number;
    zero_crossing_rate?: number;
    waveform_data?: number[];
  };
  redacted_preview?: string;
}

export interface StatsResponse {
  total_analyzed: number;
  breakdown: {
    HIGH: number;
    MODERATE: number;
    LOW: number;
    'INSUFFICIENT EVIDENCE': number;
  };
  recent_analyses: Array<{
    id: number;
    created_at: string;
    input_type: string;
    title: string;
    risk_level: string;
    risk_score: number;
    categories: string[];
  }>;
}

export interface ConsumerRight {
  id: string;
  name: string;
  act: string;
  summary: string;
  digital_context: string;
  remedy: string;
  icon: string;
}

export interface SampleScenario {
  id: string;
  title: string;
  badge: string;
  category: string;
  text: string;
  description: string;
}

export interface SampleAudioItem {
  id: string;
  title: string;
  filename: string;
  expected_label: string;
  transcript: string;
}

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function fetchStats(): Promise<StatsResponse> {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function fetchHistory(): Promise<AnalysisRecord[]> {
  const res = await fetch(`${API_BASE}/history`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
}

export async function fetchHistoryDetail(id: string | number): Promise<AnalysisRecord> {
  const res = await fetch(`${API_BASE}/history/${id}`);
  if (!res.ok) throw new Error('Failed to fetch record details');
  return res.json();
}

export async function deleteHistoryItem(id: number) {
  const res = await fetch(`${API_BASE}/history/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete history item');
  return res.json();
}

export async function analyzeText(text: string, title?: string): Promise<AnalysisRecord> {
  const res = await fetch(`${API_BASE}/analyze/json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, title })
  });
  if (!res.ok) throw new Error('Failed to analyze text');
  return res.json();
}

export async function analyzeFormData(formData: FormData): Promise<AnalysisRecord> {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) throw new Error('Failed to analyze input');
  return res.json();
}

export async function fetchRights(): Promise<{ rights: ConsumerRight[]; dispute_vs_cybercrime: any; source: string }> {
  const res = await fetch(`${API_BASE}/rights`);
  if (!res.ok) throw new Error('Failed to fetch consumer rights');
  return res.json();
}

export async function createComplaintDraft(data: any) {
  const res = await fetch(`${API_BASE}/complaints/draft`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to generate complaint draft');
  return res.json();
}

export async function fetchSamples(): Promise<SampleScenario[]> {
  const res = await fetch(`${API_BASE}/samples`);
  if (!res.ok) throw new Error('Failed to fetch sample scenarios');
  return res.json();
}

export async function fetchSampleAudioList(): Promise<SampleAudioItem[]> {
  const res = await fetch(`${API_BASE}/audio/samples`);
  if (!res.ok) throw new Error('Failed to fetch sample audio list');
  return res.json();
}

export async function analyzeSampleAudio(sampleId: string): Promise<AnalysisRecord> {
  const res = await fetch(`${API_BASE}/analyze/sample-audio/${sampleId}`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to analyze sample audio');
  return res.json();
}
