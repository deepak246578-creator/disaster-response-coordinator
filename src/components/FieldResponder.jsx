import React, { useState } from 'react';
import { 
  Radio, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Navigation, 
  Send, 
  Clock, 
  ShieldAlert, 
  Users, 
  BatteryCharging, 
  Sparkles, 
  Layers, 
  Flame, 
  CheckCircle,
  Truck,
  MessageSquare
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import confetti from 'canvas-confetti';

// Custom Map Marker Icons for Responder & Incidents
const responderIcon = new L.DivIcon({
  className: 'resp-marker',
  html: `<div style="background:#0284c7; width:30px; height:30px; border-radius:50%; border:3px solid white; display:flex; align-items:center; justify-content:center; box-shadow: 0 0 12px #38bdf8; font-size:16px;">🚒</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

const incidentIcon = (severity) => new L.DivIcon({
  className: 'inc-marker',
  html: `<div style="background:${severity === 'CRITICAL' ? '#ef4444' : severity === 'HIGH' ? '#f97316' : '#eab308'}; width:28px; height:28px; border-radius:50%; border:2px solid white; display:flex; align-items:center; justify-content:center; box-shadow: 0 0 10px rgba(0,0,0,0.5); font-size:13px; color:white; font-weight:bold;">${severity === 'CRITICAL' ? '⚠️' : '⚡'}</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

export default function FieldResponder({ 
  responders = [], 
  incidents = [], 
  onUpdateIncidentStatus,
  radioChatLogs = [],
  onSendRadioMessage,
  onBackToHome 
}) {
  // Current active responder selected (e.g. NDRF Unit 07)
  const [selectedResponderId, setSelectedResponderId] = useState(responders[0]?.id || 'RESP-01');
  const [chatInput, setChatInput] = useState('');
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'map'

  const activeResponder = responders.find(r => r.id === selectedResponderId) || responders[0];

  // Filter and sort incidents: assigned first, then sorted by AI severity score descending
  const sortedIncidents = [...incidents].sort((a, b) => {
    // Assigned to this unit gets top priority
    const aAssigned = a.assignedResponderId === activeResponder?.id;
    const bAssigned = b.assignedResponderId === activeResponder?.id;
    if (aAssigned && !bAssigned) return -1;
    if (!aAssigned && bAssigned) return 1;
    return (b.severityScore || 0) - (a.severityScore || 0);
  });

  const handleStatusChange = (incidentId, newStatus) => {
    if (newStatus === 'Resolved') {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
    onUpdateIncidentStatus(incidentId, newStatus, activeResponder?.id, activeResponder?.name);
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendRadioMessage({
      sender: activeResponder?.name || 'Field Unit',
      role: 'responder',
      text: chatInput
    });
    setChatInput('');
  };

  return (
    <div className="max-w-6xl mx-auto py-4 px-3 sm:px-4 space-y-4">
      {/* Top Unit Selector Bar */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              Tactical Field Console
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedResponderId}
                onChange={(e) => setSelectedResponderId(e.target.value)}
                className="bg-[#162032] border border-slate-700 text-white font-bold text-sm sm:text-base rounded-lg px-3 py-1 focus:outline-none focus:border-amber-400"
              >
                {responders.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.specialization})
                  </option>
                ))}
              </select>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                activeResponder?.status === 'On Scene' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' :
                activeResponder?.status === 'En Route' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                'bg-slate-800 text-cyan-300 border border-cyan-500/40'
              }`}>
                {activeResponder?.status || 'Available'}
              </span>
            </div>
          </div>
        </div>

        {/* Tactical Telemetry telemetry */}
        <div className="flex items-center gap-4 text-xs text-slate-300 font-mono">
          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>Radio: <strong className="text-white">{activeResponder?.radioChannel || 'CH-4'}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
            <span>Battery: <strong className="text-white">{activeResponder?.batteryLevel || 90}%</strong></span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>Crew: <strong className="text-white">{activeResponder?.personnelCount || 8} personnel</strong></span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Incident Feed with AI Triage Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm uppercase tracking-wide flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Assigned & Priority Incident Queue
              </h3>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                {sortedIncidents.length}
              </span>
            </div>

            {/* List / Map Switcher */}
            <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('list')}
                className={`px-3 py-1 rounded font-semibold transition ${activeTab === 'list' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
              >
                Card View
              </button>
              <button
                onClick={() => setActiveTab('map')}
                className={`px-3 py-1 rounded font-semibold transition ${activeTab === 'map' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
              >
                Tactical Map
              </button>
            </div>
          </div>

          {/* Interactive Tactical Map Tab */}
          {activeTab === 'map' ? (
            <div className="h-[520px] rounded-2xl overflow-hidden border border-slate-800 shadow-xl relative">
              <MapContainer
                center={[activeResponder?.location?.lat || 19.0550, activeResponder?.location?.lng || 72.8650]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap'
                />
                {/* Responder marker */}
                {activeResponder?.location && (
                  <Marker
                    position={[activeResponder.location.lat, activeResponder.location.lng]}
                    icon={responderIcon}
                  >
                    <Popup>
                      <div className="p-1 font-sans">
                        <div className="font-bold text-cyan-400 text-xs">{activeResponder.name}</div>
                        <div className="text-[11px] text-slate-300">{activeResponder.location.label}</div>
                      </div>
                    </Popup>
                  </Marker>
                )}

                {/* Incident markers */}
                {sortedIncidents.map(inc => inc.location?.lat && (
                  <Marker
                    key={inc.id}
                    position={[inc.location.lat, inc.location.lng]}
                    icon={incidentIcon(inc.severity)}
                  >
                    <Popup>
                      <div className="p-1 font-sans max-w-xs">
                        <div className="font-bold text-red-400 text-xs">{inc.refId}: {inc.title}</div>
                        <div className="text-[11px] text-slate-300 mt-1">{inc.location.address}</div>
                        <div className="text-[10px] text-amber-300 mt-1">Severity: {inc.severity} ({inc.severityScore}/10)</div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          ) : (
            /* Card View List */
            <div className="space-y-3">
              {sortedIncidents.map((inc) => {
                const isAssignedToMe = inc.assignedResponderId === activeResponder?.id;

                return (
                  <div
                    key={inc.id}
                    className={`bg-[#0f172a] border rounded-2xl p-4 shadow-lg transition-all duration-200 ${
                      isAssignedToMe 
                        ? 'border-amber-500/60 ring-1 ring-amber-500/30' 
                        : inc.severity === 'CRITICAL' 
                          ? 'border-red-500/40' 
                          : 'border-slate-800'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-xs text-cyan-400">{inc.refId}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            inc.severity === 'CRITICAL' ? 'bg-red-950 text-red-300 border border-red-500/40' :
                            inc.severity === 'HIGH' ? 'bg-orange-950 text-orange-300 border border-orange-500/40' :
                            'bg-yellow-950 text-yellow-300 border border-yellow-500/40'
                          }`}>
                            {inc.severity} ({inc.severityScore}/10)
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">{inc.incidentType}</span>
                          {isAssignedToMe && (
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold animate-pulse">
                              ASSIGNED TO YOUR UNIT
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1">{inc.title}</h4>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          inc.status === 'Resolved' ? 'bg-emerald-950 text-emerald-300' :
                          inc.status === 'On Scene' ? 'bg-blue-950 text-blue-300' :
                          inc.status === 'En Route' ? 'bg-amber-950 text-amber-300' :
                          'bg-slate-800 text-slate-300'
                        }`}>
                          {inc.status}
                        </span>
                        <div className="text-[10px] text-slate-500 font-mono mt-1">
                          {new Date(inc.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>

                    {/* Location & Details */}
                    <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="font-medium">{inc.location?.address}</span>
                    </div>

                    <p className="mt-2 text-xs text-slate-300 leading-relaxed bg-[#162032] p-2.5 rounded-xl border border-slate-800">
                      {inc.description}
                    </p>

                    {/* AI Tactical Responder Briefing (Explainable AI) */}
                    <div className="mt-3 bg-gradient-to-r from-blue-950/40 to-slate-900 border border-cyan-800/40 rounded-xl p-3 text-xs space-y-1.5">
                      <div className="font-bold text-cyan-300 flex items-center gap-1.5 text-[11px] uppercase">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        AI Tactical Responder Briefing:
                      </div>
                      <p className="text-slate-200 text-xs italic leading-relaxed">
                        "{inc.responderBrief || 'Deploy standard search & rescue protocols.'}"
                      </p>

                      {/* Hazards Tags */}
                      {inc.hazards && inc.hazards.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-slate-800/60">
                          <span className="text-[10px] text-red-400 font-semibold uppercase flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" /> Hazard Warnings:
                          </span>
                          {inc.hazards.map((hz, idx) => (
                            <span key={idx} className="text-[10px] bg-red-950/60 text-red-200 border border-red-800/40 px-2 py-0.5 rounded">
                              {hz}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Required Resources */}
                      {inc.requiredResources && inc.requiredResources.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] text-amber-400 font-semibold uppercase">
                            Required Equipment:
                          </span>
                          {inc.requiredResources.map((res, idx) => (
                            <span key={idx} className="text-[10px] bg-amber-950/60 text-amber-200 border border-amber-800/40 px-2 py-0.5 rounded">
                              {res}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                      <div className="text-[11px] text-slate-400">
                        Caller: <strong className="text-white font-mono">{inc.callerContact}</strong>
                      </div>

                      <div className="flex items-center gap-2">
                        {inc.status !== 'En Route' && inc.status !== 'On Scene' && inc.status !== 'Resolved' && (
                          <button
                            onClick={() => handleStatusChange(inc.id, 'En Route')}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition shadow flex items-center gap-1"
                          >
                            <Navigation className="w-3.5 h-3.5" /> Accept & En Route
                          </button>
                        )}

                        {inc.status === 'En Route' && (
                          <button
                            onClick={() => handleStatusChange(inc.id, 'On Scene')}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition shadow flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Arrived On Scene
                          </button>
                        )}

                        {inc.status !== 'Resolved' && (
                          <button
                            onClick={() => handleStatusChange(inc.id, 'Resolved')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition shadow flex items-center gap-1"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Mark Safely Resolved
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Col: Radio Dispatch Box & Tactical Log */}
        <div className="space-y-4">
          {/* Radio Channel Chat */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col h-[560px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-xs uppercase tracking-wide">
                  Live Radio Dispatch Comms
                </h3>
              </div>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono">
                CHANNEL {activeResponder?.radioChannel?.split(' ')[0] || 'CH-4'}
              </span>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto space-y-2.5 py-3 pr-1 text-xs">
              {radioChatLogs.map((msg) => {
                const isAdmin = msg.role === 'admin';
                return (
                  <div
                    key={msg.id}
                    className={`p-2.5 rounded-xl border ${
                      isAdmin 
                        ? 'bg-blue-950/40 border-blue-800/40 text-blue-100' 
                        : 'bg-slate-900 border-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className={`font-bold ${isAdmin ? 'text-cyan-400' : 'text-amber-400'}`}>
                        {msg.sender}
                      </span>
                      <span className="text-slate-500 font-mono">{msg.timestamp}</span>
                    </div>
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                );
              })}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="pt-3 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Send tactical field update to HQ..."
                className="flex-1 bg-[#162032] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="p-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition shadow"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
