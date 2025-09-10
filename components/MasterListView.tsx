
import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { Icons } from './Icons';
import type { Category, Product, Unit, ShoppingListItem } from '../types';
import { UNITS } from '../constants';

interface MasterListViewProps {
  onBack: () => void;
}

interface ExpenseItem {
    productId: number;
    quantity: number;
    unit: Unit;
    price: number; // This is price per unit for that specific purchase
}

const MasterListView: React.FC<MasterListViewProps> = ({ onBack }) => {
  const context = useContext(AppContext);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [expenses, setExpenses] = useState<Record<number, ExpenseItem>>({});
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [saveError, setSaveError] = useState('');

  if (!context) return null;
  const { products, categories, t, addShoppingList } = context;

  const mainCategories = categories.filter(c => !c.parentId);

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleExpenseChange = (product: Product, field: keyof Omit<ExpenseItem, 'productId'>, value: string | number) => {
      const productId = product.id;
      const currentExpense = expenses[productId] || {
          productId,
          quantity: 0,
          unit: product.unit,
          price: 0,
      };

      const numericValue = typeof value === 'string' ? parseFloat(value) : value;

      setExpenses(prev => ({
          ...prev,
          [productId]: {
              ...currentExpense,
              [field]: field === 'unit' ? value : (isNaN(numericValue) ? 0 : numericValue),
          }
      }));
  };
  
  const totalExpense = useMemo(() => {
    return Object.values(expenses).reduce((total, item) => {
        return total + (item.quantity * item.price);
    }, 0);
  }, [expenses]);

  const handleSaveList = () => {
    const trimmedName = newListName.trim();
    if (!trimmedName) {
        setSaveError(t({en: "List name cannot be empty.", hi: "सूची का नाम खाली नहीं हो सकता।", bho: "लिस्ट के नांव खाली ना होखे के चाहीं।", bn: "তালিকার নাম খালি হতে পারে না।", ta: "பட்டியல் பெயர் காலியாக இருக்க முடியாது।"}));
        return;
    }

    const itemsToSave: ShoppingListItem[] = Object.values(expenses)
        .filter(item => item.quantity > 0 && item.price > 0)
        .map(item => {
            const product = products.find(p => p.id === item.productId);
            return {
                id: item.productId,
                name: product ? t(product.name) : 'Custom Item',
                quantity: item.quantity,
                unit: item.unit,
                actualPrice: item.price * item.quantity,
                expectedPrice: item.price,
                isChecked: true, // Mark as purchased since price is entered
            };
        });

    if (itemsToSave.length === 0) {
        setSaveError(t({en: "Add at least one item with quantity and price to save.", hi: "सहेजने के लिए मात्रा और मूल्य के साथ कम से कम एक आइटम जोड़ें।", bho: "सेव करे खातिर मात्रा अवुरी दाम के संगे कम से कम एक आइटम जोड़ीं।", bn: "সংরক্ষণ করতে পরিমাণ এবং মূল্য সহ কমপক্ষে একটি আইটেম যোগ করুন।", ta: "சேமிக்க அளவு மற்றும் விலையுடன் குறைந்தது ஒரு பொருளையாவது சேர்க்கவும்।"}));
        return;
    }

    const success = addShoppingList(trimmedName, itemsToSave);
    if (success) {
        setExpenses({});
        setNewListName('');
        setIsSaveModalOpen(false);
        setSaveError('');
        onBack(); // Go back to dashboard after successful save
    } else {
        setSaveError(t({en: "A list with this name already exists.", hi: "इस नाम की सूची पहले से मौजूद है।", bho: "ई नांव के लिस्ट पहिलहीं से बा।", bn: "এই নামের একটি তালিকা ইতিমধ্যে বিদ্যমান।", ta: "இந்தப் பெயரில் ஒரு பட்டியல் ஏற்கனவே உள்ளது।"}));
    }
  };

  return (
    <div>
      {isSaveModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
                <h3 className="text-xl font-bold mb-4 text-slate-800">{t({ en: 'Save Expense List', hi: 'व्यय सूची सहेजें', bho: 'खरचा लिस्ट सेव करीं', bn: 'ব্যয় তালিকা সংরক্ষণ করুন', ta: 'செலவுப் பட்டியலைச் சேமிக்கவும்' })}</h3>
                <input
                    type="text"
                    value={newListName}
                    onChange={(e) => { setNewListName(e.target.value); setSaveError(''); }}
                    placeholder={t({ en: 'e.g., Weekly Groceries', hi: 'जैसे, साप्ताहिक किराना', bho: 'जइसे, हफ्ता के किराना', bn: 'যেমন, সাপ্তাহিক মুদিখানা', ta: 'உதா, வாராந்திர மளிகை' })}
                    className={`w-full p-2 border rounded-md mb-2 ${saveError ? 'border-red-500 focus:ring-red-400' : 'border-slate-300 focus:ring-teal-500'}`}
                />
                {saveError && <p className="text-red-600 text-sm mb-4">{saveError}</p>}
                <div className="flex justify-end gap-2">
                    <button onClick={() => setIsSaveModalOpen(false)} className="px-4 py-2 bg-slate-200 rounded-md hover:bg-slate-300 text-slate-800 font-semibold transition-colors">{t({ en: 'Cancel', hi: 'रद्द करें', bho: 'कैंसिल करीं', bn: 'বাতিল করুন', ta: 'ரத்துசெய்' })}</button>
                    <button onClick={handleSaveList} className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 font-semibold transition-colors">{t({ en: 'Save', hi: 'सहेजें', bho: 'सेव करीं', bn: 'সংরক্ষণ করুন', ta: 'சேமி' })}</button>
                </div>
            </div>
        </div>
      )}

      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 mr-2 rounded-full hover:bg-slate-200 transition-colors">
          <Icons.ArrowLeft className="h-6 w-6 text-slate-700" />
        </button>
        <h2 className="text-2xl font-bold text-slate-800">{t({ en: 'Expense Tracker', hi: 'खर्च का हिसाब', bho: 'खरच के हिसाब', bn: 'খরচ ট্র্যাকার', ta: 'செலவு டிராக்கர்' })}</h2>
      </div>

      <div className="space-y-3 pb-24">
        {mainCategories.map(category => (
          <div key={category.id} className="bg-white rounded-xl shadow-md">
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full flex justify-between items-center p-4 text-left font-bold text-lg text-slate-700"
            >
              <span>{t(category.name)}</span>
              <Icons.ChevronRight className={`h-6 w-6 transition-transform text-slate-500 ${expandedCategories.includes(category.id) ? 'rotate-90' : ''}`} />
            </button>
            {expandedCategories.includes(category.id) && (
              <div className="px-4 pb-4 border-t border-slate-200">
                {products.filter(p => p.categoryId === category.id || categories.find(c => c.id === p.categoryId)?.parentId === category.id).map(product => {
                  const expenseItem = expenses[product.id];
                  return (
                    <div key={product.id} className="grid grid-cols-6 gap-x-2 gap-y-3 items-center py-3 border-b border-slate-100 last:border-b-0">
                      <span className="col-span-6 sm:col-span-2 font-medium text-slate-800">{t(product.name)}</span>
                      
                      <div className="flex items-center gap-1 col-span-3 sm:col-span-2">
                        <input
                          type="number"
                          placeholder={t({en: "Qty", hi: "मात्रा", bho: "मात्रा", bn: "পরিমাণ", ta: "அளவு"})}
                          value={expenseItem?.quantity || ''}
                          onChange={(e) => handleExpenseChange(product, 'quantity', e.target.value)}
                          className="flex-grow w-full p-2 border border-slate-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
                        />
                         <select 
                            value={expenseItem?.unit || product.unit}
                            onChange={(e) => handleExpenseChange(product, 'unit', e.target.value as Unit)}
                            className="p-2 border border-slate-300 rounded-md text-sm bg-slate-100 focus:ring-teal-500 focus:border-teal-500"
                        >
                            {UNITS.map(u => <option key={u.value} value={u.value}>{t(u.label)}</option>)}
                        </select>
                      </div>

                      <div className="flex items-center gap-1 col-span-3 sm:col-span-1">
                         <span className="text-slate-600">₹</span>
                         <input
                           type="number"
                           placeholder={t({en: "Price", hi: "कीमत", bho: "दाम", bn: "দাম", ta: "விலை"})}
                           value={expenseItem?.price || ''}
                           onChange={(e) => handleExpenseChange(product, 'price', e.target.value)}
                           className="w-full p-2 border border-slate-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
                         />
                      </div>

                       <div className="text-right font-bold text-teal-600 text-md col-span-6 sm:col-span-1">
                        ₹{((expenseItem?.quantity || 0) * (expenseItem?.price || 0)).toFixed(2)}
                       </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm shadow-lg z-10 border-t border-slate-200">
        <div className="container mx-auto p-4 flex justify-between items-center">
            <div>
                <span className="text-lg font-semibold text-slate-700">{t({ en: 'Total Spent', hi: 'कुल खर्च', bho: 'कुल खरचा', bn: 'মোট খরচ', ta: 'மொத்த செலவு' })}:</span>
                <span className="font-bold text-3xl text-teal-600 ml-2">₹{totalExpense.toFixed(2)}</span>
            </div>
            <button
                onClick={() => { setIsSaveModalOpen(true); setSaveError(''); }}
                disabled={totalExpense === 0}
                className="bg-green-500 text-white font-semibold px-4 py-3 rounded-lg disabled:bg-slate-400 disabled:cursor-not-allowed hover:bg-green-600 transition-colors flex items-center gap-2"
            >
                <Icons.List className="h-5 w-5" />
                {t({ en: 'Save as List', hi: 'सूची के रूप में सहेजें', bho: 'लिस्ट के रूप में सेव करीं', bn: 'তালিকা হিসাবে সংরক্ষণ করুন', ta: 'பட்டியலாக சேமி' })}
            </button>
        </div>
      </div>
    </div>
  );
};

export default MasterListView;
