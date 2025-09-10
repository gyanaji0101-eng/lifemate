// Aligning with personal assistant purpose by removing unused e-commerce types
export type View = 'language' | 'dashboard' | 'lists' | 'listDetail' | 'milk' | 'milkLogDetail' | 'masterList' | 'horoscope' | 'horoscopeDetail' | 'weather' | 'journal' | 'remedies' | 'bazaarRates' | 'attendance' | 'attendanceHistory' | 'calculator';

export type LanguageCode = 'en' | 'hi' | 'bho' | 'bn' | 'ta';

export type Translations = {
  [key in LanguageCode]: string;
};

export type Unit = 'kg' | 'g' | 'pcs' | 'ltr' | 'packet';

export interface Product {
  id: number;
  name: Translations;
  categoryId: number;
  unit: Unit;
  price: number;
  image?: string;
}

export interface Category {
  id: number;
  name: Translations;
  parentId?: number;
}

export interface ShoppingListItem {
  id: number; 
  name: string; 
  customName?: string;
  quantity: number;
  unit: Unit;
  expectedPrice?: number;
  actualPrice: number; 
  isChecked: boolean;
}

export interface ShoppingList {
  id: number;
  name: string;
  items: ShoppingListItem[];
  createdAt: string;
}

export interface MilkRecord {
    id: number;
    date: string; // ISO string for date
    quantity: number; // in Litres
    pricePerLitre: number;
}

export interface MilkVendorList {
  id: number;
  name: string;
  records: MilkRecord[];
  createdAt: string;
}

export interface ZodiacSign {
  id: string;
  name: Translations;
}

export interface WeatherData {
    temperatureCelsius: number;
    condition: string;
    humidity: number;
    windSpeedKPH: number;
    chanceOfRain?: number;
    sunriseTime?: string;
    sunsetTime?: string;
    moonriseTime?: string;
    moonsetTime?: string;
}

export interface WeatherCache {
    data: WeatherData | null;
    timestamp: number | null;
    error: string | null;
    loading: boolean;
}

export interface JournalEntry {
  id: number;
  createdAt: string; // ISO string for creation date
  content: string;
  reminderDateTime?: string; // Optional ISO string for reminder date and time
  reminderFired?: boolean; // To track if the notification has been sent
}

export interface BazaarRateItem {
    name: string;
    rate: string;
    category: string;
}

export type NotificationPermission = 'granted' | 'denied' | 'default';

export interface DailyNotificationStatus {
    morningSent: boolean;
    marketSent: boolean;
}

export type AttendanceStatus = 'present' | 'absent';

export interface AttendanceRecord {
  date: string; // "YYYY-MM-DD"
  status: AttendanceStatus;
  overtimeHours?: number;
  isOvertimeDay?: boolean;
}

export interface AttendanceSettings {
  monthlySalary: number;
  monthlyAdvance: number;
  overtimeRatePerHour: number;
}

export interface AttendanceHistoryRecord {
  id: number;
  year: number;
  month: number; // 0-11 for Jan-Dec
  presentDays: number;
  absentDays: number;
  monthlySalary: number;
  monthlyAdvance: number;
  earnedAmount: number;
  netPayable: number;
  totalOvertimeHours: number;
  overtimeRatePerHour: number;
  totalOvertimePay: number;
  totalOvertimeDays: number;
  totalOvertimeDayPay: number;
}