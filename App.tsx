import React, { useState, useEffect, useMemo } from 'react';
import { 
  Menu, Search, Moon, Sun, BookOpen, X, ChevronRight, ChevronDown,
  FileText, Bookmark, Layers, Star, AlertCircle, Zap 
} from 'lucide-react';
import { Subject, TabType, TabConfig } from './types';
import { MOCK_DB } from './database';

const SUBJECTS: Subject[] = [
  { id: '1', code: '241701', name: 'সমকালীন পাশ্চাত্য দর্শন' },
  { id: '2', code: '241703', name: 'মার্কসীয় দর্শন' },
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

const sanitizeText = (text: string) => 
  text.replace(/#\S+|(\d+% কমন ইনশাআল্লাহ)/g, '').replace(/  +/g, ' ').trim();

// 💡 ম্যাজিক ফাংশন: অটো বোল্ড, প্যারাগ্রাফ গ্যাপ এবং জাস্টিফাই অ্যালাইনমেন্ট
const formatAnswerText = (text: string) => {
  return text.split('\n').map((line, idx) => {
    // যদি ফাঁকা লাইন হয় (এন্টার দেওয়া হয়), তবে স্পেস তৈরি করবে
    if (!line.trim()) return <div key={idx} className="h-3"></div>;
    
    // **টেক্সট** কে বোল্ড করার লজিক
    const parts = line.split(/(\*\*.*?\*\*)/g);
    
    return (
      <div key={idx} className="mb-2 leading-[1.8] text-justify text-[15px] md:text-base">
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={i} className="font-bold text-gray-900 dark:text-white">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </div>
    );
  });
};

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('ka');
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.onupdatefound = () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.onstatechange = () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                window.location.reload();
              }
            };
          }
        };
      });
    }
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
    return data.filter(i => 
      i.text.toLowerCase().includes(q) || 
      (i.answer && i.answer.toLowerCase().includes(q))
    );
  }, [selectedSubject.id, activeTab, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans antialiased">
      
      <header className="fixed top-0 inset-x-0 h-16 bg-white/90 dark:bg-dark-900/90 backdrop-blur-md border-b dark:border-gray-800 z-40 flex items-center justify-between px-4 shadow-sm">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <Menu size={24} />
        </button>

        <div className="flex-1 mx-4 max-w-md relative">
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          <input 
            type="text" 
            className="w-full bg-gray-100 dark:bg-dark-800 rounded-full py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            placeholder="সার্চ করুন..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <button onClick={toggleTheme} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          {darkMode ? <Sun size={24} className="text-yellow-400" /> : <Moon size={24} />}
        </button>
      </header>

      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-[50] backdrop-blur-sm transition-opacity" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-dark-900 z-[60] transform transition-transform duration-300 ease-in-out border-r dark:border-gray-800 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b dark:border-gray-800">
          <span className="font-bold text-xl text-primary-600">বিষয় তালিকা</span>
          <button onClick={() => setIsSidebarOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><X /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1 no-scrollbar">
          {SUBJECTS.map(s => (
            <button 
              key={s.id} 
              onClick={() => { setSelectedSubject(s); setIsSidebarOpen(false); setSearchQuery(''); setExpandedId(null); }}
              className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group ${selectedSubject.id === s.id ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <div>
                <div className="text-sm font-medium">{s.name}</div>
                <div className={`text-[10px] ${selectedSubject.id === s.id ? 'text-white/80' : 'text-gray-500'}`}>Code: {s.code}</div>
              </div>
              {selectedSubject.id === s.id && <ChevronRight size={16} />}
            </button>
          ))}
        </div>

        <div className="p-4 border-t dark:border-gray-800 flex flex-col items-center gap-1">
           <div className="flex items-center gap-2 text-primary-500">
              <Zap size={14} fill="currentColor" />
              <p className="text-sm font-bold">Powered By Mythbrix</p>
           </div>
        </div>
      </aside>

      <main className="pt-24 pb-24 px-4 max-w-3xl mx-auto min-h-screen">
        <div className="mb-8">
           <div className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 text-[10px] font-bold mb-2 uppercase tracking-wider">
             Subject Code: {selectedSubject.code}
           </div>
           <h1 className="text-2xl md:text-3xl font-bold leading-tight text-gray-900 dark:text-white">
             {selectedSubject.name}
           </h1>
           <p className="text-sm text-gray-500 mt-1 font-medium">
             {TABS.find(t => t.id === activeTab)?.fullLabel} • {currentData.length} টি প্রশ্ন
           </p>
        </div>

        <div className="space-y-4">
          {currentData.length > 0 ? currentData.map((item, idx) => {
            const isExpanded = expandedId === item.id;
            const hasAnswer = Boolean(item.answer);
            
            return (
              <div 
                key={item.id} 
                className={`bg-white dark:bg-dark-800 rounded-2xl p-4 shadow-sm border transition-all duration-300 ${isExpanded ? 'ring-2 ring-primary-500 border-transparent' : 'border-gray-100 dark:border-gray-700/50'}`}
              >
                <div 
                  className={`flex gap-4 ${hasAnswer ? 'cursor-pointer' : ''}`} 
                  onClick={() => hasAnswer && setExpandedId(isExpanded ? null : item.id)}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1 pt-1 font-medium text-lg leading-snug text-gray-800 dark:text-gray-100">
                    {sanitizeText(item.text)}
                  </div>
                  
                  {item.probability && (
                    <div className="mt-1 flex-shrink-0 flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 px-2 py-1 rounded-full h-fit">
                      <Star size={10} fill="currentColor" /> {item.probability}%
                    </div>
                  )}

                  {hasAnswer && (
                    <ChevronDown className={`mt-1.5 transition-transform duration-300 flex-shrink-0 ${isExpanded ? 'rotate-180 text-primary-500' : 'text-gray-400'}`} />
                  )}
                </div>

                {/* 💡 এখানে কাস্টম ফন্ট ক্লাস "font-answer" ব্যবহার করা হয়েছে */}
                {isExpanded && hasAnswer && (
                  <div className="mt-4 pl-12 animate-in fade-in slide-in-from-top-2">
                    <div className="p-4 md:p-5 bg-gray-50 dark:bg-gray-800/60 rounded-xl border-l-[3px] border-primary-500 text-gray-700 dark:text-gray-300 font-answer">
                       {formatAnswerText(sanitizeText(item.answer!))}
                    </div>
                  </div>
                )}
              </div>
            );
          }) : (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <AlertCircle size={48} className="mb-3 opacity-20" />
              <p className="font-medium">কোনো সাজেশন পাওয়া যায়নি</p>
            </div>
          )}
        </div>
      </main>

      <nav className="fixed bottom-0 inset-x-0 h-16 bg-white/95 dark:bg-dark-900/95 backdrop-blur-md border-t dark:border-gray-800 flex justify-around items-center z-40 pb-safe">
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button 
              key={tab.id} 
              onClick={() => { setActiveTab(tab.id); window.scrollTo({top: 0, behavior: 'smooth'}); setExpandedId(null); }} 
              className={`flex flex-col items-center gap-1 flex-1 transition-all ${isActive ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
            >
               <div className={`p-1 rounded-lg ${isActive ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}>
                 {tab.id === 'ka' ? <FileText size={20} /> : tab.id === 'kha' ? <Bookmark size={20} /> : <Layers size={20} />}
               </div>
               <span className="text-[10px] font-bold tracking-tight">{tab.label}</span>
               {isActive && <div className="w-1 h-1 bg-primary-500 rounded-full" />}
            </button>
          );
        })}
      </nav>

    </div>
  );
};

export default App;
