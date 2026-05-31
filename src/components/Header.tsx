import React from "react";

interface HeaderProps {
  onExploreClick: () => void;
}

export default function Header({ onExploreClick }: HeaderProps) {
  return (
    <div className="relative rounded-3xl overflow-hidden mt-6 shadow-xl" id="home-header">
      {/* Background visual flatlay collage overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] hover:scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=80')`
        }}
      ></div>

      {/* Dark overlay with professional color grade */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent"></div>

      {/* Hero content container */}
      <div className="relative max-w-2xl px-6 py-20 sm:px-12 sm:py-28 text-white z-10 flex flex-col justify-center items-start">
        <span className="bg-red-500/90 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 shadow-sm animate-pulse">
          Fresh & Hot Deliveries
        </span>
        
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4">
          Order your <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-400">
            favourite food
          </span> here
        </h1>
        
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-lg mb-8 font-normal">
          Choose from a highly customized culinary catalog featuring a delectable array of dishes. Our professional chefs gather the finest farm-fresh ingredients to elevate your dining experience, one hot order at a time.
        </p>

        <button
          onClick={onExploreClick}
          className="bg-red-500 hover:bg-red-600 text-white rounded-full px-8 py-3.5 text-xs font-bold tracking-widest uppercase transition-all duration-305 shadow-lg shadow-red-500/25 border border-red-400 hover:scale-105 active:scale-95 cursor-pointer"
        >
          Explore Delicious Menu
        </button>
      </div>

      {/* Floating details banner */}
      <div className="absolute bottom-4 right-6 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15 hidden md:block select-none pointer-events-none">
        <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Standard Delivery</p>
        <p className="text-xs text-white font-semibold flex items-center gap-1.5 mt-0.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Express in 25-35 Minutes
        </p>
      </div>
    </div>
  );
}
