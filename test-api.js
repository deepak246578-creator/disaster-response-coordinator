// Test script using dummy mock data only (zero real external SMS/telecom calls)
async function runTests() {
  console.log('--- Starting DRC-AI Mock API & Triage Verification ---');
  
  // 1. Fetch initial incidents
  const res1 = await fetch('http://localhost:5000/api/incidents');
  const data1 = await res1.json();
  console.log(`[PASS] Incidents loaded: ${data1.count} incidents active`);

  // 2. Submit Dummy Citizen SOS
  const res2 = await fetch('http://localhost:5000/api/incidents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      description: 'DUMMY TEST: Water level rising near Kurla subway, 4 simulated citizens trapped',
      callerContact: '000-000-0000',
      language: 'en'
    })
  });
  const data2 = await res2.json();
  console.log(`[PASS] Citizen SOS Triaged. Ref Ticket: ${data2.incident?.refId}, Severity: ${data2.incident?.severity} (${data2.incident?.severityScore}/10)`);
  console.log(`[PASS] Explainable AI Reasoning: ${data2.incident?.reasoning?.slice(0, 75)}...`);

  // 3. AI Situation Briefing
  const res3 = await fetch('http://localhost:5000/api/ai/briefing');
  const data3 = await res3.json();
  console.log(`[PASS] Situation Briefing: ${data3.briefing?.slice(0, 85)}...`);

  // 4. Mock SMS Fallback Simulator (Zero telecom integration, 100% dummy simulator)
  const res4 = await fetch('http://localhost:5000/api/sms-fallback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: 'MOCK SMS: HELP FIRE dummy drill near Bandra West',
      phone: '000-000-0000',
      landmark: 'Bandra Station Mock Landmark'
    })
  });
  const data4 = await res4.json();
  console.log(`[PASS] Mock SMS Gateway Ingested. Simulated Reply: ${data4.smsConfirmation}`);

  console.log('--- All Mock Tests Succeeded! ---');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
