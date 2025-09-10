import React from 'react';
import { LANGUAGES } from '../constants';
import type { LanguageCode } from '../types';

interface LanguageSelectionScreenProps {
  onLanguageSelect: (lang: LanguageCode) => void;
}

const LanguageSelectionScreen: React.FC<LanguageSelectionScreenProps> = ({ onLanguageSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome!</h1>
        <p className="text-lg text-gray-600 mt-2">Please select your language</p>
      </div>
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {LANGUAGES.map(lang => (
          <button
            key={lang.code}
            onClick={() => onLanguageSelect(lang.code)}
            className="p-4 bg-white rounded-lg shadow-md text-lg font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelectionScreen;