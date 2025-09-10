
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import type { View, Translations } from '../types';
import { Icons } from './Icons';
import { HEALTH_TIPS } from '../constants';

interface DashboardProps {
    onNavigate: (view: View) => void;
}

const HealthTip: React.FC = () => {
    const context = useContext(AppContext);
    const [tip, setTip] = useState<Translations | null>(null);

    useEffect(() => {
        if (!context) return;
        const { weatherCache, fetchWeather } = context;
        
        if (!weatherCache.data && !weatherCache.loading && !weatherCache.error) {
            fetchWeather();
        }
    }, [context]);

    useEffect(() => {
        if (!context) return;
        const { weatherCache, t } = context;

        if (weatherCache.data) {
            const condition = weatherCache.data.condition.toLowerCase();
            let relevantTips: Translations[] = [];

            if (condition.includes('rain') || condition.includes('drizzle')) {
                relevantTips = HEALTH_TIPS.rain;
            } else if (weatherCache.data.temperatureCelsius < 15) {
                relevantTips = HEALTH_TIPS.cold;
            } else if (weatherCache.data.temperatureCelsius > 28) {
                relevantTips = HEALTH_TIPS.hot;
            } else {
                relevantTips = HEALTH_TIPS.general;
            }
            
            setTip(relevantTips[Math.floor(Math.random() * relevantTips.length)]);
        } else {
             setTip(HEALTH_TIPS.general[Math.floor(Math.random() * HEALTH_TIPS.general.length)]);
        }
    }, [context]);


    if (!context || !tip) return null;
    const { t } = context;

    return (
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md mb-8 border-l-4 border-teal-400">
           <p className="text-slate-700">{t(tip)}</p>
        </div>
    );
};

// FIX: Define a type for menu items to support both navigation and action buttons.
interface MenuItem {
    label: string;
    icon: JSX.Element;
    view: View | string; // Allow string for non-view keys like 'install' or 'share'
    action?: () => void | Promise<void>; // Optional action for non-navigation buttons
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    const context = useContext(AppContext);
    if (!context) return null;
    const { t } = context;

    const handleShareApp = async () => {
        const shareData = {
            title: t({ en: 'LifeMate: Your Daily Assistant', hi: 'लाइफमेट: आपका दैनिक सहायक', bho: 'लाइफमेट: राउर रोज के सहायक', bn: 'লাইফমেট: আপনার দৈনিক সহকারী', ta: 'லைஃப்மேட்: உங்கள் தினசரி உதவியாளர்' }),
            text: t({ en: 'Check out LifeMate, your all-in-one personal assistant!', hi: 'लाइफमेट देखें, आपका ऑल-इन-वन व्यक्तिगत सहायक!', bho: 'लाइफमेट देखीं, राउर सब कुछ में एक व्यक्तिगत सहायक!', bn: 'লাইফমেট দেখুন, আপনার সব-ইন-ওয়ান ব্যক্তিগত সহকারী!', ta: 'லைஃப்மேட்டைப் பாருங்கள், உங்கள் ஆல்-இன்-ஒன் தனிப்பட்ட உதவியாளர்!' }),
            url: window.location.origin,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                alert(t({ en: 'Share feature is not supported in your browser.', hi: 'शेयर सुविधा आपके ब्राउज़र में समर्थित नहीं है।', bho: 'शेयर सुविधा राउर ब्राउज़र में समर्थित नइखे।', bn: 'শেয়ার বৈশিষ্ট্য আপনার ব্রাউজারে সমর্থিত নয়।', ta: 'பகிர்வு அம்சம் உங்கள் உலாவியில் ஆதரிக்கப்படவில்லை.' }));
            }
        } catch (error) {
            console.error("Error sharing app:", error);
        }
    };

    // FIX: Explicitly type the menuItems array with the new MenuItem interface.
    const menuItems: MenuItem[] = [
        {
            label: t({ en: 'Shopping Lists', hi: 'शॉपिंग की सूचियाँ', bho: 'शॉपिंग के लिस्ट', bn: 'কেনাকাটার তালিকা', ta: 'ஷாப்பிங் பட்டியல்கள்' }),
            icon: <Icons.List className="h-10 w-10 mb-2 text-sky-500" />,
            view: 'lists',
        },
        {
            label: t({ en: 'Daily Milk Log', hi: 'दैनिक दूध का हिसाब', bho: 'रोज के दूध के हिसाब', bn: 'দৈনিক দুধের লগ', ta: 'தினசரி பால் பதிவு' }),
            icon: <Icons.Milk className="h-10 w-10 mb-2 text-green-500" />,
            view: 'milk',
        },
        {
            label: t({ en: 'Local Bazaar Rates', hi: 'मंडी भाव', bho: 'मंडी भाव', bn: 'স্থানীয় বাজারের দর', ta: 'உள்ளூர் பஜார் விகிதங்கள்' }),
            icon: <Icons.Scale className="h-10 w-10 mb-2 text-orange-500" />,
            view: 'bazaarRates',
        },
        {
            label: t({ en: 'Expense Tracker', hi: 'खर्च का हिसाब', bho: 'खरच के हिसाब', bn: 'খরচ ট্র্যাকার', ta: 'செலவு டிராக்கர்' }),
            icon: <Icons.Eye className="h-10 w-10 mb-2 text-violet-500" />,
            view: 'masterList',
        },
        {
            label: t({ en: 'Calculator', hi: 'कैलकुलेटर', bho: 'कैलकुलेटर', bn: 'ক্যালকুলেটর', ta: 'கால்குலேட்டர்' }),
            icon: <Icons.Calculator className="h-10 w-10 mb-2 text-gray-500" />,
            view: 'calculator',
        },
        {
            label: t({ en: 'Attendance Card', hi: 'हाजिरी कार्ड', bho: 'हाजिरी कार्ड', bn: 'হাজিরা কার্ড', ta: 'வருகைப் பதிவு' }),
            icon: <Icons.CalendarCheck className="h-10 w-10 mb-2 text-fuchsia-500" />,
            view: 'attendance',
        },
        {
            label: t({ en: "Today's Horoscope", hi: 'आज का राशिफल', bho: 'आज के राशिफल', bn: 'আজকের রাশিফল', ta: 'இன்றைய ராசிபலன்' }),
            icon: <Icons.Horoscope className="h-10 w-10 mb-2 text-indigo-500" />,
            view: 'horoscope',
        },
        {
            label: t({ en: "Today's Weather", hi: 'आज का मौसम', bho: 'आज के मौसम', bn: 'আজকের আবহাওয়া', ta: 'இன்றைய வானிலை' }),
            icon: <Icons.Weather className="h-10 w-10 mb-2 text-cyan-500" />,
            view: 'weather',
        },
        {
            label: t({ en: 'Daily Journal', hi: 'मेरी डायरी', bho: 'हमर डायरी', bn: 'আমার ডায়েরি', ta: 'என் டைரி' }),
            icon: <Icons.Journal className="h-10 w-10 mb-2 text-amber-500" />,
            view: 'journal',
        },
        {
            label: t({ en: 'Health & Home Remedies', hi: 'घरेलू नुस्ख़े', bho: 'घरेलू नुस्खा', bn: 'স্বাস্থ্য ও ঘরোয়া প্রতিকার', ta: 'உடல்நலம் மற்றும் வீட்டு வைத்தியம்' }),
            icon: <Icons.Remedy className="h-10 w-10 mb-2 text-lime-500" />,
            view: 'remedies',
        },
    ];

    menuItems.push({
        label: t({ en: 'Share the App', hi: 'ऐप शेयर करें', bho: 'ऐप शेयर करीं', bn: 'অ্যাপটি শেয়ার করুন', ta: 'செயலியைப் பகிரவும்' }),
        icon: <Icons.Share className="h-10 w-10 mb-2 text-rose-500" />,
        view: 'share', // This is just a key, not a navigation view
        action: handleShareApp,
    });


    return (
        <div className="p-2 sm:p-4">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-slate-800 tracking-tight">LifeMate</h1>
                <p className="text-md text-slate-500 mt-1">{t({ en: 'Your Personal Shopping Assistant', hi: 'आपका व्यक्तिगत खरीदारी सहायक', bho: 'रउवा पर्सनल खरीदारी सहायक', bn: 'আপনার ব্যক্তিগত কেনাকাটার সহকারী', ta: 'உங்கள் தனிப்பட்ட ஷாப்பிங் உதவியாளர்' })}</p>
            </div>
            
            <HealthTip />
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                {menuItems.map((item) => (
                    <button
                        key={item.view}
                        onClick={() => (item.action ? item.action() : onNavigate(item.view as View))}
                        className={`bg-white p-4 sm:p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 flex flex-col items-center justify-center text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500`}
                    >
                        {item.icon}
                        <span className="text-sm sm:text-base font-semibold text-slate-700">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;