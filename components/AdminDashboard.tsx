import React, { useState } from 'react';
import { InternalTool, AppCategory, MarqueeItem } from '../types';
import { BrutalButton } from './ui/BrutalButton';
import { BrutalInput, BrutalTextArea } from './ui/BrutalInput';
import { BrutalSelect } from './ui/BrutalSelect';
import { StatusBadge } from './ui/StatusBadge';
import { 
  Cloud, Database, Users, BarChart3, ShieldAlert, GitBranch, 
  MessageSquare, FileText, Server, Terminal, Plus, Trash2, Save, X, Settings,
  Megaphone, LayoutGrid, CheckSquare
} from 'lucide-react';

// Icon mapping for selection
const ICON_MAP: Record<string, any> = {
  Cloud, Database, Users, BarChart3, ShieldAlert, GitBranch, 
  MessageSquare, FileText, Server, Terminal
};

interface AdminDashboardProps {
  tools: InternalTool[];
  marqueeItems: MarqueeItem[];
  onUpdateTool: (tool: InternalTool) => void;
  onAddTool: (tool: InternalTool) => void;
  onDeleteTool: (id: string) => void;
  onUpdateMarqueeItems: (items: MarqueeItem[]) => void;
  onExitAdmin: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  tools, 
  marqueeItems,
  onUpdateTool, 
  onAddTool, 
  onDeleteTool,
  onUpdateMarqueeItems,
  onExitAdmin 
}) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'TOOLS' | 'ALERTS'>('TOOLS');

  // Tool State
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [isCreatingTool, setIsCreatingTool] = useState(false);
  const [toolFormData, setToolFormData] = useState<Partial<InternalTool>>({});

  // Marquee State
  const [selectedMarqueeId, setSelectedMarqueeId] = useState<string | null>(null);
  const [isCreatingMarquee, setIsCreatingMarquee] = useState(false);
  const [marqueeFormData, setMarqueeFormData] = useState<Partial<MarqueeItem>>({});

  // --- TOOL HANDLERS ---
  const handleSelectTool = (tool: InternalTool) => {
    setSelectedToolId(tool.id);
    setToolFormData(tool);
    setIsCreatingTool(false);
  };

  const handleCreateNewTool = () => {
    setSelectedToolId(null);
    setIsCreatingTool(true);
    setToolFormData({
      id: `tool_${Date.now()}`,
      name: '',
      description: '',
      url: 'https://',
      category: AppCategory.DEV_TOOLS,
      status: 'OFFLINE',
      accessLevel: ['ADMIN'],
      icon: Terminal
    });
  };

  const handleSaveTool = () => {
    if (!toolFormData.name || !toolFormData.id) return;
    
    const toolToSave = {
        ...toolFormData,
        icon: toolFormData.icon || Terminal
    } as InternalTool;

    if (isCreatingTool) {
      onAddTool(toolToSave);
    } else {
      onUpdateTool(toolToSave);
    }
    
    setIsCreatingTool(false);
    setSelectedToolId(toolToSave.id);
  };

  const handleDeleteTool = () => {
    if (selectedToolId) {
      onDeleteTool(selectedToolId);
      setSelectedToolId(null);
      setToolFormData({});
    }
  };

  // --- MARQUEE HANDLERS ---
  const handleSelectMarquee = (item: MarqueeItem) => {
    setSelectedMarqueeId(item.id);
    setMarqueeFormData(item);
    setIsCreatingMarquee(false);
  };

  const handleCreateNewMarquee = () => {
    setSelectedMarqueeId(null);
    setIsCreatingMarquee(true);
    setMarqueeFormData({
      id: `mq_${Date.now()}`,
      text: '',
      highlight: false,
      color: 'bg-brutal-black text-white'
    });
  };

  const handleSaveMarquee = () => {
    if (!marqueeFormData.text) return;

    const itemToSave = { ...marqueeFormData } as MarqueeItem;
    
    let newItems = [...marqueeItems];
    if (isCreatingMarquee) {
      newItems.unshift(itemToSave); // Add to top
    } else {
      newItems = newItems.map(item => item.id === itemToSave.id ? itemToSave : item);
    }

    onUpdateMarqueeItems(newItems);
    setIsCreatingMarquee(false);
    setSelectedMarqueeId(itemToSave.id);
  };

  const handleDeleteMarquee = () => {
    if (selectedMarqueeId) {
      const newItems = marqueeItems.filter(item => item.id !== selectedMarqueeId);
      onUpdateMarqueeItems(newItems);
      setSelectedMarqueeId(null);
      setMarqueeFormData({});
    }
  };

  return (
    <div className="min-h-screen bg-[#e5e5e5] flex flex-col font-sans text-brutal-black">
      {/* Background Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-5 z-0" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-brutal-black text-white border-b-4 border-white flex justify-between items-center h-16 px-6 shadow-hard">
        <div className="flex items-center gap-4">
            <div className="bg-brutal-red px-2 py-1 font-mono font-bold text-xs animate-pulse text-white">ADMIN_MODE_ACTIVE</div>
            <h1 className="font-black text-xl tracking-wider">SYSTEM // CONSOLE</h1>
        </div>
        <div className="flex gap-4">
            <button 
                onClick={onExitAdmin}
                className="font-mono text-sm hover:text-brutal-yellow underline decoration-2 underline-offset-4"
            >
                EXIT_CONSOLE
            </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10">
        
        {/* LEFT PANEL: DATA GRID */}
        <div className="flex-1 flex flex-col border-r-4 border-brutal-black bg-white/50 backdrop-blur-sm overflow-hidden">
            {/* View Switcher Header */}
            <div className="p-4 border-b-4 border-brutal-black bg-white flex justify-between items-center">
                <div className="flex gap-1 border-2 border-brutal-black p-1 bg-gray-100">
                    <button 
                        onClick={() => setActiveTab('TOOLS')}
                        className={`px-4 py-1 font-mono font-bold text-xs uppercase transition-all ${activeTab === 'TOOLS' ? 'bg-brutal-black text-white shadow-hard-sm' : 'hover:bg-gray-200'}`}
                    >
                        TOOLS ({tools.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('ALERTS')}
                        className={`px-4 py-1 font-mono font-bold text-xs uppercase transition-all ${activeTab === 'ALERTS' ? 'bg-brutal-black text-white shadow-hard-sm' : 'hover:bg-gray-200'}`}
                    >
                        ALERTS ({marqueeItems.length})
                    </button>
                </div>
                
                <BrutalButton 
                    onClick={activeTab === 'TOOLS' ? handleCreateNewTool : handleCreateNewMarquee} 
                    variant="primary" 
                    className="py-2 px-4 text-xs"
                >
                    <Plus className="w-4 h-4 mr-2" /> NEW ENTRY
                </BrutalButton>
            </div>
            
            {/* Content List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {activeTab === 'TOOLS' ? (
                    tools.map(tool => (
                        <div 
                            key={tool.id}
                            onClick={() => handleSelectTool(tool)}
                            className={`
                                border-2 p-3 cursor-pointer transition-all flex items-center gap-4 group
                                ${selectedToolId === tool.id 
                                    ? 'bg-brutal-black text-white border-brutal-black shadow-hard-sm translate-x-1' 
                                    : 'bg-white border-brutal-black hover:bg-yellow-50 hover:shadow-hard-sm'}
                            `}
                        >
                            <div className={`
                                w-8 h-8 flex items-center justify-center border-2 
                                ${selectedToolId === tool.id ? 'border-white bg-white text-black' : 'border-brutal-black bg-gray-100'}
                            `}>
                                {React.createElement(tool.icon || Terminal, { size: 16 })}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-bold font-mono text-sm truncate">{tool.name}</div>
                                <div className="text-xs opacity-60 truncate font-mono">{tool.id}</div>
                            </div>
                            <StatusBadge status={tool.status} />
                        </div>
                    ))
                ) : (
                    marqueeItems.map(item => (
                        <div 
                            key={item.id}
                            onClick={() => handleSelectMarquee(item)}
                            className={`
                                border-2 p-3 cursor-pointer transition-all flex items-center gap-4 group
                                ${selectedMarqueeId === item.id 
                                    ? 'bg-brutal-black text-white border-brutal-black shadow-hard-sm translate-x-1' 
                                    : 'bg-white border-brutal-black hover:bg-yellow-50 hover:shadow-hard-sm'}
                            `}
                        >
                             <div className={`
                                w-8 h-8 flex items-center justify-center border-2 shrink-0
                                ${selectedMarqueeId === item.id ? 'border-white bg-white text-black' : 'border-brutal-black bg-gray-100'}
                            `}>
                                <Megaphone size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-bold font-mono text-sm truncate uppercase">{item.text}</div>
                            </div>
                            {item.highlight && <div className="w-3 h-3 rounded-full bg-brutal-red animate-pulse border border-white" />}
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* RIGHT PANEL: INSPECTOR */}
        <div className="w-full lg:w-[450px] bg-white border-l-0 lg:border-l-4 border-brutal-black flex flex-col overflow-y-auto">
            {activeTab === 'TOOLS' ? (
                // --- TOOL EDITOR ---
                (selectedToolId || isCreatingTool) ? (
                    <>
                        <div className="p-6 border-b-4 border-brutal-black bg-yellow-50">
                            <h2 className="font-black text-2xl uppercase mb-1">
                                {isCreatingTool ? 'CREATE NEW NODE' : 'EDIT NODE CONFIG'}
                            </h2>
                            <div className="font-mono text-xs opacity-50 truncate">
                                ID: {toolFormData.id}
                            </div>
                        </div>

                        <div className="p-6 space-y-6 flex-1">
                            <BrutalInput 
                                label="Application Name" 
                                value={toolFormData.name || ''} 
                                onChange={e => setToolFormData({...toolFormData, name: e.target.value})}
                            />
                            
                            <BrutalTextArea 
                                label="Description" 
                                value={toolFormData.description || ''} 
                                onChange={e => setToolFormData({...toolFormData, description: e.target.value})}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <BrutalSelect 
                                    label="Category"
                                    value={toolFormData.category}
                                    onChange={e => setToolFormData({...toolFormData, category: e.target.value as AppCategory})}
                                    options={Object.values(AppCategory).map(c => ({ value: c, label: c }))}
                                />
                                <BrutalSelect 
                                    label="Status"
                                    value={toolFormData.status}
                                    onChange={e => setToolFormData({...toolFormData, status: e.target.value as any})}
                                    options={[
                                        { value: 'ONLINE', label: 'ONLINE' },
                                        { value: 'MAINTENANCE', label: 'MAINTENANCE' },
                                        { value: 'OFFLINE', label: 'OFFLINE' },
                                    ]}
                                />
                            </div>

                            <BrutalInput 
                                label="Target URL" 
                                value={toolFormData.url || ''} 
                                onChange={e => setToolFormData({...toolFormData, url: e.target.value})}
                            />

                            <div className="flex flex-col gap-1">
                                <label className="font-mono text-xs font-bold uppercase tracking-wider opacity-70">Icon</label>
                                <div className="grid grid-cols-5 gap-2 border-2 border-brutal-black p-2 bg-gray-50">
                                    {Object.keys(ICON_MAP).map(iconName => {
                                        const Ico = ICON_MAP[iconName];
                                        const isSelected = toolFormData.icon === Ico; 
                                        return (
                                            <button
                                                key={iconName}
                                                onClick={() => setToolFormData({...toolFormData, icon: Ico})}
                                                className={`
                                                    p-2 flex items-center justify-center border-2 transition-all
                                                    ${isSelected 
                                                        ? 'bg-brutal-black text-white border-brutal-black' 
                                                        : 'bg-white border-transparent hover:border-gray-300'}
                                                `}
                                                title={iconName}
                                            >
                                                <Ico size={20} />
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t-4 border-brutal-black bg-gray-50 flex gap-4">
                            <BrutalButton variant="primary" fullWidth onClick={handleSaveTool}>
                                <Save className="w-4 h-4 mr-2" /> SAVE CHANGES
                            </BrutalButton>
                            {!isCreatingTool && (
                                <button 
                                    onClick={handleDeleteTool}
                                    className="px-4 border-2 border-brutal-black bg-white hover:bg-brutal-red hover:text-white transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                        <Settings className="w-16 h-16 mb-4 opacity-20" />
                        <p className="font-mono text-sm uppercase">Select a tool record from the grid to inspect or modify configuration.</p>
                    </div>
                )
            ) : (
                // --- MARQUEE EDITOR ---
                (selectedMarqueeId || isCreatingMarquee) ? (
                    <>
                        <div className="p-6 border-b-4 border-brutal-black bg-yellow-50">
                            <h2 className="font-black text-2xl uppercase mb-1">
                                {isCreatingMarquee ? 'BROADCAST ALERT' : 'EDIT ALERT'}
                            </h2>
                            <div className="font-mono text-xs opacity-50 truncate">
                                ID: {marqueeFormData.id}
                            </div>
                        </div>

                        <div className="p-6 space-y-6 flex-1">
                            <BrutalTextArea 
                                label="Announcement Text" 
                                value={marqueeFormData.text || ''} 
                                onChange={e => setMarqueeFormData({...marqueeFormData, text: e.target.value.toUpperCase()})}
                                className="text-xl font-bold uppercase"
                            />

                            <div className="flex items-center gap-4 border-2 border-brutal-black p-4 bg-gray-50">
                                <div 
                                    onClick={() => setMarqueeFormData({...marqueeFormData, highlight: !marqueeFormData.highlight})}
                                    className={`w-6 h-6 border-2 border-brutal-black flex items-center justify-center cursor-pointer ${marqueeFormData.highlight ? 'bg-brutal-black text-white' : 'bg-white'}`}
                                >
                                    {marqueeFormData.highlight && <CheckSquare size={16} />}
                                </div>
                                <label className="font-mono font-bold uppercase cursor-pointer select-none" onClick={() => setMarqueeFormData({...marqueeFormData, highlight: !marqueeFormData.highlight})}>
                                    Enable Highlight Color
                                </label>
                            </div>

                            {marqueeFormData.highlight && (
                                <BrutalSelect 
                                    label="Highlight Color"
                                    value={marqueeFormData.color}
                                    onChange={e => setMarqueeFormData({...marqueeFormData, color: e.target.value as any})}
                                    options={[
                                        { value: 'bg-brutal-black text-white', label: 'PITCH BLACK (NOTICE)' },
                                        { value: 'bg-brutal-red text-white', label: 'CRITICAL RED (ALERT)' },
                                        { value: 'bg-brutal-yellow text-black', label: 'NEON YELLOW (INFO)' },
                                    ]}
                                />
                            )}

                            {/* Preview */}
                            <div className="mt-8">
                                <label className="font-mono text-xs font-bold uppercase tracking-wider opacity-70 mb-2 block">Preview</label>
                                <div className="border-2 border-brutal-black p-4 bg-white flex justify-center">
                                    <span className={`px-2 font-bold font-mono ${marqueeFormData.highlight ? marqueeFormData.color : ''}`}>
                                        {marqueeFormData.text || 'YOUR TEXT HERE'}
                                    </span>
                                </div>
                            </div>
                        </div>

                         <div className="p-6 border-t-4 border-brutal-black bg-gray-50 flex gap-4">
                            <BrutalButton variant="primary" fullWidth onClick={handleSaveMarquee}>
                                <Megaphone className="w-4 h-4 mr-2" /> PUBLISH ALERT
                            </BrutalButton>
                            {!isCreatingMarquee && (
                                <button 
                                    onClick={handleDeleteMarquee}
                                    className="px-4 border-2 border-brutal-black bg-white hover:bg-brutal-red hover:text-white transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                        <Megaphone className="w-16 h-16 mb-4 opacity-20" />
                        <p className="font-mono text-sm uppercase">Select an alert to edit or create a new broadcast.</p>
                    </div>
                )
            )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;