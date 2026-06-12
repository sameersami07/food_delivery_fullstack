import React from "react";
import { Sparkles, ArrowDownToLine } from "lucide-react";

export default function AppDownload() {
  return (
    <div 
      className="rounded-3xl bg-slate-950 p-6 sm:p-12 text-white relative overflow-hidden mt-16 shadow-xl"
      id="app-download-widget"
    >
      {/* Absolute ambient lights effects */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-red-500/10 rounded-full blur-3xl rounded-full"></div>
      <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl rounded-full"></div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-xl mx-auto">
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-red-400 mb-4 border border-white/10">
          <ArrowDownToLine size={20} className="animate-bounce" />
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
          For Better Experience Download <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-400 font-black">
            Foodie Mobile App
          </span>
        </h2>
        
        <p className="text-slate-400 text-xs sm:text-sm font-normal mb-8 leading-relaxed">
          Order food on-the-go with real-time location mapping, exclusive promotional codes, and live delivery dispatch tracker alerts right on your phone.
        </p>

        {/* Buttons mockups */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          {/* App Store button */}
          <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl px-6 py-3 w-48 transition-all hover:scale-[1.02] cursor-pointer">
            <svg viewBox="0 0 384 512" width="20" fill="currentColor" className="text-white">
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-48.4-19.3-76.5-19.3-36.9 0-77 21-99.3 59.8-46.3 80-11.8 196.3 32.5 259.8 21.6 31.6 47 66.8 81.3 65.5 32.2-1.2 44.5-20.7 83.2-20.7 38.4 0 50 20.7 83.5 20 34.7-.6 56.4-32 77.8-63.5 24.7-36 34.7-70.9 35-72.7-1-.4-68-26.3-68.7-104.1zM281.3 85c39.6-47.3 36.8-90.8 35.3-95-36.2 3.4-80 26.2-105.5 56-22 25.3-41.2 68.7-37.4 92.7 41.2 3 81.7-20 107.6-53.7z"/>
            </svg>
            <div className="text-left">
              <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold leading-tight">Download on the</p>
              <p className="text-xs font-bold leading-tight mt-0.5">App Store</p>
            </div>
          </button>

          {/* Play Store button */}
          <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl px-6 py-3 w-48 transition-all hover:scale-[1.02] cursor-pointer">
            <svg viewBox="0 0 512 512" width="20" fill="currentColor" className="text-white">
              <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58 33.3 60.1 60.1L491 292.7c13-7.5 21-21.7 21-37.1s-8-29.6-21.8-37.1l-23-13l-1-.7zM104.6 499l220.7-126.7-60.7-60.7L104.6 499z"/>
            </svg>
            <div className="text-left">
              <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold leading-tight">Get it on</p>
              <p className="text-xs font-bold leading-tight mt-0.5">Google Play</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
