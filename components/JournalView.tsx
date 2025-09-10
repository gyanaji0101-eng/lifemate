import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Icons } from './Icons';

interface JournalViewProps {
  onBack: () => void;
}

const JournalView: React.FC<JournalViewProps> = ({ onBack }) => {
  const context = useContext(AppContext);
  const [content, setContent] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  
  if (!context) return null;
  const { journalEntries, addJournalEntry, removeJournalEntry, t, language } = context;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      const reminderDateTime = reminderDate && reminderTime ? `${reminderDate}T${reminderTime}` : undefined;
      addJournalEntry({ 
        content: content.trim(), 
        reminderDateTime: reminderDateTime
      });
      setContent('');
      setReminderDate('');
      setReminderTime('');
    }
  };
  
  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 mr-2 rounded-full hover:bg-slate-200 transition-colors"><Icons.ArrowLeft className="h-6 w-6 text-slate-700" /></button>
        <h2 className="text-2xl font-bold text-slate-800">{t({ en: 'Daily Journal', hi: 'मेरी डायरी', bho: 'हमर डायरी', bn: 'আমার ডায়েরি', ta: 'என் டைரி' })}</h2>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-md mb-8">
        <h3 className="font-bold mb-3 text-slate-700 text-lg">{t({ en: 'Add New Note', hi: 'नया नोट जोड़ें', bho: 'नया नोट जोड़ीं', bn: 'নতুন নোট যোগ করুন', ta: 'புதிய குறிப்பைச் சேர்க்கவும்' })}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={t({ en: 'Write your expenses, notes, or thoughts...', hi: 'अपने खर्चे, नोट्स या विचार लिखें...', bho: 'आपन खरचा, नोट्स भा बिचार लिखीं...', bn: 'আপনার খরচ, নোট বা চিন্তা লিখুন...', ta: 'உங்கள் செலவுகள், குறிப்புகள் அல்லது எண்ணங்களை எழுதுங்கள்...' })}
            className="w-full p-2 border border-slate-300 rounded-lg min-h-[100px] focus:ring-teal-500 focus:border-teal-500"
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="sm:col-span-2 grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-slate-600">{t({ en: 'Reminder Date', hi: 'रिमाइंडर दिनांक', bho: 'रिमाइंडर तारीख', bn: 'অনুস্মারক তারিখ', ta: 'நினைவூட்டல் தேதி' })}</label>
                <input 
                  type="date" 
                  value={reminderDate} 
                  onChange={e => setReminderDate(e.target.value)} 
                  className="mt-1 block w-full p-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  min={today}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600">{t({ en: 'Reminder Time', hi: 'रिमाइंडर समय', bho: 'रिमाइंडर समय', bn: 'অনুস্মারক সময়', ta: 'நினைவூட்டல் நேரம்' })}</label>
                <input 
                  type="time" 
                  value={reminderTime} 
                  onChange={e => setReminderTime(e.target.value)} 
                  className="mt-1 block w-full p-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  disabled={!reminderDate}
                />
              </div>
            </div>
            <button type="submit" className="w-full bg-teal-600 text-white p-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
              {t({ en: 'Save Note', hi: 'नोट सहेजें', bho: 'नोट सेव करीं', bn: 'নোট সংরক্ষণ করুন', ta: 'குறிப்பைச் சேமி' })}
            </button>
          </div>
        </form>
      </div>
      
      <h3 className="text-xl font-bold mb-4 text-slate-800">{t({ en: 'Your Notes', hi: 'आपके नोट्स', bho: 'रउवा नोट्स', bn: 'আপনার নোট', ta: 'உங்கள் குறிப்புகள்' })}</h3>
      {journalEntries.length > 0 ? (
        <div className="space-y-4">
          {journalEntries.map(entry => {
            const reminderDateTime = entry.reminderDateTime ? new Date(entry.reminderDateTime) : null;
            const isReminderDue = reminderDateTime && reminderDateTime <= new Date() && !entry.reminderFired;

            return (
              <div key={entry.id} className={`p-4 rounded-xl shadow-md relative ${isReminderDue ? 'bg-yellow-50 border-l-4 border-yellow-400' : 'bg-white'}`}>
                <p className="text-slate-700 whitespace-pre-wrap">{entry.content}</p>
                <div className="text-xs text-slate-500 mt-2 flex justify-between items-center">
                   <span>{new Date(entry.createdAt).toLocaleDateString(language || 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                   {reminderDateTime && (
                     <div className={`flex items-center gap-1 p-1 rounded ${isReminderDue ? 'text-yellow-800 font-bold' : ''}`}>
                       <Icons.Bell className="h-4 w-4" />
                       <span>{reminderDateTime.toLocaleString(language || 'en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                     </div>
                   )}
                </div>
                 <button onClick={() => removeJournalEntry(entry.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 p-1">
                    <Icons.Trash className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-slate-500 py-10">{t({ en: 'No notes yet. Add your first one!', hi: 'अभी तक कोई नोट्स नहीं। अपना पहला नोट जोड़ें!', bho: 'अबले कवनो नोट नइखे। आपन पहिला जोड़ीं!', bn: 'এখনও কোনো নোট নেই। আপনার প্রথমটি যোগ করুন!', ta: 'இன்னும் குறிப்புகள் இல்லை. உங்கள் முதல் ஒன்றைச் சேர்க்கவும்!' })}</p>
      )}
    </div>
  );
};

export default JournalView;