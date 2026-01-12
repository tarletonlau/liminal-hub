import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldCheck, Fingerprint } from 'lucide-react';
import { BrutalButton } from './ui/BrutalButton';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = () => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-brutal-bg flex flex-col md:flex-row font-sans text-brutal-black">
      
      {/* Left Panel: Branding */}
      <div className="w-full md:w-1/2 bg-brutal-black text-white flex flex-col justify-between p-8 md:p-16 border-r-4 border-brutal-black relative overflow-hidden">
        
        {/* Abstract Pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="w-full h-full" style={{ 
                backgroundImage: 'linear-gradient(#444 2px, transparent 2px), linear-gradient(90deg, #444 2px, transparent 2px)',
                backgroundSize: '40px 40px'
            }}></div>
        </div>

        <div className="z-10">
          <div className="w-16 h-16 bg-white text-brutal-black flex items-center justify-center mb-8 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
            <ShieldCheck className="w-8 h-8" strokeWidth={3} />
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-6">
            INTERNAL<br/>
            TOOLS<br/>
            HUB<span className="text-brutal-yellow">.</span>
          </h1>
          <p className="font-mono text-lg opacity-70 max-w-md border-l-2 border-brutal-yellow pl-4">
            Restricted access environment. All activities are monitored and logged. 
          </p>
        </div>

        <div className="mt-12 md:mt-0 font-mono text-xs uppercase z-10 flex gap-8">
            <div>
                <span className="block text-gray-500 mb-1">Secure Connection</span>
                <span className="text-green-400 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    ENCRYPTED
                </span>
            </div>
            <div>
                <span className="block text-gray-500 mb-1">System Status</span>
                <span className="text-white">OPERATIONAL</span>
            </div>
        </div>
      </div>

      {/* Right Panel: Auth Form */}
      <div className="w-full md:w-1/2 bg-brutal-bg flex items-center justify-center p-8 relative">
        {/* Corner Decors */}
        <div className="absolute top-8 left-8 w-4 h-4 border-t-4 border-l-4 border-brutal-black"></div>
        <div className="absolute bottom-8 right-8 w-4 h-4 border-b-4 border-r-4 border-brutal-black"></div>

        <div className="w-full max-w-md space-y-8">
            
            <div className="text-center md:text-left">
                <h2 className="text-3xl font-black uppercase mb-2 flex items-center gap-2 md:justify-start justify-center">
                    <Fingerprint className="w-8 h-8" />
                    Identity Verify
                </h2>
                <p className="font-mono text-sm opacity-60">Please authenticate using your corporate SSO credentials.</p>
            </div>

            <div className="bg-white border-4 border-brutal-black p-8 shadow-hard relative">
                {/* Decorative tape */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-200 border-2 border-brutal-black px-4 py-1 font-mono text-xs font-bold -rotate-2">
                    CONFIDENTIAL
                </div>

                <div className="space-y-6 mt-4">
                    <div className="space-y-2">
                        <label className="font-mono font-bold text-sm uppercase">Provider</label>
                        <div className="flex items-center justify-between p-4 border-2 border-brutal-black bg-gray-50 opacity-60 cursor-not-allowed">
                            <span className="font-bold">CLERK_SSO_V2</span>
                            <Lock className="w-4 h-4" />
                        </div>
                    </div>
                    
                    <div className="pt-4">
                        <BrutalButton 
                            fullWidth 
                            onClick={handleAuth} 
                            disabled={isLoading}
                            className={isLoading ? 'opacity-80 cursor-wait' : ''}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    VERIFYING <span className="animate-ping w-2 h-2 bg-brutal-yellow rounded-full"></span>
                                </span>
                            ) : (
                                "AUTHENTICATE ACCESS"
                            )}
                        </BrutalButton>
                    </div>

                    <div className="text-center">
                        <p className="font-mono text-xs text-gray-500">
                            By accessing this system you agree to the 
                            <a href="#" className="underline decoration-2 underline-offset-2 hover:bg-black hover:text-white ml-1">IT Policy</a>.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-between font-mono text-xs font-bold opacity-40">
                <span>ID: {Math.floor(Math.random() * 100000)}</span>
                <span>LAT: 37.7749 N</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;