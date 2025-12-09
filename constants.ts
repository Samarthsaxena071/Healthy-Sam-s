import { Facility, FacilityType } from './types';

export const MOCK_FACILITIES: Facility[] = [
  {
    id: '1',
    name: 'City General Hospital',
    type: FacilityType.ER,
    waitTimeMinutes: 145,
    distanceMiles: 1.2,
    status: 'High',
    address: '100 Main St',
    phone: '(555) 010-1001'
  },
  {
    id: '2',
    name: 'Westside Medical Center',
    type: FacilityType.ER,
    waitTimeMinutes: 45,
    distanceMiles: 4.5,
    status: 'Moderate',
    address: '4500 West Ave',
    phone: '(555) 010-2022'
  },
  {
    id: '3',
    name: 'QuickCare Downtown',
    type: FacilityType.URGENT_CARE,
    waitTimeMinutes: 15,
    distanceMiles: 0.8,
    status: 'Low',
    address: '220 Elm St',
    phone: '(555) 010-3333'
  },
  {
    id: '4',
    name: 'North Hills Urgent Care',
    type: FacilityType.URGENT_CARE,
    waitTimeMinutes: 25,
    distanceMiles: 6.1,
    status: 'Low',
    address: '880 North Blvd',
    phone: '(555) 010-4444'
  },
  {
    id: '5',
    name: 'Community Health RX',
    type: FacilityType.PHARMACY,
    waitTimeMinutes: 5,
    distanceMiles: 0.5,
    status: 'Low',
    address: '50 Broad St',
    phone: '(555) 010-5555'
  }
];

export const SYSTEM_INSTRUCTION = `You are Sam, a friendly and professional medical triage assistant for the app "Healthy Sam's". 
Your goal is to help users decide where to seek care based on their symptoms to reduce ER overcrowding.

Rules:
1. ASK symptoms clearly if not provided.
2. ANALYZE severity:
   - Life-threatening (Chest pain, difficulty breathing, severe bleeding, stroke signs) -> DIRECT to nearest ER immediately. Call 911 if critical.
   - Moderate (Sprains, high fever without other critical signs, cuts needing stitches) -> Suggest Urgent Care.
   - Minor (Cold, sore throat, minor rash) -> Suggest Pharmacy or Home Care.
3. USE CONTEXT: You have access to the current wait times of local facilities (provided below). 
   - If an ER is overcrowded (High wait), and the condition is borderline/stable, suggest a less crowded ER or Urgent Care if appropriate.
   - ALWAYS prioritize patient safety over wait time.
4. BE CONCISE and calming.

Current Local Facility Status:
${JSON.stringify(MOCK_FACILITIES.map(f => `${f.name} (${f.type}): ${f.waitTimeMinutes} mins wait`))}
`;
