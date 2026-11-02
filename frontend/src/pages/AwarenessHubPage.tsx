import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Trophy
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuizScenario {
  id: number;
  title: string;
  sender: string;
  message: string;
  isScam: boolean;
  explanation: string;
  category: string;
}

const QUIZ_SCENARIOS: QuizScenario[] = [
  {
    id: 1,
    title: 'UPI Reverse Charge / Scan QR Scam',
    sender: '+91 98210 54321 (Buyer on OLX)',
    message: 'Sir, I have transferred Rs 5,000 for your furniture. Please scan this merchant QR code and enter your UPI PIN to claim the money directly into your bank.',
    isScam: true,
    explanation: 'ENTERING UPI PIN ALWAYS DEBITS MONEY. You never need to enter a PIN, password, or scan a QR code to receive a payment or refund.',
    category: 'UPI Refund Trap'
  },
  {
    id: 2,
    title: 'Legitimate Bank Advisory Message',
    sender: 'VM-HDFCBK (Verified Sender Header)',
    message: 'Dear Customer, your debit card ending 4012 was used for Rs 850 at Metro Stores. HDFC Bank will NEVER ask for your OTP, PIN, or CVV. If not done by you, call 18002583838.',
    isScam: false,
    explanation: 'This is a genuine statutory transaction alert. It specifies the card digits, transaction quantum, and provides protective warnings without soliciting credentials.',
    category: 'Legitimate Alert'
  },
  {
    id: 3,
    title: 'Urgent Electricity Disconnection Notice',
    sender: '+91 88765 12098 (Unknown Mobile)',
    message: 'Dear Consumer, your electricity power will be disconnected tonight at 9:30 PM by order of Electricity Office because your previous bill was not updated. Please contact Officer at 9876543210 immediately.',
    isScam: true,
    explanation: 'State DISCOMs (electricity boards) do not issue disconnection ultimatums from personal 10-digit mobile numbers or demand instant phone settlement.',
    category: 'Utility Scareware'
  },
  {
    id: 4,
    title: 'WhatsApp Digital Arrest Impersonation',
    sender: '+92 301 984321 / Video Call (Police DP)',
    message: 'This is Cyber Cell Delhi. A FedEx parcel sent to Cambodia with 15 fake passports and MDMA was booked with your Aadhaar. You are under digital arrest. Stay on this WhatsApp call or non-bailable warrant will be issued.',
    isScam: true,
    explanation: 'There is NO CONCEPT OF "DIGITAL ARREST" in Indian criminal jurisprudence. Police and CBI never conduct interrogations or resolve criminal matters via WhatsApp video calls.',
    category: 'Digital Arrest'
  }
];

export const AwarenessHubPage: React.FC = () => {
  const [userAnswers, setUserAnswers] = useState<Record<number, boolean | null>>({});
  const [showResults, setShowResults] = useState<Record<number, boolean>>({});

  const handleAnswer = (scenarioId: number, answer: boolean) => {
    setUserAnswers((prev) => ({ ...prev, [scenarioId]: answer }));
    setShowResults((prev) => ({ ...prev, [scenarioId]: true }));
  };

  const answeredCount = Object.keys(showResults).length;
  const correctCount = QUIZ_SCENARIOS.filter(
    (s) => showResults[s.id] && userAnswers[s.id] === s.isScam
  ).length;

  return (
    <div className="flex-1 bg-[#FAFAFC] py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E5E5EA] text-xs font-semibold text-[#0071E3]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Scam Awareness Hub</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#1D1D1F]">
            Spot the Scam: Interactive Simulator
          </h1>
          <p className="text-sm text-[#6E6E73] leading-relaxed">
            Test your forensic intuition against real-world fraud vectors targeting Indian consumers. Understand the psychology and statutory rules behind digital extortion.
          </p>
        </div>

        {/* Score Progress Card */}
        <div className="bg-white rounded-2xl border border-[#E5E5EA] p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5F5F7] flex items-center justify-center text-[#0071E3]">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#6E6E73]">Your Forensic Score</div>
              <div className="text-base font-bold text-[#1D1D1F]">
                {correctCount} / {QUIZ_SCENARIOS.length} Correct Scenarios Resolved
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/analyze"
              className="px-4 py-2 bg-[#0071E3] text-white text-xs font-semibold rounded-xl hover:bg-[#005BB5] transition-colors"
            >
              Analyze Your Own Message
            </Link>
          </div>
        </div>

        {/* Quiz Scenarios Grid */}
        <div className="space-y-6">
          <h2 className="text-base font-bold text-[#1D1D1F]">
            Interactive Scenario Challenges
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {QUIZ_SCENARIOS.map((scenario) => {
              const isAnswered = showResults[scenario.id];
              const userAnswer = userAnswers[scenario.id];
              const isCorrect = isAnswered && userAnswer === scenario.isScam;

              return (
                <div
                  key={scenario.id}
                  className={`p-6 rounded-2xl bg-white border transition-all shadow-sm flex flex-col justify-between ${
                    isAnswered
                      ? isCorrect
                        ? 'border-[#34C759]'
                        : 'border-[#FF3B30]'
                      : 'border-[#E5E5EA] hover:border-[#0071E3]'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F5F5F7] text-[#6E6E73] uppercase">
                        {scenario.category}
                      </span>
                      <span className="text-xs text-[#8E8E93]">Scenario #{scenario.id}</span>
                    </div>

                    <h3 className="text-base font-bold text-[#1D1D1F]">{scenario.title}</h3>

                    {/* Simulated Phone Message Card */}
                    <div className="p-3.5 rounded-xl bg-[#FAFAFC] border border-[#E5E5EA] space-y-1.5">
                      <div className="text-[11px] font-semibold text-[#0071E3]">{scenario.sender}</div>
                      <p className="text-xs text-[#1D1D1F] leading-relaxed italic">
                        "{scenario.message}"
                      </p>
                    </div>

                    {/* Answer Buttons */}
                    {!isAnswered ? (
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => handleAnswer(scenario.id, true)}
                          className="py-2.5 px-3 rounded-xl border border-[#FFCCD0] bg-[#FFF2F2] text-[#FF3B30] text-xs font-semibold hover:bg-[#FFE5E5] transition-colors"
                        >
                          🚨 Deceptive Scam
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAnswer(scenario.id, false)}
                          className="py-2.5 px-3 rounded-xl border border-[#BDECC9] bg-[#E8F8ED] text-[#34C759] text-xs font-semibold hover:bg-[#D5F5DF] transition-colors"
                        >
                          ✅ Legitimate Notice
                        </button>
                      </div>
                    ) : (
                      /* Feedback Card */
                      <div
                        className={`p-3.5 rounded-xl text-xs space-y-1.5 border ${
                          isCorrect
                            ? 'bg-[#E8F8ED] border-[#BDECC9] text-[#1D1D1F]'
                            : 'bg-[#FFF2F2] border-[#FFCCD0] text-[#1D1D1F]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold">
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
                              <span className="text-[#34C759]">Correct Verdict!</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-[#FF3B30]" />
                              <span className="text-[#FF3B30]">Incorrect! This was a {scenario.isScam ? 'Scam' : 'Legitimate'} communication.</span>
                            </>
                          )}
                        </div>
                        <p className="text-[11px] text-[#6E6E73] leading-relaxed">
                          {scenario.explanation}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E5E5EA] flex items-center justify-between text-[11px] text-[#6E6E73]">
                    <span>Consumer Protection Act, 2019</span>
                    {isAnswered && (
                      <button
                        onClick={() => {
                          setShowResults((prev) => ({ ...prev, [scenario.id]: false }));
                        }}
                        className="text-[#0071E3] font-semibold hover:underline"
                      >
                        Try Again
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4 Golden Rules of Indian Consumer Cybersecurity */}
        <div className="bg-white rounded-3xl border border-[#E5E5EA] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[#0071E3]" />
            <h2 className="text-lg font-bold text-[#1D1D1F]">
              The 4 Non-Negotiable Rules of Consumer Cybersecurity
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#FAFAFC] border border-[#E5E5EA] space-y-1">
              <div className="text-xs font-bold text-[#1D1D1F]">1. UPI PIN is Only for Paying</div>
              <div className="text-xs text-[#6E6E73] leading-relaxed">
                You never enter a UPI PIN, biometric fingerprint, or scan a QR code to receive refunds, cashbacks, or lottery rewards.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAFAFC] border border-[#E5E5EA] space-y-1">
              <div className="text-xs font-bold text-[#1D1D1F]">2. No Official 'Digital Arrest' Exists</div>
              <div className="text-xs text-[#6E6E73] leading-relaxed">
                Indian police, CBI, Customs, and ED never place citizens under virtual detention or demand bank transfers over WhatsApp or Skype.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAFAFC] border border-[#E5E5EA] space-y-1">
              <div className="text-xs font-bold text-[#1D1D1F]">3. Never Sideload Support APKs</div>
              <div className="text-xs text-[#6E6E73] leading-relaxed">
                AnyDesk, TeamViewer, QuickSupport, or WhatsApp `.apk` links allow scammers to mirror your screen and intercept bank OTPs in real-time.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAFAFC] border border-[#E5E5EA] space-y-1">
              <div className="text-xs font-bold text-[#1D1D1F]">4. 1930 Golden Hour Principle</div>
              <div className="text-xs text-[#6E6E73] leading-relaxed">
                If an unauthorized transaction occurs, dial 1930 or visit cybercrime.gov.in within 2 hours to freeze recipient mule accounts before withdrawal.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
