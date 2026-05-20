import { parseServiceRequest } from '../src/utils/aiMock';

const testCases = [
  { input: "kal raat 8 baje", expected: "Tomorrow, 8:00 PM" },
  { input: "aaj subah 10 baje", expected: "Today, 10:00 AM" },
  { input: "parson shaam 5 baje", expected: "Day after tomorrow, 5:00 PM" },
  { input: "char din baad raat 9 baje", expected: "4 days later, 9:00 PM" },
  { input: "kal 3 baje", expected: "Tomorrow, 3:00 PM" },
];

console.log("Running Time Extraction Tests...");
let allPassed = true;

testCases.forEach(({ input, expected }, index) => {
  const result = parseServiceRequest(input);
  const passed = result.time === expected;
  console.log(`Test ${index + 1}: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`   Input: "${input}"`);
  console.log(`   Expected: "${expected}"`);
  console.log(`   Actual:   "${result.time}"`);
  if (!passed) allPassed = false;
});

if (allPassed) {
  console.log("\nAll tests passed! 🎉");
} else {
  console.log("\nSome tests failed. 🛑");
}
