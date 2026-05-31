import React, { useEffect } from "react";
import { StoreContextProvider, useStore } from "./context/StoreContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import PlaceOrder from "./pages/PlaceOrder";
import MyOrders from "./pages/MyOrders";
import Verify from "./pages/Verify";
import LoginPopup from "./components/LoginPopup";
import AdminLayout from "./pages/admin/AdminLayout";
import { Loader2, Bell, CheckCircle, AlertOctagon, Info } from "lucide-react";

function AppContent() {
  const {
    view,
    customerSubView,
    showLogin,
    alert,
    loading,
    user,
    setView,
    setShowLogin,
    triggerAlert
  } = useStore();

  useEffect(() => {
    if (view === "admin" && user?.role !== "admin") {
      setView("store");
      if (!user) {
        setShowLogin(true);
        triggerAlert("Sign in with your admin account to continue", "error");
      } else {
        triggerAlert("Admin access is restricted to the site owner", "error");
      }
    }
  }, [view, user, setView, setShowLogin, triggerAlert]);

  // Render responsive notification icon
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle size={16} className="text-emerald-500" />;
      case "error":
        return <AlertOctagon size={16} className="text-red-500" />;
      default:
        return <Info size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/55 flex flex-col font-sans transition-all duration-300">
      
      {/* Dynamic Full screen spinner loader */}
      {loading && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-xs z-50 flex flex-col items-center justify-center">
          <Loader2 size={36} className="text-red-500 animate-spin" />
          <p className="text-xs font-black uppercase tracking-widest text-slate-500 mt-3.5 select-none animate-pulse">
            Saturating appetites...
          </p>
        </div>
      )}

      {/* Persistent top-header navigation */}
      <Navbar />

      {/* Main active sub-view viewport */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        {view === "admin" && user?.role === "admin" ? (
          <AdminLayout />
        ) : (
          <>
            {customerSubView === "home" && <Home />}
            {customerSubView === "cart" && <Cart />}
            {customerSubView === "order" && <PlaceOrder />}
            {customerSubView === "my-orders" && <MyOrders />}
            {customerSubView === "verify" && <Verify />}
          </>
        )}
      </main>

      {/* Persistent company footer banner */}
      <Footer />

      {/* Global User AuthenticationPopup dialog */}
      {showLogin && <LoginPopup />}

      {/* Global CSS timed Alert-Toast messaging */}
      {alert && (
        <div 
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl border shadow-xl flex items-center space-x-3 max-w-xs sm:max-w-sm animate-in slide-in-from-bottom-5 duration-300 ${
            alert.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-100"
              : alert.type === "error"
              ? "bg-red-50 text-red-800 border-red-100 animate-shake"
              : "bg-blue-50 text-blue-800 border-blue-100"
          }`}
          id="global-toast-notification"
        >
          <div className="flex-shrink-0">
            {getAlertIcon(alert.type)}
          </div>
          <div className="flex-grow">
            <p className="text-xs font-bold leading-normal">{alert.message}</p>
          </div>
        </div>
      )}

    </div>
  );
}

export default function App() {
  return (
    <StoreContextProvider>
      <AppContent />
    </StoreContextProvider>
  );
}
