import React, { createContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import type { LanguageCode, Translations, Product, Category, ShoppingList, ShoppingListItem, MilkRecord, MilkVendorList, JournalEntry, WeatherData, WeatherCache, NotificationPermission, DailyNotificationStatus, AttendanceRecord, AttendanceStatus, AttendanceSettings, AttendanceHistoryRecord } from '../types';
import { CATEGORIES, PRODUCTS } from '../constants';
import { getMorningNotification, getMarketNotification } from '../utils/notifications';

// Helper for local storage
const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
};

interface AppContextType {
  language: LanguageCode | null;
  setLanguage: (lang: LanguageCode) => void;
  t: (translations: Translations) => string;
  products: Product[];
  categories: Category[];
  shoppingLists: ShoppingList[];
  milkVendorLists: MilkVendorList[];
  journalEntries: JournalEntry[];
  weatherCache: WeatherCache;
  notificationPermission: NotificationPermission;
  attendanceRecords: AttendanceRecord[];
  attendanceSettings: AttendanceSettings;
  attendanceHistory: AttendanceHistoryRecord[];
  addAttendanceHistoryRecord: (record: Omit<AttendanceHistoryRecord, 'id'>) => boolean;
  removeAttendanceHistoryRecord: (recordId: number) => void;
  updateAttendanceSettings: (settings: Partial<AttendanceSettings>) => void;
  setAttendanceStatus: (date: string, status: AttendanceStatus | null) => void;
  setOvertimeHours: (date: string, hours: number) => void;
  setOvertimeDay: (date: string, isOvertime: boolean) => void;
  setNotificationPermission: (permission: NotificationPermission) => void;
  triggerDailyNotification: () => void;
  fetchWeather: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => void;
  addShoppingList: (name: string, items?: ShoppingListItem[]) => boolean;
  duplicateShoppingList: (listId: number) => void;
  removeShoppingList: (listId: number) => void;
  updateShoppingList: (listId: number, updatedList: Partial<ShoppingList>) => void;
  addMilkVendor: (name: string) => boolean;
  removeMilkVendor: (vendorId: number) => void;
  addRecordToVendor: (vendorId: number, record: Omit<MilkRecord, 'id'>) => void;
  removeRecordFromVendor: (vendorId: number, recordId: number) => void;
  findProductByName: (name: string) => Product | undefined;
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
  updateJournalEntry: (entryId: number, updates: Partial<JournalEntry>) => void;
  removeJournalEntry: (entryId: number) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [language, setLanguage] = useLocalStorage<LanguageCode | null>('app-language', null);
  const [products, setProducts] = useLocalStorage<Product[]>('app-products', PRODUCTS);
  const [shoppingLists, setShoppingLists] = useLocalStorage<ShoppingList[]>('app-shopping-lists', []);
  const [milkVendorLists, setMilkVendorLists] = useLocalStorage<MilkVendorList[]>('app-milk-vendor-lists', []);
  const [journalEntries, setJournalEntries] = useLocalStorage<JournalEntry[]>('app-journal-entries', []);
  const [weatherCache, setWeatherCache] = useState<WeatherCache>({ data: null, timestamp: null, error: null, loading: false });
  const [notificationPermission, setNotificationPermission] = useLocalStorage<NotificationPermission>('app-notification-permission', 'default');
  const [attendanceRecords, setAttendanceRecords] = useLocalStorage<AttendanceRecord[]>('app-attendance-records', []);
  const [attendanceSettings, setAttendanceSettings] = useLocalStorage<AttendanceSettings>('app-attendance-settings', { monthlySalary: 0, monthlyAdvance: 0, overtimeRatePerHour: 0 });
  const [attendanceHistory, setAttendanceHistory] = useLocalStorage<AttendanceHistoryRecord[]>('app-attendance-history', []);

  const t = useCallback((translations: Translations) => {
    return translations[language || 'en'] || translations['en'];
  }, [language]);
  
  const triggerDailyNotification = useCallback(() => {
    if (notificationPermission !== 'granted' || !('Notification' in window)) {
        return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const currentHour = new Date().getHours();

    // Get status from storage
    const storedStatusRaw = localStorage.getItem('dailyNotificationStatus');
    let todayStatus: DailyNotificationStatus = { morningSent: false, marketSent: false };

    if (storedStatusRaw) {
        const stored = JSON.parse(storedStatusRaw);
        if (stored.date === todayStr) {
            todayStatus = stored.status;
        }
    }

    const sendNotification = (title: string, body: string) => {
        const notification = new Notification(title, {
            body: body,
            icon: '/logo.png', // Assuming you have a logo in public folder
        });
        notification.onclick = () => window.focus();
    };

    let notificationSent = false;
    let newStatus = { ...todayStatus };

    // Decision Logic: Prioritize the most relevant, unsent notification for the current time.
    if (currentHour >= 10 && !todayStatus.marketSent) {
        const { title, body } = getMarketNotification(t);
        sendNotification(title, body);
        newStatus.marketSent = true;
        notificationSent = true;
    } else if (!todayStatus.morningSent) {
        const { title, body } = getMorningNotification(t);
        sendNotification(title, body);
        newStatus.morningSent = true;
        notificationSent = true;
    }

    if (notificationSent) {
        localStorage.setItem('dailyNotificationStatus', JSON.stringify({ date: todayStr, status: newStatus }));
    }
  }, [notificationPermission, t]);


  const fetchWeather = useCallback(async () => {
    // REMOVED: Caching logic to ensure fresh data on every fetch, addressing user's request for accuracy.
    setWeatherCache(prev => ({ ...prev, loading: true, error: null }));

    if (!navigator.geolocation) {
        setWeatherCache({ data: null, timestamp: null, loading: false, error: "Geolocation is not supported." });
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                const { latitude, longitude } = position.coords;
                const prompt = `Based on the coordinates latitude: ${latitude}, longitude: ${longitude}, provide the current weather information, including the percentage chance of rain, sunrise time, sunset time, moonrise time, and moonset time. All times should be in HH:MM format (e.g., 06:15 or 18:30).`;

                const response = await ai.models.generateContent({
                  model: 'gemini-2.5-flash',
                  contents: prompt,
                  config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                      type: Type.OBJECT,
                      properties: {
                        temperatureCelsius: { type: Type.NUMBER },
                        condition: { type: Type.STRING },
                        humidity: { type: Type.NUMBER },
                        windSpeedKPH: { type: Type.NUMBER },
                        chanceOfRain: { type: Type.NUMBER },
                        sunriseTime: { type: Type.STRING },
                        sunsetTime: { type: Type.STRING },
                        moonriseTime: { type: Type.STRING },
                        moonsetTime: { type: Type.STRING },
                      }
                    }
                  }
                });
                
                const weatherData = JSON.parse(response.text) as WeatherData;
                setWeatherCache({ data: weatherData, timestamp: Date.now(), loading: false, error: null });

            } catch (err) {
                console.error("Error fetching weather:", err);
                setWeatherCache({ data: null, timestamp: null, loading: false, error: "Could not load weather data." });
            }
        },
        () => {
            setWeatherCache({ data: null, timestamp: null, loading: false, error: "Unable to retrieve your location." });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  const addProduct = (productData: Omit<Product, 'id'>) => {
    setProducts(prev => [...prev, { ...productData, id: Date.now() }]);
  };

  const addShoppingList = (name: string, items: ShoppingListItem[] = []) => {
    const trimmedName = name.trim();
    if (!trimmedName) return false;
    const isDuplicate = shoppingLists.some(list => list.name.toLowerCase() === trimmedName.toLowerCase());

    if (isDuplicate) {
        return false;
    }
    
    const newList: ShoppingList = {
        id: Date.now(),
        name: trimmedName,
        items: items,
        createdAt: new Date().toISOString(),
    };
    setShoppingLists(prev => [newList, ...prev]);
    return true;
  };
  
  const duplicateShoppingList = (listId: number) => {
    const listToDuplicate = shoppingLists.find(list => list.id === listId);
    if (!listToDuplicate) return;

    let newName = `${listToDuplicate.name} (Copy)`;
    let counter = 2;
    while (shoppingLists.some(list => list.name === newName)) {
        newName = `${listToDuplicate.name} (Copy ${counter++})`;
    }

    const newList: ShoppingList = {
        ...listToDuplicate,
        id: Date.now(),
        name: newName,
        createdAt: new Date().toISOString(),
    };
    setShoppingLists(prev => [newList, ...prev]);
  };

  const removeShoppingList = (listId: number) => {
    setShoppingLists(prev => prev.filter(list => list.id !== listId));
  };
  
  const updateShoppingList = (listId: number, updatedList: Partial<ShoppingList>) => {
    setShoppingLists(prev => prev.map(list => list.id === listId ? { ...list, ...updatedList } : list));
  };

  const findProductByName = (name: string) => {
    const lowerCaseName = name.toLowerCase().trim();
    return products.find(p => 
        Object.values(p.name).some(translatedName => translatedName.toLowerCase() === lowerCaseName)
    );
  };

  const addMilkVendor = (name: string): boolean => {
    const trimmedName = name.trim();
    if (!trimmedName) return false;
    const isDuplicate = milkVendorLists.some(list => list.name.toLowerCase() === trimmedName.toLowerCase());
    if (isDuplicate) return false;
    
    const newList: MilkVendorList = {
        id: Date.now(),
        name: trimmedName,
        records: [],
        createdAt: new Date().toISOString(),
    };
    setMilkVendorLists(prev => [newList, ...prev]);
    return true;
  };

  const removeMilkVendor = (vendorId: number) => {
      setMilkVendorLists(prev => prev.filter(v => v.id !== vendorId));
  };

  const addRecordToVendor = (vendorId: number, record: Omit<MilkRecord, 'id'>) => {
      const newRecord = { ...record, id: Date.now() };
      setMilkVendorLists(prev => prev.map(vendor => {
          if (vendor.id === vendorId) {
              const updatedRecords = [newRecord, ...vendor.records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
              return { ...vendor, records: updatedRecords };
          }
          return vendor;
      }));
  };

  const removeRecordFromVendor = (vendorId: number, recordId: number) => {
      setMilkVendorLists(prev => prev.map(vendor => {
          if (vendor.id === vendorId) {
              const updatedRecords = vendor.records.filter(r => r.id !== recordId);
              return { ...vendor, records: updatedRecords };
          }
          return vendor;
      }));
  };

  const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => {
    const newEntry: JournalEntry = {
        ...entry,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        reminderFired: false,
    };
    setJournalEntries(prev => [newEntry, ...prev].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const updateJournalEntry = (entryId: number, updates: Partial<JournalEntry>) => {
    setJournalEntries(prev => prev.map(entry => entry.id === entryId ? { ...entry, ...updates } : entry));
  };

  const removeJournalEntry = (entryId: number) => {
    setJournalEntries(prev => prev.filter(entry => entry.id !== entryId));
  };
  
  const setAttendanceStatus = (date: string, status: AttendanceStatus | null) => {
    setAttendanceRecords(prev => {
      const existingRecordIndex = prev.findIndex(record => record.date === date);

      if (status === null) {
        // Remove the record if status is null
        if (existingRecordIndex > -1) {
          return prev.filter((_, index) => index !== existingRecordIndex);
        }
        return prev;
      }

      if (existingRecordIndex > -1) {
        // Update existing record
        const newRecords = [...prev];
        const updatedRecord = { ...newRecords[existingRecordIndex], status };
        // Reset overtime if marked absent
        if (status === 'absent') {
          delete updatedRecord.overtimeHours;
          delete updatedRecord.isOvertimeDay;
        }
        newRecords[existingRecordIndex] = updatedRecord;
        return newRecords;
      } else {
        // Add new record
        return [...prev, { date, status }];
      }
    });
  };

  const setOvertimeHours = (date: string, hours: number) => {
    setAttendanceRecords(prev => {
      return prev.map(record => {
        if (record.date === date) {
          const newRecord = { ...record };
          if (hours > 0) {
            newRecord.overtimeHours = hours;
          } else {
            delete newRecord.overtimeHours;
          }
          return newRecord;
        }
        return record;
      });
    });
  };

  const setOvertimeDay = (date: string, isOvertime: boolean) => {
    setAttendanceRecords(prev => {
      return prev.map(record => {
        if (record.date === date) {
          const newRecord = { ...record };
          if (isOvertime) {
            newRecord.isOvertimeDay = true;
          } else {
            delete newRecord.isOvertimeDay;
          }
          return newRecord;
        }
        return record;
      });
    });
  };
  
  const updateAttendanceSettings = (settings: Partial<AttendanceSettings>) => {
    setAttendanceSettings(prev => ({ ...prev, ...settings }));
  };
  
  const addAttendanceHistoryRecord = (record: Omit<AttendanceHistoryRecord, 'id'>): boolean => {
    const isDuplicate = attendanceHistory.some(h => h.year === record.year && h.month === record.month);
    if (isDuplicate) {
        return false;
    }
    const newRecord = { ...record, id: Date.now() };
    setAttendanceHistory(prev => [newRecord, ...prev].sort((a, b) => {
        const dateA = new Date(a.year, a.month);
        const dateB = new Date(b.year, b.month);
        return dateB.getTime() - dateA.getTime();
    }));
    return true;
  };

  const removeAttendanceHistoryRecord = (recordId: number) => {
      setAttendanceHistory(prev => prev.filter(r => r.id !== recordId));
  };

  const checkJournalReminders = useCallback(() => {
    if (notificationPermission !== 'granted') return;

    const now = new Date();
    journalEntries.forEach(entry => {
        if (entry.reminderDateTime && !entry.reminderFired) {
            const reminderTime = new Date(entry.reminderDateTime);
            if (now >= reminderTime) {
                // FIX: The 'vibrate' property is not a standard part of the NotificationOptions type and was causing a compilation error. It has been removed.
                const notification = new Notification(t({en: 'LifeMate Reminder', hi: 'लाइफमेट रिमाइंडर', bho: 'लाइफमेट रिमाइंडर', bn: 'লাইফমেট রিমাইন্ডার', ta: 'லைஃப்மேட் நினைவூட்டல்'}), {
                    body: entry.content,
                    icon: '/logo.png',
                    requireInteraction: true,
                    tag: `journal-${entry.id}`
                });
                notification.onclick = () => window.focus();
                
                updateJournalEntry(entry.id, { reminderFired: true });
            }
        }
    });
  }, [journalEntries, notificationPermission, t, updateJournalEntry]);

  useEffect(() => {
      const intervalId = setInterval(checkJournalReminders, 30000); // Check every 30 seconds
      return () => clearInterval(intervalId);
  }, [checkJournalReminders]);
  
  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      t,
      products,
      categories: CATEGORIES,
      shoppingLists,
      milkVendorLists,
      journalEntries,
      weatherCache,
      notificationPermission,
      attendanceRecords,
      attendanceSettings,
      attendanceHistory,
      addAttendanceHistoryRecord,
      removeAttendanceHistoryRecord,
      updateAttendanceSettings,
      setAttendanceStatus,
      setOvertimeHours,
      setOvertimeDay,
      setNotificationPermission,
      triggerDailyNotification,
      fetchWeather,
      addProduct,
      addShoppingList,
      duplicateShoppingList,
      removeShoppingList,
      updateShoppingList,
      addMilkVendor,
      removeMilkVendor,
      addRecordToVendor,
      removeRecordFromVendor,
      findProductByName,
      addJournalEntry,
      updateJournalEntry,
      removeJournalEntry,
    }}>
      {children}
    </AppContext.Provider>
  );
};