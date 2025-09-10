import type { Translations } from '../types';

interface NotificationContent {
    title: Translations;
    body: Translations;
}

const MORNING_NOTIFICATIONS: NotificationContent[] = [
    {
        title: {
            en: '✨ Your Daily Horoscope is Here!',
            hi: '✨ आपका दैनिक राशिफल आ गया है!',
            bho: '✨ रउवा दैनिक राशिफल आ गइल बा!',
            bn: '✨ আপনার দৈনিক রাশিফল এখানে!',
            ta: '✨ உங்கள் தினசரி ராசிபலன் இங்கே!'
        },
        body: {
            en: "What do the stars have in store for you today? Tap to find out your lucky tip!",
            hi: "आज सितारे आपके लिए क्या लेकर आए हैं? अपनी लकी टिप जानने के लिए टैप करें!",
            bho: "आज सितारा रउवा खातिर का ले के आइल बा? आपन लकी टिप जाने खातिर टैप करीं!",
            bn: "আজ আপনার জন্য তারারা কী নিয়ে এসেছে? আপনার ভাগ্যবান টিপ জানতে ট্যাপ করুন!",
            ta: "இன்று நட்சத்திரங்கள் உங்களுக்காக என்ன வைத்திருக்கின்றன? உங்கள் அதிர்ஷ்டக் குறிப்பை அறிய தட்டவும்!"
        }
    },
    {
        title: {
            en: '🌦️ A Tip for Today\'s Weather!',
            hi: '🌦️ आज के मौसम के लिए एक टिप!',
            bho: '🌦️ आज के मौसम खातिर एगो टिप!',
            bn: '🌦️ আজকের আবহাওয়ার জন্য একটি টিপ!',
            ta: '🌦️ இன்றைய வானிலைக்கான ஒரு குறிப்பு!'
        },
        body: {
            en: "The weather is changing! Here's a health tip to keep you feeling your best today.",
            hi: "मौसम बदल रहा है! आज आपको सबसे अच्छा महसूस कराने के लिए एक स्वास्थ्य टिप।",
            bho: "मौसम बदल रहल बा! आज रउवा के सबसे बढ़िया महसूस करावे खातिर एगो स्वास्थ्य टिप।",
            bn: "আবহাওয়া পরিবর্তন হচ্ছে! আজ আপনাকে সেরা অনুভব করাতে একটি স্বাস্থ্য টিপ।",
            ta: "வானிலை மாறுகிறது! இன்று நீங்கள் சிறந்ததாக உணர ஒரு சுகாதாரக் குறிப்பு இங்கே."
        }
    },
];

const MARKET_NOTIFICATIONS: NotificationContent[] = [
    {
        title: {
            en: '📈 Today\'s Market Rates!',
            hi: '📈 आज के मंडी भाव!',
            bho: '📈 आज के मंडी भाव!',
            bn: '📈 আজকের বাজারের দর!',
            ta: '📈 இன்றைய சந்தை விகிதங்கள்!'
        },
        body: {
            en: "Planning to shop? Check the latest approximate rates for vegetables, grains, and more.",
            hi: "खरीदारी की योजना बना रहे हैं? सब्ज़ियों, अनाज और अन्य चीज़ों के ताज़ा अनुमानित भाव देखें।",
            bho: "खरीदारी के योजना बनावत बानी? सब्जी, अनाज आ अउरी चीज के ताजा अनुमानित भाव देखीं।",
            bn: "কেনাকাটার পরিকল্পনা করছেন? সবজি, শস্য এবং আরও অনেক কিছুর সর্বশেষ আনুমানিক দর দেখুন।",
            ta: "ஷாப்பிங் செய்ய திட்டமிட்டுள்ளீர்களா? காய்கறிகள், தானியங்கள் மற்றும் பலவற்றிற்கான சமீபத்திய தோராயமான விகிதங்களைப் பார்க்கவும்."
        }
    },
];


export const getMorningNotification = (t: (translations: Translations) => string): { title: string, body: string } => {
    const randomIndex = Math.floor(Math.random() * MORNING_NOTIFICATIONS.length);
    const randomNotification = MORNING_NOTIFICATIONS[randomIndex];
    return {
        title: t(randomNotification.title),
        body: t(randomNotification.body)
    };
};

export const getMarketNotification = (t: (translations: Translations) => string): { title: string, body: string } => {
    const randomIndex = Math.floor(Math.random() * MARKET_NOTIFICATIONS.length);
    const randomNotification = MARKET_NOTIFICATIONS[randomIndex];
    return {
        title: t(randomNotification.title),
        body: t(randomNotification.body)
    };
};