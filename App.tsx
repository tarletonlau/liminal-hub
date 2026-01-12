import React, { useState, useEffect } from 'react';
import { LockKeyhole } from 'lucide-react';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import { INTERNAL_TOOLS, DEFAULT_MARQUEE_ITEMS } from './constants';
import { InternalTool, MarqueeItem } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  
  // Lifted state for tools so they can be edited in Admin mode
  const [tools, setTools] = useState<InternalTool[]>(INTERNAL_TOOLS);
  
  // Lifted state for marquee items
  const [marqueeItems, setMarqueeItems] = useState<MarqueeItem[]>(DEFAULT_MARQUEE_ITEMS);

  // Check for existing session (mocked)
  useEffect(() => {
    const session = localStorage.getItem('hub_auth_token');
    if (session) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem('hub_auth_token', 'mock_token_xyz_123');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('hub_auth_token');
    setIsAuthenticated(false);
    setIsAdminMode(false);
  };

  // CRUD Operations - Tools
  const handleUpdateTool = (updatedTool: InternalTool) => {
    setTools(prev => prev.map(t => t.id === updatedTool.id ? updatedTool : t));
  };

  const handleAddTool = (newTool: InternalTool) => {
    setTools(prev => [newTool, ...prev]);
  };

  const handleDeleteTool = (toolId: string) => {
    setTools(prev => prev.filter(t => t.id !== toolId));
  };

  // CRUD Operations - Marquee
  const handleUpdateMarqueeItems = (newItems: MarqueeItem[]) => {
    setMarqueeItems(newItems);
  };

  return (
    <>
      {isAuthenticated ? (
        <>
          {isAdminMode ? (
            <AdminDashboard 
              tools={tools}
              marqueeItems={marqueeItems}
              onUpdateTool={handleUpdateTool}
              onAddTool={handleAddTool}
              onDeleteTool={handleDeleteTool}
              onUpdateMarqueeItems={handleUpdateMarqueeItems}
              onExitAdmin={() => setIsAdminMode(false)}
            />
          ) : (
            <>
              <Dashboard 
                tools={tools} 
                marqueeItems={marqueeItems}
                onLogout={handleLogout} 
              />
              
              {/* Temp Admin Toggle for Demo */}
              <button
                onClick={() => setIsAdminMode(true)}
                className="fixed bottom-6 right-6 z-50 bg-brutal-black text-white p-3 border-2 border-white shadow-hard hover:bg-brutal-red transition-all"
                title="Toggle Admin Console"
              >
                <LockKeyhole className="w-6 h-6" />
              </button>
            </>
          )}
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  );
};

export default App;