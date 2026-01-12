import React, { useState, useMemo } from 'react';
import { LogOut, Search, Command, LayoutGrid, List } from 'lucide-react';
import { MOCK_USER } from '../constants';
import { InternalTool, AppCategory, MarqueeItem } from '../types';
import { BrutalButton } from './ui/BrutalButton';
import { StatusBadge } from './ui/StatusBadge';

interface DashboardProps {
  tools: InternalTool[];
  marqueeItems: MarqueeItem[];
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tools, marqueeItems, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AppCategory | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');

  // Filter Logic
  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'ALL' || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [tools, searchQuery, selectedCategory]);

  const categories = ['ALL', ...Object.values(AppCategory)];

  const MarqueeGroup = () => (
    <>
      {marqueeItems.map((item) => (
        <span key={item.id} className="inline-flex items-center">
          <span className={`mx-4 px-2 ${item.highlight ? item.color : ''}`}>
            {item.text}
          </span>
          <span className="text-brutal-black/20 font-black mx-2">//</span>
        </span>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-brutal-bg flex flex-col font-sans text-brutal-black selection:bg-brutal-yellow selection:text-black">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-brutal-bg border-b-4 border-brutal-black">
        <div className="flex justify-between items-stretch h-20">
          
          {/* Logo Area */}
          <div className="flex items-center px-6 border-r-4 border-brutal-black bg-brutal-black text-white min-w-[200px] justify-center">
            <h1 className="text-3xl font-black tracking-tighter">HUB<span className="text-brutal-yellow">//</span>INT</h1>
          </div>

          {/* Marquee / Status Area */}
          <div className="flex-1 flex items-center overflow-hidden bg-white relative hidden md:flex border-r-4 border-brutal-black">
             <div className="marquee-container w-full">
                <div className="marquee-content font-mono font-bold text-sm tracking-widest uppercase flex items-center py-2">
                  <MarqueeGroup />
                  <MarqueeGroup />
                  <MarqueeGroup />
                </div>
             </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center px-6 gap-4 bg-white hover:bg-brutal-yellow transition-colors cursor-default group">
            <div className="text-right hidden sm:block">
              <div className="font-black text-sm uppercase leading-none">{MOCK_USER.name}</div>
              <div className="font-mono text-xs opacity-60 mt-1">{MOCK_USER.role}_ID_{MOCK_USER.id.split('_')[1]}</div>
            </div>
            <div className="w-10 h-10 border-2 border-brutal-black bg-gray-200 group-hover:bg-white flex items-center justify-center font-bold text-xl">
              {MOCK_USER.name.charAt(0)}
            </div>
          </div>

          {/* Logout Action */}
          <button 
            onClick={onLogout}
            className="flex items-center justify-center w-20 border-l-4 border-brutal-black hover:bg-brutal-red hover:text-white transition-colors"
            title="Disconnect"
          >
            <LogOut strokeWidth={3} />
          </button>
        </div>
      </header>

      {/* SUB-HEADER / FILTERS */}
      <div className="border-b-4 border-brutal-black bg-white flex flex-col lg:flex-row">
        
        {/* Search */}
        <div className="flex-1 flex border-b-4 lg:border-b-0 lg:border-r-4 border-brutal-black">
          <div className="w-16 flex items-center justify-center border-r-4 border-brutal-black bg-brutal-bg">
            <Search className="w-6 h-6" />
          </div>
          <input 
            type="text" 
            placeholder="SEARCH_TOOLS..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-4 font-mono uppercase bg-white outline-none placeholder:text-gray-400 focus:bg-yellow-50"
          />
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as any)}
              className={`
                px-6 py-4 border-r-4 border-brutal-black font-mono font-bold uppercase whitespace-nowrap text-sm transition-all
                ${selectedCategory === cat 
                  ? 'bg-brutal-black text-brutal-yellow' 
                  : 'bg-white hover:bg-brutal-yellow/50'}
              `}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="hidden lg:flex border-l-0 lg:border-l-4 border-brutal-black ml-auto">
            <button 
                onClick={() => setViewMode('GRID')}
                className={`w-16 flex items-center justify-center border-r-4 border-brutal-black transition-colors ${viewMode === 'GRID' ? 'bg-brutal-black text-white' : 'hover:bg-gray-100'}`}
            >
                <LayoutGrid className="w-5 h-5" />
            </button>
            <button 
                onClick={() => setViewMode('LIST')}
                className={`w-16 flex items-center justify-center transition-colors ${viewMode === 'LIST' ? 'bg-brutal-black text-white' : 'hover:bg-gray-100'}`}
            >
                <List className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* MAIN GRID */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className={`relative z-10 grid gap-6 ${viewMode === 'GRID' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredTools.length > 0 ? (
            filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} viewMode={viewMode} />
            ))
          ) : (
            <div className="col-span-full py-20 border-4 border-dashed border-gray-400 flex flex-col items-center justify-center text-gray-400 font-mono">
              <Command className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-xl uppercase">No tools found matching query.</p>
              <button onClick={() => {setSearchQuery(''); setSelectedCategory('ALL');}} className="mt-4 border-b-2 border-gray-400 hover:text-black hover:border-black">RESET FILTERS</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const ToolCard: React.FC<{ tool: InternalTool, viewMode: 'GRID' | 'LIST' }> = ({ tool, viewMode }) => {
  const Icon = tool.icon;

  if (viewMode === 'LIST') {
      return (
        <div className="group bg-white border-4 border-brutal-black p-4 flex items-center gap-6 shadow-hard transition-all hover:-translate-y-1 hover:shadow-hard-lg hover:bg-yellow-50">
             <div className="w-12 h-12 bg-brutal-black text-white flex items-center justify-center border-2 border-brutal-black shrink-0">
                <Icon strokeWidth={2} className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-black text-xl uppercase tracking-tight truncate">{tool.name}</h3>
                    <StatusBadge status={tool.status} />
                </div>
                <p className="font-mono text-sm truncate opacity-70">{tool.description}</p>
            </div>
            <BrutalButton variant="outline" className="hidden md:flex shrink-0">
                LAUNCH
            </BrutalButton>
        </div>
      )
  }

  return (
    <div className="group flex flex-col bg-white border-4 border-brutal-black shadow-hard transition-all duration-100 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-hard-lg relative overflow-hidden">
      
      {/* Header */}
      <div className="p-6 border-b-4 border-brutal-black bg-white group-hover:bg-brutal-yellow transition-colors duration-100 flex justify-between items-start">
        <div className="w-14 h-14 bg-brutal-black text-white flex items-center justify-center border-2 border-transparent group-hover:border-brutal-black group-hover:bg-white group-hover:text-brutal-black transition-all">
          <Icon strokeWidth={2} className="w-7 h-7" />
        </div>
        <StatusBadge status={tool.status} />
      </div>

      {/* Body */}
      <div className="p-6 flex-1 flex flex-col justify-between gap-6 bg-white">
        <div>
          <h3 className="font-black text-3xl uppercase tracking-tighter mb-2 leading-8 group-hover:underline decoration-4 underline-offset-4 decoration-brutal-black">{tool.name}</h3>
          <p className="font-mono text-sm leading-relaxed opacity-80 border-l-2 border-gray-300 pl-3">
            {tool.description}
          </p>
        </div>

        <div className="space-y-4">
           {/* Meta Tags */}
           <div className="flex flex-wrap gap-2 font-mono text-xs uppercase font-bold text-gray-500">
                <span className="bg-gray-100 px-2 py-1">V.2.4.0</span>
                <span className="bg-gray-100 px-2 py-1">{tool.category.replace('_', ' ')}</span>
           </div>
           
           <BrutalButton fullWidth withIcon onClick={() => window.open(tool.url, '_blank')}>
            ACCESS TOOL
           </BrutalButton>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;