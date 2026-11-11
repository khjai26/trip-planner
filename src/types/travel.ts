export type TravelType = 'domestic' | 'overseas';

export interface Travelers {
  adults: number;
  children: number;
  infants: number;
}

export interface PetInfo {
  hasPet: boolean;
  petType: '강아지' | '고양이' | '기타';
  petSize: '소형' | '중형' | '대형';
}

export interface DomesticSpecifics {
  departureRegion: string;
  destination: string;
  transport: string[];
}

export interface OverseasSpecifics {
  departureAirport: string;
  continent: string;
  destination: string;
  flightPreference: '직항만' | '경유 가능';
  localTransport: string[];
  accommodationStyle: string;
}

export interface PlannerFormData {
  type: TravelType;
  startDate: string;
  durationNights: number;
  durationDays: number;
  travelers: Travelers;
  budget: number;
  budgetPerPerson: boolean;
  includeFlight: boolean;
  purpose: string;
  pet: PetInfo;
  keywords: string[];
  domestic: DomesticSpecifics;
  overseas: OverseasSpecifics;
}

export interface PlanPlace {
  id: string;
  time: string;
  name: string;
  category: string;
  description: string;
  estimatedCost: string;
  estimatedCostKRW: number;
  transportToNext?: string;
  isPetFriendly?: boolean;
  highlight?: string;
  photoUrl?: string;
}

export interface DayItinerary {
  dayNumber: number;
  date: string;
  themeTitle: string;
  daySummary: string;
  places: PlanPlace[];
}

export interface BudgetComparison {
  userBudgetKRW: number;
  differenceKRW: number;
  percentage: number;
  isOverBudget: boolean;
  analysisMessage: string;
}

export interface OverseasChecklist {
  visaRequirement: string;
  passportValidity: string;
  timeDifference: string;
  voltageAndPlug: string;
  weatherAndClothing: string;
  travelInsurance: string;
  tippingCulture: string;
  officialNotice: string;
}

export interface FlightInfo {
  departureAirport: string;
  estimatedFlightDuration: string;
  type: string;
  approximateFareKRW: string;
  tips: string;
}

export interface TravelPlanResponse {
  tripTitle: string;
  destination: string;
  destinationSummary: string;
  totalCostKRW: number;
  budgetComparison: BudgetComparison;
  travelTips: string[];
  days: DayItinerary[];
  isOverseas: boolean;
  currency?: {
    code: string;
    symbol: string;
    exchangeRateText: string;
  };
  flightInfo?: FlightInfo;
  checklist?: OverseasChecklist;
  petQuarantineNotice?: string;
  notice?: string;
}

export interface SavedPlace extends PlanPlace {
  dayNumber: number;
  dayTheme: string;
  tripDestination: string;
  savedAt: number;
}
