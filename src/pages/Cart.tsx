import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart, Percent } from "lucide-react";

export default function Cart() {
  const {
    food_list,
    cartItems,
    addToCart,
    removeFromCart,
    getCartTotal,
    getCartCount,
    setCustomerSubView,
    token,
    setShowLogin,
    triggerAlert
  } = useStore();

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoApplied, setPromoApplied] = useState("");

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");

    if (!promoCode.trim()) return;

    if (promoCode.trim().toUpperCase() === "TOMATO5") {
      if (getCartTotal() < 15) {
        setPromoError("Promo code 'TOMATO5' requires a minimum order subtotal of $15.00");
        return;
      }
      setDiscount(5);
      setPromoApplied("TOMATO5");
      triggerAlert("Promo Coupon 'TOMATO5' applied! You saved $5.00", "success");
    } else {
      setPromoError("Invalid promo code. Hint: Use coupon 'TOMATO5'");
    }
  };

  const handleCheckout = () => {
    if (getCartCount() === 0) {
      triggerAlert("Your cart is empty. Add gourmet feeds first!", "error");
      return;
    }

    if (!token) {
      triggerAlert("Please login to proceed checkout", "info");
      setShowLogin(true);
      return;
    }

    // Direct to delivery addressing details
    localStorage.setItem("tomato_active_discount", String(discount));
    localStorage.setItem("tomato_promo_applied", promoApplied);
    setCustomerSubView("order");
  };

  const cartTotal = getCartTotal();
  const deliveryFee = cartTotal > 0 ? 5 : 0;
  const finalTotal = Math.max(0, cartTotal + deliveryFee - discount);

  return (
    <div className="py-8 animate-in fade-in duration-300" id="cart-page">
      <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2 mb-8">
        <ShoppingCart size={22} className="text-red-500" />
        Shopping Checkout Cart
      </h2>

      {getCartCount() === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 border border-slate-100 rounded-3xl text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-500 flex items-center justify-center mb-4">
            <ShoppingCart size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-700">Your basket is feeling light</h3>
          <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
            There are currently no delicious gourmet dishes inside your cart. Head back to our storefront to add food item!
          </p>
          <button
            onClick={() => setCustomerSubView("home")}
            className="mt-6 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full px-6 py-2.5 text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
          >
            Start Browsing Food
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* List panel column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="hidden sm:grid grid-cols-6 gap-4 text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 px-4">
              <span className="col-span-1">Item</span>
              <span className="col-span-2">Name</span>
              <span className="col-span-1 text-center">Price</span>
              <span className="col-span-1 text-center">Quantity</span>
              <span className="col-span-1 text-right">Total</span>
            </div>

            <div className="space-y-3">
              {Object.entries(cartItems).map(([id, val]) => {
                const quantity = Number(val);
                const item = food_list.find((f) => f._id === id);
                if (!item || quantity <= 0) return null;

                return (
                  <div
                    key={id}
                    className="grid grid-cols-1 sm:grid-cols-6 gap-4 items-center bg-white border border-slate-100 hover:border-slate-250 p-4 rounded-2xl transition-all"
                  >
                    {/* Visual frame */}
                    <div className="col-span-1 flex items-center justify-center sm:justify-start">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 sm:w-12 sm:h-12 rounded-xl object-cover shadow-sm bg-slate-50"
                      />
                    </div>

                    {/* Metadata text */}
                    <div className="col-span-1 sm:col-span-2 text-center sm:text-left">
                      <p className="font-bold text-slate-800 text-sm leading-snug">{item.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wider font-semibold">{item.category}</p>
                    </div>

                    {/* Price column */}
                    <div className="col-span-1 text-center font-semibold text-slate-500 text-xs">
                      ${item.price.toFixed(2)}
                    </div>

                    {/* Adjusters counter pill column */}
                    <div className="col-span-1 flex justify-center">
                      <div className="flex items-center space-x-2.5 bg-slate-50 p-1.5 rounded-full border border-slate-100">
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="w-5 h-5 rounded-full bg-white hover:bg-slate-150 flex items-center justify-center text-slate-600 shadow-sm cursor-pointer"
                        >
                          <Minus size={10} className="stroke-[2.5]" />
                        </button>
                        <span className="text-xs font-extrabold text-slate-800 w-4 text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => addToCart(item._id)}
                          className="w-5 h-5 rounded-full bg-white hover:bg-slate-155 flex items-center justify-center text-slate-600 shadow-sm cursor-pointer"
                        >
                          <Plus size={10} className="stroke-[2.5]" />
                        </button>
                      </div>
                    </div>

                    {/* Line total price */}
                    <div className="col-span-1 flex justify-between sm:justify-end items-center px-4 sm:px-0">
                      <span className="sm:hidden text-xs text-slate-400 font-semibold uppercase tracking-wider">Line Total</span>
                      <span className="font-bold text-slate-800 text-sm">
                        ${(item.price * quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setCustomerSubView("home")}
              className="text-xs font-bold text-red-500 hover:text-red-600 hover:underline cursor-pointer flex items-center gap-1.5"
            >
              ← Back to menu additions
            </button>
          </div>

          {/* Pricing calculations side card column */}
          <div className="space-y-6">
            
            {/* Promo coupons block wrapper */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
              <div>
                <h4 className="font-bold text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
                  <Percent size={15} className="text-red-500" />
                  Have a Promo Code?
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Enter coupons here to claim shopping savings discounts.
                </p>
              </div>

              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code (e.g. TOMATO5)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={!!promoApplied}
                  className="flex-grow bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-3 uppercase text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:ring-1 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={!!promoApplied || !promoCode}
                  className="bg-slate-950 hover:bg-slate-800 disabled:bg-slate-100 hover:text-white disabled:text-slate-300 py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {promoApplied && (
                <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 py-2 px-3 rounded-xl text-xs flex justify-between items-center">
                  <span className="font-bold uppercase tracking-wider text-[10px]">Coupon Applied - '{promoApplied}'</span>
                  <button
                    type="button"
                    onClick={() => {
                      setPromoApplied("");
                      setDiscount(0);
                      setPromoCode("");
                    }}
                    className="text-[10px] font-black underline hover:text-emerald-900 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}

              {promoError && (
                <p className="text-[11px] font-semibold text-red-500 leading-normal">{promoError}</p>
              )}

              {!promoApplied && (
                <p className="text-[10px] text-slate-400 select-all border border-slate-100 py-1.5 px-2.5 rounded bg-slate-50/50 block text-center leading-normal">
                  💡 Hint: Apply <strong className="text-red-500">TOMATO5</strong> to receive discount on products over $15!
                </p>
              )}
            </div>

            {/* Calculations summaries block */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col">
              <h3 className="font-bold text-slate-800 text-sm tracking-tight border-b border-slate-50 pb-3">
                Cart Total Calculations
              </h3>

              <div className="space-y-2.5 text-xs text-slate-500 font-medium">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-800 font-bold">${cartTotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold bg-emerald-50/50 p-2 rounded-lg">
                    <span>Discount Coupon ({promoApplied})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Standard Delivery Fee</span>
                  <span className="text-slate-800 font-bold">${deliveryFee.toFixed(2)}</span>
                </div>

                <hr className="border-slate-50 my-1" />

                <div className="flex justify-between text-slate-800 text-sm font-black pt-1">
                  <span>Grand Total</span>
                  <span className="text-red-500 font-extrabold text-base">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 px-4 rounded-2xl text-xs uppercase tracking-wider transition-all duration-200 mt-4 shadow-md hover:shadow-lg flex items-center justify-center space-x-1 cursor-pointer"
              >
                <span>Proceed To Delivery</span>
                <ArrowRight size={14} className="stroke-[2.5]" />
              </button>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
