import React, { useState, useEffect, useContext, useMemo } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { AppContext } from '../context/AppContext';
import { Icons } from './Icons';
import type { BazaarRateItem } from '../types';
import { LANGUAGES } from '../constants';

interface BazaarRatesViewProps {
  onBack: () => void;
}

const BazaarRatesView: React.FC<BazaarRatesViewProps> = ({ onBack }) => {
    const context = useContext(AppContext);
    const [rates, setRates] = useState<BazaarRateItem[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    if (!context) return null;
    const { t, language } = context;

    useEffect(() => {
        const fetchRates = async (lat: number, lon: number) => {
            setIsLoading(true);
            setError('');
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                const languageName = LANGUAGES.find(l => l.code === (language || 'en'))?.name || 'English';

                const prompt = `Based on the location at latitude ${lat}, longitude ${lon}, provide the approximate current retail market rates (mandi bhav) for the following common items in ${languageName}: Potato, Onion, Tomato, Rice, Wheat Flour, Toor Dal, Gold (24K), and Silver. Provide the output as a JSON object with a single key "rates" which is an array. Each object in the array should have three keys: "name" (the item name in ${languageName}), "rate" (a string including currency and unit, e.g., "₹20/kg" or "₹72,000/10g"), and "category" (e.g., "Vegetable", "Grain", "Precious Metal").`;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: Type.OBJECT,
                            properties: {
                                rates: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            name: { type: Type.STRING },
                                            rate: { type: Type.STRING },
                                            category: { type: Type.STRING },
                                        }
                                    }
                                }
                            }
                        }
                    }
                });

                const data = JSON.parse(response.text) as { rates: BazaarRateItem[] };
                setRates(data.rates);

            } catch (err) {
                console.error("Error fetching bazaar rates:", err);
                setError(t({ en: 'Could not load market rates.', hi: 'मंडी भाव लोड नहीं हो सका।', bho: 'मंडी भाव लोड नइखे हो पावत।', bn: 'বাজারের দর লোড করা যায়নি।', ta: 'சந்தை விகிதங்களை ஏற்ற முடியவில்லை।' }));
            } finally {
                setIsLoading(false);
            }
        };

        if (!navigator.geolocation) {
            setError(t({ en: "Geolocation is not supported.", hi: "जियोलोकेशन समर्थित नहीं है।", bho: "जियोलोकेशन समर्थित नइखे।", bn: "জিওলোকেশন সমর্থিত নয়।", ta: "புவிஇருப்பிடம் ஆதரிக்கப்படவில்லை."}));
            setIsLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchRates(position.coords.latitude, position.coords.longitude);
            },
            () => {
                setError(t({ en: "Please enable location permissions to see local rates.", hi: "स्थानीय भाव देखने के लिए कृपया लोकेशन अनुमति सक्षम करें।", bho: "स्थानीय भाव देखे खातिर लोकेशन अनुमति चालू करीं।", bn: "স্থানীয় দর দেখতে অনুগ্রহ করে অবস্থান অনুমতি সক্রিয় করুন।", ta: "உள்ளூர் விகிதங்களைக் காண இருப்பிட அனுமதிகளை இயக்கவும்."}));
                setIsLoading(false);
            },
            { enableHighAccuracy: true }
        );
    }, [language, t]);

    const groupedRates = useMemo(() => {
        if (!rates) return {};
        return rates.reduce((acc, rate) => {
            const category = rate.category;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(rate);
            return acc;
        }, {} as Record<string, BazaarRateItem[]>);
    }, [rates]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center text-slate-500 pt-10">
                    <Icons.Scale className="h-12 w-12 animate-pulse text-orange-400" />
                    <p className="mt-4">{t({ en: 'Fetching local market rates...', hi: 'स्थानीय मंडी भाव प्राप्त हो रहे हैं...', bho: 'स्थानीय मंडी भाव मिल रहल बा...', bn: 'স্থানীয় বাজারের দর আনা হচ্ছে...', ta: 'உள்ளூர் சந்தை விகிதங்களைப் பெறுகிறது...' })}</p>
                </div>
            );
        }

        if (error) {
            return <p className="text-red-500 text-center p-4 bg-red-50 rounded-lg">{error}</p>;
        }

        if (rates) {
            return (
                <div className="space-y-6">
                    {Object.entries(groupedRates).map(([category, items]) => (
                        <div key={category}>
                            <h3 className="font-bold text-xl mb-3 text-slate-700 border-b-2 border-slate-200 pb-2">{category}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                                {items.map(item => (
                                    <div key={item.name} className="flex justify-between items-baseline">
                                        <span className="text-slate-800">{item.name}</span>
                                        <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-1 rounded">{item.rate}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        return null;
    };

    return (
        <div>
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="p-2 mr-2 rounded-full hover:bg-slate-200 transition-colors">
                    <Icons.ArrowLeft className="h-6 w-6 text-slate-700" />
                </button>
                <h2 className="text-2xl font-bold text-slate-800">{t({ en: 'Local Bazaar Rates', hi: 'मंडी भाव', bho: 'मंडी भाव', bn: 'স্থানীয় বাজারের দর', ta: 'உள்ளூர் பஜார் விகிதங்கள்' })}</h2>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg min-h-[300px]">
                {renderContent()}
            </div>
            <div className="mt-4 text-center text-sm text-slate-500 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p>{t({ en: 'Disclaimer: These rates are approximate and for reference only. Actual market prices may vary.', hi: 'अस्वीकरण: यह भाव केवल अनुमानित हैं और संदर्भ के लिए हैं। वास्तविक बाज़ार भाव भिन्न हो सकते हैं।', bho: 'अस्वीकरण: ई भाव खाली अनुमानित बा आ संदर्भ खातिर बा। असल बजार के भाव अलग हो सकेला।', bn: 'দাবিত্যাগ: এই দরগুলি আনুমানিক এবং শুধুমাত্র রেফারেন্সের জন্য। প্রকৃত বাজার দর ভিন্ন হতে পারে।', ta: 'பொறுப்புத் துறப்பு: இந்த விகிதங்கள் தோராயமானவை மற்றும் குறிப்புக்காக மட்டுமே. உண்மையான சந்தை விலைகள் மாறுபடலாம்.' })}</p>
            </div>
        </div>
    );
};

export default BazaarRatesView;