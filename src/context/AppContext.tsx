import React, { createContext, useState, useCallback, ReactNode } from 'react';
import type { LanguageCode, Translations, Product, Category, ShoppingList, ShoppingListItem, MilkRecord } from '../types';
import { CATEGORIES, PRODUCTS } from '../constants';

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
  milkRecords: MilkRecord[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  addShoppingList: (name: string, items?: ShoppingListItem[]) => boolean;
  duplicateShoppingList: (listId: number) => void;
  removeShoppingList: (listId: number) => void;
  updateShoppingList: (listId: number, updatedList: Partial<ShoppingList>) => void;
  addMilkRecord: (record: Omit<MilkRecord, 'id'>) => void;
  removeMilkRecord: (recordId: number) => void;
  findProductByName: (name: string) => Product | undefined;
}

export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [language, setLanguage] = useLocalStorage<LanguageCode | null>('app-language', null);
  const [products, setProducts] = useLocalStorage<Product[]>('app-products', PRODUCTS);
  const [shoppingLists, setShoppingLists] = useLocalStorage<ShoppingList[]>('app-shopping-lists', []);
  const [milkRecords, setMilkRecords] = useLocalStorage<MilkRecord[]>('app-milk-records', []);

  const t = useCallback((translations: Translations) => {
    return translations[language || 'en'] || translations['en'];
  }, [language]);

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

  const addMilkRecord = (record: Omit<MilkRecord, 'id'>) => {
    const newRecord = { ...record, id: Date.now() };
    setMilkRecords(prev => [newRecord, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const removeMilkRecord = (recordId: number) => {
    setMilkRecords(prev => prev.filter(record => record.id !== recordId));
  };

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      t,
      products,
      categories: CATEGORIES,
      shoppingLists,
      milkRecords,
      addProduct,
      addShoppingList,
      duplicateShoppingList,
      removeShoppingList,
      updateShoppingList,
      addMilkRecord,
      removeMilkRecord,
      findProductByName,
    }}>
      {children}
    </AppContext.Provider>
  );
};
