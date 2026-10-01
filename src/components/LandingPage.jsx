import React from 'react';
import { 
  AlertTriangle, 
  Shield, 
  Activity, 
  MapPin, 
  Radio, 
  Cpu, 
  PhoneCall, 
  Smartphone, 
  Layers, 
  Flame, 
  HeartHandshake, 
  Users, 
  ArrowRight,
  Wifi,
  Sparkles
} from 'lucide-react';

export default function LandingPage({ onSelectRole, onOpenSmsModal, activeIncidentsCount = 8, activeRespondersCount = 3 }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between py-6 px-4 max-w-7xl mx-auto">
      {/* Top Hotline Bar */}
      <div className="bg-gradient-to-r from-red-600/90 via-rose-700/90 to-amber-600/90 border border-red-500/30 rounded-2xl p-3.5 sm:p-4 shadow-xl flex flex-wrap items-center justify-between gap-3 text-white mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/20 backdrop-blur rounded-xl animate-pulse">
            <PhoneCall className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-widest uppercase text-red-200">
              NATIONAL EMERGENCY RESPONSE HOTLINES (24x7 TOLL-FREE)
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base font-extrabold tracking-wide">
              <span>🚨 Police / Disaster: <strong className="text-amber-300 font-mono text-lg">112</strong></span>
              <span>🚑 Medical Ambulance: <strong className="text-amber-300 font-mono text-lg">108</strong></span>
              <span>🌊 Flood & Relief: <strong className="text-amber-300 font-mono text-lg">1070</strong></span>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenSmsModal}
          className="flex items-center gap-2 bg-black/40 hover:bg-black/60 border border-white/20 px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition shadow-sm"
        >
          <Smartphone className="w-4 h-4 text-amber-300" />
          <span>Feature Phone / SMS Fallback (112)</span>
        </button>
      </div>

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4 my-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold backdrop-blur">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Smart India Hackathon 2024 Demo • Gen-AI Disaster Operations Suite
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          DRC-AI: <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">Disaster Response Coordinator</span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Real-time Gen-AI triage, explainable decision-making, and rapid multi-agency dispatch connecting panicked citizens with active field units and central command during high-consequence disasters.
        </p>

        {/* Live Metrics Pill */}
        <div className="flex items-center justify-center gap-4 text-xs text-slate-300 pt-2 font-mono">
          <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <strong className="text-white">{activeIncidentsCount}</strong> Active Disaster Alerts
          </span>
          <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <strong className="text-white">{activeRespondersCount}</strong> Field Taskforces En Route
          </span>
          <span className="hidden sm:flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            AI Triage Latency: <strong className="text-emerald-400">~0.8s</strong>
          </span>
        </div>
      </div>

      {/* Role Selector 3-Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
        {/* Card 1: Citizen SOS */}
        <div 
          onClick={() => onSelectRole('citizen')}
          className="group relative bg-gradient-to-b from-[#141d2f] to-[#0d1424] border border-red-500/30 hover:border-red-500/80 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-red-950/40 hover:-translate-y-1 flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-600 text-white rounded-xl shadow-lg shadow-red-600/30 group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 bg-red-950/60 border border-red-800/40 px-2.5 py-1 rounded-full">
                For Citizens
              </span>
            </div>

            <h3 className="text-xl font-bold text-white group-hover:text-red-300 transition">
              I Need Help (SOS)
            </h3>

            <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
              One-tap voice emergency reporting with auto GPS location, photo capture, multilingual instructions (Hindi / English / Tamil), and live rescue tracking.
            </p>

            <ul className="mt-4 space-y-1.5 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                Speech-to-Text voice emergency input
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                AI-generated calm survival instructions
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                Works offline / low bandwidth with queue sync
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-red-400 flex items-center gap-1 group-hover:underline">
              Launch Citizen SOS <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="text-[10px] text-slate-500 font-mono">Mobile-first PWA</div>
          </div>
        </div>

        {/* Card 2: Field Responder */}
        <div 
          onClick={() => onSelectRole('responder')}
          className="group relative bg-gradient-to-b from-[#141d2f] to-[#0d1424] border border-amber-500/30 hover:border-amber-500/80 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-amber-950/40 hover:-translate-y-1 flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-500 text-slate-950 rounded-xl shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                <Radio className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-800/40 px-2.5 py-1 rounded-full">
                For Field Units
              </span>
            </div>

            <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition">
              Field Responder Console
            </h3>

            <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
              Operational dashboard for NDRF, Fire Brigade, and Red Cross units. View AI severity-ranked incidents, tactical entry briefs, and dispatch status.
            </p>

            <ul className="mt-4 space-y-1.5 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                AI Tactical briefing & hazard warning flags
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Accept / En Route / Arrived status transitions
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Two-way radio dispatch messaging to HQ
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1 group-hover:underline">
              Enter Responder Console <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="text-[10px] text-slate-500 font-mono">3 Units Active</div>
          </div>
        </div>

        {/* Card 3: Control Room War Room */}
        <div 
          onClick={() => onSelectRole('control')}
          className="group relative bg-gradient-to-b from-[#141d2f] to-[#0d1424] border border-cyan-500/40 hover:border-cyan-400 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-950/40 hover:-translate-y-1 flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-xl shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform">
                <Activity className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/60 border border-cyan-800/40 px-2.5 py-1 rounded-full">
                Judges' Feature
              </span>
            </div>

            <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition">
              Control Room War Room
            </h3>

            <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
              Central Command dashboard featuring live Leaflet tactical map, LLM executive situation briefing, explainable AI triage inspector, and duplicate report deduplication.
            </p>

            <ul className="mt-4 space-y-1.5 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Live interactive tactical map with pulsing pins
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Explainable AI reasoning & duplicate clustering
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Human-in-the-Loop authorization for Critical Tier
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-300 flex items-center gap-1 group-hover:underline">
              Open Master Command HQ <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="text-[10px] text-emerald-400 font-mono">100% Real-time Sync</div>
          </div>
        </div>
      </div>

      {/* Bottom Features Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-800/80 pt-5 text-slate-400 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-slate-800/60 rounded-lg text-cyan-400 shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-200">Explainable Gen-AI</div>
            <div className="text-[11px] text-slate-400">Gemini 1.5/2.5 Triage Engine</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-slate-800/60 rounded-lg text-amber-400 shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-200">Duplicate Clustering</div>
            <div className="text-[11px] text-slate-400">Geospatial SOS deduplication</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-slate-800/60 rounded-lg text-emerald-400 shrink-0">
            <Wifi className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-200">Offline Resilience</div>
            <div className="text-[11px] text-slate-400">PWA local queue & SMS bridge</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-slate-800/60 rounded-lg text-rose-400 shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-200">Human-in-the-Loop</div>
            <div className="text-[11px] text-slate-400">Critical incident officer sign-off</div>
          </div>
        </div>
      </div>
    </div>
  );
}
