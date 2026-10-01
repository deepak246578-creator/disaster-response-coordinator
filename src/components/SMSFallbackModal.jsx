import React, { useState } from 'react';
import { Smartphone, Send, ArrowLeft, CheckCircle2, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

export default function SMSFallbackModal({ isOpen, onClose, onNewIncidentSubmitted }) {
  const [phone, setPhone] = useState('+91 98201 55902');
  const [location, setLocation] = useState('Dadar Flower Market, Senapati Bapat Marg');
  const [smsText, setSmsText] = useState('HELP FIRE! Short circuit in flower market shed. 3 shops caught fire, heavy smoke, 4 people unable to find exit.');
  const [loading, setLoading] = useState(false);
  const [responseLog, setResponseLog] = useState(null);

  if (!isOpen) return null;

  const handleSendSMS = async (e) => {
    e.preventDefault();
    if (!smsText.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/sms-fallback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: smsText,
          phone,
          landmark: location
        })
      });
      const data = await res.json();
      if (data.success) {
        setResponseLog(data);
        if (onNewIncidentSubmitted) {
          onNewIncidentSubmitted();
        }
      }
    } catch (err) {
      console.error('SMS fallback error:', err);
    } finally {
      setLoading(false);
    }
  };

  const sampleTemplates = [
    'HELP FLOOD 5 people stranded on terrace near Kurla West Station road',
    'HELP MEDICAL Elderly person severe chest pain, road blocked by water in Sion',
    'HELP COLLAPSE Wall cracked and fell, 2 laborers under rubble Dadar'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-[#1e293b] border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                Feature-Phone SMS / USSD Fallback Gateway
                <span className="text-[10px] bg-amber-500/30 text-amber-300 font-semibold px-2 py-0.5 rounded-full border border-amber-500/40">
                  No Internet Needed
                </span>
              </h3>
              <p className="text-xs text-slate-400">Simulates 112 SMS dispatch parsing for non-smartphone citizens</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          <div className="bg-blue-950/40 border border-blue-800/40 rounded-xl p-3.5 text-xs text-blue-200 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-cyan-300">How this works during disaster blackouts:</span> Citizens send an SMS to <code className="bg-blue-900/60 px-1 py-0.5 rounded text-white font-mono">112</code>. DRC-AI's Natural Language Triage Engine parses the raw text, extracts landmarks, calculates severity, and auto-dispatches responders without cellular 4G/5G data.
            </div>
          </div>

          {responseLog ? (
            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                SMS Successfully Ingested & AI Triaged!
              </div>
              <div className="bg-[#090e17] rounded-lg p-3 border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
                <div className="text-cyan-400 font-bold">📲 Incoming Telecom SMS Dispatch:</div>
                <div className="text-white">"{smsText}"</div>
                <div className="text-slate-400 text-[11px] mt-2 pt-2 border-t border-slate-800">
                  Ref Ticket: <span className="text-amber-400 font-bold">{responseLog.refId}</span> | From: {phone}
                </div>
              </div>
              <div className="bg-cyan-950/30 border border-cyan-800/50 rounded-lg p-3 text-xs text-cyan-200">
                <span className="font-semibold text-cyan-300">Auto SMS Reply Sent to Citizen:</span>
                <p className="font-mono text-slate-300 mt-1 italic">"{responseLog.smsConfirmation}"</p>
              </div>
              <button
                onClick={() => setResponseLog(null)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg transition"
              >
                Simulate Another SMS
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendSMS} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Citizen Mobile Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#162032] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Cell Tower Landmark Area</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-[#162032] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">
                  SMS Message Body (Sent to Shortcode 112)
                </label>
                <textarea
                  value={smsText}
                  onChange={(e) => setSmsText(e.target.value)}
                  rows={3}
                  className="w-full bg-[#162032] border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-cyan-500 placeholder-slate-500"
                  placeholder="Type distress SMS..."
                  required
                />
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">Quick Template Presets:</span>
                <div className="space-y-1.5">
                  {sampleTemplates.map((tpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSmsText(tpl)}
                      className="block w-full text-left text-xs bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-md px-3 py-1.5 text-slate-300 transition truncate"
                    >
                      {tpl}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Ingesting Telecom SMS & Triage Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Simulate Citizen Sending SMS to 112
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
