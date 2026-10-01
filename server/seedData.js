export const getInitialIncidents = () => [
  {
    id: 'INC-701',
    refId: 'SOS-9421',
    title: 'Severe Flash Flooding & 8 Citizens Stranded',
    description: 'Rapid water level rising up to 4.5 feet near railway subway. 8 people including 2 senior citizens trapped inside ground floor residential unit with rising water.',
    incidentType: 'Flood / Waterlogging',
    location: {
      address: 'Near Kurla West Railway Subway, Mumbai',
      lat: 19.0688,
      lng: 72.8794,
    },
    severity: 'CRITICAL',
    severityScore: 9.4,
    status: 'Responder Assigned', // Reported, Verified, Responder Assigned, On Scene, Resolved
    reportedAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    callerContact: '+91 98201 44102',
    language: 'hi',
    source: 'Citizen SOS',
    assignedResponderId: 'RESP-01',
    assignedResponderName: 'NDRF Unit 07 (Marine Rescue)',
    hazards: ['Live submerged electric poles', 'Current speed > 1.8 m/s', 'Contaminated water'],
    requiredResources: ['2x Inflatable Rescue Boats (IRB)', 'Life Vests (x10)', 'Stretcher harness'],
    citizenInstructions: [
      'Move immediately to higher elevation furniture or upper floors if accessible.',
      'DO NOT step into standing water near electrical poles or transformer boxes.',
      'Tie a bright cloth outside high window to mark your exact position for boat crew.',
      'Conserve phone battery: switch off Bluetooth and GPS background apps.'
    ],
    responderBrief: '8 persons stranded at ground floor Kurla West subway junction. Water depth ~4.5 ft. Approach via LBS Marg with high-clearance vehicle or deploy inflatable boats from junction.',
    reasoning: 'Critical water depth exceeding 4 ft, elderly victims present with immobility hazard, active submersion risk in dense urban corridor.',
    humanSignOff: {
      required: true,
      signedOff: true,
      signedOffBy: 'Control Room Chief Officer Verma',
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString()
    },
    duplicateReportsCount: 2,
    clusterId: 'CLUSTER-KURLA-01'
  },
  {
    id: 'INC-702',
    refId: 'SOS-9422',
    title: 'Industrial Transformer Fire with Chemical Smoke',
    description: 'Electric substation spark caused oil ignition. Thick toxic black smoke spreading towards nearby slums. Explosions heard.',
    incidentType: 'Fire / Chemical Hazard',
    location: {
      address: 'Bandra East Industrial Estate, Near Kalanagar, Mumbai',
      lat: 19.0596,
      lng: 72.8485,
    },
    severity: 'CRITICAL',
    severityScore: 9.1,
    status: 'On Scene',
    reportedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    callerContact: '+91 98212 99014',
    language: 'en',
    source: 'Citizen SOS',
    assignedResponderId: 'RESP-02',
    assignedResponderName: 'Mumbai Fire Rescue Bravo (Hazmat)',
    hazards: ['PCB dielectric oil smoke', 'Risk of 33kV line flashover', 'Downwind toxic dispersal'],
    requiredResources: ['Dry Chemical Powder (DCP) Tender', 'SCBA Breathing Apparatus (x6)', 'Evacuation Cordon'],
    citizenInstructions: [
      'Cover mouth and nose with a damp cloth or N95 mask immediately.',
      'Evacuate perpendicular to the wind direction — do not run downwind.',
      'Do NOT pour domestic water onto industrial transformer flames.',
      'Follow police megaphones for the assembly point at Bandra Station East.'
    ],
    responderBrief: 'Class C/D electrical transformer blaze spreading to commercial shed. 33kV power shutoff request sent to Tata Power grid dispatch. Deploy foam & DCP.',
    reasoning: 'High-voltage oil-fed flame in proximity to informal settlements; toxic inhalation danger elevates severity to Tier-1 Critical.',
    humanSignOff: {
      required: true,
      signedOff: true,
      signedOffBy: 'Disaster Comm. Joshi',
      timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString()
    },
    duplicateReportsCount: 4,
    clusterId: 'CLUSTER-BANDRA-FIRE'
  },
  {
    id: 'INC-703',
    refId: 'SOS-9423',
    title: 'Partial Chawl Balcony & Wall Collapse',
    description: 'Old 3-storey structure rear wing partially collapsed after persistent heavy downpour. 3 laborers feared trapped under rubble.',
    incidentType: 'Structural Collapse',
    location: {
      address: 'Ranade Road, Dadar West, Mumbai',
      lat: 19.0222,
      lng: 72.8427,
    },
    severity: 'HIGH',
    severityScore: 8.5,
    status: 'Responder Assigned',
    reportedAt: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
    callerContact: '+91 97690 12384',
    language: 'mr',
    source: 'Citizen SOS',
    assignedResponderId: 'RESP-01',
    assignedResponderName: 'NDRF Unit 07 (Marine Rescue)',
    hazards: ['Unstable hanging cantilever slab', 'Gas cylinder leak threat', 'Crowd congestion'],
    requiredResources: ['Acoustic Victim Locators', 'Hydraulic Spreader & Cutters', 'Search Dogs Unit'],
    citizenInstructions: [
      'Keep clear of remaining walls and sagging balconies.',
      'Do not light matches or cigarettes due to potential cooking gas leaks.',
      'Make rhythmic tapping sounds on metal pipes if trapped under debris to signal rescue sensors.'
    ],
    responderBrief: 'Secondary collapse hazard active. Cordon perimeter 50m. Acoustic listen tests required before debris removal.',
    reasoning: 'Trapped human life suspected under masonry; structural instability requires immediate specialized search and shoring teams.',
    humanSignOff: {
      required: true,
      signedOff: false,
    },
    duplicateReportsCount: 1,
    clusterId: 'CLUSTER-DADAR-03'
  },
  {
    id: 'INC-704',
    refId: 'SOS-9424',
    title: 'Multiple Heat Exhaustion & Dehydration at Relief Center',
    description: 'Overcrowding at community hall shelter during evacuation. 5 women and children faint due to heat and lack of ORS saline.',
    incidentType: 'Mass Medical Emergency',
    location: {
      address: '90 Feet Road, Dharavi Sector 5, Mumbai',
      lat: 19.0434,
      lng: 72.8567,
    },
    severity: 'HIGH',
    severityScore: 7.8,
    status: 'On Scene',
    reportedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    callerContact: '+91 98199 00411',
    language: 'hi',
    source: 'Citizen SOS',
    assignedResponderId: 'RESP-03',
    assignedResponderName: 'Red Cross Mobile ICU & Trauma Van',
    hazards: ['Heat stroke progression', 'Stampede risk at water distribution point'],
    requiredResources: ['IV Saline Fluids', 'Oral Rehydration Salts (x200)', 'Paramedic Team'],
    citizenInstructions: [
      'Move affected individuals to shaded, well-ventilated corridor.',
      'Loosen tight clothing and apply cool damp cloths to neck and forehead.',
      'Sip water slowly if conscious; do not force fluids if semiconscious.'
    ],
    responderBrief: '5 dehydrated victims at Sector 5 hall. Distribute triage tags (Yellow/Green). Set up hydration station.',
    reasoning: 'Non-trauma medical emergency with potential for escalation if hydration & ventilation are not established rapidly.',
    humanSignOff: {
      required: false,
      signedOff: false
    },
    duplicateReportsCount: 0,
    clusterId: null
  },
  {
    id: 'INC-705',
    refId: 'SOS-9425',
    title: 'Suspected Ammonia Gas Leak near Fertilizer Corridor',
    description: 'Pungent eye-stinging odor detected near Mahul refinery fringe road. Commuters reporting burning throat and watery eyes.',
    incidentType: 'Hazardous Materials (HAZMAT)',
    location: {
      address: 'Mahul Road, Chembur East, Mumbai',
      lat: 19.0150,
      lng: 72.8990,
    },
    severity: 'HIGH',
    severityScore: 8.0,
    status: 'Verified',
    reportedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    callerContact: '+91 99302 55890',
    language: 'en',
    source: 'Citizen SOS',
    assignedResponderId: null,
    assignedResponderName: null,
    hazards: ['Corrosive vapor plume', 'Reduced road visibility'],
    requiredResources: ['Gas Multi-detector sniffer', 'Water curtain fogging nozzles', 'SDRF Hazmat'],
    citizenInstructions: [
      'Shut all windows and air-conditioners if staying indoors.',
      'Place damp towel over face and eyes.',
      'Breathe through wet cloth, avoid heavy physical exertion.'
    ],
    responderBrief: 'Hazmat reconnaissance needed. Wind blowing South-Southwest at 14 km/h. Prepare atmospheric gas detection.',
    reasoning: 'Chemical irritant in air affecting respiratory tracts of civilian traffic, needs immediate containment before wider drift.',
    humanSignOff: {
      required: true,
      signedOff: false
    },
    duplicateReportsCount: 3,
    clusterId: 'CLUSTER-CHEMBUR-GAS'
  },
  {
    id: 'INC-706',
    refId: 'SOS-9426',
    title: 'Waterlogged Underpass Stranded Bus with 24 Passengers',
    description: 'BEST bus stuck in 3 feet water under Andheri subway. Engine dead, water slowly creeping above floorboard.',
    incidentType: 'Flood / Transit Disruption',
    location: {
      address: 'Andheri West Subway, Near Station, Mumbai',
      lat: 19.1197,
      lng: 72.8464,
    },
    severity: 'MEDIUM',
    severityScore: 6.7,
    status: 'Responder Assigned',
    reportedAt: new Date(Date.now() - 19 * 60 * 1000).toISOString(),
    callerContact: '+91 98670 77319',
    language: 'en',
    source: 'Citizen SOS',
    assignedResponderId: 'RESP-02',
    assignedResponderName: 'Mumbai Fire Rescue Bravo (Hazmat)',
    hazards: ['Submerged potholes', 'Pushed flood debris'],
    requiredResources: ['Heavy Winch Tow Truck', 'High-capacity dewatering pump'],
    citizenInstructions: [
      'Passengers must stay on top of bus seats or roof hatch if water rises.',
      'Do not disembark into unknown depth currents.',
      'Traffic police have stopped further vehicles entering subway.'
    ],
    responderBrief: 'Subway water depth 3 ft. Bus stalled. Evacuate passengers via rear emergency exit to higher ground walkway.',
    reasoning: 'Passengers currently safe inside vehicle envelope; situation requires transit evacuation before high tide peaks.',
    humanSignOff: {
      required: false,
      signedOff: false
    },
    duplicateReportsCount: 1,
    clusterId: null
  },
  {
    id: 'INC-707',
    refId: 'SOS-9427',
    title: 'High Tide Storm Surge Inundating Coastal Walkway',
    description: 'Unusual tidal swell washing over sea wall. Benches and light poles damaged. 2 tourists slipped on rocks.',
    incidentType: 'Coastal Surge',
    location: {
      address: 'Radio Club Pier, Colaba, Mumbai',
      lat: 18.9190,
      lng: 72.8330,
    },
    severity: 'MEDIUM',
    severityScore: 5.9,
    status: 'Reported',
    reportedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    callerContact: '+91 98200 11988',
    language: 'en',
    source: 'Citizen SOS',
    assignedResponderId: null,
    assignedResponderName: null,
    hazards: ['Slippery algae rocks', 'Riptide undertow'],
    requiredResources: ['Coastal Guard Lifebuoys', 'Police Barricading Unit'],
    citizenInstructions: [
      'Step back at least 50 meters from the promenade edge.',
      'Do not attempt selfie photography near incoming swell waves.',
      'Assist injured persons to Colaba police kiosk.'
    ],
    responderBrief: 'Deploy coastal safety wardens to clear promenade. High tide peak in 45 mins.',
    reasoning: 'Moderate hazard localized to waterfront; minor injuries reported, evacuation of shoreline needed.',
    humanSignOff: {
      required: false,
      signedOff: false
    },
    duplicateReportsCount: 0,
    clusterId: null
  },
  {
    id: 'INC-708',
    refId: 'SOS-9428',
    title: 'Tree Fallen Blocking Ambulance Route to Rajawadi Hospital',
    description: 'Century-old banyan tree uprooted across Ghatkopar arterial road, blocking oxygen delivery van and emergency traffic.',
    incidentType: 'Road Obstruction',
    location: {
      address: 'Near Tilak Nagar Station Road, Chembur/Ghatkopar, Mumbai',
      lat: 19.0710,
      lng: 72.8980,
    },
    severity: 'LOW',
    severityScore: 4.2,
    status: 'Resolved',
    reportedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    callerContact: '+91 98701 33412',
    language: 'en',
    source: 'Citizen SOS',
    assignedResponderId: 'RESP-02',
    assignedResponderName: 'Mumbai Fire Rescue Bravo (Hazmat)',
    hazards: ['Fallen tree trunk', 'Diverted traffic bottleneck'],
    requiredResources: ['Motorized Chainsaws', 'Hydraulic Crane (BMC Garden Dept)'],
    citizenInstructions: [
      'Take alternate diversion through Eastern Express Highway flyover.',
      'Keep siren path clear for queued emergency vehicles.'
    ],
    responderBrief: 'Tree cut into manageable logs and pushed to sidewalk. Arterial lane re-opened to one-way emergency flow.',
    reasoning: 'Obstruction cleared; low residual risk. Maintained for situational logs.',
    humanSignOff: {
      required: false,
      signedOff: false
    },
    duplicateReportsCount: 0,
    clusterId: null
  }
];

export const getInitialResponders = () => [
  {
    id: 'RESP-01',
    name: 'NDRF Unit 07',
    teamLeader: 'Cmdr. Rajesh Rathore',
    specialization: 'Marine & Structural Rescue',
    status: 'En Route', // Available, En Route, On Scene, Busy
    location: {
      lat: 19.0550,
      lng: 72.8650,
      label: 'Moving toward Kurla West via LBS Marg'
    },
    currentIncidentId: 'INC-701',
    personnelCount: 14,
    equipment: ['Inflatable Rafts (x3)', 'Hydraulic Cutters', 'High-power Searchlights', 'Satellite Comms'],
    batteryLevel: 88,
    radioChannel: 'CH-4 (Disaster Alpha)'
  },
  {
    id: 'RESP-02',
    name: 'Mumbai Fire Rescue Bravo',
    teamLeader: 'Station Officer S. Kadam',
    specialization: 'Hazmat & Urban Fire Combat',
    status: 'On Scene',
    location: {
      lat: 19.0600,
      lng: 72.8490,
      label: 'Stationed at Bandra East Industrial Zone'
    },
    currentIncidentId: 'INC-702',
    personnelCount: 9,
    equipment: ['Foam Tender', 'DCP Nozzles', 'SCBA Kits (x8)', 'Thermal Imaging Camera'],
    batteryLevel: 94,
    radioChannel: 'CH-2 (Fire Command)'
  },
  {
    id: 'RESP-03',
    name: 'Red Cross Mobile ICU & Trauma',
    teamLeader: 'Dr. Aisha Merchant',
    specialization: 'Emergency Medicine & Triage',
    status: 'On Scene',
    location: {
      lat: 19.0430,
      lng: 72.8570,
      label: 'Dharavi Sector 5 Emergency Center'
    },
    currentIncidentId: 'INC-704',
    personnelCount: 6,
    equipment: ['2x Advanced Ventilators', 'Defibrillator', 'Cold-chain Blood Supplies', 'IV Drip Racks'],
    batteryLevel: 76,
    radioChannel: 'CH-9 (Medical MedNet)'
  }
];

export const getInitialShelters = () => [
  {
    id: 'SHELTER-01',
    name: 'BKC Mega Relief Camp & Base',
    type: 'Relief Camp',
    location: { lat: 19.0670, lng: 72.8680 },
    capacity: 1500,
    currentOccupancy: 420,
    supplies: { foodDays: 4, waterLiters: 12000, medicalKits: 85 },
    status: 'Operational'
  },
  {
    id: 'SHELTER-02',
    name: 'KEM Memorial Hospital Trauma Center',
    type: 'Tertiary Hospital',
    location: { lat: 19.0020, lng: 72.8420 },
    capacity: 250,
    currentOccupancy: 195,
    supplies: { icuBedsAvailable: 14, oxygenTanks: 92, bloodUnits: 140 },
    status: 'Surge Protocol'
  },
  {
    id: 'SHELTER-03',
    name: 'Sion Municipal High School Shelter',
    type: 'Emergency Shelter',
    location: { lat: 19.0370, lng: 72.8620 },
    capacity: 600,
    currentOccupancy: 310,
    supplies: { foodDays: 2, waterLiters: 4500, medicalKits: 20 },
    status: 'Operational'
  },
  {
    id: 'SHELTER-04',
    name: 'Cooper Hospital Emergency Wing',
    type: 'General Hospital',
    location: { lat: 19.1080, lng: 72.8360 },
    capacity: 180,
    currentOccupancy: 122,
    supplies: { icuBedsAvailable: 8, oxygenTanks: 45, bloodUnits: 65 },
    status: 'Operational'
  }
];
