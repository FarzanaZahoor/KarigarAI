import { Provider, MOCK_PROVIDERS } from '../data/mockProviders';

export interface ParsedIntent {
  serviceType: string | null;
  location: string | null;
  time: string | null;
  isPastTime?: boolean;
  isMissingTime?: boolean;
}

export function parseServiceRequest(text: string): ParsedIntent {
  const lowerText = text.toLowerCase().trim();
  
  // 1. Extract Service Type
  let serviceType = null;
  if (lowerText.match(/(electrician|electric|bijli|wiring|socket|taar|bijli wala|bijli wali|بجلی|الیکٹریشن)/)) serviceType = 'Electrician';
  else if (lowerText.match(/(plumber|plumbing|nal|pipe|pani|leakage|nal wala|پلمبر|نل)/)) serviceType = 'Plumber';
  else if (lowerText.match(/(ac technician|ac tech|air conditioner|ac wala|ac service|cooling|thanda|اے سی)/) || lowerText.includes('ac')) serviceType = 'AC Technician';
  else if (lowerText.match(/(parlor wali|parlour wali|salon wali|mehndi wali|makeup artist|beautician|beauty|salon|makeup|make up|mehndi|threading|facial|waxing|parlor|parlour|bridal|beauty wali|بیوٹیشن|بیوٹی|میک اپ|مہندی)/)) serviceType = 'Beautician';
  else if (lowerText.match(/(carpenter|carpentry|wood|almari|furniture|darwaza|wardrobe|wood work|لکڑی|کارپینٹر|الماری)/)) serviceType = 'Carpenter';

  // 2. Extract Location
  let location: string | null = null;
  if (lowerText.match(/gulberg/i)) location = 'Gulberg';
  else if (lowerText.match(/dha|d\.h\.a|defence|defense|phase 5/i)) location = 'DHA Phase 5';
  else if (lowerText.match(/johar|johar town/i)) location = 'Johar Town';
  else if (lowerText.match(/model town|modeltown/i)) location = 'Model Town';
  else if (lowerText.match(/bahria|bahria town/i)) location = 'Bahria Town';
  else if (lowerText.match(/garden town|gardentown/i)) location = 'Garden Town';
  else if (lowerText.match(/iqbal town|iqbaltown/i)) location = 'Iqbal Town';
  else if (lowerText.match(/wapda town|wapdatown/i)) location = 'Wapda Town';
  else if (lowerText.match(/cavalry|cavalry ground/i)) location = 'Cavalry Ground';
  else if (lowerText.match(/cantt|cantonment|cant/i)) location = 'Cantt';

  // 3. Extract Time
  const timeInfo = extractTimeInfo(lowerText);

  return { 
    serviceType, 
    location, 
    time: timeInfo.time,
    isPastTime: timeInfo.isPast,
    isMissingTime: timeInfo.time === null
  };
}

function extractTimeInfo(text: string): { time: string | null, isPast: boolean } {
  const lowerText = text.toLowerCase();
  let forcePM = !!lowerText.match(/\b(raat|night|tonight)\b/i);
  let dayStr = "Today";
  let daysToAdd = 0;
  
  if (lowerText.match(/\b(kal|tomorrow)\b/i)) { dayStr = "Tomorrow"; daysToAdd = 1; }
  else if (lowerText.match(/\b(parson|do din baad|2 din baad|day after tomorrow)\b/i)) { dayStr = "Day after tomorrow"; daysToAdd = 2; }

  // Check if text has ANY time-related keywords before extracting hours
  const hasTimeContext = !!lowerText.match(/\b(baje|subah|morning|shaam|sham|dopahar|raat|night|tonight|am|pm|abhi|asap|now|foran|jaldi)\b/i) || daysToAdd > 0;

  // Handle immediate/ASAP requests
  if (lowerText.match(/\b(abhi|asap|now|foran|jaldi)\b/i)) {
    return { time: 'ASAP', isPast: false };
  }

  const numMap: { [key: string]: number } = {
    "ek": 1, "do": 2, "teen": 3, "char": 4, "panch": 5, "chhe": 6, "saat": 7, "aath": 8, "nau": 9, "das": 10, "gyarah": 11, "barah": 12,
    "one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10, "eleven": 11, "twelve": 12
  };
  
  let hour: number | null = null;
  // Only match numbers that appear near time-context words (baje, subah, etc.)
  const timeNumericMatch = lowerText.match(/\b([1-9]|1[0-2])\s*baje\b/);
  if (timeNumericMatch) {
    hour = parseInt(timeNumericMatch[1]);
  } else {
    // Try generic numeric match only if there's time context
    if (hasTimeContext) {
      const numericMatch = lowerText.match(/\b([1-9]|1[0-2])\b/);
      if (numericMatch) hour = parseInt(numericMatch[1]);
    }
    if (hour === null) {
      for (const [word, val] of Object.entries(numMap)) {
        if (new RegExp(`\\b${word}\\b`, 'i').test(lowerText)) { hour = val; break; }
      }
    }
  }

  // If no hour found, check for time-of-day keywords without specific hour
  if (hour === null && !hasTimeContext) return { time: null, isPast: false };
  
  // Handle cases like "kal subah" or "aaj shaam" without specific hour
  if (hour === null && hasTimeContext) {
    if (lowerText.match(/\b(subah|morning)\b/i)) { hour = 9; }
    else if (lowerText.match(/\b(dopahar)\b/i)) { hour = 1; }
    else if (lowerText.match(/\b(shaam|sham)\b/i)) { hour = 6; }
    else if (lowerText.match(/\b(raat|night|tonight)\b/i)) { hour = 9; forcePM = true; }
    else if (daysToAdd > 0) { hour = 9; } // default to morning for "kal"/"parson" without time
    else return { time: null, isPast: false };
  }

  let ampm: string | null = null;
  if (forcePM || lowerText.match(/\b(shaam|sham|dopahar|pm)\b/i)) ampm = "PM";
  else if (lowerText.match(/\b(subah|morning|am)\b/i)) ampm = "AM";
  
  if (!ampm) {
    if (hour! >= 1 && hour! <= 6) ampm = "PM";
    else ampm = "AM";
  }

  const timeString = `${dayStr}, ${hour}:00 ${ampm}`;
  
  // Proper past time detection: compare full date+time
  let isPast = false;
  const now = new Date();
  const requestedDate = new Date(now);
  requestedDate.setDate(requestedDate.getDate() + daysToAdd);
  
  let requestedHour24 = hour!;
  if (ampm === "PM" && hour! < 12) requestedHour24 += 12;
  if (ampm === "AM" && hour === 12) requestedHour24 = 0;
  
  requestedDate.setHours(requestedHour24, 0, 0, 0);
  
  if (requestedDate.getTime() < now.getTime()) {
    isPast = true;
  }

  return { time: timeString, isPast };
}

export function findBestProvider(intent: ParsedIntent): Provider[] {
  let matched = MOCK_PROVIDERS.filter(p => p.available);
  
  if (intent.serviceType) {
    matched = matched.filter(p => p.service.toLowerCase() === intent.serviceType!.toLowerCase());
  }

  matched.sort((a, b) => {
    const aAreaMatch = a.area === intent.location;
    const bAreaMatch = b.area === intent.location;
    if (aAreaMatch !== bAreaMatch) return aAreaMatch ? -1 : 1;
    if (a.distance !== b.distance) return a.distance - b.distance;
    return b.rating - a.rating;
  });

  return matched;
}

export const rankProviders = findBestProvider;
