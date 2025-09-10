
import type { LanguageCode, Category, Product, Unit, Translations, ZodiacSign } from './types';

export const LANGUAGES: { code: LanguageCode; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'bho', name: 'भोजपुरी' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'ta', name: 'தமிழ்' },
];

export const CATEGORIES: Category[] = [
    { id: 1, name: { en: 'Dairy & Milk', hi: 'डेयरी और दूध', bho: 'डेयरी आ दूध', bn: 'দুগ্ধ ও দুধ', ta: 'பால் & பால் பொருட்கள்' } },
    { id: 2, name: { en: 'Vegetables', hi: 'सब्ज़ियाँ', bho: 'सब्जी', bn: 'শাকসবজি', ta: 'காய்கறிகள்' } },
    { id: 3, name: { en: 'Fruits', hi: 'फल', bho: 'फल', bn: 'ফল', ta: 'பழங்கள்' } },
    { id: 4, name: { en: 'Grains & Pulses', hi: 'अनाज व दालें', bho: 'अनाज आ दाल', bn: 'শস্য ও ডাল', ta: 'தானியங்கள் & பருப்புகள்' } },
    { id: 5, name: { en: 'Spices & Oil', hi: 'मसाले व तेल', bho: 'मसाला आ तेल', bn: 'মসলা ও তেল', ta: 'மசாலா & எண்ணெய்' } },
    { id: 6, name: { en: 'Bakery & Packaged Food', hi: 'बेकरी और पैकेज्ड भोजन', bho: 'बेकरी आ पैकेज्ड खाना', bn: 'বেকারি ও প্যাকেজড খাবার', ta: 'பேக்கரி & தொகுக்கப்பட்ட உணவு' } },
    { id: 7, name: { en: 'Snacks & Drinks', hi: 'स्नैक्स और पेय', bho: 'नाश्ता आ पिये वाला', bn: 'স্ন্যাকস ও পানীয়', ta: 'தின்பண்டங்கள் & பானங்கள்' } },
    { id: 8, name: { en: 'Beauty & Personal Care', hi: 'सौंदर्य और व्यक्तिगत देखभाल', bho: 'सुंदरता आ व्यक्तिगत देखभाल', bn: 'সৌন্দর্য ও ব্যক্তিগত যত্ন', ta: 'அழகு & தனிப்பட்ட பராமரிப்பு' } },
    { id: 81, parentId: 8, name: { en: 'Male Care', hi: 'पुरुषों की देखभाल', bho: 'मरद के देखभाल', bn: 'পুরুষদের যত্ন', ta: 'ஆண்கள் பராமரிப்பு' } },
    { id: 82, parentId: 8, name: { en: 'Female Care', hi: 'महिलाओं की देखभाल', bho: 'मेहरारू के देखभाल', bn: 'মহিলাদের যত্ন', ta: 'பெண்கள் பராமரிப்பு' } },
    { id: 9, name: { en: 'Household & Daily Use', hi: 'घरेलू और दैनिक उपयोग', bho: 'घर के आ रोज के उपयोग', bn: 'গৃহস্থালি ও দৈনন্দিন ব্যবহার', ta: 'வீட்டு உபயோகம் & தினசரி பயன்பாடு' } },
    { id: 10, name: { en: 'Electronics & Misc', hi: 'इलेक्ट्रॉनिक्स और विविध', bho: 'इलेक्ट्रॉनिक्स आ अउरी', bn: 'ইলেকট্রনিক্স ও বিবিধ', ta: 'மின்னணுவியல் & இதர' } },
];

export const UNITS: { value: Unit; label: Translations }[] = [
    { value: 'kg', label: { en: 'Kg', hi: 'किग्रा', bho: 'किग्रा', bn: 'কেজি', ta: 'கிலோ' } },
    { value: 'g', label: { en: 'Gram', hi: 'ग्राम', bho: 'ग्राम', bn: 'গ্রাম', ta: 'கிராம்' } },
    { value: 'pcs', label: { en: 'Pcs', hi: 'अदद', bho: 'पीस', bn: 'পিস', ta: 'துண்டுகள்' } },
    { value: 'ltr', label: { en: 'Ltr', hi: 'लीटर', bho: 'लीटर', bn: 'লিটার', ta: 'லிட்டர்' } },
    { value: 'packet', label: { en: 'Packet', hi: 'पैकेट', bho: 'पैकेट', bn: 'প্যাকেট', ta: 'பாக்கெட்' } },
];

export const ZODIAC_SIGNS: ZodiacSign[] = [
    { id: 'aries', name: { en: 'Aries', hi: 'मेष', bho: 'मेष', bn: 'মেষ', ta: 'மேஷம்' } },
    { id: 'taurus', name: { en: 'Taurus', hi: 'वृषभ', bho: 'वृषभ', bn: 'বৃষ', ta: 'ரிஷபம்' } },
    { id: 'gemini', name: { en: 'Gemini', hi: 'मिथुन', bho: 'मिथुन', bn: 'মিথুন', ta: 'மிதுனம்' } },
    { id: 'cancer', name: { en: 'Cancer', hi: 'कर्क', bho: 'कर्क', bn: 'কর্কট', ta: 'கடகம்' } },
    { id: 'leo', name: { en: 'Leo', hi: 'सिंह', bho: 'सिंह', bn: 'সিংহ', ta: 'சிம்மம்' } },
    { id: 'virgo', name: { en: 'Virgo', hi: 'कन्या', bho: 'कन्या', bn: 'কন্যা', ta: 'கன்னி' } },
    { id: 'libra', name: { en: 'Libra', hi: 'तुला', bho: 'तुला', bn: 'তুলা', ta: 'துலாம்' } },
    { id: 'scorpio', name: { en: 'Scorpio', hi: 'वृश्चिक', bho: 'वृश्चिक', bn: 'বৃশ্চিক', ta: 'விருச்சிகம்' } },
    { id: 'sagittarius', name: { en: 'Sagittarius', hi: 'धनु', bho: 'धनु', bn: 'ধনু', ta: 'தனுசு' } },
    { id: 'capricorn', name: { en: 'Capricorn', hi: 'मकर', bho: 'मकर', bn: 'মকর', ta: 'மகரம்' } },
    { id: 'aquarius', name: { en: 'Aquarius', hi: 'कुंभ', bho: 'कुंभ', bn: 'কুম্ভ', ta: 'கும்பம்' } },
    { id: 'pisces', name: { en: 'Pisces', hi: 'मीन', bho: 'मीन', bn: 'মীন', ta: 'மீனம்' } },
];

export const HEALTH_TIPS: { [key: string]: Translations[] } = {
    rain: [
        { en: 'It\'s raining today ☔ – Drinking hot soup will be beneficial.', hi: 'आज बारिश है ☔ – गरम सूप पीना फायदेमंद रहेगा।', bho: 'आज बरखा बा ☔ – गरम सूप पीयल फायदेमंद रही।', bn: 'আজ বৃষ্টি হচ্ছে ☔ – গরম স্যুপ পান করা উপকারী হবে।', ta: 'இன்று மழை பெய்கிறது ☔ – சூடான சூப் குடிப்பது நன்மை பயக்கும்.' },
        { en: 'Avoid street food during rainy season to prevent infections.', hi: 'संक्रमण से बचने के لیے बरसात के मौसम में स्ट्रीट फूड से बचें।', bho: 'संकरमन से बचे खातिर बरसात के मौसम में बाहर के खाना से बचीं।', bn: 'সংক্রমণ এড়াতে বর্ষাকালে রাস্তার খাবার এড়িয়ে চলুন।', ta: 'தொற்றுநோய்களைத் தவிர்க்க மழைக்காலத்தில் தெரு உணவுகளைத் தவிர்க்கவும்.' },
    ],
    cold: [
        { en: 'It\'s cold today ❄️ – Dry fruits and warm milk are essential.', hi: 'आज सर्दी है ❄️ – Dry fruits और गरम दूध ज़रूरी।', bho: 'आज सरदी बा ❄️ – सुफल आ गरम दूध जरूरी।', bn: 'আজ ঠান্ডা ❄️ – শুকনো ফল এবং গরম দুধ অপরিহার্য।', ta: 'இன்று குளிராக இருக்கிறது ❄️ – உலர் பழங்கள் மற்றும் சூடான பால் அவசியம்.' },
        { en: 'Wear warm clothes to protect yourself from the cold.', hi: 'ठंड से बचने के लिए गर्म कपड़े पहनें।', bho: 'ठंडा से बचे खातिर गरम कपड़ा पहिनीं।', bn: 'ঠান্ডা থেকে নিজেকে রক্ষা করতে গরম পোশাক পরুন।', ta: 'குளிரிலிருந்து உங்களைப் பாதுகாத்துக் கொள்ள சூடான ஆடைகளை அணியுங்கள்.' },
    ],
    hot: [
        { en: 'It\'s hot today ☀️ – Stay hydrated and drink plenty of water.', hi: 'आज गर्मी है ☀️ – हाइड्रेटेड रहें और खूब पानी पिएं।', bho: 'आज गरमी बा ☀️ – पानी पीयत रहीं आ हाइड्रेटेड रहीं।', bn: 'আজ গরম ☀️ – হাইড্রেটেড থাকুন এবং প্রচুর জল পান করুন।', ta: 'இன்று வெப்பமாக இருக்கிறது ☀️ – நீரேற்றத்துடன் இருங்கள் மற்றும் প্রচুর தண்ணீர் குடியுங்கள்.' },
        { en: 'Eat light foods like cucumber and watermelon to stay cool.', hi: 'ठंडा रहने के लिए खीरा और तरबूज जैसे हल्के खाद्य पदार्थ खाएं।', bho: 'ठंडा रहे खातिर खीरा आ तरबूज जइसन हलका खाना खाईं।', bn: 'ঠান্ডা থাকতে শসা এবং তরমুজের মতো হালকা খাবার খান।', ta: 'குளிர்ச்சியாக இருக்க வெள்ளரி மற்றும் தர்பூசணி போன்ற லேசான உணவுகளை உண்ணுங்கள்.' },
    ],
    general: [
        { en: 'Household Tip: Khichdi is the best food for an upset stomach.', hi: 'घरेलू टिप: खिचड़ी पेट खराब में सबसे अच्छा खाना है।', bho: 'घरेलू टिप: खिचड़ी पेट खराब में सबसे बढ़िया खाना ह।', bn: 'ঘরোয়া টিপ: পেট খারাপের জন্য খিচুড়ি সেরা খাবার।', ta: 'வீட்டுக்குறிப்பு: வயிற்றுக் கோளாறுக்கு கிச்சடி சிறந்த உணவு.' },
        { en: 'A short walk after dinner aids digestion.', hi: 'रात के खाने के बाद थोड़ी देर टहलना पाचन में मदद करता है।', bho: 'रात के खाना के बाद तनी देर टहलला से खाना पचे में मदद मिलेला।', bn: ' রাতের খাবারের পর কিছুক্ষণ হাঁটলে হজমে সাহায্য হয়।', ta: 'இரவு உணவிற்குப் பிறகு ஒரு சிறிய நடை செரிமானத்திற்கு உதவுகிறது.' },
    ],
};


export const PRODUCTS: Product[] = [
    // 1: Dairy & Milk
    { id: 101, categoryId: 1, name: { en: 'Milk', hi: 'दूध', bho: 'दूध', bn: 'দুধ', ta: 'பால்' }, unit: 'ltr', price: 60 },
    { id: 102, categoryId: 1, name: { en: 'Paneer', hi: 'पनीर', bho: 'पनीर', bn: 'পনির', ta: 'பன்னீர்' }, unit: 'kg', price: 400 },
    { id: 103, categoryId: 1, name: { en: 'Curd/Yogurt', hi: 'दही', bho: 'दही', bn: 'দই', ta: 'தயிர்' }, unit: 'kg', price: 120 },
    { id: 104, categoryId: 1, name: { en: 'Butter', hi: 'मक्खन', bho: 'मक्खन', bn: 'মাখন', ta: 'வெண்ணெய்' }, unit: 'g', price: 50 },
    { id: 105, categoryId: 1, name: { en: 'Ghee', hi: 'घी', bho: 'घी', bn: 'ঘি', ta: 'நெய்' }, unit: 'ltr', price: 600 },
    { id: 106, categoryId: 1, name: { en: 'Cheese', hi: 'चीज़', bho: 'चीज़', bn: 'চিজ', ta: 'சீஸ்' }, unit: 'g', price: 100 },
    { id: 107, categoryId: 1, name: { en: 'Milk Powder', hi: 'मिल्क पाउडर', bho: 'मिल्क पाउडर', bn: 'দুধের গুঁড়া', ta: 'பால் பவுடர்' }, unit: 'kg', price: 300 },

    // 2: Vegetables
    { id: 201, categoryId: 2, name: { en: 'Potato', hi: 'आलू', bho: 'आलू', bn: 'আলু', ta: 'உருளைக்கிழங்கு' }, unit: 'kg', price: 30 },
    { id: 202, categoryId: 2, name: { en: 'Onion', hi: 'प्याज', bho: 'प्याज', bn: 'পেঁয়াজ', ta: 'வெங்காயம்' }, unit: 'kg', price: 40 },
    { id: 203, categoryId: 2, name: { en: 'Tomato', hi: 'टमाटर', bho: 'टमाटर', bn: 'টমেটো', ta: 'தக்காளி' }, unit: 'kg', price: 50 },
    { id: 204, categoryId: 2, name: { en: 'Brinjal', hi: 'बैंगन', bho: 'भंटा', bn: 'বেগুন', ta: 'கத்திரிக்காய்' }, unit: 'kg', price: 40 },
    { id: 205, categoryId: 2, name: { en: 'Okra', hi: 'भिंडी', bho: 'भिंडी', bn: 'ঢ্যাঁড়শ', ta: 'வெண்டைக்காய்' }, unit: 'kg', price: 60 },
    { id: 206, categoryId: 2, name: { en: 'Cauliflower', hi: 'गोभी', bho: 'गोभी', bn: 'ফুলকপি', ta: 'காலிஃபிளவர்' }, unit: 'pcs', price: 30 },
    { id: 207, categoryId: 2, name: { en: 'Peas', hi: 'मटर', bho: 'मटर', bn: 'মটর', ta: 'பட்டாணி' }, unit: 'kg', price: 80 },
    { id: 208, categoryId: 2, name: { en: 'Carrot', hi: 'गाजर', bho: 'गाजर', bn: 'গাজর', ta: 'கேரட்' }, unit: 'kg', price: 50 },
    { id: 209, categoryId: 2, name: { en: 'Radish', hi: 'मूली', bho: 'मूली', bn: 'মূলা', ta: 'முள்ளங்கி' }, unit: 'kg', price: 40 },
    { id: 210, categoryId: 2, name: { en: 'Capsicum', hi: 'शिमला मिर्च', bho: 'शिमला मिर्च', bn: 'ক্যাপসিকাম', ta: 'குடை மிளகாய்' }, unit: 'kg', price: 70 },
    { id: 211, categoryId: 2, name: { en: 'Bottle Gourd', hi: 'लौकी', bho: 'लौकी', bn: 'লাউ', ta: 'சுரைக்காய்' }, unit: 'pcs', price: 40 },
    { id: 212, categoryId: 2, name: { en: 'Bitter Gourd', hi: 'करेला', bho: 'करेला', bn: 'করলা', ta: 'பாகற்காய்' }, unit: 'kg', price: 60 },
    { id: 213, categoryId: 2, name: { en: 'Pumpkin', hi: 'कद्दू', bho: 'कोहड़ा', bn: 'কুমড়া', ta: 'பூசணி' }, unit: 'kg', price: 30 },
    { id: 214, categoryId: 2, name: { en: 'Spinach', hi: 'पालक', bho: 'पालक', bn: 'পালং শাক', ta: 'கீரை' }, unit: 'kg', price: 50 },
    { id: 215, categoryId: 2, name: { en: 'Fenugreek', hi: 'मेथी', bho: 'मेथी', bn: 'মেথি', ta: 'வெந்தயம்' }, unit: 'kg', price: 60 },
    { id: 216, categoryId: 2, name: { en: 'Green Chilli', hi: 'हरी मिर्च', bho: 'हरियर मिरचा', bn: 'কাঁচা লঙ্কা', ta: 'பச்சை மிளகாய்' }, unit: 'g', price: 10 },
    { id: 217, categoryId: 2, name: { en: 'Ginger', hi: 'अदरक', bho: 'अदरक', bn: 'আদা', ta: 'இஞ்சி' }, unit: 'g', price: 20 },
    { id: 218, categoryId: 2, name: { en: 'Garlic', hi: 'लहसुन', bho: 'लहसुन', bn: 'রসুন', ta: 'பூண்டு' }, unit: 'g', price: 25 },
    { id: 219, categoryId: 2, name: { en: 'Coriander', hi: 'धनिया', bho: 'धनिया', bn: 'ধনিয়া', ta: 'கொத்தமல்லி' }, unit: 'g', price: 15 },
    { id: 220, categoryId: 2, name: { en: 'Ridge Gourd', hi: 'तोरई', bho: 'तोरी', bn: 'ঝিঙে', ta: 'பீர்க்கங்காய்' }, unit: 'kg', price: 50 },

    // 3: Fruits
    { id: 301, categoryId: 3, name: { en: 'Apple', hi: 'सेब', bho: 'सेब', bn: 'আপেল', ta: 'ஆப்பிள்' }, unit: 'kg', price: 150 },
    { id: 302, categoryId: 3, name: { en: 'Banana', hi: 'केला', bho: 'केला', bn: 'কলা', ta: 'வாழைப்பழம்' }, unit: 'pcs', price: 5 },
    { id: 303, categoryId: 3, name: { en: 'Orange', hi: 'संतरा', bho: 'संतरा', bn: 'কমলা', ta: 'ஆரஞ்சு' }, unit: 'kg', price: 80 },
    { id: 304, categoryId: 3, name: { en: 'Grapes', hi: 'अंगूर', bho: 'अंगूर', bn: 'আঙ্গুর', ta: 'திராட்சை' }, unit: 'kg', price: 100 },
    { id: 305, categoryId: 3, name: { en: 'Mango', hi: 'आम', bho: 'आम', bn: 'আম', ta: 'மாம்பழம்' }, unit: 'kg', price: 120 },
    { id: 306, categoryId: 3, name: { en: 'Guava', hi: 'अमरूद', bho: 'अमरूद', bn: 'পেয়ারা', ta: 'கொய்யா' }, unit: 'kg', price: 70 },
    { id: 307, categoryId: 3, name: { en: 'Papaya', hi: 'पपीता', bho: 'पपीता', bn: 'পেঁপে', ta: 'பப்பாளி' }, unit: 'pcs', price: 50 },
    { id: 308, categoryId: 3, name: { en: 'Pomegranate', hi: 'अनार', bho: 'अनार', bn: 'ডালিম', ta: 'மாதுளை' }, unit: 'kg', price: 160 },
    { id: 309, categoryId: 3, name: { en: 'Watermelon', hi: 'तरबूज', bho: 'तरबूज', bn: 'তরমুজ', ta: 'தர்பூசணி' }, unit: 'pcs', price: 80 },
    { id: 310, categoryId: 3, name: { en: 'Muskmelon', hi: 'खरबूजा', bho: 'खरबूजा', bn: 'खरমুজ', ta: 'முலாம்பழம்' }, unit: 'pcs', price: 60 },
    { id: 311, categoryId: 3, name: { en: 'Litchi', hi: 'लीची', bho: 'लीची', bn: 'লিচু', ta: 'லிச்சி' }, unit: 'kg', price: 180 },
    { id: 312, categoryId: 3, name: { en: 'Coconut', hi: 'नारियल', bho: 'नारियल', bn: 'নারকেল', ta: 'தேங்காய்' }, unit: 'pcs', price: 40 },

    // 4: Grains & Pulses
    { id: 401, categoryId: 4, name: { en: 'Rice', hi: 'चावल', bho: 'चावल', bn: 'চাল', ta: 'அரிசி' }, unit: 'kg', price: 50 },
    { id: 402, categoryId: 4, name: { en: 'Wheat', hi: 'गेहूँ', bho: 'गेहूँ', bn: 'গম', ta: 'கோதுமை' }, unit: 'kg', price: 35 },
    { id: 403, categoryId: 4, name: { en: 'Flour (Atta)', hi: 'आटा', bho: 'आटा', bn: 'আটা', ta: 'மாவு' }, unit: 'kg', price: 40 },
    { id: 404, categoryId: 4, name: { en: 'Gram Flour (Besan)', hi: 'बेसन', bho: 'बेसन', bn: 'বেসন', ta: 'கடலை மாவு' }, unit: 'kg', price: 80 },
    { id: 405, categoryId: 4, name: { en: 'Semolina (Suji)', hi: 'सूजी', bho: 'सूजी', bn: 'সুজি', ta: 'ரவை' }, unit: 'kg', price: 50 },
    { id: 406, categoryId: 4, name: { en: 'Toor Dal', hi: 'अरहर दाल', bho: 'अरहर दाल', bn: 'তুর ডাল', ta: 'துவரம் பருப்பு' }, unit: 'kg', price: 150 },
    { id: 407, categoryId: 4, name: { en: 'Masoor Dal', hi: 'मसूर दाल', bho: 'मसूर दाल', bn: 'মসুর ডাল', ta: 'மைசூர் பருப்பு' }, unit: 'kg', price: 110 },
    { id: 408, categoryId: 4, name: { en: 'Moong Dal', hi: 'मूंग दाल', bho: 'मूंग दाल', bn: 'মুগ ডাল', ta: 'பாசிப் பருப்பு' }, unit: 'kg', price: 140 },
    { id: 409, categoryId: 4, name: { en: 'Urad Dal', hi: 'उड़द दाल', bho: 'उड़द दाल', bn: 'বিউলি ডাল', ta: 'உளுத்தம் பருப்பு' }, unit: 'kg', price: 130 },
    { id: 410, categoryId: 4, name: { en: 'Chana Dal', hi: 'चना दाल', bho: 'चना दाल', bn: 'ছোলার ডাল', ta: 'கடலைப் பருப்பு' }, unit: 'kg', price: 90 },
    { id: 411, categoryId: 4, name: { en: 'Rajma', hi: 'राजमा', bho: 'राजमा', bn: 'রাজমা', ta: 'ராஜ்மா' }, unit: 'kg', price: 120 },
    { id: 412, categoryId: 4, name: { en: 'Chole', hi: 'छोले', bho: 'छोला', bn: 'ছোলা', ta: 'கொண்டைக்கடலை' }, unit: 'kg', price: 100 },
    { id: 413, categoryId: 4, name: { en: 'Soyabean', hi: 'सोयाबीन', bho: 'सोयाबीन', bn: 'সোয়াবিন', ta: 'சோயாபீன்' }, unit: 'kg', price: 100 },

    // 5: Spices & Oil
    { id: 501, categoryId: 5, name: { en: 'Salt', hi: 'नमक', bho: 'नमक', bn: 'লবণ', ta: 'உப்பு' }, unit: 'kg', price: 20 },
    { id: 502, categoryId: 5, name: { en: 'Turmeric Powder', hi: 'हल्दी पाउडर', bho: 'हरदी', bn: 'হলুদ গুঁড়ো', ta: 'மஞ்சள் தூள்' }, unit: 'g', price: 30 },
    { id: 503, categoryId: 5, name: { en: 'Chilli Powder', hi: 'मिर्च पाउडर', bho: 'मिरचा पाउडर', bn: 'লঙ্কা গুঁড়ো', ta: 'மிளகாய் தூள்' }, unit: 'g', price: 40 },
    { id: 504, categoryId: 5, name: { en: 'Coriander Powder', hi: 'धनिया पाउडर', bho: 'धनिया पाउडर', bn: 'ধনিয়া গুঁড়ো', ta: 'கொத்தமல்லி தூள்' }, unit: 'g', price: 35 },
    { id: 505, categoryId: 5, name: { en: 'Cumin Seeds', hi: 'जीरा', bho: 'जीरा', bn: 'জিরা', ta: 'சீரகம்' }, unit: 'g', price: 45 },
    { id: 506, categoryId: 5, name: { en: 'Garam Masala', hi: 'गरम मसाला', bho: 'गरम मसाला', bn: 'গরম মসলা', ta: 'கரம் மசாலா' }, unit: 'g', price: 50 },
    { id: 507, categoryId: 5, name: { en: 'Mustard Seeds', hi: 'राई', bho: 'राई', bn: 'সরিষা', ta: 'கடுகு' }, unit: 'g', price: 25 },
    { id: 508, categoryId: 5, name: { en: 'Cardamom', hi: 'इलायची', bho: 'इलायची', bn: 'এলাচ', ta: 'ஏலக்காய்' }, unit: 'g', price: 100 },
    { id: 509, categoryId: 5, name: { en: 'Cinnamon', hi: 'दालचीनी', bho: 'दालचीनी', bn: 'দারুচিনি', ta: 'இலவங்கப்பட்டை' }, unit: 'g', price: 60 },
    { id: 510, categoryId: 5, name: { en: 'Cloves', hi: 'लौंग', bho: 'लौंग', bn: 'লবঙ্গ', ta: 'கிராம்பு' }, unit: 'g', price: 80 },
    { id: 511, categoryId: 5, name: { en: 'Black Pepper', hi: 'काली मिर्च', bho: 'मरिच', bn: 'গোল মরিচ', ta: 'கருப்பு மிளகு' }, unit: 'g', price: 70 },
    { id: 512, categoryId: 5, name: { en: 'Mustard Oil', hi: 'सरसों का तेल', bho: 'सरसों के तेल', bn: 'সরিষার তেল', ta: 'கடுகு எண்ணெய்' }, unit: 'ltr', price: 180 },
    { id: 513, categoryId: 5, name: { en: 'Refined Oil', hi: 'रिफाइंड तेल', bho: 'रिफाइंड तेल', bn: 'পরিশোধিত তেল', ta: 'சுத்திகரிக்கப்பட்ட எண்ணெய்' }, unit: 'ltr', price: 150 },
    { id: 514, categoryId: 5, name: { en: 'Soyabean Oil', hi: 'सोयाबीन तेल', bho: 'सोयाबीन तेल', bn: 'সয়াবিন তেল', ta: 'சோயாபீன் எண்ணெய்' }, unit: 'ltr', price: 160 },

    // 6: Bakery & Packaged Food
    { id: 601, categoryId: 6, name: { en: 'Bread', hi: 'ब्रेड', bho: 'ब्रेड', bn: 'রুটি', ta: 'ரொட்டி' }, unit: 'packet', price: 40 },
    { id: 602, categoryId: 6, name: { en: 'Biscuits', hi: 'बिस्किट', bho: 'बिस्कुट', bn: 'বিস্কুট', ta: 'பிஸ்கட்' }, unit: 'packet', price: 20 },
    { id: 603, categoryId: 6, name: { en: 'Noodles', hi: 'नूडल्स', bho: 'नूडल्स', bn: 'নুডলস', ta: 'நூடுல்ஸ்' }, unit: 'packet', price: 15 },
    { id: 604, categoryId: 6, name: { en: 'Pasta', hi: 'पास्ता', bho: 'पास्ता', bn: 'পাস্তা', ta: 'பாஸ்தா' }, unit: 'packet', price: 50 },
    { id: 605, categoryId: 6, name: { en: 'Namkeen', hi: 'नमकीन', bho: 'नमकीन', bn: 'নমকিন', ta: 'நம்கீன்' }, unit: 'packet', price: 30 },
    { id: 606, categoryId: 6, name: { en: 'Toast/Rusk', hi: 'टोस्ट', bho: 'टोस्ट', bn: 'টোস্ট', ta: 'டோஸ்ட்' }, unit: 'packet', price: 40 },
    { id: 607, categoryId: 6, name: { en: 'Jam', hi: 'जैम', bho: 'जैम', bn: 'জ্যাম', ta: 'ஜாம்' }, unit: 'g', price: 120 },

    // 7: Snacks & Drinks
    { id: 701, categoryId: 7, name: { en: 'Tea', hi: 'चाय', bho: 'चाय', bn: 'চা', ta: 'தேநீர்' }, unit: 'g', price: 100 },
    { id: 702, categoryId: 7, name: { en: 'Coffee', hi: 'कॉफी', bho: 'कॉफी', bn: 'কফি', ta: 'காபி' }, unit: 'g', price: 150 },
    { id: 703, categoryId: 7, name: { en: 'Juice', hi: 'जूस', bho: 'जूस', bn: 'জুস', ta: 'சாறு' }, unit: 'ltr', price: 100 },
    { id: 704, categoryId: 7, name: { en: 'Soft Drink', hi: 'सॉफ्ट ड्रिंक', bho: 'सॉफ्ट ड्रिंक', bn: 'সফট ড্রিঙ্ক', ta: 'குளிர்பானம்' }, unit: 'ltr', price: 40 },
    { id: 705, categoryId: 7, name: { en: 'Chips', hi: 'चिप्स', bho: 'चिप्स', bn: 'চিপস', ta: 'சிப்ஸ்' }, unit: 'packet', price: 20 },
    { id: 706, categoryId: 7, name: { en: 'Chocolate', hi: 'चॉकलेट', bho: 'चॉकलेट', bn: 'চকোলেট', ta: 'சாக்லேட்' }, unit: 'pcs', price: 50 },
    { id: 707, categoryId: 7, name: { en: 'Syrup/Sherbet', hi: 'शरबत', bho: 'शरबत', bn: 'শরবত', ta: 'சர்பத்' }, unit: 'ltr', price: 120 },

    // 8.1: Male Care
    { id: 8101, categoryId: 81, name: { en: 'Soap (Men)', hi: 'साबुन (पुरुष)', bho: 'साबुन (मरद)', bn: 'সাবান (পুরুষ)', ta: 'சோப் (ஆண்கள்)' }, unit: 'pcs', price: 40 },
    { id: 8102, categoryId: 81, name: { en: 'Shampoo (Men)', hi: 'शैम्पू (पुरुष)', bho: 'शैम्पू (मरद)', bn: 'শ্যাম্পু (পুরুষ)', ta: 'ஷாம்பு (ஆண்கள்)' }, unit: 'ltr', price: 200 },
    { id: 8103, categoryId: 81, name: { en: 'Hair Oil', hi: 'हेयर ऑयल', bho: 'माथ के तेल', bn: 'চুলের তেল', ta: 'ஹேர் ஆயில்' }, unit: 'ltr', price: 150 },
    { id: 8104, categoryId: 81, name: { en: 'Face Wash (Men)', hi: 'फेस वॉश (पुरुष)', bho: 'फेस वॉश (मरद)', bn: 'ফেস ওয়াশ (পুরুষ)', ta: 'ஃபேஸ் வாஷ் (ஆண்கள்)' }, unit: 'ltr', price: 180 },
    { id: 8105, categoryId: 81, name: { en: 'Shaving Cream', hi: 'शेविंग क्रीम', bho: 'सेविंग क्रीम', bn: 'শেভিং ক্রিম', ta: 'ஷேவிங் கிரீம்' }, unit: 'g', price: 80 },
    { id: 8106, categoryId: 81, name: { en: 'Razor/Trimmer', hi: 'रेज़र/ट्रिमर', bho: 'रेज़र/ट्रিমर', bn: 'রেজার/ট্রিমার', ta: 'ரேசர்/ட்ரிம்மர்' }, unit: 'pcs', price: 100 },
    { id: 8107, categoryId: 81, name: { en: 'Aftershave', hi: 'आफ्टरशेव', bho: 'आफ्टरशेव', bn: 'আফটারশেভ', ta: 'ஆஃப்டர் ஷேவ்' }, unit: 'ltr', price: 250 },
    { id: 8108, categoryId: 81, name: { en: 'Perfume/Deodorant (Men)', hi: 'परफ्यूम/डियो (पुरुष)', bho: 'परफ्यूम/डियो (मरद)', bn: 'পারফিউম/ডিও (পুরুষ)', ta: 'வாசனை திரவியம்/டியோ (ஆண்கள்)' }, unit: 'pcs', price: 220 },

    // 8.2: Female Care
    { id: 8201, categoryId: 82, name: { en: 'Shampoo', hi: 'शैम्पू', bho: 'शैम्पू', bn: 'শ্যাম্পু', ta: 'ஷாம்பு' }, unit: 'ltr', price: 220 },
    { id: 8202, categoryId: 82, name: { en: 'Conditioner', hi: 'कंडीशनर', bho: 'कंडीशनर', bn: 'কন্ডিশনার', ta: 'கண்டிஷனர்' }, unit: 'ltr', price: 250 },
    { id: 8203, categoryId: 82, name: { en: 'Hair Serum', hi: 'हेयर सीरम', bho: 'हेयर सीरम', bn: 'হেয়ার سیرাম', ta: 'ஹேர் சீரம்' }, unit: 'ltr', price: 300 },
    { id: 8204, categoryId: 82, name: { en: 'Hair Color', hi: 'हेयर कलर', bho: 'हेयर कलर', bn: 'চুলের রঙ', ta: 'ஹேர் கலர்' }, unit: 'packet', price: 150 },
    { id: 8205, categoryId: 82, name: { en: 'Face Wash', hi: 'फेस वॉश', bho: 'फेस वॉश', bn: 'ফেস ওয়াশ', ta: 'ஃபேஸ் வாஷ்' }, unit: 'ltr', price: 180 },
    { id: 8206, categoryId: 82, name: { en: 'Moisturizer', hi: 'मॉइस्चराइज़र', bho: 'मॉइस्चराइज़र', bn: 'ময়েশ্চারাইজার', ta: 'மாய்ஸ்சரைசர்' }, unit: 'g', price: 200 },
    { id: 8207, categoryId: 82, name: { en: 'Sunscreen', hi: 'सनस्क्रीन', bho: 'सनस्क्रीन', bn: 'সানস্ক্রিন', ta: 'சன்ஸ்கிரீன்' }, unit: 'g', price: 350 },
    { id: 8208, categoryId: 82, name: { en: 'Face Pack', hi: 'फेस पैक', bho: 'फेस पैक', bn: 'ফেস প্যাক', ta: 'ஃபேஸ் பேக்' }, unit: 'packet', price: 100 },
    { id: 8209, categoryId: 82, name: { en: 'Scrub', hi: 'स्क्रब', bho: 'स्क्रब', bn: 'স্ক্রাব', ta: 'ஸ்க்ரப்' }, unit: 'g', price: 150 },
    { id: 8210, categoryId: 82, name: { en: 'Body Lotion', hi: 'बॉडी लोशन', bho: 'बॉडी लोशन', bn: 'বডি লোশন', ta: 'பாடி லோஷன்' }, unit: 'ltr', price: 250 },
    { id: 8211, categoryId: 82, name: { en: 'Lip Balm', hi: 'लिप बाम', bho: 'लिप बाम', bn: 'লিপ বাম', ta: 'லிப் பாம்' }, unit: 'pcs', price: 100 },
    { id: 8212, categoryId: 82, name: { en: 'Foundation', hi: 'फाउंडेशन', bho: 'फाउंडेशन', bn: 'ফাউন্ডেশন', ta: 'ஃபவுண்டேஷன்' }, unit: 'pcs', price: 500 },
    { id: 8213, categoryId: 82, name: { en: 'Kajal', hi: 'काजल', bho: 'काजल', bn: 'কাজল', ta: 'காஜல்' }, unit: 'pcs', price: 150 },
    { id: 8214, categoryId: 82, name: { en: 'Eyeliner', hi: 'आईलाइनर', bho: 'आईलाइनर', bn: 'আইলাইনার', ta: 'ஐலைனர்' }, unit: 'pcs', price: 200 },
    { id: 8215, categoryId: 82, name: { en: 'Lipstick', hi: 'लिपस्टिक', bho: 'लिपस्टिक', bn: 'লিপস্টিক', ta: 'லிப்ஸ்டிக்' }, unit: 'pcs', price: 300 },
    { id: 8216, categoryId: 82, name: { en: 'Nail Polish', hi: 'नेल पॉलिश', bho: 'नेल पॉलिश', bn: 'নেল পলিশ', ta: 'நெயில் பாலிஷ்' }, unit: 'pcs', price: 80 },
    { id: 8217, categoryId: 82, name: { en: 'Makeup Remover', hi: 'मेकअप रिमूवर', bho: 'मेकअप रिमूवर', bn: 'মেকআপ রিমুভার', ta: 'மேக்கப் ரிமூவர்' }, unit: 'ltr', price: 250 },
    { id: 8218, categoryId: 82, name: { en: 'Sanitary Pads', hi: 'सैनिटरी पैड', bho: 'सैनिटरी पैड', bn: 'স্যানিটারি প্যাড', ta: 'சானிட்டரி பேட்கள்' }, unit: 'packet', price: 40 },
    { id: 8219, categoryId: 82, name: { en: 'Perfume/Deodorant (Women)', hi: 'परफ्यूम/डियो (महिला)', bho: 'परफ्यूम/डियो (मेहरारू)', bn: 'পারফিউম/ডিও (মহিলা)', ta: 'வாசனை திரவியம்/டியோ (பெண்கள்)' }, unit: 'pcs', price: 250 },
    { id: 8220, categoryId: 82, name: { en: 'Hair Oil', hi: 'हेयर ऑयल', bho: 'माथ के तेल', bn: 'চুলের তেল', ta: 'ஹேர் ஆயில்' }, unit: 'ltr', price: 150 },
    { id: 8221, categoryId: 82, name: { en: 'Day Cream', hi: 'डे क्रीम', bho: 'दिन के क्रीम', bn: 'ডে ক্রিম', ta: 'டே கிரீம்' }, unit: 'g', price: 250 },
    { id: 8222, categoryId: 82, name: { en: 'Night Cream', hi: 'नाइट क्रीम', bho: 'रात के क्रीम', bn: 'নাইট ক্রিম', ta: 'நைட் கிரீம்' }, unit: 'g', price: 300 },
    { id: 8223, categoryId: 82, name: { en: 'Hand Cream', hi: 'हैंड क्रीम', bho: 'हाथ के क्रीम', bn: 'হ্যান্ড ক্রিম', ta: 'ஹேண்ட் கிரீம்' }, unit: 'g', price: 180 },
    { id: 8224, categoryId: 82, name: { en: 'Compact Powder', hi: 'कॉम्पैक्ट पाउडर', bho: 'कॉम्पैक्ट पाउडर', bn: 'কমপ্যাক্ট পাউডার', ta: 'காம்பாக்ட் பவுடர்' }, unit: 'pcs', price: 220 },
    { id: 8225, categoryId: 82, name: { en: 'Blush', hi: 'ब्लश', bho: 'ब्लश', bn: 'ব্লাশ', ta: 'பிளஷ்' }, unit: 'pcs', price: 400 },
    { id: 8226, categoryId: 82, name: { en: 'Mascara', hi: 'मस्कारा', bho: 'मस्कारा', bn: 'মাস্কারা', ta: 'மஸ்காரா' }, unit: 'pcs', price: 350 },
    { id: 8227, categoryId: 82, name: { en: 'Lip Gloss', hi: 'लिप ग्लॉस', bho: 'लिप ग्लॉस', bn: 'লিপ গ্লস', ta: 'லிப் கிளாஸ்' }, unit: 'pcs', price: 250 },
    { id: 8228, categoryId: 82, name: { en: 'Tampons', hi: 'टैम्पोन', bho: 'टैम्पोन', bn: 'ট্যাম্পন', ta: 'டம்பான்கள்' }, unit: 'packet', price: 200 },
    { id: 8229, categoryId: 82, name: { en: 'Menstrual Cup', hi: 'मेंस्ट्रुअल कप', bho: 'मेंस्ट्रुअल कप', bn: 'মাসিক কাপ', ta: 'மாதவிடாய் கோப்பை' }, unit: 'pcs', price: 450 },
    { id: 8230, categoryId: 82, name: { en: 'Body Wash', hi: 'बॉडी वॉश', bho: 'बॉडी वॉश', bn: 'বডি ওয়াশ', ta: 'பாடி வாஷ்' }, unit: 'ltr', price: 280 },
    { id: 8231, categoryId: 82, name: { en: 'Soap (Women)', hi: 'साबुन (महिला)', bho: 'साबुन (मेहरारू)', bn: 'সাবান (মহিলা)', ta: 'சோப் (பெண்கள்)' }, unit: 'pcs', price: 45 },

    // 9: Household & Daily Use
    { id: 901, categoryId: 9, name: { en: 'Bucket', hi: 'बाल्टी', bho: 'बाल्टी', bn: 'বালতি', ta: 'வாளி' }, unit: 'pcs', price: 150 },
    { id: 902, categoryId: 9, name: { en: 'Mug', hi: 'मग', bho: 'मग', bn: 'মগ', ta: 'குவளை' }, unit: 'pcs', price: 50 },
    { id: 903, categoryId: 9, name: { en: 'Broom', hi: 'झाड़ू', bho: 'झाड़ू', bn: 'ঝাঁটা', ta: 'துடைப்பம்' }, unit: 'pcs', price: 80 },
    { id: 904, categoryId: 9, name: { en: 'Mop', hi: 'पोछा', bho: 'पोछा', bn: 'মোছা', ta: 'மாப்' }, unit: 'pcs', price: 200 },
    { id: 905, categoryId: 9, name: { en: 'Detergent Powder', hi: 'डिटर्जेंट पाउडर', bho: 'डिटर्जेंट', bn: 'ডিটারজেন্ট পাউডার', ta: 'சலவை தூள்' }, unit: 'kg', price: 100 },
    { id: 906, categoryId: 9, name: { en: 'Detergent Bar', hi: 'डिटर्जेंट बार', bho: 'डिटर्जेंट साबुन', bn: 'ডিটারজেন্ট বার', ta: 'சலவை சோப்' }, unit: 'pcs', price: 10 },
    { id: 907, categoryId: 9, name: { en: 'Floor Cleaner', hi: 'फिनाइल', bho: 'फिनाइल', bn: 'ফিনাইল', ta: 'தரை சுத்தம் செய்பவர்' }, unit: 'ltr', price: 90 },
    { id: 908, categoryId: 9, name: { en: 'Toilet Cleaner', hi: 'टॉयलेट क्लीनर', bho: 'टॉयलेट क्लीनर', bn: 'টয়লেট ক্লিনার', ta: 'கழிவறை சுத்தம் செய்பவர்' }, unit: 'ltr', price: 100 },
    { id: 909, categoryId: 9, name: { en: 'Garbage Bags', hi: 'डस्टबिन बैग', bho: 'डस्टबिन बैग', bn: 'ময়লার ব্যাগ', ta: 'குப்பை பைகள்' }, unit: 'packet', price: 50 },
    { id: 910, categoryId: 9, name: { en: 'Matchbox', hi: 'माचिस', bho: 'माचिस', bn: 'ম্যাচবক্স', ta: 'தீப்பெட்டி' }, unit: 'pcs', price: 1 },
    { id: 911, categoryId: 9, name: { en: 'Incense Sticks', hi: 'अगरबत्ती', bho: 'अगरबत्ती', bn: 'ধূপকাঠি', ta: 'ஊதுபத்தி' }, unit: 'packet', price: 30 },

    // 10: Electronics & Misc
    { id: 1001, categoryId: 10, name: { en: 'Charger', hi: 'चार्जर', bho: 'चार्जर', bn: 'চার্জার', ta: 'சார்ஜர்' }, unit: 'pcs', price: 300 },
    { id: 1002, categoryId: 10, name: { en: 'Bulb/LED', hi: 'बल्ब', bho: 'बल्ब', bn: 'বাল্ব', ta: 'பல்பு' }, unit: 'pcs', price: 100 },
    { id: 1003, categoryId: 10, name: { en: 'Torch', hi: 'टॉर्च', bho: 'टॉर्च', bn: 'টর্চ', ta: 'டார்ச்' }, unit: 'pcs', price: 150 },
    { id: 1004, categoryId: 10, name: { en: 'Battery', hi: 'बैटरी', bho: 'बैटरी', bn: 'ব্যাটারি', ta: 'பேட்டரி' }, unit: 'pcs', price: 20 },
    { id: 1005, categoryId: 10, name: { en: 'Extension Board', hi: 'एक्सटेंशन बोर्ड', bho: 'एक्सटेंशन बोर्ड', bn: 'এক্সটেনশন বোর্ড', ta: 'நீட்டிப்பு பலகை' }, unit: 'pcs', price: 250 },
    { id: 1006, categoryId: 10, name: { en: 'Fan', hi: 'पंखा', bho: 'पंखा', bn: 'ফ্যান', ta: 'விசிறி' }, unit: 'pcs', price: 1500 },
];
