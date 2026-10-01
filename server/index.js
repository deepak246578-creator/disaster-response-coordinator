import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { getInitialIncidents, getInitialResponders, getInitialShelters } from './seedData.js';
import { triageIncidentWithAI, generateSituationBriefing } from './aiTriage.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH']
  }
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// In-Memory Real-time State Store
let incidents = getInitialIncidents();
let responders = getInitialResponders();
let shelters = getInitialShelters();
let radioChatLogs = [
  {
    id: 'MSG-1',
    sender: 'Control Room Chief',
    role: 'admin',
    text: 'NDRF Unit 07, flood depth at Kurla subway rising fast. Prioritize residential wing B.',
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  },
  {
    id: 'MSG-2',
    sender: 'NDRF Unit 07',
    role: 'responder',
    text: 'Copy Control Room. Inflatable boats deployed from LBS junction. 4 rescued so far.',
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  },
  {
    id: 'MSG-3',
    sender: 'Mumbai Fire Rescue Bravo',
    role: 'responder',
    text: 'Bandra substation: Power shutoff confirmed by Tata grid. Foam application underway.',
    timestamp: new Date(Date.now() - 4 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

// Socket.IO Real-time Connection
io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  // Send initial state
  socket.emit('init:data', {
    incidents,
    responders,
    shelters,
    radioChatLogs
  });

  // Handle live chat message
  socket.on('chat:send', (messageData) => {
    const newMsg = {
      id: `MSG-${Date.now()}`,
      sender: messageData.sender || 'Field Unit',
      role: messageData.role || 'responder',
      text: messageData.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    radioChatLogs.push(newMsg);
    io.emit('chat:broadcast', newMsg);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

// REST API Endpoints

// 1. Get All Incidents
app.get('/api/incidents', (req, res) => {
  res.json({ success: true, count: incidents.length, incidents });
});

// 2. Submit Citizen SOS (Runs AI Triage Engine)
app.post('/api/incidents', async (req, res) => {
  try {
    const {
      description,
      location,
      callerContact,
      language = 'en',
      photoUrl = null,
      source = 'Citizen SOS'
    } = req.body;

    if (!description || !description.trim()) {
      return res.status(400).json({ success: false, error: 'Emergency description is required' });
    }

    const defaultLoc = location && location.lat ? location : {
      lat: 19.0760 + (Math.random() - 0.5) * 0.05,
      lng: 72.8777 + (Math.random() - 0.5) * 0.05,
      address: location?.address || 'Mumbai Central Emergency Zone'
    };

    // Run AI Triage Engine (Gemini with Heuristic Fallback)
    const triageResult = await triageIncidentWithAI({
      text: description,
      location: defaultLoc,
      language,
      existingIncidents: incidents
    });

    const refId = `SOS-${Math.floor(1000 + Math.random() * 9000)}`;
    const newIncidentId = `INC-${Date.now().toString().slice(-4)}`;

    // Auto-assign nearest or best suited responder if Critical/High
    let assignedResponderId = null;
    let assignedResponderName = null;

    if (triageResult.severity === 'CRITICAL' || triageResult.severity === 'HIGH') {
      const availableResp = responders.find(r => r.status === 'Available') || responders[0];
      if (availableResp) {
        assignedResponderId = availableResp.id;
        assignedResponderName = availableResp.name;
        availableResp.status = 'En Route';
        availableResp.currentIncidentId = newIncidentId;
      }
    }

    const newIncident = {
      id: newIncidentId,
      refId,
      title: triageResult.title || 'Reported Emergency Incident',
      description,
      incidentType: triageResult.incidentType || 'General Emergency',
      location: defaultLoc,
      severity: triageResult.severity || 'HIGH',
      severityScore: triageResult.severityScore || 7.5,
      status: 'Reported',
      reportedAt: new Date().toISOString(),
      callerContact: callerContact || 'Anonymous Citizen',
      language,
      photoUrl,
      source,
      assignedResponderId,
      assignedResponderName,
      hazards: triageResult.hazards || ['Unassessed on-site danger'],
      requiredResources: triageResult.requiredResources || ['Emergency Response Unit'],
      citizenInstructions: triageResult.citizenInstructions || [
        'Stay calm and remain in a safe location.',
        'Keep phone line clear for responders.',
        'Watch for approaching siren beacons.'
      ],
      responderBrief: triageResult.responderBrief || `Incident reported at ${defaultLoc.address}. Caution advised.`,
      reasoning: triageResult.reasoning || 'Automated AI evaluation based on reported keywords and location parameters.',
      aiSource: triageResult.aiSource || 'DRC-AI Triage Core',
      humanSignOff: {
        required: triageResult.severity === 'CRITICAL',
        signedOff: false,
        signedOffBy: null,
        timestamp: null
      },
      duplicateReportsCount: triageResult.duplicateReportsCount || 0,
      clusterId: triageResult.clusterId || null,
      etaMinutes: Math.floor(6 + Math.random() * 8)
    };

    incidents.unshift(newIncident);

    // Real-time broadcast to Control Room and Field Responders
    io.emit('incident:created', newIncident);
    if (assignedResponderId) {
      io.emit('responders:updated', responders);
    }

    res.status(201).json({
      success: true,
      message: 'SOS successfully triaged and registered',
      incident: newIncident
    });
  } catch (err) {
    console.error('Error handling SOS submission:', err);
    res.status(500).json({ success: false, error: 'Failed to process emergency report' });
  }
});

// 3. Update Incident Status
app.patch('/api/incidents/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, responderId, responderName } = req.body;

  const incident = incidents.find(i => i.id === id || i.refId === id);
  if (!incident) {
    return res.status(404).json({ success: false, error: 'Incident not found' });
  }

  if (status) incident.status = status;
  if (responderId) incident.assignedResponderId = responderId;
  if (responderName) incident.assignedResponderName = responderName;

  // If resolved, free the responder
  if (status === 'Resolved' && incident.assignedResponderId) {
    const resp = responders.find(r => r.id === incident.assignedResponderId);
    if (resp && resp.currentIncidentId === incident.id) {
      resp.status = 'Available';
      resp.currentIncidentId = null;
    }
  }

  io.emit('incident:updated', incident);
  io.emit('responders:updated', responders);

  res.json({ success: true, incident });
});

// 4. Human-in-the-Loop Sign-off for Critical Incident
app.post('/api/incidents/:id/human-signoff', (req, res) => {
  const { id } = req.params;
  const { officerName = 'Control Room Watch Commander' } = req.body;

  const incident = incidents.find(i => i.id === id || i.refId === id);
  if (!incident) {
    return res.status(404).json({ success: false, error: 'Incident not found' });
  }

  incident.humanSignOff = {
    required: true,
    signedOff: true,
    signedOffBy: officerName,
    timestamp: new Date().toISOString()
  };

  io.emit('incident:updated', incident);
  res.json({ success: true, incident });
});

// 5. Merge Duplicate Reports into Cluster
app.post('/api/incidents/merge', (req, res) => {
  const { masterId, duplicateId } = req.body;

  const master = incidents.find(i => i.id === masterId);
  const duplicate = incidents.find(i => i.id === duplicateId);

  if (!master || !duplicate) {
    return res.status(404).json({ success: false, error: 'One or more incidents not found' });
  }

  master.duplicateReportsCount = (master.duplicateReportsCount || 0) + 1;
  duplicate.status = 'Resolved';
  duplicate.mergedIntoId = masterId;
  duplicate.description += ` [MERGED INTO ${master.refId}]`;

  io.emit('incident:updated', master);
  io.emit('incident:updated', duplicate);

  res.json({ success: true, master, duplicate });
});

// 6. Responders List & Status
app.get('/api/responders', (req, res) => {
  res.json({ success: true, responders });
});

app.patch('/api/responders/:id', (req, res) => {
  const { id } = req.params;
  const { status, lat, lng, radioChannel } = req.body;

  const resp = responders.find(r => r.id === id);
  if (!resp) return res.status(404).json({ success: false, error: 'Responder not found' });

  if (status) resp.status = status;
  if (radioChannel) resp.radioChannel = radioChannel;
  if (lat && lng) {
    resp.location = {
      ...resp.location,
      lat,
      lng
    };
  }

  io.emit('responders:updated', responders);
  res.json({ success: true, responder: resp });
});

// 7. Shelters List
app.get('/api/shelters', (req, res) => {
  res.json({ success: true, shelters });
});

// 8. AI Situation Briefing for Control Room (Gemini LLM)
app.get('/api/ai/briefing', async (req, res) => {
  try {
    const briefingText = await generateSituationBriefing(incidents, responders);
    res.json({
      success: true,
      briefing: briefingText,
      generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Briefing generation failed' });
  }
});

// 9. SMS Fallback Ingestion (Simulates Feature-Phone SOS via SMS)
app.post('/api/sms-fallback', async (req, res) => {
  const { text, phone = '+91 91234 56789', landmark = 'Dadar Station Plaza' } = req.body;

  if (!text) {
    return res.status(400).json({ success: false, error: 'SMS body is empty' });
  }

  // Create incident via AI Triage
  const triageResult = await triageIncidentWithAI({
    text: text + ' (Reported via SMS Gateway)',
    location: { address: landmark, lat: 19.0178, lng: 72.8478 },
    language: 'en',
    existingIncidents: incidents
  });

  const refId = `SMS-${Math.floor(1000 + Math.random() * 9000)}`;
  const newIncident = {
    id: `INC-${Date.now().toString().slice(-4)}`,
    refId,
    title: `[SMS SOS] ${triageResult.title}`,
    description: text,
    incidentType: triageResult.incidentType,
    location: { address: landmark, lat: 19.0178, lng: 72.8478 },
    severity: triageResult.severity,
    severityScore: triageResult.severityScore,
    status: 'Reported',
    reportedAt: new Date().toISOString(),
    callerContact: phone,
    source: 'SMS / 112 Gateway',
    hazards: triageResult.hazards,
    requiredResources: triageResult.requiredResources,
    citizenInstructions: triageResult.citizenInstructions,
    responderBrief: triageResult.responderBrief,
    reasoning: triageResult.reasoning,
    aiSource: triageResult.aiSource,
    humanSignOff: { required: triageResult.severity === 'CRITICAL', signedOff: false }
  };

  incidents.unshift(newIncident);
  io.emit('incident:created', newIncident);

  res.json({
    success: true,
    refId,
    smsConfirmation: `DRC-AI 112 ALERT: SOS received. Ref: ${refId}. Severity: ${triageResult.severity}. Stay where you are. Responders alerted. Reply HELP for updates.`
  });
});

// 10. Reset Demo Data
app.post('/api/reset-demo', (req, res) => {
  incidents = getInitialIncidents();
  responders = getInitialResponders();
  shelters = getInitialShelters();

  io.emit('init:data', { incidents, responders, shelters, radioChatLogs });
  res.json({ success: true, message: 'Demo data successfully reset' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n=================================================`);
  console.log(`  DRC-AI Disaster Coordinator Server is LIVE!`);
  console.log(`  Port: http://localhost:${PORT}`);
  console.log(`  Real-time Socket.IO: Active`);
  console.log(`=================================================\n`);
});
