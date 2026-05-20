const { parseServiceRequest, findBestProvider } = require('../src/utils/aiMock');

const testCases = [
  { input: "BEAUTICIAN chahiye", expected: "Beautician" },
  { input: "beauty wali", expected: "Beautician" },
  { input: "salon wali chahiye", expected: "Beautician" },
  { input: "ELECTRICIAN", expected: "Electrician" },
  { input: "bijli wala", expected: "Electrician" },
  { input: "PLUMBER", expected: "Plumber" },
  { input: "AC TECHNICIAN", expected: "AC Technician" },
  { input: "CARPENTER", expected: "Carpenter" },
  { input: "almari banana", expected: "Carpenter" },
  { input: "mehndi lagwani", expected: "Beautician" },
  // Additional mixed case
  { input: "Need an ac tech tonight", expected: "AC Technician" },
  { input: "Wood work in Gulberg", expected: "Carpenter" }
];

console.log("Running Service Matching Tests...\n");
let allPassed = true;

testCases.forEach((tc, index) => {
  const intent = parseServiceRequest(tc.input);
  const passed = intent.serviceType === tc.expected;
  
  console.log(`Test ${index + 1}: ${passed ? '✅' : '❌'} "${tc.input}" -> ${intent.serviceType}`);
  if (!passed) {
    console.log(`   Expected: ${tc.expected}`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log("\nAll service matching tests passed! 🚀");
} else {
  console.log("\nSome tests failed. 🛑");
  process.exit(1);
}
