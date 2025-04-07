
import { CreativeDevice } from '../types/campaign';

export const creativeDevices: CreativeDevice[] = [
  {
    id: "unexpected-mashup",
    name: "Unexpected Mashup",
    description: "Combine two seemingly unrelated concepts, cultural formats, or product categories.",
    examples: [
      "Burger King's 'Moldy Whopper' (food + decay)",
      "Spotify's 'Wrapped' (personal data + year in review)",
      "Nike's 'Breaking2' (sports + science documentary)"
    ],
    applicableTo: ["digital", "social", "experiential", "branded-entertainment"]
  },
  {
    id: "participation-mechanics",
    name: "Participation Mechanics",
    description: "Create a framework that invites consumer co-creation or interaction.",
    examples: [
      "ALS Ice Bucket Challenge",
      "Share a Coke campaign",
      "Dove 'Real Beauty Sketches'"
    ],
    applicableTo: ["social", "UGC", "experiential", "guerrilla"]
  },
  {
    id: "subversive-placement",
    name: "Subversive Placement",
    description: "Position the brand message in unexpected contexts or media spaces.",
    examples: [
      "Fearless Girl on Wall Street",
      "KFC 'FCK' apology ad",
      "Carlsberg's 'Probably Not' reverse campaign"
    ],
    applicableTo: ["ooh-ambient", "stunt", "guerrilla", "real-time"]
  },
  {
    id: "format-disruption",
    name: "Format Disruption",
    description: "Break the conventions of a familiar media format or channel.",
    examples: [
      "Skittles Super Bowl ad shown to only one person",
      "Domino's pothole fixing campaign",
      "Old Spice's interactive YouTube experience"
    ],
    applicableTo: ["digital", "social", "branded-entertainment", "stunt"]
  },
  {
    id: "emotional-contrast",
    name: "Emotional Contrast",
    description: "Create a dramatic shift in emotion to heighten audience impact.",
    examples: [
      "Sandy Hook Promise 'Back to School Essentials'",
      "Always 'Like a Girl'",
      "Thai Life Insurance 'Unsung Hero'"
    ],
    applicableTo: ["digital", "branded-entertainment", "social", "brand-activism"]
  }
];

/**
 * Get creative devices based on campaign style
 */
export function getCreativeDevicesForStyle(
  style: string | undefined,
  count: number = 2
): CreativeDevice[] {
  // If no style specified, return random devices
  if (!style) {
    return shuffleArray([...creativeDevices]).slice(0, count);
  }
  
  // Filter devices applicable to the specified style
  const applicableDevices = creativeDevices.filter(device => 
    device.applicableTo.some(s => s.toLowerCase() === style.toLowerCase())
  );
  
  // If no applicable devices found, return random devices
  if (applicableDevices.length === 0) {
    return shuffleArray([...creativeDevices]).slice(0, count);
  }
  
  // Return random applicable devices
  return shuffleArray(applicableDevices).slice(0, Math.min(count, applicableDevices.length));
}

/**
 * Format creative devices for prompt inclusion
 */
export function formatCreativeDevicesForPrompt(devices: CreativeDevice[]): string {
  if (devices.length === 0) return '';
  
  return `
#### **Creative Devices**
Consider incorporating these creative techniques:
${devices.map((device, i) => `${i + 1}. **${device.name}**: ${device.description}
   Examples: ${device.examples[0]}`).join('\n')}
  `.trim();
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
