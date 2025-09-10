import React, { useState, useContext, useEffect } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import type { View, ZodiacSign } from './types';
import LanguageSelectionScreen from './components/LanguageSelectionScreen';
import Dashboard from './components/Dashboard';
import ShoppingListsView from './components/ShoppingListsView';
import ShoppingListDetail from './components/ShoppingListDetail';
import MilkVendorsView from './components/MilkVendorsView';
import MilkLogDetailView from './components/MilkLogDetailView';
import MasterListView from './components/MasterListView';
import HoroscopeView from './components/HoroscopeView';
import HoroscopeDetailView from './components/HoroscopeDetailView';
import WeatherView from './components/WeatherView';
import JournalView from './components/JournalView';
import RemediesView from './components/RemediesView';
import BazaarRatesView from './components/BazaarRatesView';
import NotificationPermissionManager from './components/NotificationPermissionManager';
import AttendanceView from './components/AttendanceView';
import AttendanceHistoryView from './components/AttendanceHistoryView';
import CalculatorView from './components/CalculatorView';
import { ZODIAC_SIGNS } from './constants';

const AppContent: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;
    const { language, setLanguage, shoppingLists, milkVendorLists, notificationPermission, triggerDailyNotification } = context;

    const [view, setView] = useState<View>(language ? 'dashboard' : 'language');
    const [selectedListId, setSelectedListId] = useState<number | null>(null);
    const [selectedZodiacSignId, setSelectedZodiacSignId] = useState<string | null>(null);
    const [selectedMilkVendorId, setSelectedMilkVendorId] = useState<number | null>(null);
    
    useEffect(() => {
        if (language && view === 'language') {
            setView('dashboard');
        }
    }, [language, view]);

    useEffect(() => {
        // Trigger notification check when app is opened to dashboard
        if (view === 'dashboard') {
            triggerDailyNotification();
        }
    }, [view, triggerDailyNotification]);

    const handleLanguageSelect = (lang: 'en' | 'hi' | 'bho' | 'bn' | 'ta') => {
        setLanguage(lang);
        setView('dashboard');
    };

    const handleSelectList = (id: number) => {
        setSelectedListId(id);
        setView('listDetail');
    };
    
    const handleSelectZodiacSign = (id: string) => {
        setSelectedZodiacSignId(id);
        setView('horoscopeDetail');
    };
    
    const handleSelectMilkVendor = (id: number) => {
        setSelectedMilkVendorId(id);
        setView('milkLogDetail');
    };

    const selectedList = shoppingLists.find(l => l.id === selectedListId);
    const selectedZodiacSign = ZODIAC_SIGNS.find(s => s.id === selectedZodiacSignId);
    const selectedMilkVendor = milkVendorLists.find(v => v.id === selectedMilkVendorId);

    const renderContent = () => {
        switch (view) {
            case 'language':
                return <LanguageSelectionScreen onLanguageSelect={handleLanguageSelect} />;
            case 'dashboard':
                return <Dashboard onNavigate={setView} />;
            case 'lists':
                return <ShoppingListsView onSelectList={handleSelectList} onBack={() => setView('dashboard')} />;
            case 'listDetail':
                if (selectedList) {
                    return <ShoppingListDetail list={selectedList} onBack={() => { setView('lists'); setSelectedListId(null); }} />;
                }
                setView('lists');
                return null;
            case 'milk':
                return <MilkVendorsView onSelectVendor={handleSelectMilkVendor} onBack={() => setView('dashboard')} />;
            case 'milkLogDetail':
                if (selectedMilkVendor) {
                    return <MilkLogDetailView vendorList={selectedMilkVendor} onBack={() => { setView('milk'); setSelectedMilkVendorId(null); }} />;
                }
                setView('milk');
                return null;
            case 'masterList':
                return <MasterListView onBack={() => setView('dashboard')} />;
            case 'horoscope':
                return <HoroscopeView onSelectSign={handleSelectZodiacSign} onBack={() => setView('dashboard')} />;
            case 'horoscopeDetail':
                 if (selectedZodiacSign) {
                    return <HoroscopeDetailView sign={selectedZodiacSign} onBack={() => { setView('horoscope'); setSelectedZodiacSignId(null); }} />;
                }
                setView('horoscope');
                return null;
            case 'weather':
                return <WeatherView onBack={() => setView('dashboard')} />;
            case 'journal':
                return <JournalView onBack={() => setView('dashboard')} />;
            case 'remedies':
                return <RemediesView onBack={() => setView('dashboard')} />;
            case 'bazaarRates':
                return <BazaarRatesView onBack={() => setView('dashboard')} />;
            case 'attendance':
                return <AttendanceView onBack={() => setView('dashboard')} onNavigate={setView} />;
            case 'attendanceHistory':
                return <AttendanceHistoryView onBack={() => setView('attendance')} />;
            case 'calculator':
                return <CalculatorView onBack={() => setView('dashboard')} />;
            default:
                return <Dashboard onNavigate={setView} />;
        }
    };

    return (
        <div className="container mx-auto p-4 pb-20">
            {notificationPermission === 'default' && view !== 'language' && <NotificationPermissionManager />}
            {renderContent()}
        </div>
    );
};

const App: React.FC = () => (
    <AppProvider>
        <AppContent />
    </AppProvider>
);

export default App;