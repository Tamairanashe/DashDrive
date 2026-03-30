
export interface VehicleCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface CityCoverage {
  id: string;
  name: string;
  image: string;
  driversOnline: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Define Merchant interface used by the MerchantGrid component
export interface Merchant {
  id: string;
  name: string;
  logo: string;
  category: string;
  offer?: string;
}
