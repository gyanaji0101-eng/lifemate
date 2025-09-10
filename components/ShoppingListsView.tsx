import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Icons } from './Icons';
import type { ShoppingList } from '../types';
import { UNITS } from '../constants';

interface ShoppingListsProps {
  onSelectList: (id: number) => void;
  onBack: () => void;
}

const ShoppingLists: React.FC<ShoppingListsProps> = ({ onSelectList, onBack }) => {
  const context = useContext(AppContext);
  const [newListName, setNewListName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);

  if (!context) return null;
  const { shoppingLists, addShoppingList, removeShoppingList, duplicateShoppingList, t } = context;

  const handleCreateListSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newListName.trim();
    if (trimmedName) {
      const success = addShoppingList(trimmedName);
      if (success) {
        setNewListName('');
        setNameError(null);
      } else {
        setNameError(t({
            en: 'A list with this name already exists.',
            hi: 'इस नाम की सूची पहले से मौजूद है।',
            bho: 'ई नांव के लिस्ट पहिलहीं से बा।',
            bn: 'এই নামের একটি তালিকা ইতিমধ্যে বিদ্যমান।',
            ta: 'இந்தப் பெயரில் ஒரு பட்டியல் ஏற்கனவே உள்ளது.'
        }));
      }
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewListName(e.target.value);
    if (nameError) {
      setNameError(null);
    }
  };
  
  const handleShareList = (list: ShoppingList) => {
    if (navigator.share) {
        let shareText = `${list.name}\n\n`;
        list.items.forEach(item => {
            const unitLabel = UNITS.find(u => u.value === item.unit)?.label;
            const translatedUnit = unitLabel ? t(unitLabel) : item.unit;
            shareText += `[ ] ${item.name} - ${item.quantity} ${translatedUnit}\n`;
        });

        navigator.share({
            title: `Shopping List: ${list.name}`,
            text: shareText,
        }).catch(console.error);
    } else {
        alert(t({ en: 'Share feature is not supported in your browser.', hi: 'शेयर सुविधा आपके ब्राउज़र में समर्थित नहीं है।', bho: 'शेयर सुविधा राउर ब्राउज़र में समर्थित नइखे।', bn: 'শেয়ার বৈশিষ্ট্য আপনার ব্রাউজারে সমর্থিত নয়।', ta: 'பகிர்வு அம்சம் உங்கள் உலாவியில் ஆதரிக்கப்படவில்லை.' }));
    }
};

  return (
    <div>
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 mr-2 rounded-full hover:bg-slate-200 transition-colors"><Icons.ArrowLeft className="h-6 w-6 text-slate-700" /></button>
        <h2 className="text-2xl font-bold text-slate-800">{t({ en: 'My Shopping Lists', hi: 'मेरी खरीदारी सूचियाँ', bho: 'हमार खरीदारी के लिस्ट', bn: 'আমার কেনাকাটার তালিকা', ta: 'எனது ஷாப்பிங் பட்டியல்கள்' })}</h2>
      </div>

      <div className="mb-8 bg-white p-4 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-3 text-slate-700">{t({ en: 'Create New List', hi: 'नई सूची बनाएं', bho: 'नया लिस्ट बनाईं', bn: 'নতুন তালিকা তৈরি করুন', ta: 'புதிய பட்டியலை உருவாக்கவும்' })}</h3>
        <form onSubmit={handleCreateListSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newListName}
            onChange={handleNameChange}
            placeholder={t({en: 'e.g., Monthly Shopping', hi: 'जैसे, मासिक खरीदारी', bho: 'जइसे, महीना के खरीदारी', bn: 'যেমন, মাসিক কেনাকাটা', ta: 'உதாரணமாக, மாதாந்திர ஷாப்பிங்'})}
            className={`flex-grow p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
              nameError
                ? 'border-red-400 focus:ring-red-400'
                : 'border-slate-300 focus:ring-teal-500'
            }`}
            aria-invalid={!!nameError}
            aria-describedby="list-name-error"
          />
          <button type="submit" className="bg-teal-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-teal-700 flex items-center gap-2 shrink-0 justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
            <Icons.Plus className="h-5 w-5" />
            {t({ en: 'Create', hi: 'बनाएं', bho: 'बनाईं', bn: 'তৈরি করুন', ta: 'உருவாக்கு' })}
          </button>
        </form>
        {nameError && (
          <p id="list-name-error" className="text-red-600 text-sm mt-2">{nameError}</p>
        )}
      </div>

      {shoppingLists.length === 0 ? (
        <div className="text-center py-20">
          <Icons.List className="mx-auto h-16 w-16 text-slate-400" />
          <h3 className="mt-4 text-xl font-semibold text-slate-700">{t({en: 'No lists yet', hi: 'अभी कोई सूची नहीं है', bho: 'अबले कवनो लिस्ट नइखे', bn: 'এখনও কোনো তালিকা নেই', ta: 'இன்னும் பட்டியல்கள் இல்லை'})}</h3>
          <p className="text-slate-500 mt-2">{t({en: 'Create your first shopping list to get started.', hi: 'शुरू करने के लिए अपनी पहली खरीदारी सूची बनाएं।', bho: 'शुरू करे खातिर आपन पहिला खरीदारी लिस्ट बनाईं।', bn: 'শুরু করতে আপনার প্রথম কেনাকাটার তালিকা তৈরি করুন।', ta: 'தொடங்குவதற்கு உங்கள் முதல் ஷாப்பிங் பட்டியலை உருவாக்கவும்.'})}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {shoppingLists.map(list => (
            <div key={list.id} className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center transition-all duration-300 hover:shadow-lg hover:ring-2 hover:ring-teal-200">
              <button onClick={() => onSelectList(list.id)} className="text-left flex-grow">
                <h3 className="font-semibold text-slate-800 text-lg">{list.name}</h3>
                <p className="text-sm text-slate-500">
                  {t({en: 'Items', hi: 'आइटम', bho: 'आइटम', bn: 'আইটেম', ta: 'பொருட்கள்'})}: {list.items.length} | {new Date(list.createdAt).toLocaleDateString()}
                </p>
              </button>
              <div className="flex items-center">
                <button onClick={() => handleShareList(list)} className="text-teal-500 hover:text-teal-700 p-2 transition-colors" aria-label={`Share list ${list.name}`}>
                    <Icons.Share className="h-5 w-5" />
                </button>
                <button onClick={() => duplicateShoppingList(list.id)} className="text-sky-500 hover:text-sky-700 p-2 transition-colors" aria-label={`Duplicate list ${list.name}`}>
                    <Icons.Duplicate className="h-5 w-5" />
                </button>
                <button onClick={() => removeShoppingList(list.id)} className="text-red-500 hover:text-red-700 p-2 transition-colors" aria-label={`Delete list ${list.name}`}>
                    <Icons.Trash className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShoppingLists;