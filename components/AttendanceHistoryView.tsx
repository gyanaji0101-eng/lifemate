import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Icons } from './Icons';

interface AttendanceHistoryViewProps {
  onBack: () => void;
}

const AttendanceHistoryView: React.FC<AttendanceHistoryViewProps> = ({ onBack }) => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { t, attendanceHistory, removeAttendanceHistoryRecord, language } = context;

  return (
    <div>
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 mr-2 rounded-full hover:bg-slate-200 transition-colors">
          <Icons.ArrowLeft className="h-6 w-6 text-slate-700" />
        </button>
        <h2 className="text-2xl font-bold text-slate-800">
          {t({ en: 'Attendance History', hi: 'हाजिरी का इतिहास', bho: 'हाजिरी के इतिहास', bn: 'হাজিরার ইতিহাস', ta: 'வருகை வரலாறு' })}
        </h2>
      </div>

      {attendanceHistory.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <Icons.Clock className="mx-auto h-16 w-16 text-slate-400" />
          <h3 className="mt-4 text-xl font-semibold text-slate-700">
            {t({ en: 'No Saved History', hi: 'कोई इतिहास सहेजा नहीं गया', bho: 'कवनो इतिहास सेव नइखे', bn: 'কোনো ইতিহাস সংরক্ষিত নেই', ta: 'சேமிக்கப்பட்ட வரலாறு இல்லை' })}
          </h3>
          <p className="mt-2">
            {t({ en: 'You can save a month\'s summary from the Attendance Card screen.', hi: 'आप हाजिरी कार्ड स्क्रीन से महीने का सारांश सहेज सकते हैं।', bho: 'रउआ हाजिरी कार्ड स्क्रीन से महीना के सारांश सेव कर सकत बानी।', bn: 'আপনি অ্যাটেনডেন্স কার্ড স্ক্রিন থেকে মাসের সারসংক্ষেপ সংরক্ষণ করতে পারেন।', ta: 'வருகைப் பதிவுத் திரையில் இருந்து ஒரு மாதத்தின் சுருக்கத்தை நீங்கள் சேமிக்கலாம்.' })}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {attendanceHistory.map(record => {
            const monthName = new Date(record.year, record.month).toLocaleString(language || 'en-US', { month: 'long', year: 'numeric' });
            return (
              <div key={record.id} className="bg-white p-4 rounded-xl shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-teal-600">{monthName}</h3>
                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-600">
                      <span>{t({ en: 'Present:', hi: 'उपस्थित:', bho: 'हाजिर:', bn: 'উপস্থিত:', ta: 'வருகை:' })}</span><span className="font-semibold text-green-700">{record.presentDays} {t({ en: 'days', hi: 'दिन', bho: 'दिन', bn: 'দিন', ta: 'நாட்கள்' })}</span>
                      <span>{t({ en: 'Absent:', hi: 'अनुपस्थित:', bho: 'गैरहाजिर:', bn: 'অনুপস্থিত:', ta: 'வரவில்லை:' })}</span><span className="font-semibold text-red-700">{record.absentDays} {t({ en: 'days', hi: 'दिन', bho: 'दिन', bn: 'দিন', ta: 'நாட்கள்' })}</span>
                      <span>{t({ en: 'OT Hours:', hi: 'ओवरटाइम घंटे:', bho: 'ओवरटाइम घंटा:', bn: 'ওটি ঘন্টা:', ta: 'OT மணி:' })}</span><span className="font-semibold text-blue-700">{record.totalOvertimeHours} {t({ en: 'hrs', hi: 'घंटे', bho: 'घंटा', bn: 'ঘন্টা', ta: 'மணி' })}</span>
                       <span>{t({ en: 'OT Days:', hi: 'ओवरटाइम दिन:', bho: 'ओवरटाइम दिन:', bn: 'ওটি দিন:', ta: 'OT நாட்கள்:' })}</span><span className="font-semibold text-indigo-700">{record.totalOvertimeDays} {t({ en: 'days', hi: 'दिन', bho: 'दिन', bn: 'দিন', ta: 'நாட்கள்' })}</span>
                    </div>
                  </div>
                  <button onClick={() => removeAttendanceHistoryRecord(record.id)} className="text-red-400 hover:text-red-600 p-1" aria-label={`Delete record for ${monthName}`}>
                    <Icons.Trash className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200 space-y-1">
                  <div className="flex justify-between text-sm"><span className="text-slate-500">{t({ en: 'Salary', hi: 'वेतन', bho: 'पगार', bn: 'বেতন', ta: 'சம்பளம்' })}:</span> <span className="font-medium text-slate-800">₹{record.monthlySalary.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">{t({ en: 'Advance', hi: 'एडवांस', bho: 'एडवांस', bn: 'অগ্রিম', ta: 'முன்பணம்' })}:</span> <span className="font-medium text-slate-800">₹{record.monthlyAdvance.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">{t({ en: 'Earned (Salary)', hi: 'कमाई (वेतन)', bho: 'कमाई (पगार)', bn: 'উপার্জিত (বেতন)', ta: 'சம்பாதித்தது (சம்பளம்)' })}:</span> <span className="font-medium text-slate-800">₹{record.earnedAmount.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">{t({ en: 'Earned (OT Hours)', hi: 'कमाई (ओटी घंटे)', bho: 'कमाई (ओटी घंटा)', bn: 'উপার্জিত (ওটি ঘন্টা)', ta: 'சம்பாதித்தது (OT மணி)' })}:</span> <span className="font-medium text-blue-700">+ ₹{record.totalOvertimePay.toFixed(2)}</span></div>
                   <div className="flex justify-between text-sm"><span className="text-slate-500">{t({ en: 'Earned (OT Days)', hi: 'कमाई (ओटी दिन)', bho: 'कमाई (ओटी दिन)', bn: 'উপার্জিত (ওটি দিন)', ta: 'சம்பாதித்தது (OT நாட்கள்)' })}:</span> <span className="font-medium text-indigo-700">+ ₹{record.totalOvertimeDayPay.toFixed(2)}</span></div>
                  <div className="flex justify-between text-md font-bold mt-1 pt-1 border-t"><span className="text-slate-700">{t({ en: 'Net Payable', hi: 'कुल देय', bho: 'कुल देय', bn: 'মোট প্রদেয়', ta: 'நிகர ஊதியம்' })}:</span> <span className="text-green-600">₹{record.netPayable.toFixed(2)}</span></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AttendanceHistoryView;