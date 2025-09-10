
import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { GoogleGenAI } from "@google/genai";
import { Icons } from './Icons';
import { LANGUAGES } from '../constants';

interface RemediesViewProps {
  onBack: () => void;
}

const RemediesView: React.FC<RemediesViewProps> = ({ onBack }) => {
  const context = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!context) return null;
  const { t, language } = context;
  
  const exampleQueries = [
    t({ en: 'Headache', hi: 'सिर दर्द', bho: 'माथा के दरद', bn: 'মাথাব্যথা', ta: 'தலைவலி' }),
    t({ en: 'Cold & Cough', hi: 'सर्दी-जुकाम', bho: 'सरदी-खांसी', bn: 'সর্দি-কাশি', ta: 'சளி & இருமல்' }),
    t({ en: 'Stomach ache', hi: 'पेट दर्द', bho: 'पेट के दरद', bn: 'পেট ব্যথা', ta: 'வயிற்று வலி' }),
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchTerm.trim();
    if (!query) return;

    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const languageName = LANGUAGES.find(l => l.code === (language || 'en'))?.name || 'English';

      const prompt = `You are a helpful assistant providing common and safe home remedies. The user is asking for remedies for "${query}" in the ${languageName} language.
      
      Please provide a few simple, safe, and well-known home remedies. Structure your answer with clear headings or bullet points. Keep the tone helpful and easy to understand.
      
      At the very end of your response, you MUST include this exact disclaimer, translated into ${languageName}: "Disclaimer: These are home remedies. In serious conditions, please consult a doctor."`;

      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setResponse(result.text);

    } catch (err) {
      console.error("Error fetching remedy:", err);
      setError(t({ 
          en: 'Sorry, I could not fetch a remedy at this time. Please check your connection and try again.', 
          hi: 'क्षमा करें, मैं इस समय कोई उपाय नहीं खोज सका। कृपया अपना कनेक्शन जांचें और पुनः प्रयास करें।',
          bho: 'माफ करीं, हम अभी कवनो उपाय ना खोज सकलीं। आपन कनेक्शन जांच के फेर से कोसिस करीं।',
          bn: 'দুঃখিত, আমি এই মুহূর্তে একটি প্রতিকার আনতে পারিনি। অনুগ্রহ করে আপনার সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।',
          ta: 'மன்னிக்கவும், இந்த நேரத்தில் என்னால் ஒரு தீர்வைக் கண்டுபிடிக்க முடியவில்லை. உங்கள் இணைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 mr-2 rounded-full hover:bg-slate-200 transition-colors">
          <Icons.ArrowLeft className="h-6 w-6 text-slate-700" />
        </button>
        <h2 className="text-2xl font-bold text-slate-800">{t({ en: 'Health & Home Remedies', hi: 'घरेलू नुस्ख़े', bho: 'घरेलू नुस्खा', bn: 'স্বাস্থ্য ও ঘরোয়া প্রতিকার', ta: 'உடல்நலம் மற்றும் வீட்டு வைத்தியம்' })}</h2>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder={t({ en: 'Search for an ailment (e.g., cold)...', hi: 'बीमारी खोजें (जैसे, सर्दी)...', bho: 'बेमारी खोजीं (जइसे, सरदी)...', bn: 'অসুখ খুঁজুন (যেমন, সর্দি)...', ta: 'ஒரு நோயைத் தேடுங்கள் (எ.கா., சளி)...' })}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Icons.Search className="h-5 w-5 text-slate-400" />
            </div>
          </div>
          <button type="submit" className="bg-teal-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-teal-700 flex items-center justify-center shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500" disabled={isLoading}>
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
                <Icons.Search className="h-5 w-5" />
            )}
          </button>
        </form>
      </div>

      <div className="min-h-[300px] bg-white p-4 sm:p-6 rounded-xl shadow-md">
        {isLoading && (
          <div className="flex flex-col items-center justify-center text-slate-500 pt-10">
            <Icons.Remedy className="h-12 w-12 animate-pulse text-lime-400" />
            <p className="mt-4">{t({ en: 'Searching for the best remedies...', hi: 'सर्वोत्तम उपाय खोजे जा रहे हैं...', bho: 'सबसे बढ़िया उपाय खोजाता...', bn: 'সেরা প্রতিকার খোঁজা হচ্ছে...', ta: 'சிறந்த வைத்தியங்களைத் தேடுகிறது...' })}</p>
          </div>
        )}
        {error && <p className="text-red-500 text-center p-4 bg-red-50 rounded-lg">{error}</p>}
        {response && (
            <div className="text-slate-700 leading-relaxed whitespace-pre-wrap prose prose-slate max-w-none">{response}</div>
        )}
        {!isLoading && !error && !response && (
            <div className="text-center text-slate-500 pt-10">
                <h3 className="font-semibold text-lg text-slate-700">{t({ en: 'What are you looking for?', hi: 'आप क्या ढूंढ रहे हैं?', bho: 'रउआ का खोजत बानी?', bn: 'আপনি কি খুঁজছেন?', ta: 'நீங்கள் என்ன தேடுகிறீர்கள்?' })}</h3>
                <p className="mt-2 text-sm">{t({ en: 'Try searching for things like:', hi: 'ऐसी चीज़ें खोजने का प्रयास करें:', bho: 'अइसन चीज खोजे के कोसिस करीं:', bn: 'এর মতো জিনিস খোঁজার চেষ্টা করুন:', ta: 'இது போன்ற விஷயங்களைத் தேட முயற்சிக்கவும்:' })}</p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {exampleQueries.map(q => <button key={q} onClick={() => setSearchTerm(q)} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm hover:bg-slate-200">{q}</button>)}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default RemediesView;