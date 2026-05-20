// Self-contained test for Lahore dataset and ranking
const MOCK_PROVIDERS = [
  { id: 'e1', name: 'Ahmad Electrician', service: 'Electrician', area: 'Gulberg', distance: 1.2, rating: 4.8, price: '1500', priceUnit: 'visit', available: true, phone: '0300-1111222' },
  { id: 'e2', name: 'Usman Electric Works', service: 'Electrician', area: 'DHA Phase 5', distance: 2.1, rating: 4.6, price: '1800', priceUnit: 'visit', available: true, phone: '0300-2222333' },
  { id: 'e3', name: 'Tariq Wiring Expert', service: 'Electrician', area: 'Johar Town', distance: 1.8, rating: 4.9, price: '2000', priceUnit: 'visit', available: true, phone: '0300-3333444' },
];

function rankProviders(intent) {
  let matched = MOCK_PROVIDERS;
  if (intent.serviceType) {
    matched = matched.filter(p => p.service === intent.serviceType);
  }
  matched = matched.filter(p => p.available);
  matched.sort((a, b) => {
    if (a.distance !== b.distance) return a.distance - b.distance;
    return b.rating - a.rating;
  });
  return matched;
}

function parseLocation(text) {
  const lowerText = text.toLowerCase();
  if (lowerText.match(/gulberg/i)) return 'Gulberg';
  if (lowerText.match(/dha|phase 5/i)) return 'DHA Phase 5';
  if (lowerText.match(/johar town/i)) return 'Johar Town';
  return null;
}

const testCases = [
  { input: "electrician in Gulberg", expectedLocation: "Gulberg", expectedFirst: "Ahmad Electrician" },
  { input: "electrician in DHA", expectedLocation: "DHA Phase 5", expectedFirst: "Ahmad Electrician" }, // Gulberg is closer (1.2) than DHA (2.1)
  { input: "plumber in Johar Town", expectedLocation: "Johar Town", expectedFirst: null }, // No plumbers in this small subset
];

console.log("Running Lahore Dataset Tests...");

testCases.forEach(({ input, expectedLocation, expectedFirst }, index) => {
  const loc = parseLocation(input);
  const providers = rankProviders({ serviceType: input.includes('electrician') ? 'Electrician' : 'Plumber', location: loc });
  
  const locPassed = loc === expectedLocation;
  const rankPassed = providers.length > 0 ? (providers[0].name === expectedFirst) : (expectedFirst === null);
  
  console.log(`Test ${index + 1}: ${locPassed && rankPassed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`   Input: "${input}"`);
  console.log(`   Location: Expected "${expectedLocation}", Actual "${loc}"`);
  console.log(`   First Provider: Expected "${expectedFirst}", Actual "${providers[0]?.name || 'None'}"`);
});
