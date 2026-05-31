import React, { useEffect, useState } from "react";
import { useStore } from "../context/StoreContext";
import { CheckCircle, AlertTriangle, Loader2, ArrowRight, ShoppingCart } from "lucide-react";

export default function Verify() {
  const {
    orderToVerify,
    verifyPayment,
    setCustomerSubView,
    triggerAlert,
    setOrderToVerify
  } = useStore();

  const [processing, setProcessing] = useState(true);
  const [success, setSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    if (!orderToVerify) {
      setProcessing(false);
      setSuccess(false);
      return;
    }

    const processPayment = async () => {
      setProcessing(true);
      // Wait 2 seconds to simulate high-fidelity Stripe processing latency
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      try {
        const isVerified = await verifyPayment(orderToVerify.orderId, orderToVerify.success);
        setSuccess(isVerified);
        
        if (isVerified) {
          triggerAlert("Payment Confirmed! Chef has received your feeds.", "success");
        } else {
          triggerAlert("Stripe payment authorization failed.", "error");
        }
      } catch (err) {
        console.error(err);
        setSuccess(false);
      } finally {
        setProcessing(false);
      }
    };

    processPayment();
  }, [orderToVerify]);

  const handleReturnToStore = () => {
    setOrderToVerify(null);
    setCustomerSubView("home");
  };

  const handleTrackOrders = () => {
    setOrderToVerify(null);
    setCustomerSubView("my-orders");
  };

  return (
    <div className="py-20 flex flex-col items-center justify-center min-h-[50vh] text-center animate-in fade-in duration-300" id="verify-page">
      
      {processing && (
        <div className="space-y-4">
          <div className="relative flex items-center justify-center">
            <Loader2 size={44} className="text-red-500 animate-spin" />
            <span className="absolute text-[9px] uppercase font-bold text-slate-400">3d-Secure</span>
          </div>
          <h3 className="text-base font-bold text-slate-800">Verifying secure billing details...</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Please hold on while we complete the Stripe card authorization. Do not refresh or close this connection.
          </p>
        </div>
      )}

      {!processing && success === true && (
        <div className="space-y-6 max-w-sm animate-in zoom-in-95 duration-250">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10 border border-emerald-200">
            <CheckCircle size={32} className="stroke-[2.2]" />
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">Payment Completed Successfully!</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Your transaction has been authorized and cleared through Stripe. Your order is now in line to be prepared by our premium chef!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-4">
            <button
              onClick={handleTrackOrders}
              className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
            >
              <span>Track Delivery</span>
              <ArrowRight size={13} />
            </button>
            <button
              onClick={handleReturnToStore}
              className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Browse more food
            </button>
          </div>
        </div>
      )}

      {!processing && success === false && (
        <div className="space-y-6 max-w-sm animate-in zoom-in-95 duration-250 animate-shake">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/10 border border-rose-200">
            <AlertTriangle size={32} className="stroke-[2.2]" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">Transaction Cancelled / Failed</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              We were unable to secure authorization from your billing bank. Please double-check your balance details or map a different payment method.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 w-full pt-4">
            <button
              onClick={handleReturnToStore}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
            >
              <ShoppingCart size={13} />
              <span>Return to Shopping Cart</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
