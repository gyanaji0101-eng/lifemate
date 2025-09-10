import React, { useState, useEffect, useContext } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { AppContext } from '../context/AppContext';
import type { ZodiacSign } from '../types';
import { Icons } from './Icons';
import { LANGUAGES } from '../constants';

interface HoroscopeDetailViewProps {
  sign: ZodiacSign;
  onBack: () => void;
}

const HoroscopeDetailView: React.FC<HoroscopeDetailViewProps> = ({ sign, onBack }) => {
  const context = useContext(AppContext);
  const [horoscope, setHoroscope] = useState('');
  const [luckyTip, setLuckyTip] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  if (!context) return null;
  const { t, language } = context;

  useEffect(() => {
    const generateHoroscope = async () => {
      setIsLoading(true);
      setError('');
      setHoroscope('');
      setLuckyTip('');
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        
        const languageName = LANGUAGES.find(l => l.code === (language || 'en'))?.name || 'English';
        const signName = t(sign.name);

        const prompt = `Generate a short, positive, and encouraging daily horoscope for the zodiac sign "${signName}" in the ${languageName} language. Provide the output as a JSON object with two keys: "horoscope" (a string of about 50-70 words covering love, career, and health) and "luckyTip" (a short, single-sentence, gamified lucky tip like "Wear green clothes today for good luck" or "Offer Tulsi in today's puja.").`;
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    horoscope: { type: Type.STRING },
                    luckyTip: { type: Type.STRING },
                }
            }
          }
        });
        
        const data = JSON.parse(response.text) as { horoscope: string, luckyTip: string };
        setHoroscope(data.horoscope);
        setLuckyTip(data.luckyTip);

      } catch (err) {
        console.error("Error generating horoscope:", err);
        setError(t({ 
            en: 'Could not load the horoscope. Please try again later.', 
            hi: 'राशिफल लोड नहीं हो सका। कृपया बाद में पुनः प्रयास करें।',
            bho: 'राशिफल लोड नइखे हो पावत। कुछ देर बाद फेर से कोसिस करीं।',
            bn: 'রাশিফল লোড করা যায়নি। অনুগ্রহ করে পরে আবার চেষ্টা করুন।',
            ta: 'ராசிபலனை ஏற்ற முடியவில்லை. பிறகு மீண்டும் முயற்சிக்கவும்.'
        }));
      } finally {
        setIsLoading(false);
      }
    };

    generateHoroscope();
  }, [sign, language, t]);

  return (
    <div>
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 mr-2 rounded-full hover:bg-slate-200 transition-colors">
          <Icons.ArrowLeft className="h-6 w-6 text-slate-700" />
        </button>
        <h2 className="text-2xl font-bold text-slate-800">{t(sign.name)}</h2>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-lg min-h-[200px]">
        {isLoading && (
          <div className="flex flex-col items-center justify-center text-slate-500">
            <Icons.Horoscope className="h-12 w-12 animate-pulse text-indigo-400" />
            <p className="mt-4">{t({ en: 'Generating your daily horoscope...', hi: 'आपका दैनिक राशिफल तैयार हो रहा है...', bho: 'रउवा दैनिक राशिफल तइयार हो रहल बा...', bn: 'আপনার দৈনিক রাশিফল তৈরি করা হচ্ছে...', ta: 'உங்கள் தினசரி ராசிபலன் உருவாக்கப்படுகிறது...' })}</p>
          </div>
        )}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!isLoading && !error && (
          <div>
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{horoscope}</p>
            {luckyTip && (
              <div className="mt-6 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg flex items-start gap-3">
                <Icons.Horoscope className="h-6 w-6 text-amber-500 shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-amber-800">
                    {t({ en: 'Lucky Tip', hi: 'लकी टिप', bho: 'लकी टिप', bn: 'লাকি টিপ', ta: 'அதிர்ஷ்டக் குறிப்பு' })}
                  </h4>
                  <p className="text-amber-700 mt-1">{luckyTip}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HoroscopeDetailView;