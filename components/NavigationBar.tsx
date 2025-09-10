import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Icons } from './Icons';
import type { View, Translations } from '../types';

interface NavigationBarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

interface NavItem {
  view: View;
  icon: JSX.Element;
  label: Translations;
  badge?: number;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ activeView, setActiveView }) => {
  const context = useContext(AppContext);
  if (!context) return null;
  // FIX: Removed cartItems as it does not exist on AppContextType anymore.
  const { t } = context;
  
  // FIX: Updated navItems to reflect available views and icons.
  const navItems: NavItem[] = [
    { view: 'dashboard', icon: <Icons.Home className="h-6 w-6" />, label: { en: 'Dashboard', hi: 'डैशबोर्ड', bho: 'डैशबोर्ड', bn: 'ড্যাশবোর্ড', ta: 'டாஷ்போர்டு' } },
    { view: 'lists', icon: <Icons.List className="h-6 w-6" />, label: { en: 'Lists', hi: 'सूचियाँ', bho: 'लिस्ट', bn: 'তালিকা', ta: 'பட்டியல்கள்' } },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_5px_rgba(0,0,0,0.1)] z-10">
      <div className="container mx-auto px-4 flex justify-around">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setActiveView(item.view)}
            className={`flex flex-col items-center justify-center w-full py-2 text-sm transition-colors duration-200 ${
              activeView === item.view ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'
            }`}
          >
            <div className="relative">
              {item.icon}
              {item.badge ? (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <span>{t(item.label)}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default NavigationBar;
