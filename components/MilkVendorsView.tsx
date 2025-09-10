import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Icons } from './Icons';

interface MilkVendorsViewProps {
  onSelectVendor: (id: number) => void;
  onBack: () => void;
}

const MilkVendorsView: React.FC<MilkVendorsViewProps> = ({ onSelectVendor, onBack }) => {
  const context = useContext(AppContext);
  const [newVendorName, setNewVendorName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);

  if (!context) return null;
  const { milkVendorLists, addMilkVendor, removeMilkVendor, t } = context;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newVendorName.trim();
    if (trimmedName) {
      const success = addMilkVendor(trimmedName);
      if (success) {
        setNewVendorName('');
        setNameError(null);
      } else {
        setNameError(t({
            en: 'A vendor with this name already exists.',
            hi: 'इस नाम का विक्रेता पहले से मौजूद है।',
            bho: 'ई नांव के बेचे वाला पहिलहीं से बा।',
            bn: 'এই নামের একজন বিক্রেতা ইতিমধ্যে বিদ্যমান।',
            ta: 'இந்தப் பெயரில் ஒரு விற்பனையாளர் ஏற்கனவே உள்ளார்.'
        }));
      }
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewVendorName(e.target.value);
    if (nameError) {
      setNameError(null);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 mr-2 rounded-full hover:bg-slate-200 transition-colors"><Icons.ArrowLeft className="h-6 w-6 text-slate-700" /></button>
        <h2 className="text-2xl font-bold text-slate-800">{t({ en: 'Daily Milk Log', hi: 'दैनिक दूध का हिसाब', bho: 'रोज के दूध के हिसाब', bn: 'দৈনিক দুধের লগ', ta: 'தினசரி பால் பதிவு' })}</h2>
      </div>

      <div className="mb-8 bg-white p-4 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-3 text-slate-700">{t({ en: 'Add New Vendor', hi: 'नया विक्रेता जोड़ें', bho: 'नया बेचेवाला जोड़ीं', bn: 'নতুন বিক্রেতা যোগ করুন', ta: 'புதிய விற்பனையாளரைச் சேர்க்கவும்' })}</h3>
        <form onSubmit={handleCreateSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newVendorName}
            onChange={handleNameChange}
            placeholder={t({en: 'e.g., Ramu Kaka Dairy', hi: 'जैसे, रामू काका डेयरी', bho: 'जइसे, रामू काका डेयरी', bn: 'যেমন, রামু কাকা ডেয়ারি', ta: 'உதாரணமாக, ராமு காகா டைரி'})}
            className={`flex-grow p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
              nameError
                ? 'border-red-400 focus:ring-red-400'
                : 'border-slate-300 focus:ring-teal-500'
            }`}
            aria-invalid={!!nameError}
            aria-describedby="vendor-name-error"
          />
          <button type="submit" className="bg-teal-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-teal-700 flex items-center gap-2 shrink-0 justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
            <Icons.Plus className="h-5 w-5" />
            {t({ en: 'Add Vendor', hi: 'विक्रेता जोड़ें', bho: 'विक्रेता जोड़ीं', bn: 'বিক্রেতা যোগ করুন', ta: 'விற்பனையாளரைச் சேர்' })}
          </button>
        </form>
        {nameError && (
          <p id="vendor-name-error" className="text-red-600 text-sm mt-2">{nameError}</p>
        )}
      </div>

      {milkVendorLists.length === 0 ? (
        <div className="text-center py-20">
          <Icons.Milk className="mx-auto h-16 w-16 text-slate-400" />
          <h3 className="mt-4 text-xl font-semibold text-slate-700">{t({en: 'No vendors yet', hi: 'अभी कोई विक्रेता नहीं है', bho: 'अबले कवनो बेचेवाला नइखे', bn: 'এখনও কোনো বিক্রেতা নেই', ta: 'இன்னும் விற்பனையாளர்கள் இல்லை'})}</h3>
          <p className="text-slate-500 mt-2">{t({en: 'Add your milk vendor to start logging.', hi: 'लॉगिंग शुरू करने के लिए अपने दूध विक्रेता को जोड़ें।', bho: 'लॉगिंग शुरू करे खातिर आपन दूध बेचेवाला के जोड़ीं।', bn: 'লগিং শুরু করতে আপনার দুধ বিক্রেতা যোগ করুন।', ta: 'பதிவைத் தொடங்க உங்கள் பால் விற்பனையாளரைச் சேர்க்கவும்.'})}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {milkVendorLists.map(vendor => (
            <div key={vendor.id} className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center transition-all duration-300 hover:shadow-lg hover:ring-2 hover:ring-teal-200">
              <button onClick={() => onSelectVendor(vendor.id)} className="text-left flex-grow">
                <h3 className="font-semibold text-slate-800 text-lg">{vendor.name}</h3>
                <p className="text-sm text-slate-500">
                  {t({en: 'Records', hi: 'रिकॉर्ड', bho: 'रिकॉर्ड', bn: 'রেকর্ড', ta: 'பதிவுகள்'})}: {vendor.records.length}
                </p>
              </button>
              <div className="flex items-center">
                <button onClick={(e) => { e.stopPropagation(); removeMilkVendor(vendor.id); }} className="text-red-500 hover:text-red-700 p-2 transition-colors" aria-label={`Delete vendor ${vendor.name}`}>
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

export default MilkVendorsView;
