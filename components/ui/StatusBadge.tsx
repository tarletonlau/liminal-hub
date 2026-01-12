import React from 'react';

interface StatusBadgeProps {
  status: 'ONLINE' | 'MAINTENANCE' | 'OFFLINE';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles = {
    ONLINE: "bg-brutal-yellow text-brutal-black",
    MAINTENANCE: "bg-orange-400 text-brutal-black",
    OFFLINE: "bg-brutal-red text-white",
  };

  return (
    <div className={`
      inline-flex items-center gap-2 border-2 border-brutal-black px-2 py-0.5 text-xs font-mono font-bold
      ${styles[status]}
    `}>
      <div className={`w-2 h-2 rounded-full border border-brutal-black ${status === 'ONLINE' ? 'animate-pulse bg-green-500' : 'bg-black'}`} />
      {status}
    </div>
  );
};