import React, { useState, useEffect } from "react";
import { useStore } from "../context/StoreContext";
import AddressAutocomplete, { ParsedAddress } from "../components/AddressAutocomplete";
import { MapPin, ShieldCheck, CreditCard, ArrowLeft, Loader2 } from "lucide-react";

export default function PlaceOrder() {
  const {
    getCartTotal,
    getCartCount,
    setCustomerSubView,
    placeNewOrder,
    triggerAlert,
    setOrderToVerify
  } = useStore();

  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: ""
  });

  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedDiscount = localStorage.getItem("tomato_active_discount");
    if (savedDiscount) {
      setDiscount(Number(savedDiscount));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressSelect = (parsed: ParsedAddress) => {
    setAddress(prev => ({
      ...prev,
      street: parsed.street || prev.street,
      city: parsed.city || prev.city,
      state: parsed.state || prev.state,
      zipCode: parsed.zipCode || prev.zipCode,
      country: parsed.country || prev.country
    }));
  };

  const handlePlaceOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (getCartCount() === 0) {
      triggerAlert("Empty cart checklist! Please add items first.", "error");
      setCustomerSubView("home");
      return;
    }

    // Standard phone check
    if (!address.phone || address.phone.length < 5) {
      triggerAlert("Please enter a valid call phone number", "error");
      return;
    }

    setLoading(true);
    const sessionUrl = await placeNewOrder(address);
    setLoading(false);

    if (sessionUrl) {
      // Parse query parameters
      // format: /verify?success=true&orderId=order_xxxx
      try {
        const urlObj = new URL(sessionUrl, "https://example.com");
        const success = urlObj.searchParams.get("success") || "true";
        const orderId = urlObj.searchParams.get("orderId") || "";
        
        // Transition state to verify screen
        setOrderToVerify({ orderId, success });
        setCustomerSubView("verify");
        triggerAlert("Connecting simulated Stripe secure checkout...", "info");
      } catch (err) {
        console.error(err);
        triggerAlert("Error matching simulated Stripe gateway redirection", "error");
      }
    }
  };

  const codeTotal = getCartTotal();
  const deliveryFee = codeTotal > 0 ? 5 : 0;
  const grandTotal = Math.max(0, codeTotal + deliveryFee - discount);

  return (
    <div className="py-8 animate-in fade-in duration-300" id="place-order-page">
      <button
        onClick={() => setCustomerSubView("cart")}
        className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5 mb-6 cursor-pointer"
      >
        <ArrowLeft size={13} className="stroke-[2.5]" />
        <span>Return to view basket cart</span>
      </button>

      <form onSubmit={handlePlaceOrderSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* Form Inputs panel */}
        <div className="lg:col-span-3 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <MapPin size={20} className="text-red-500" />
              Delivery & Shipping Address
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Please enter your destination details to fulfill dispatch tracking.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1.5 uppercase ml-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={address.firstName}
                onChange={handleChange}
                required
                placeholder="John"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-1 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-slate-400"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1.5 uppercase ml-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={address.lastName}
                onChange={handleChange}
                required
                placeholder="Doe"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-1 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1.5 uppercase ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={address.email}
              onChange={handleChange}
              required
              placeholder="e.g. john@example.com"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-1 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1.5 uppercase ml-1">Street Address</label>
            <AddressAutocomplete
              value={address.street}
              onChange={(street) => setAddress(prev => ({ ...prev, street }))}
              onAddressSelect={handleAddressSelect}
              placeholder="Start typing your address..."
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-1 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1.5 uppercase ml-1">City</label>
              <input
                type="text"
                name="city"
                value={address.city}
                onChange={handleChange}
                required
                placeholder="San Francisco"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-1 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-slate-400"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1.5 uppercase ml-1">State</label>
              <input
                type="text"
                name="state"
                value={address.state}
                onChange={handleChange}
                required
                placeholder="CA"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-1 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1.5 uppercase ml-1">Zip Code</label>
              <input
                type="text"
                name="zipCode"
                value={address.zipCode}
                onChange={handleChange}
                required
                placeholder="94111"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-1 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-slate-400"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1.5 uppercase ml-1">Country</label>
              <input
                type="text"
                name="country"
                value={address.country}
                onChange={handleChange}
                required
                placeholder="USA"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-1 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1.5 uppercase ml-1">Mobile Phone Number</label>
            <input
              type="text"
              name="phone"
              value={address.phone}
              onChange={handleChange}
              required
              placeholder="e.g. 415-555-1234"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-1 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Totals Summary panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm tracking-tight border-b border-slate-50 pb-3 flex items-center gap-1.5">
              <CreditCard size={15} className="text-red-500" />
              Order Checkout Summary
            </h3>

            <div className="space-y-2.5 text-xs text-slate-500 font-medium">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="text-slate-800 font-bold">${codeTotal.toFixed(2)}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold bg-emerald-50/50 p-2 rounded-lg">
                  <span>Promo savings coupon</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Standard Delivery Fee</span>
                <span className="text-slate-800 font-bold">${deliveryFee.toFixed(2)}</span>
              </div>

              <hr className="border-slate-50 my-1" />

              <div className="flex justify-between text-slate-800 text-sm font-black pt-1">
                <span>Grand Total Price</span>
                <span className="text-red-500 font-extrabold text-base">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Secure tags */}
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-start space-x-2">
              <ShieldCheck size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-slate-700">Encrypted Stripe Guarantee</p>
                <p className="text-[9px] text-slate-400 mt-0.5 leading-normal">
                  Our payment portal connects directly via dynamic token handshakes to keep credentials completely isolated.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-slate-300 text-white font-bold py-3.5 px-4 rounded-2xl text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Configuring Stripe Checkout...</span>
                </>
              ) : (
                <span>Simulate Stripe Checkout</span>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
