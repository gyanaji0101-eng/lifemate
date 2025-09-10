import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { Icons } from './Icons';
import type { AttendanceStatus, View } from '../types';

interface AttendanceViewProps {
  onBack: () => void;
  onNavigate: (view: View) => void;
}

const AttendanceView: React.FC<AttendanceViewProps> = ({ onBack, onNavigate }) => {
  const context = useContext(AppContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [saveStatus, setSaveStatus] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  if (!context) return null;
  const { t, attendanceRecords, setAttendanceStatus, setOvertimeHours, setOvertimeDay, language, attendanceSettings, updateAttendanceSettings, addAttendanceHistoryRecord } = context;

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday...

  const monthName = currentDate.toLocaleString(language || 'en-US', { month: 'long', year: 'numeric' });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const currentStatus = attendanceRecords.find(r => r.date === dateStr)?.status;
    
    let nextStatus: AttendanceStatus | null = 'present';
    if (currentStatus === 'present') {
        nextStatus = 'absent';
    } else if (currentStatus === 'absent') {
        nextStatus = null;
    }

    setAttendanceStatus(dateStr, nextStatus);
  };

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startingDayOfWeek });

  const monthSummary = useMemo(() => {
    const monthStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    const presentDays = attendanceRecords.filter(r => r.date.startsWith(monthStr) && r.status === 'present').length;
    const absentDays = attendanceRecords.filter(r => r.date.startsWith(monthStr) && r.status === 'absent').length;
    const totalOvertimeHours = attendanceRecords.filter(r => r.date.startsWith(monthStr) && r.status === 'present').reduce((total, record) => total + (record.overtimeHours || 0), 0);
    const totalOvertimeDays = attendanceRecords.filter(r => r.date.startsWith(monthStr) && r.status === 'present' && r.isOvertimeDay).length;
    return { presentDays, absentDays, totalOvertimeHours, totalOvertimeDays };
  }, [attendanceRecords, currentDate]);
  
  const presentDaysRecords = useMemo(() => {
    const monthStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    return attendanceRecords
        .filter(r => r.date.startsWith(monthStr) && r.status === 'present')
        .sort((a, b) => a.date.localeCompare(b.date));
  }, [attendanceRecords, currentDate]);


  const weekdays = useMemo(() => 
    Array.from({ length: 7 }, (_, i) => {
        const date = new Date(2023, 0, 1 + i); // Use a known Sunday to start the week
        return date.toLocaleString(language || 'en-US', { weekday: 'short' });
    }), [language]);

  const { monthlySalary, monthlyAdvance, overtimeRatePerHour } = attendanceSettings;
  const dailyRate = monthlySalary > 0 && daysInMonth > 0 ? monthlySalary / daysInMonth : 0;
  const earnedAmount = dailyRate * monthSummary.presentDays;
  const totalOvertimePay = monthSummary.totalOvertimeHours * (overtimeRatePerHour || 0);
  const totalOvertimeDayPay = monthSummary.totalOvertimeDays * dailyRate;
  const netPayable = (earnedAmount + totalOvertimePay + totalOvertimeDayPay) - (monthlyAdvance || 0);

  const handleSaveMonth = () => {
    setSaveStatus(null);
    const recordToSave = {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth(),
        presentDays: monthSummary.presentDays,
        absentDays: monthSummary.absentDays,
        monthlySalary: monthlySalary || 0,
        monthlyAdvance: monthlyAdvance || 0,
        earnedAmount: earnedAmount,
        netPayable: netPayable,
        totalOvertimeHours: monthSummary.totalOvertimeHours,
        overtimeRatePerHour: overtimeRatePerHour || 0,
        totalOvertimePay: totalOvertimePay,
        totalOvertimeDays: monthSummary.totalOvertimeDays,
        totalOvertimeDayPay: totalOvertimeDayPay,
    };
    
    const success = addAttendanceHistoryRecord(recordToSave);
    if(success) {
        setSaveStatus({ message: t({en: 'Month saved successfully!', hi: 'महीना सफलतापूर्वक सहेजा गया!', bho: 'महीना बढ़िया से सेव हो गइल!', bn: 'মাস সফলভাবে সংরক্ষিত হয়েছে!', ta: 'மாதம் வெற்றிகரமாக சேமிக்கப்பட்டது!'}), type: 'success'});
    } else {
        setSaveStatus({ message: t({en: 'This month has already been saved.', hi: 'यह महीना पहले ही सहेजा जा चुका है।', bho: 'ई महीना पहिलहीं से सेव बा।', bn: 'এই মাস ইতিমধ্যে সংরক্ষিত হয়েছে।', ta: 'இந்த மாதம் ஏற்கனவே சேமிக்கப்பட்டுள்ளது.'}), type: 'error'});
    }
    setTimeout(() => setSaveStatus(null), 3000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
            <button onClick={onBack} className="p-2 mr-2 rounded-full hover:bg-slate-200 transition-colors"><Icons.ArrowLeft className="h-6 w-6 text-slate-700" /></button>
            <h2 className="text-2xl font-bold text-slate-800">{t({ en: 'Attendance Card', hi: 'हाजिरी कार्ड', bho: 'हाजिरी कार्ड', bn: 'হাজিরা কার্ড', ta: 'வருகைப் பதிவு' })}</h2>
        </div>
        <button onClick={() => onNavigate('attendanceHistory')} className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
            <Icons.Clock className="h-5 w-5" />
            {t({ en: 'History', hi: 'इतिहास', bho: 'इतिहास', bn: 'ইতিহাস', ta: 'வரலாறு' })}
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-slate-100 transition-colors" aria-label={t({en: 'Previous month', hi: 'पिछला महीना', bho: 'पिछला महीना', bn: 'আগের মাস', ta: 'முந்தைய மாதம்' })}>
              <Icons.ArrowLeft className="h-5 w-5 text-slate-600"/>
          </button>
          <h3 className="text-lg font-bold text-slate-700 text-center">{monthName}</h3>
          <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-slate-100 transition-colors" aria-label={t({en: 'Next month', hi: 'अगला महीना', bho: 'अगिला महीना', bn: 'পরবর্তী মাস', ta: 'அடுத்த மாதம்' })}>
              <Icons.ChevronRight className="h-5 w-5 text-slate-600"/>
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-500 mb-2">
            {weekdays.map((day, i) => <div key={i} aria-hidden="true">{day}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {blanks.map((_, i) => <div key={`blank-${i}`} />)}
          {days.map(day => {
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const record = attendanceRecords.find(r => r.date === dateStr);
            
            let bgClass = 'bg-slate-50 hover:bg-slate-200';
            let mark = null;
            let statusText = t({en: 'Unmarked', hi: 'अचिह्नित', bho: 'बिना निशान के', bn: 'অচিহ্নিত', ta: 'குறிக்கப்படாதது'});

            if (record?.status === 'present') {
                bgClass = 'bg-green-100 hover:bg-green-200 ring-1 ring-green-300';
                mark = <span className="text-green-700 text-lg font-bold leading-none">✓</span>;
                statusText = t({ en: 'Present', hi: 'उपस्थित', bho: 'हाजिर', bn: 'উপস্থিত', ta: 'வருகை' });
            } else if (record?.status === 'absent') {
                bgClass = 'bg-red-100 hover:bg-red-200 ring-1 ring-red-300';
                mark = <span className="text-red-700 text-lg font-bold leading-none">✕</span>;
                statusText = t({ en: 'Absent', hi: 'अनुपस्थित', bho: 'गैरहाजिर', bn: 'অনুপস্থিত', ta: 'வரவில்லை' });
            }

            return (
              <button 
                key={day} 
                onClick={() => handleDayClick(day)} 
                className={`h-12 w-full flex flex-col items-center justify-center rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-teal-500 ${bgClass}`}
                aria-label={`${t({en: 'Day', hi: 'दिन', bho: 'दिन', bn: 'দিন', ta: 'நாள்'})} ${day}, ${statusText}`}
              >
                <span className="text-slate-800 text-sm font-medium">{day}</span>
                {mark}
              </button>
            );
          })}
        </div>

        <div className="mt-6 border-t pt-4 grid grid-cols-4 gap-2">
            <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{monthSummary.presentDays}</p>
                <p className="text-sm text-slate-600">{t({ en: 'Present', hi: 'उपस्थित', bho: 'हाजिर', bn: 'উপস্থিত', ta: 'வருகை' })}</p>
            </div>
            <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{monthSummary.absentDays}</p>
                <p className="text-sm text-slate-600">{t({ en: 'Absent', hi: 'अनुपस्थित', bho: 'गैरहाजिर', bn: 'অনুপস্থিত', ta: 'வரவில்லை' })}</p>
            </div>
            <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{monthSummary.totalOvertimeHours}</p>
                <p className="text-sm text-slate-600">{t({ en: 'OT Hours', hi: 'ओटी घंटे', bho: 'ओटी घंटा', bn: 'ওটি ঘন্টা', ta: 'OT மணி' })}</p>
            </div>
            <div className="text-center">
                <p className="text-2xl font-bold text-indigo-600">{monthSummary.totalOvertimeDays}</p>
                <p className="text-sm text-slate-600">{t({ en: 'OT Days', hi: 'ओटी दिन', bho: 'ओटी दिन', bn: 'ওটি দিন', ta: 'OT நாட்கள்' })}</p>
            </div>
        </div>
      </div>
      
      {presentDaysRecords.length > 0 && (
        <div className="bg-white p-4 rounded-xl shadow-md mt-6">
            <h3 className="text-lg font-bold text-slate-700 mb-4">{t({ en: 'Overtime Details', hi: 'ओवरटाइम का हिसाब', bho: 'ओवरटाइम के हिसाब', bn: 'ওভারটাইমের বিবরণ', ta: 'கூடுதல் நேர விவரங்கள்' })}</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {presentDaysRecords.map(record => (
                    <div key={record.date} className="grid grid-cols-3 gap-4 items-center">
                        <span className="text-slate-700 text-sm">{new Date(record.date).toLocaleDateString(language || 'en-GB', { day: '2-digit', month: 'short', weekday: 'short' })}</span>
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-slate-600">{t({en: 'Hours:', hi: 'घंटे:', bho: 'घंटा:', bn: 'ঘন্টা:', ta: 'மணி:'})}</label>
                            <input
                                type="number"
                                value={record.overtimeHours || ''}
                                onChange={(e) => setOvertimeHours(record.date, Number(e.target.value))}
                                className="w-20 p-1.5 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                                placeholder="0"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                           <input
                                type="checkbox"
                                checked={!!record.isOvertimeDay}
                                onChange={(e) => setOvertimeDay(record.date, e.target.checked)}
                                className="h-5 w-5 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
                                id={`ot-day-${record.date}`}
                            />
                            <label htmlFor={`ot-day-${record.date}`} className="text-sm text-slate-600">{t({en: 'OT Day', hi: 'ओटी दिन', bho: 'ओटी दिन', bn: 'ওটি দিন', ta: 'OT நாள்'})}</label>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      <div className="bg-white p-4 rounded-xl shadow-md mt-6">
        <h3 className="text-lg font-bold text-slate-700 mb-4">{t({ en: 'Salary Calculation', hi: 'वेतन गणना', bho: 'पगार के गणना', bn: 'বেতন গণনা', ta: 'சம்பள கணக்கீடு' })}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">{t({ en: 'Monthly Salary', hi: 'मासिक वेतन', bho: 'महीना के पगार', bn: 'মাসিক বেতন', ta: 'மாத சம்பளம்' })} (₹)</label>
            <input 
              type="number" 
              placeholder="e.g., 20000"
              value={attendanceSettings.monthlySalary || ''}
              onChange={(e) => updateAttendanceSettings({ monthlySalary: Number(e.target.value) })}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
           <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">{t({ en: 'Advance Taken', hi: 'लिया गया एडवांस', bho: 'लिहल एडवांस', bn: 'নেওয়া অগ্রিম', ta: 'எடுத்த முன்பணம்' })} (₹)</label>
            <input 
              type="number" 
              placeholder="e.g., 2000"
              value={attendanceSettings.monthlyAdvance || ''}
              onChange={(e) => updateAttendanceSettings({ monthlyAdvance: Number(e.target.value) })}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">{t({ en: 'OT Rate/Hour', hi: 'ओवरटाइम रेट/घंटा', bho: 'ओवरटाइम रेट/घंटा', bn: 'ওভারটাইম রেট/ঘন্টা', ta: 'OT விகிதம்/மணி' })} (₹)</label>
            <input 
              type="number" 
              placeholder="e.g., 100"
              value={attendanceSettings.overtimeRatePerHour || ''}
              onChange={(e) => updateAttendanceSettings({ overtimeRatePerHour: Number(e.target.value) })}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
        </div>
        
        {monthlySalary > 0 && (
          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between items-center text-sm text-slate-600">
              <span>{t({ en: 'Per Day Rate', hi: 'प्रति दिन दर', bho: 'रोज के रेट', bn: 'প্রতি দিনের হার', ta: 'ஒரு நாள் விகிதம்' })}</span>
              <span className="font-semibold text-slate-800">₹{dailyRate.toFixed(2)}</span>
            </div>
             <div className="flex justify-between items-center text-sm text-slate-600">
              <span>{t({ en: 'Earned (from Salary)', hi: 'कमाई (वेतन से)', bho: 'कमाई (पगार से)', bn: 'উপার্জন (বেতন থেকে)', ta: 'சம்பாதித்தது (சம்பளம்)' })}</span>
              <span className="font-semibold text-slate-800">₹{earnedAmount.toFixed(2)}</span>
            </div>
             <div className="flex justify-between items-center text-md text-slate-600">
              <span>{t({ en: 'Earned (from OT Hours)', hi: 'कमाई (ओटी घंटे)', bho: 'कमाई (ओटी घंटा)', bn: 'উপার্জন (ওটি ঘন্টা)', ta: 'சம்பாதித்தது (OT மணி)' })}</span>
              <span className="font-semibold text-blue-600">+ ₹{totalOvertimePay.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-md text-slate-600">
              <span>{t({ en: 'Earned (from OT Days)', hi: 'कमाई (ओटी दिन)', bho: 'कमाई (ओटी दिन)', bn: 'উপার্জন (ওটি দিন)', ta: 'சம்பாதித்தது (OT நாட்கள்)' })}</span>
              <span className="font-semibold text-indigo-600">+ ₹{totalOvertimeDayPay.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-xl font-bold text-slate-800 pt-2 border-t mt-2">
              <span>{t({ en: 'Net Payable Salary', hi: 'कुल देय वेतन', bho: 'कुल देय पगार', bn: 'মোট প্রদেয় বেতন', ta: 'நிகர செலுத்த வேண்டிய சம்பளம்' })}</span>
              <span className="text-green-600">₹{netPayable.toFixed(2)}</span>
            </div>
          </div>
        )}
        <div className="mt-4 pt-4 border-t">
            {saveStatus && (
                <div className={`p-3 mb-4 rounded-lg text-sm text-center ${saveStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {saveStatus.message}
                </div>
            )}
            <button 
              onClick={handleSaveMonth} 
              className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white font-semibold py-3 rounded-lg hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-slate-400"
              disabled={monthSummary.presentDays === 0 && monthSummary.absentDays === 0}
            >
                <Icons.ArchiveBoxArrowDown className="h-5 w-5" />
                {t({en: 'Save Current Month', hi: 'वर्तमान महीना सहेजें', bho: 'चालू महीना सेव करीं', bn: 'বর্তমান মাস সংরক্ষণ করুন', ta: 'நடப்பு மாதத்தைச் சேமிக்கவும்'})}
            </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceView;