
export enum FacilityType {
  ER = 'Emergency Room',
  URGENT_CARE = 'Urgent Care',
  PHARMACY = 'Pharmacy'
}

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  waitTimeMinutes: number;
  distanceMiles: number;
  status: 'Low' | 'Moderate' | 'High' | 'Critical';
  address: string;
  phone: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
}

export interface CheckInFormData {
  firstName: string;
  lastName: string;
  dob: string;
  symptoms: string;
  insuranceProvider?: string;
  facilityId: string;
}

export enum AppView {
  DASHBOARD = 'dashboard',
  TRIAGE = 'triage',
  PRE_CHECK_IN = 'pre-check-in'
}
