import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ZODIAC_SIGNS } from '../constants';
import { Icons } from './Icons';

interface HoroscopeViewProps {
  onSelectSign: (id: string) => void;
  onBack: () => void;
}

const HoroscopeView: React.FC<HoroscopeViewProps> = ({ onSelectSign, onBack }) => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { t } = context;

  const signSymbols: { [key: string]: string } = {
    aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋', leo: '♌', virgo: '♍',
    libra: '♎', scorpio: '♏', sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓'
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 mr-2 rounded-full hover:bg-slate-200 transition-colors">
          <Icons.ArrowLeft className="h-6 w-6 text-slate-700" />
        </button>
        <h2 className="text-2xl font-bold text-slate-800">{t({ en: "Choose Your Zodiac Sign", hi: "अपनी राशि चुनें", bho: "आपन राशि चुनीं", bn: "আপনার রাশিচক্র চয়ন করুন", ta: "உங்கள் ராசியைத் தேர்ந்தெடுக்கவும்" })}</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {ZODIAC_SIGNS.map(sign => (
          <button
            key={sign.id}
            onClick={() => onSelectSign(sign.id)}
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300 flex flex-col items-center justify-center text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <span className="text-5xl mb-2">{signSymbols[sign.id]}</span>
            <span className="font-semibold text-slate-700">{t(sign.name)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HoroscopeView;