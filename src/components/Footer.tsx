import React from "react";
import { Coffee, Mail, PhoneCall, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 mt-24 pt-16 pb-8 border-t border-slate-900" id="footer-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 sm:gap-8 mb-12">
          
          {/* Logo Brand column */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold leading-none text-base">
                T
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                TOMATO<span className="text-red-500">.</span>
              </span>
            </div>
            
            <p className="text-slate-400 text-xs sm:text-sm font-normal leading-relaxed max-w-sm">
              We deliver premium, chef-crafted delicacies right to your doorstep. Satisfying your late-night study streaks, work deadlines, or cozy family dinners with fresh, piping hot food.
            </p>
            
            <div className="flex items-center space-x-3 pt-2">
              {["facebook", "twitter", "linkedin"].map((p) => (
                <span 
                  key={p} 
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-red-500 hover:text-white flex items-center justify-center text-xs text-slate-400 transition-colors uppercase font-bold text-[8px] tracking-widest cursor-pointer"
                >
                  {p.substring(0, 2)}
                </span>
              ))}
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
              Our Company
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">About Tomato</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Delivery Careers</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Become a Partner</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Media Kits</span>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
              Get in Touch
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li className="flex items-center space-x-2">
                <PhoneCall size={12} className="text-red-500" />
                <span>+1 (800) 555-TOMATO</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={12} className="text-red-500" />
                <span>support@tomato.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin size={12} className="text-red-500" />
                <span>100 Fresh Culinary Rd, SF</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Separator line & Copyright details */}
        <hr className="border-slate-900 my-6" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-500 font-medium">
          <p>© 2026 TOMATO Food Services Inc. All absolute rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policies</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Fulfillment Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
