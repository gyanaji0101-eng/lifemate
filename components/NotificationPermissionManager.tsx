import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Icons } from './Icons';

const NotificationPermissionManager: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;
    const { setNotificationPermission, t } = context;

    const handleAllow = async () => {
        if (!('Notification' in window)) {
            alert('This browser does not support desktop notification');
            setNotificationPermission('denied');
            return;
        }

        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
    };

    const handleDeny = () => {
        setNotificationPermission('denied');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 mb-4">
                    <Icons.Bell className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                    {t({ en: 'Enable Daily Notifications?', hi: 'दैनिक सूचनाएं सक्षम करें?', bho: 'रोज के सूचना चालू करीं?', bn: 'দৈনিক বিজ্ঞপ্তি সক্রিয় করবেন?', ta: 'தினசரி அறிவிப்புகளை இயக்குவா?' })}
                </h3>
                <p className="text-slate-600 mb-6">
                    {t({ en: 'Get daily alerts for horoscope, market rates, and health tips to start your day right!', hi: 'अपने दिन की सही शुरुआत करने के लिए राशिफल, बाजार भाव और स्वास्थ्य युक्तियों के लिए दैनिक अलर्ट प्राप्त करें!', bho: 'आपन दिन के सही शुरुआत करे खातिर राशिफल, बजार के भाव आ स्वास्थ्य के सुझाव खातिर रोज अलर्ट पाईं!', bn: 'আপনার দিনটি সঠিকভাবে শুরু করতে রাশিফল, বাজারের দর এবং স্বাস্থ্য টিপসের জন্য দৈনিক সতর্কতা পান!', ta: 'உங்கள் நாளை சரியாகத் தொடங்க ராசிபலன், சந்தை விகிதங்கள் மற்றும் சுகாதாரக் குறிப்புகளுக்கான தினசரி விழிப்பூட்டல்களைப் பெறுங்கள்!' })}
                </p>
                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleAllow}
                        className="w-full bg-teal-600 text-white font-semibold py-3 rounded-lg hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                        {t({ en: 'Yes, Allow Notifications', hi: 'हाँ, सूचनाओं की अनुमति दें', bho: 'हँ, सूचना के अनुमति दीं', bn: 'হ্যাঁ, বিজ্ঞপ্তির অনুমতি দিন', ta: 'ஆம், அறிவிப்புகளை அனுமதிக்கவும்' })}
                    </button>
                    <button
                        onClick={handleDeny}
                        className="w-full bg-slate-200 text-slate-800 font-semibold py-3 rounded-lg hover:bg-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
                    >
                        {t({ en: 'No, Thanks', hi: 'नहीं, धन्यवाद', bho: 'ना, धन्यवाद', bn: 'না, ধন্যবাদ', ta: 'இல்லை, நன்றி' })}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationPermissionManager;
