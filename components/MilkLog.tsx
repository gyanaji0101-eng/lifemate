
import React, { useState, useContext, useMemo, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Icons } from './Icons';

interface MilkLogProps {
  onBack: () => void;
}

const MilkLog: React.FC<MilkLogProps> = ({ onBack }) => {
  const context = useContext(AppContext);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [quantity, setQuantity] = useState(1);
  const [pricePerLitre, setPricePerLitre] = useState(0);
  const [vendorName, setVendorName] = useState('');
  const [pendingRecord, setPendingRecord] = useState<{ date: string; quantity: number; pricePerLitre: number; vendorName: string; } | null>(null);

  if (!context) return null;
  // FIX: Destructure updated context properties for milk vendor management to resolve errors.
  const { milkVendorLists, addMilkVendor, addRecordToVendor, removeRecordFromVendor, t, language } = context;

  useEffect(() => {
    // Effect to add a record after a new vendor has been created and state has updated.
    if (pendingRecord) {
        const vendor = milkVendorLists.find(v => v.name === pendingRecord.vendorName);
        if (vendor) {
            const { vendorName, ...recordData } = pendingRecord;
            addRecordToVendor(vendor.id, recordData);
            setPendingRecord(null);
        }
    }
  }, [milkVendorLists, pendingRecord, addRecordToVendor]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity > 0 && pricePerLitre > 0) {
      // FIX: Adapt to vendor-based milk logging.
      const trimmedVendorName = vendorName.trim() || t({ en: 'General', hi: 'सामान्य', bho: 'आम', bn: 'সাধারণ', ta: 'பொது' });
      const recordData = { date, quantity, pricePerLitre };

      const existingVendor = milkVendorLists.find(v => v.name.toLowerCase() === trimmedVendorName.toLowerCase());

      if (existingVendor) {
          addRecordToVendor(existingVendor.id, recordData);
      } else {
          const success = addMilkVendor(trimmedVendorName);
          if (success) {
            // Set a pending record to be added once the new vendor is available in the state.
            setPendingRecord({ ...recordData, vendorName: trimmedVendorName });
          }
      }

      setQuantity(1);
      setPricePerLitre(0);
      setVendorName('');
    }
  };
  
  // FIX: Derive a flat list of all milk records from all vendors for display.
  const milkRecords = useMemo(() => {
    return milkVendorLists.flatMap(vendor =>
        vendor.records.map(record => ({
            ...record,
            vendorName: vendor.name,
            vendorId: vendor.id,
        }))
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [milkVendorLists]);

  const groupedRecords: { [key: string]: typeof milkRecords } = milkRecords.reduce((acc, record) => {
    const month = new Date(record.date).toLocaleString(language || 'en-GB', { month: 'long', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(record);
    return acc;
  }, {} as { [key: string]: typeof milkRecords });


  return (
    <div>
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 mr-2 rounded-full hover:bg-slate-200 transition-colors"><Icons.ArrowLeft className="h-6 w-6 text-slate-700" /></button>
        <h2 className="text-2xl font-bold text-slate-800">{t({ en: 'Daily Milk Log', hi: 'दैनिक दूध का हिसाब', bho: 'रोज के दूध के हिसाब', bn: 'দৈনিক দুধের লগ', ta: 'தினசரி பால் பதிவு' })}</h2>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-md mb-8">
        <h3 className="font-bold mb-3 text-slate-700 text-lg">{t({ en: 'Add New Entry', hi: 'नई एंट्री जोड़ें', bho: 'नया एंट्री जोड़ीं', bn: 'নতুন এন্ট্রি যোগ করুন', ta: 'புதிய பதிவைச் சேர்க்கவும்' })}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-600">{t({ en: 'Vendor Name (Optional)', hi: 'विक्रेता का नाम (वैकल्पिक)', bho: 'बेचे वाला के नांव (वैकल्पिक)', bn: 'বিক্রেতার নাম (ঐচ্ছিক)', ta: 'விற்பனையாளர் பெயர் (விருப்பத்திற்குரியது)' })}</label>
            <input 
                type="text" 
                value={vendorName} 
                onChange={e => setVendorName(e.target.value)} 
                className="mt-1 block w-full p-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" 
                placeholder={t({ en: 'e.g., Local Dairy', hi: 'जैसे, स्थानीय डेयरी', bho: 'जइसे, लोकल डेयरी', bn: 'যেমন, স্থানীয় ডেয়ারি', ta: 'உதா, உள்ளூர் பால் பண்ணை' })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">{t({ en: 'Date', hi: 'तारीख', bho: 'तारीख', bn: 'তারিখ', ta: 'தேதி' })}</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">{t({ en: 'Quantity (Ltr)', hi: 'मात्रा (लीटर)', bho: 'मात्रा (लीटर)', bn: 'পরিমাণ (লিটার)', ta: 'அளவு (லிட்டர்)' })}</label>
            <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="mt-1 block w-full p-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" step="0.5" min="0" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">{t({ en: 'Price per Litre', hi: 'मूल्य प्रति लीटर', bho: 'दाम प्रति लीटर', bn: 'প্রতি লিটারের দাম', ta: 'ஒரு লিட்டர் விலை' })}</label>
            <input type="number" value={pricePerLitre || ''} onChange={e => setPricePerLitre(Number(e.target.value))} className="mt-1 block w-full p-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" step="0.01" min="0" required />
          </div>
          <button type="submit" className="bg-teal-600 text-white p-2 rounded-lg font-semibold hover:bg-teal-700 self-end transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">{t({ en: 'Add Entry', hi: 'एंट्री जोड़ें', bho: 'एंट्री जोड़ीं', bn: 'এন্ট্রি যোগ করুন', ta: 'பதிவைச் சேர்க்கவும்' })}</button>
        </form>
      </div>
      
      <h3 className="text-xl font-bold mb-4 text-slate-800">{t({ en: 'History', hi: 'इतिहास', bho: 'इतिहास', bn: 'ইতিহাস', ta: 'வரலாறு' })}</h3>
      {Object.keys(groupedRecords).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedRecords).map(([month, records]) => {
            const monthTotal = records.reduce((sum, r) => sum + (r.quantity * r.pricePerLitre), 0);
            return (
              <div key={month} className="bg-white p-4 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-200">
                    <h4 className="font-bold text-lg text-teal-600">{month}</h4>
                    <span className="font-bold text-lg text-slate-800">₹{monthTotal.toFixed(2)}</span>
                </div>
                <div className="space-y-2">
                  {records.map(record => (
                    <div key={record.id} className="flex justify-between items-center p-2 rounded-lg hover:bg-slate-50">
                      <div>
                        <div className="flex items-center gap-2">
                            <p className="font-semibold text-slate-700">{new Date(record.date).toLocaleDateString(language || 'en-GB', { day: 'numeric', weekday: 'long' })}</p>
                            {record.vendorName && <span className="text-xs font-medium text-white bg-teal-600 px-2 py-0.5 rounded-full">{record.vendorName}</span>}
                        </div>
                        <p className="text-sm text-slate-500 mt-1">{record.quantity} Ltr @ ₹{record.pricePerLitre}/Ltr</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-bold text-md text-slate-800">₹{(record.quantity * record.pricePerLitre).toFixed(2)}</p>
                        {/* FIX: Use removeRecordFromVendor with vendorId and recordId. */}
                        <button onClick={() => removeRecordFromVendor(record.vendorId, record.id)} className="text-red-500 hover:text-red-700 p-1"><Icons.Trash className="h-5 w-5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-center text-slate-500 py-10">{t({ en: 'No milk records found.', hi: 'कोई दूध रिकॉर्ड नहीं मिला।', bho: 'कोनो दूध के रिकॉर्ड ना मिलल।', bn: 'কোনো দুধের রেকর্ড পাওয়া যায়নি।', ta: 'பால் பதிவுகள் எதுவும் இல்லை.' })}</p>
      )}
    </div>
  );
};

export default MilkLog;
