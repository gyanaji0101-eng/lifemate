import React, { useState, useEffect, useContext, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { AppContext } from '../context/AppContext';
import { Icons } from './Icons';
import type { WeatherData } from '../types';

interface WeatherViewProps {
  onBack: () => void;
}

const WeatherView: React.FC<WeatherViewProps> = ({ onBack }) => {
    const context = useContext(AppContext);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    if (!context) return null;
    const { t } = context;

    const fetchWeather = useCallback(async (lat: number, lon: number) => {
        setIsLoading(true);
        setError('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            const prompt = `Based on the coordinates latitude: ${lat}, longitude: ${lon}, provide the current weather information, including the percentage chance of rain, sunrise time, sunset time, moonrise time, and moonset time. All times should be in HH:MM format (e.g., 06:15 or 18:30).`;

            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
              config: {
                responseMimeType: "application/json",
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    temperatureCelsius: { type: Type.NUMBER },
                    condition: { type: Type.STRING },
                    humidity: { type: Type.NUMBER },
                    windSpeedKPH: { type: Type.NUMBER },
                    chanceOfRain: { type: Type.NUMBER },
                    sunriseTime: { type: Type.STRING },
                    sunsetTime: { type: Type.STRING },
                    moonriseTime: { type: Type.STRING },
                    moonsetTime: { type: Type.STRING },
                  }
                }
              }
            });

            const weatherData = JSON.parse(response.text) as WeatherData;
            setWeather(weatherData);

        } catch (err) {
            console.error("Error fetching weather:", err);
            setError(t({ en: 'Could not load weather data. Please try again later.', hi: 'मौसम डेटा लोड नहीं हो सका। कृपया बाद में पुनः प्रयास करें।', bho: 'मौसम डेटा लोड नइखे हो पावत। कुछ देर बाद फेर से कोसिस करीं।', bn: 'আবহাওয়ার ডেটা লোড করা যায়নি। অনুগ্রহ করে পরে আবার চেষ্টা করুন।', ta: 'வானிலை தரவை ஏற்ற முடியவில்லை. பிறகு மீண்டும் முயற்சிக்கவும்.' }));
        } finally {
            setIsLoading(false);
        }
    }, [t]);


    useEffect(() => {
        if (!navigator.geolocation) {
            setError(t({ en: "Geolocation is not supported by your browser.", hi: "जियोलोकेशन आपके ब्राउज़र द्वारा समर्थित नहीं है।", bho: "जियोलोकेशन रउरा ब्राउज़र द्वारा समर्थित नइखे।", bn: "জিওলোকেশন আপনার ব্রাউজার দ্বারা সমর্থিত নয়।", ta: "புவிஇருப்பிடம் உங்கள் உலாவியால் ஆதரிக்கப்படவில்லை." }));
            setIsLoading(false);
            return;
        }
        
        const geoOptions = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchWeather(position.coords.latitude, position.coords.longitude);
            },
            () => {
                setError(t({ en: "Unable to retrieve your location. Please enable location permissions in your browser settings.", hi: "आपका स्थान प्राप्त करने में असमर्थ। कृपया अपनी ब्राउज़र सेटिंग्स में स्थान अनुमतियों को सक्षम करें।", bho: "रउरा लोकेशन पावे में असमर्थ बानी। आपन ब्राउज़र सेटिंग में लोकेशन अनुमति चालू करीं।", bn: "আপনার অবস্থান পুনরুদ্ধার করা যায়নি। অনুগ্রহ করে আপনার ব্রাউজার সেটিংসে অবস্থান অনুমতি সক্রিয় করুন।", ta: "உங்கள் இருப்பிடத்தைப் பெற முடியவில்லை. உங்கள் உலாவி அமைப்புகளில் இருப்பிட அனுமதிகளை இயக்கவும்." }));
                setIsLoading(false);
            },
            geoOptions
        );
    }, [t, fetchWeather]);


    const getWeatherIcon = (condition: string) => {
        const lowerCondition = condition.toLowerCase();
        if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) return <Icons.Rain className="w-24 h-24 text-blue-500" />;
        if (lowerCondition.includes('cloud') || lowerCondition.includes('overcast')) return <Icons.Cloud className="w-24 h-24 text-gray-500" />;
        if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) return <Icons.Sun className="w-24 h-24 text-yellow-500" />;
        return <Icons.Weather className="w-24 h-24 text-cyan-500" />;
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center text-gray-500">
                    <Icons.Weather className="h-12 w-12 animate-pulse text-cyan-400" />
                    <p className="mt-4">{t({ en: 'Fetching weather data...', hi: 'मौसम डेटा प्राप्त हो रहा है...', bho: 'मौसम डेटा मिल रहल बा...', bn: 'আবহাওয়ার ডেটা আনা হচ্ছে...', ta: 'வானிலை தரவு பெறப்படுகிறது...' })}</p>
                </div>
            );
        }

        if (error) {
            return <p className="text-red-500 text-center p-4 bg-red-50 rounded-lg">{error}</p>;
        }

        if (weather) {
            return (
                <div className="text-center w-full">
                    <div className="my-4">
                        {getWeatherIcon(weather.condition)}
                    </div>
                    <p className="text-7xl font-bold text-gray-800">{Math.round(weather.temperatureCelsius)}°C</p>
                    <p className="text-xl text-gray-600 capitalize">{weather.condition}</p>
                    
                    <div className="mt-6 grid grid-cols-3 gap-4 text-center border-t pt-4">
                        <div className="flex flex-col items-center">
                            <Icons.Droplet className="h-6 w-6 text-blue-400 mb-1" />
                            <p className="font-semibold text-sm text-gray-500">{t({ en: 'Chance of Rain', hi: 'बारिश की संभावना', bho: 'बरखा के चांस', bn: 'বৃষ্টির সম্ভাবনা', ta: 'மழைக்கான வாய்ப்பு' })}</p>
                            <p className="text-lg font-bold">{weather.chanceOfRain ?? 0}%</p>
                        </div>
                        <div className="flex flex-col items-center">
                             <Icons.Droplet className="h-6 w-6 text-cyan-400 mb-1" />
                            <p className="font-semibold text-sm text-gray-500">{t({ en: 'Humidity', hi: 'नमी', bho: 'नमी', bn: 'আর্দ্রতা', ta: 'ஈரப்பதம்' })}</p>
                            <p className="text-lg font-bold">{weather.humidity}%</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="font-semibold text-sm text-gray-500">{t({ en: 'Wind Speed', hi: 'हवा की गति', bho: 'हवा के गति', bn: 'বায়ুর গতি', ta: 'காற்றின் வேகம்' })}</p>
                            <p className="text-lg font-bold">{weather.windSpeedKPH} km/h</p>
                        </div>
                    </div>

                     <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center border-t pt-4">
                        {weather.sunriseTime && <div className="flex flex-col items-center"><Icons.Sunrise className="h-8 w-8 text-orange-400" /><p className="font-semibold text-sm">{t({en: 'Sunrise', hi: 'सूर्योदय', bho: 'सूर्योदय', bn: 'সূর্যোদয়', ta: 'சூரிய உதயம்'})}</p><p>{weather.sunriseTime}</p></div>}
                        {weather.sunsetTime && <div className="flex flex-col items-center"><Icons.Sunset className="h-8 w-8 text-orange-600" /><p className="font-semibold text-sm">{t({en: 'Sunset', hi: 'सूर्यास्त', bho: 'सूर्यास्त', bn: 'সূর্যাস্ত', ta: 'சூரிய அஸ்தமனம்'})}</p><p>{weather.sunsetTime}</p></div>}
                        {weather.moonriseTime && <div className="flex flex-col items-center"><Icons.Moonrise className="h-8 w-8 text-gray-400" /><p className="font-semibold text-sm">{t({en: 'Moonrise', hi: 'चंद्रोदय', bho: 'चंद्रोदय', bn: 'চন্দ্রোদয়', ta: 'சந்திரன் உதயம்'})}</p><p>{weather.moonriseTime}</p></div>}
                        {weather.moonsetTime && <div className="flex flex-col items-center"><Icons.Moonset className="h-8 w-8 text-gray-600" /><p className="font-semibold text-sm">{t({en: 'Moonset', hi: 'चंद्रास्त', bho: 'चंद्रास्त', bn: 'চন্দ্রাস্ত', ta: 'சந்திரன் அஸ்தமனம்'})}</p><p>{weather.moonsetTime}</p></div>}
                    </div>
                </div>
            );
        }

        return null;
    }

    return (
        <div>
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="p-2 mr-2 rounded-full hover:bg-gray-200">
                  <Icons.ArrowLeft className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">{t({ en: "Today's Weather", hi: 'आज का मौसम', bho: 'आज के मौसम', bn: 'আজকের আবহাওয়া', ta: 'இன்றைய வானிலை' })}</h2>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg min-h-[300px] flex items-center justify-center">
                {renderContent()}
            </div>
        </div>
    );
};

export default WeatherView;
