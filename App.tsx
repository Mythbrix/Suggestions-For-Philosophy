import React, { useState, useEffect, useMemo } from 'react';
import { 
  Menu, Search, Moon, Sun, BookOpen, X, ChevronRight, ChevronDown,
  FileText, Bookmark, Layers, Star, AlertCircle, WifiOff 
} from 'lucide-react';
import { Subject, TabType, TabConfig } from './types';
import { MOCK_DB } from './database';

const SUBJECTS: Subject[] = [
  { id: '1', code: '241701', name: 'সমকালীন পাশ্চাত্য দর্শন' },
  { id: '2', code: '241703', name: 'মার্কসীয় দর্শন' },
  // ... বাকি সাবজেক্ট লিস্ট
];

const TABS: TabConfig[] = [
  { id: 'ka', label: 'ক-বিভাগ', fullLabel: 'অতি সংক্ষিপ্ত প্রশ্ন' },
  { id: 'kha', label: 'খ-বিভাগ', fullLabel: 'সংক্ষিপ্ত প্রশ্ন' },
  { id: 'ga', label: 'গ-বিভাগ', fullLabel: 'রচনামূলক প্রশ্ন' },
];

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('ka');
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const currentData = useMemo(() => {
    const data = MOCK_DB[selectedSubject.id]?.[activeTab] || [];
    if (!searchQuery.trim()) return data;
    const q = searchQuery.toLowerCase();
    return data.filter(item => 
      item.text.toLowerCase().includes(q) || (item.answer && item.answer.toLowerCase().includes(q))
    );
  }, [selectedSubject.id, activeTab, searchQuery]);

  return (
    <div className="min-h-screen transition-colors duration-300 dark:bg-gray-950 dark:text-gray-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-white/90 dark:bg-dark-900/90 backdrop-blur-md border-b dark:border-gray-800 flex items-center justify-between px-4">
        <button onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
        <div className="flex-1 mx-4 relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            className="w-full bg-gray-100 dark:bg-dark-800 rounded-full py-2 pl-10 pr-4 text-sm outline-none" 
            placeholder="সার্চ..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <button onClick={toggleTheme}>{darkMode ? <Sun className="text-yellow-400" /> : <Moon />}</button>
      </header>

      {/* Offline Alert */}
      {!isOnline && (
        <div className="fixed top-16 left-0 right-0 bg-orange-600 text-white text-[10px] py-1 text-center flex items-center justify-center gap-2 z-30">
          <WifiOff size={12} /> আপনি অফলাইনে আছেন
        </div>
      )}

      {/* Sidebar Overlay */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsSidebarOpen(false)} />}

      {/* Sidebar Menu */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-dark-900 z-[60] transform transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
         <div className="p-5 border-b dark:border-gray-800 flex justify-between items-center">
            <h2 className="font-bold text-lg">বিষয় তালিকা</h2>
            <button onClick={() => setIsSidebarOpen(false)}><X /></button>
         </div>
         <div className="p-4 space-y-2 overflow-y-auto h-[calc(100%-80px)]">
            {SUBJECTS.map(s => (
              <button 
                key={s.id} 
                onClick={() => { setSelectedSubject(s); setIsSidebarOpen(false); }}
                className={`w-full text-left p-3 rounded-xl transition-colors ${selectedSubject.id === s.id ? 'bg-primary-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                <div className="text-sm font-medium">{s.name}</div>
                <div className="text-[10px] opacity-70">Code: {s.code}</div>
              </button>
            ))}
         </div>
      </aside>

      {/* Main Content */}
      <main className="pt-24 pb-20 px-4 max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{selectedSubject.name}</h1>
          <p className="text-xs text-gray-500">{TABS.find(t => t.id === activeTab)?.fullLabel}</p>
        </div>

        <div className="space-y-4">
          {currentData.length > 0 ? currentData.map((item, idx) => (
            <div key={item.id} className="bg-white dark:bg-dark-800 p-4 rounded-2xl shadow-sm border dark:border-gray-700">
               <div className="flex gap-3" onClick={() => activeTab === 'ka' && setExpandedId(expandedId === item.id ? null : item.id)}>
                  <span className="text-primary-500 font-bold">{idx + 1}.</span>
                  <div className="flex-1 font-medium">{item.text}</div>
                  {activeTab === 'ka' && <ChevronDown className={expandedId === item.id ? 'rotate-180' : ''} />}
                  {item.probability && <span className="text-[10px] font-bold text-red-500">{item.probability}%</span>}
               </div>
               {expandedId === item.id && item.answer && (
                 <div className="mt-3 pl-7 text-sm text-gray-600 dark:text-gray-400 border-l-2 border-primary-500 italic">
                    {item.answer}
                 </div>
               )}
            </div>
          )) : <div className="text-center py-20 text-gray-500">কোনো তথ্য পাওয়া যায়নি</div>}
        </div>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-dark-900 border-t dark:border-gray-800 flex justify-around items-center">
        {TABS.map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 ${activeTab === tab.id ? 'text-primary-500' : 'text-gray-400'}`}
          >
            {tab.id === 'ka' ? <FileText size={20} /> : tab.id === 'kha' ? <Bookmark size={20} /> : <Layers size={20} />}
            <span className="text-[10px] font-bold">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
