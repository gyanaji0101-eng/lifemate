

export type View = 'language' | 'dashboard' | 'lists' | 'listDetail' | 'milk' | 'masterList' | 'horoscope' | 'horoscopeDetail' | 'weather';

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
