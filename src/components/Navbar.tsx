import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { ShoppingBag, User, LayoutDashboard, LogOut, Search, Clock, ListOrdered, Utensils } from "lucide-react";

export default function Navbar() {
  const {
    getCartCount,
    setView,
    view,
    user,
    logout,
    setShowLogin,
    setCustomerSubView
  } = useStore();

  const [showDropdown, setShowDropdown] = useState(false);

  // Return to customer storefront homepage
  const handleHomeClick = () => {
    setView("store");
    setCustomerSubView("home");
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo element with interactive click */}
          <div 
            onClick={handleHomeClick}
            className="flex items-center space-x-2 cursor-pointer transition-transform hover:scale-[1.02] active:scale-95"
            id="nav-logo"
          >
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold shadow-lg shadow-red-500/20 text-xl tracking-tight">
              T
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-800">
              TOMATO<span className="text-red-500 font-extrabold">.</span>
            </span>
          </div>

          {/* Core navigation controls */}
          <div className="hidden md:flex items-center space-x-8 font-medium text-slate-600">
            <button 
              onClick={() => { setView("store"); setCustomerSubView("home"); }}
              className={`hover:text-red-500 transition-colors cursor-pointer text-sm py-1 border-b-2 ${view === 'store' ? 'text-red-500 border-red-500 font-semibold' : 'border-transparent'}`}
            >
              Order Food
            </button>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            <button 
              onClick={() => { setView("store"); setCustomerSubView("my-orders"); }}
              className="hover:text-red-500 transition-colors cursor-pointer text-sm"
            >
              Track Deliveries
            </button>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            <button 
              onClick={() => { 
                if (user?.role === "admin") {
                  setView("admin");
                } else {
                  setView("admin");
                  // Let them see the admin portal directly or prompt login
                }
              }}
              className={`hover:text-red-500 transition-colors cursor-pointer text-sm py-1 border-b-2 flex items-center gap-1.5 ${view === 'admin' ? 'text-red-500 border-red-500 font-semibold' : 'border-transparent'}`}
            >
              <LayoutDashboard size={15} />
              Admin Dashboard
            </button>
          </div>

          {/* Action buttons list */}
          <div className="flex items-center space-x-5" id="nav-actions">
            
            {/* Shopping Cart button with dynamic badge counts */}
            {view === "store" && (
              <button
                onClick={() => setCustomerSubView("cart")}
                className="relative p-2.5 rounded-full text-slate-600 hover:bg-slate-50 hover:text-red-500 transition-all duration-200 cursor-pointer"
                id="cart-icon-btn"
              >
                <ShoppingBag size={21} className="stroke-[2.2]" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white animate-bounce">
                    {getCartCount()}
                  </span>
                )}
              </button>
            )}

            {/* Profile dropdown / Authentication popups triggers */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-1.5 p-1 rounded-full hover:bg-slate-50 border border-slate-100 transition-all cursor-pointer"
                  id="profile-dropdown-btn"
                >
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">
                    {user.name.substring(0, 1).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 hidden sm:inline max-w-[80px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                </button>

                {showDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
                    <div className="absolute right-0 mt-2.5 w-56 rounded-xl bg-white border border-slate-100 shadow-xl py-1.5 z-20 text-sm text-slate-700 animate-in fade-in slide-in-from-top-3 duration-200">
                      <div className="px-4 py-2.5 border-b border-slate-50">
                        <p className="text-xs text-slate-400">Authenticated user</p>
                        <p className="font-semibold text-slate-800 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-400 select-none bg-slate-50 rounded px-1.5 py-0.5 mt-1 inline-block uppercase font-bold tracking-widest leading-none">
                          {user.role || "customer"}
                        </p>
                      </div>

                      {user.role === "admin" && (
                        <button
                          onClick={() => {
                            setView("admin");
                            setShowDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors flex items-center space-x-2 text-slate-700"
                        >
                          <LayoutDashboard size={15} />
                          <span>Admin Portal</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setView("store");
                          setCustomerSubView("my-orders");
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors flex items-center space-x-2 text-slate-700"
                      >
                        <ListOrdered size={15} />
                        <span>My Placed Orders</span>
                      </button>

                      <hr className="my-1 border-slate-50" />

                      <button
                        onClick={() => {
                          logout();
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 transition-colors flex items-center space-x-2 font-medium"
                      >
                        <LogOut size={15} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="bg-slate-950 hover:bg-slate-800 text-white rounded-full px-6 py-2 text-xs font-semibold tracking-wide shadow-md shadow-slate-950/10 hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                id="login-btn"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
