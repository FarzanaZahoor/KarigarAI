// Self-contained test for extractTime logic (Updated for Overhaul)
function extractTime(text) {
  const lowerText = text.toLowerCase();
  
  // STEP 1 - Find day
  let dayStr = "Today";
  
  if (lowerText.match(/\b(char din baad|4 din baad)\b/i)) {
    dayStr = "4 days later";
  } else if (lowerText.match(/\b(teen din baad|3 din baad)\b/i)) {
    dayStr = "3 days later";
  } else if (lowerText.match(/\b(parson|do din baad|2 din baad|day after tomorrow)\b/i)) {
    dayStr = "Day after tomorrow";
  } else if (lowerText.match(/\b(kal|tomorrow)\b/i)) {
    dayStr = "Tomorrow";
  } else if (lowerText.match(/\b(aaj|today|aj|tonight)\b/i)) {
    dayStr = "Today";
  }

  // STEP 2 - Find hour number
  const numMap = {
    "ek": 1, "do": 2, "teen": 3, "char": 4, "panch": 5, "chhe": 6, 
    "saat": 7, "aath": 8, "nau": 9, "das": 10, "gyarah": 11, "barah": 12,
    "one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6,
    "seven": 7, "eight": 8, "nine": 9, "ten": 10, "eleven": 11, "twelve": 12
  };
  
  let hour = null;
  const numericMatch = lowerText.match(/\b([1-9]|1[0-2])\b/);
  if (numericMatch) {
    hour = parseInt(numericMatch[1]);
  } else {
    for (const [word, val] of Object.entries(numMap)) {
      if (new RegExp(`\\b${word}\\b`, 'i').test(lowerText)) {
        hour = val;
        break;
      }
    }
  }

  if (hour === null) return null;

  // STEP 3 - Find AM or PM
  let ampm = null;
  
  if (lowerText.match(/\b(raat|night|tonight|shaam|sham|dopahar|pm)\b/i)) {
    ampm = "PM";
  } else if (lowerText.match(/\b(subah|morning|am)\b/i)) {
    ampm = "AM";
  }
  
  if (!ampm) {
    if (hour >= 1 && hour <= 6) ampm = "PM";
    else if (hour >= 7 && hour <= 12) ampm = "AM";
  }

  // STEP 4 - Build final time
  return `${dayStr}, ${hour}:00 ${ampm}`;
}

const testCases = [
  { input: "kal raat 8 baje", expected: "Tomorrow, 8:00 PM" },
  { input: "8 baje raat", expected: "Today, 8:00 PM" },
  { input: "tomorrow night at 8", expected: "Tomorrow, 8:00 PM" },
  { input: "tonight at 9", expected: "Today, 9:00 PM" },
  { input: "day after tomorrow at 3 PM", expected: "Day after tomorrow, 3:00 PM" },
  { input: "kal subah 10 baje", expected: "Tomorrow, 10:00 AM" },
];

console.log("Running Overhaul Time Extraction Tests...");
let allPassed = true;

testCases.forEach(({ input, expected }, index) => {
  const actual = extractTime(input);
  const passed = actual === expected;
  console.log(`Test ${index + 1}: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`   Input: "${input}"`);
  console.log(`   Expected: "${expected}"`);
  console.log(`   Actual:   "${actual}"`);
  if (!passed) allPassed = false;
});

if (allPassed) {
  console.log("\nAll overhaul tests passed! 🎉");
} else {
  console.log("\nSome overhaul tests failed. 🛑");
  process.exit(1);
}
