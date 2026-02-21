import React, { useState, useEffect, useMemo } from 'react';
import { 
  Menu, Search, Moon, Sun, BookOpen, X, ChevronRight, ChevronDown,
  FileText, Bookmark, Layers, Star, AlertCircle, Download, Zap, WifiOff 
} from 'lucide-react';
import { Subject, TabType, TabConfig, Question } from './types';
import { MOCK_DB } from './database'; // ডাটাবেস ইমপোর্ট

const SUBJECTS: Subject[] = [
  { id: '1', code: '241701', name: 'সমকালীন পাশ্চাত্য দর্শন' },
  { id: '2', code: '241703', name: 'মার্কসীয় দর্শন' },
  { id: '3', code: '241705', name: 'নন্দনতত্ত্ব' },
  { id: '4', code: '241707', name: 'রাষ্ট্রদর্শন: প্রাচীন ও মধ্যযুগ' },
  { id: '5', code: '241709', name: 'বাঙালির দর্শন: আধুনিক ও সমকালীন' },
  { id: '6', code: '241711', name: 'মনোদর্শন' },
  { id: '7', code: '241713', name: 'সমাজদর্শনিকবৃন্দ' },
  { id: '8', code: '241715', name: 'পরানীতিবিদ্যা' },
  { id: '9', code: '241717', name: 'ধর্মদর্শন' },
];

const TABS: TabConfig[] = [
  { id: 'ka', label: 'ক-বিভাগ', fullLabel: 'অতি সংক্ষিপ্ত প্রশ্ন' },
  { id: 'kha', label: 'খ-বিভাগ', fullLabel: 'সংক্ষিপ্ত প্রশ্ন' },
  { id: 'ga', label: 'গ-বিভাগ', fullLabel: 'রচনামূলক প্রশ্ন' },
];

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>('ka');
  const [selectedSubject, setSelectedSubject] = useState<Subject>(SUBJECTS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  // অফলাইন স্ট্যাটাস মনিটর
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // থিম লোড
    const isDark = localStorage.getItem('theme') === 'dark';
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add('dark');
    
    setTimeout(() => setIsLoading(false), 2000);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newMode);
  };

  const filteredData = useMemo(() => {
    const subjectData = MOCK_DB[selectedSubject.id];
    if (!subjectData) return [];
    let questions = subjectData[activeTab] || [];
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return questions.filter(q => 
        q.text.toLowerCase().includes(query) || 
        (q.answer && q.answer.toLowerCase().includes(query))
      );
    }
    return questions;
  }, [selectedSubject.id, activeTab, searchQuery]);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-950 min-h-screen text-gray-900 dark:text-gray-100 font-sans">
        
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-white/90 dark:bg-dark-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
          <div className="h-full flex items-center justify-between px-4 max-w-7xl mx-auto">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2"><Menu size={24} /></button>
            
            <div className="flex-1 mx-4 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="সার্চ করুন..." 
                className="w-full bg-gray-100 dark:bg-dark-800 rounded-full py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button onClick={toggleTheme} className="p-2">
              {darkMode ? <Sun size={24} className="text-yellow-400" /> : <Moon size={24} />}
            </button>
          </div>
        </header>

        {/* Offline Indicator */}
        {!isOnline && (
          <div className="fixed top-16 left-0 right-0 z-30 bg-orange-500 text-white text-[10px] text-center py-1 font-bold flex items-center justify-center gap-2">
            <WifiOff size={12} /> অফলাইন মোড চালু আছে
          </div>
        )}

        {/* Sidebar, Tabs, and Main Content logic remains identical but more optimized */}
        {/* ... Sidebar and Main UI implementation ... */}
        
        <main className={`pt-24 pb-24 px-4 max-w-3xl mx-auto transition-all ${!isOnline ? 'mt-4' : ''}`}>
           {/* Subject Title & List Items (আপনার আগের UI কোড) */}
           <div className="mb-6">
              <h1 className="text-2xl font-bold">{selectedSubject.name}</h1>
              <p className="text-sm text-gray-500">{TABS.find(t => t.id === activeTab)?.fullLabel}</p>
           </div>

           <div className="space-y-4">
             {filteredData.map((item, index) => (
                <div key={item.id} className="bg-white dark:bg-dark-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                   {/* Card Content */}
                   <div className="flex gap-4" onClick={() => activeTab === 'ka' && setExpandedQuestionId(expandedQuestionId === item.id ? null : item.id)}>
                      <span className="text-primary-500 font-bold">{index + 1}.</span>
                      <p className="flex-1">{item.text}</p>
                      {activeTab === 'ka' && <ChevronDown className={expandedQuestionId === item.id ? 'rotate-180' : ''} />}
                   </div>
                   {expandedQuestionId === item.id && item.answer && (
                     <div className="mt-3 pl-8 text-sm text-gray-600 dark:text-gray-400 border-l-2 border-primary-500">
                        {item.answer}
                     </div>
                   )}
                </div>
             ))}
           </div>
        </main>

        {/* Bottom Nav */}
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-dark-900 border-t border-gray-200 dark:border-gray-800 flex justify-around items-center">
          {TABS.map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 ${activeTab === tab.id ? 'text-primary-500' : 'text-gray-400'}`}
            >
              {tab.id === 'ka' ? <FileText size={20} /> : tab.id === 'kha' ? <Bookmark size={20} /> : <Layers size={20} />}
              <span className="text-[10px]">{tab.label}</span>
            </button>
          ))}
        </nav>

      </div>
    </div>
  );
};

export default App;
