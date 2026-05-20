const { parseServiceRequest, rankProviders } = require('../src/utils/aiMock');

const testCases = [
  { 
    name: "Test 1: raat 8 baje electrician chahiye",
    input: "raat 8 baje electrician chahiye", 
    expectedService: "Electrician", 
    expectedTime: "Today, 8:00 PM" 
  },
  { 
    name: "Test 2: kal subah 10 baje plumber DHA mein",
    input: "kal subah 10 baje plumber DHA mein", 
    expectedService: "Plumber", 
    expectedTime: "Tomorrow, 10:00 AM",
    expectedLocation: "DHA Phase 5"
  },
  { 
    name: "Test 3: beauty wali chahiye aaj shaam 5 baje",
    input: "beauty wali chahiye aaj shaam 5 baje", 
    expectedService: "Beautician", 
    expectedTime: "Today, 5:00 PM" 
  },
  { 
    name: "Test 4: I need carpenter tonight at 9",
    input: "I need carpenter tonight at 9", 
    expectedService: "Carpenter", 
    expectedTime: "Today, 9:00 PM" 
  },
  { 
    name: "Test 5: AC wala parson dopahar 2 baje",
    input: "AC wala parson dopahar 2 baje", 
    expectedService: "AC Technician", 
    expectedTime: "Day after tomorrow, 2:00 PM" 
  },
];

console.log("Running Critical Bug Fix Tests...\n");
let allPassed = true;

testCases.forEach((tc, index) => {
  const intent = parseServiceRequest(tc.input);
  const providers = rankProviders(intent);
  
  const servicePassed = intent.serviceType === tc.expectedService;
  const timePassed = intent.time === tc.expectedTime;
  const locPassed = tc.expectedLocation ? (intent.location === tc.expectedLocation) : true;
  
  const passed = servicePassed && timePassed && locPassed;
  
  console.log(`${tc.name}: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  if (!servicePassed) console.log(`   Service: Expected "${tc.expectedService}", Actual "${intent.serviceType}"`);
  if (!timePassed) console.log(`   Time: Expected "${tc.expectedTime}", Actual "${intent.time}"`);
  if (!locPassed) console.log(`   Location: Expected "${tc.expectedLocation}", Actual "${intent.location}"`);
  
  if (!passed) allPassed = false;
});

if (allPassed) {
  console.log("\nAll critical tests passed! 🎉");
} else {
  console.log("\nSome tests failed. 🛑");
  process.exit(1);
}
