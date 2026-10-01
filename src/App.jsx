import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  Radio, 
  Wifi, 
  WifiOff, 
  Smartphone, 
  RotateCcw, 
  Languages,
  Home,
  Bell,
  Sparkles
} from 'lucide-react';
import LandingPage from './components/LandingPage';
import CitizenSOS from './components/CitizenSOS';
import FieldResponder from './components/FieldResponder';
import ControlRoom from './components/ControlRoom';
import SMSFallbackModal from './components/SMSFallbackModal';
import { translations } from './translations';

export default function App() {
  const [role, setRole] = useState('home'); // 'home' | 'citizen' | 'responder' | 'control'
  const [language, setLanguage] = useState('en');
  const [connectivity, setConnectivity] = useState('online'); // 'online' | 'degraded' | 'offline'
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [soundAlertEnabled, setSoundAlertEnabled] = useState(true);

  // Real-time server state
  const [incidents, setIncidents] = useState([]);
  const [responders, setResponders] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [radioChatLogs, setRadioChatLogs] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [socketInstance, setSocketInstance] = useState(null);

  // Audio tone generator for critical alert chime
  const playAlertSirenChime = () => {
    if (!soundAlertEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      console.warn('Audio tone failed:', e);
    }
  };

  // Socket.IO Setup
  useEffect(() => {
    const socket = io('/', {
      transports: ['websocket', 'polling']
    });

    setSocketInstance(socket);

    socket.on('connect', () => {
      console.log('Connected to DRC-AI real-time server');
      setSocketConnected(true);
    });

    socket.on('disconnect', () => {
      setSocketConnected(false);
    });

    socket.on('init:data', (data) => {
      if (data.incidents) setIncidents(data.incidents);
      if (data.responders) setResponders(data.responders);
      if (data.shelters) setShelters(data.shelters);
      if (data.radioChatLogs) setRadioChatLogs(data.radioChatLogs);
    });

    socket.on('incident:created', (newIncident) => {
      setIncidents((prev) => [newIncident, ...prev]);
      if (newIncident.severity === 'CRITICAL') {
        playAlertSirenChime();
      }
    });

    socket.on('incident:updated', (updated) => {
      setIncidents((prev) => prev.map(i => (i.id === updated.id ? updated : i)));
    });

    socket.on('responders:updated', (newResponders) => {
      setResponders(newResponders);
    });

    socket.on('chat:broadcast', (newMsg) => {
      setRadioChatLogs((prev) => [...prev, newMsg]);
    });

    // Fallback REST fetch if socket delay
    fetch('/api/incidents')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.incidents) setIncidents(data.incidents);
      })
      .catch(err => console.warn('REST incidents fallback error:', err));

    fetch('/api/responders')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.responders) setResponders(data.responders);
      })
      .catch(err => console.warn('REST responders fallback error:', err));

    fetch('/api/shelters')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.shelters) setShelters(data.shelters);
      })
      .catch(err => console.warn('REST shelters fallback error:', err));

    return () => {
      socket.disconnect();
    };
  }, [soundAlertEnabled]);

  // Handle Update Incident Status
  const handleUpdateIncidentStatus = async (incidentId, status, responderId, responderName) => {
    try {
      const res = await fetch(`/api/incidents/${incidentId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, responderId, responderName })
      });
      const data = await res.json();
      if (data.success && data.incident) {
        setIncidents(prev => prev.map(i => i.id === data.incident.id ? data.incident : i));
      }
    } catch (e) {
      console.error('Update status error:', e);
    }
  };

  // Handle Human-in-the-Loop Sign-off
  const handleHumanSignOff = async (incidentId, officerName) => {
    try {
      const res = await fetch(`/api/incidents/${incidentId}/human-signoff`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ officerName })
      });
      const data = await res.json();
      if (data.success && data.incident) {
        setIncidents(prev => prev.map(i => i.id === data.incident.id ? data.incident : i));
      }
    } catch (e) {
      console.error('Signoff error:', e);
    }
  };

  // Handle Merge Duplicates
  const handleMergeIncidents = async (masterId, duplicateId) => {
    try {
      const res = await fetch('/api/incidents/merge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ masterId, duplicateId })
      });
      const data = await res.json();
      if (data.success) {
        // Refresh incidents
        const refRes = await fetch('/api/incidents');
        const refData = await refRes.json();
        if (refData.success) setIncidents(refData.incidents);
      }
    } catch (e) {
      console.error('Merge error:', e);
    }
  };

  // Handle Radio Chat Message Send
  const handleSendRadioMessage = (msgData) => {
    if (socketInstance && socketConnected) {
      socketInstance.emit('chat:send', msgData);
    } else {
      setRadioChatLogs(prev => [...prev, {
        id: `LOCAL-${Date.now()}`,
        ...msgData,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  // Reset Demo State
  const handleResetDemo = async () => {
    try {
      const res = await fetch('/api/reset-demo', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        window.location.reload();
      }
    } catch (e) {
      console.error('Reset demo error:', e);
    }
  };

  return (
    <div className="min-h-screen bg-[#070C18] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#0B132B]/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Platform Title */}
          <div 
            onClick={() => setRole('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 via-teal-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-black text-sm sm:text-base tracking-tight text-white font-['Outfit',sans-serif]">
                DRC-AI <span className="text-cyan-400 font-normal">| Disaster Response</span>
                <span className="text-[9px] bg-red-600 text-white font-mono px-1.5 py-0.2 rounded font-bold uppercase tracking-wider animate-pulse">
                  LIVE SIH
                </span>
              </div>
              <div className="text-[10px] text-slate-400 -mt-0.5">Gen-AI Emergency Management Suite</div>
            </div>
          </div>

          {/* Role Navigation Switcher */}
          <nav className="flex items-center gap-1 bg-[#162032] p-1 rounded-xl border border-slate-700/80 text-xs font-semibold">
            <button
              onClick={() => setRole('home')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                role === 'home' ? 'bg-cyan-500 text-slate-950 shadow-md font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Portal</span>
            </button>

            <button
              onClick={() => setRole('citizen')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                role === 'citizen' ? 'bg-red-600 text-white shadow-md font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span>Citizen SOS</span>
            </button>

            <button
              onClick={() => setRole('responder')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                role === 'responder' ? 'bg-amber-500 text-slate-950 shadow-md font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Responder Console</span>
            </button>

            <button
              onClick={() => setRole('control')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                role === 'control' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Control Room HQ</span>
            </button>
          </nav>

          {/* Right Toolbar: Connectivity Simulator + SMS Fallback + Reset */}
          <div className="flex items-center gap-2 text-xs">
            {/* Connectivity Simulation Mode */}
            <div className="flex items-center bg-[#162032] rounded-lg border border-slate-700 p-0.5">
              <button
                onClick={() => setConnectivity('online')}
                title="Simulate High Speed Online Connection"
                className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                  connectivity === 'online' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Online
              </button>
              <button
                onClick={() => setConnectivity('degraded')}
                title="Simulate Degraded 2G Network"
                className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                  connectivity === 'degraded' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                2G Degraded
              </button>
              <button
                onClick={() => setConnectivity('offline')}
                title="Simulate Complete Connectivity Blackout"
                className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                  connectivity === 'offline' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Offline
              </button>
            </div>

            {/* SMS Modal Trigger */}
            <button
              onClick={() => setIsSmsModalOpen(true)}
              className="p-1.5 sm:px-2.5 sm:py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg border border-slate-700 transition flex items-center gap-1 font-semibold"
              title="Simulate Feature-Phone SMS to 112"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[11px]">SMS Gateway</span>
            </button>

            {/* Reset Demo Button */}
            <button
              onClick={handleResetDemo}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition"
              title="Reset Demo to Original Pre-seeded Mumbai Incidents"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Screen Views */}
      <main className="flex-1">
        {role === 'home' && (
          <LandingPage
            onSelectRole={(selectedRole) => setRole(selectedRole)}
            onOpenSmsModal={() => setIsSmsModalOpen(true)}
            activeIncidentsCount={incidents.filter(i => i.status !== 'Resolved').length}
            activeRespondersCount={responders.length}
          />
        )}

        {role === 'citizen' && (
          <CitizenSOS
            currentLanguage={language}
            setLanguage={setLanguage}
            connectivity={connectivity}
            onBackToHome={() => setRole('home')}
            allIncidents={incidents}
          />
        )}

        {role === 'responder' && (
          <FieldResponder
            responders={responders}
            incidents={incidents}
            onUpdateIncidentStatus={handleUpdateIncidentStatus}
            radioChatLogs={radioChatLogs}
            onSendRadioMessage={handleSendRadioMessage}
            onBackToHome={() => setRole('home')}
          />
        )}

        {role === 'control' && (
          <ControlRoom
            incidents={incidents}
            responders={responders}
            shelters={shelters}
            onUpdateIncidentStatus={handleUpdateIncidentStatus}
            onHumanSignOff={handleHumanSignOff}
            onMergeIncidents={handleMergeIncidents}
            radioChatLogs={radioChatLogs}
            onSendRadioMessage={handleSendRadioMessage}
            soundAlertEnabled={soundAlertEnabled}
            setSoundAlertEnabled={setSoundAlertEnabled}
          />
        )}
      </main>

      {/* Feature Phone / SMS Fallback Modal */}
      <SMSFallbackModal
        isOpen={isSmsModalOpen}
        onClose={() => setIsSmsModalOpen(false)}
        onNewIncidentSubmitted={() => {
          fetch('/api/incidents')
            .then(res => res.json())
            .then(d => d.success && setIncidents(d.incidents));
        }}
      />
    </div>
  );
}
