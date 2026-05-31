import React, { useEffect, useState } from "react";
import { useStore } from "../context/StoreContext";
import { OrderItem } from "../types";
import { Clock, RefreshCw, Box, ClipboardList, CheckCircle2, Truck, HelpCircle, Loader2 } from "lucide-react";

export default function MyOrders() {
  const { fetchUserOrders, token, setShowLogin, triggerAlert } = useStore();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  const getOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchUserOrders();
      // Sort orders by most recent date
      const sorted = data.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setOrders(sorted);
    } catch (err) {
      console.error(err);
      triggerAlert("Failed to load your orders", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setShowLogin(true);
      setLoading(false);
    } else {
      getOrders();
    }
  }, [token]);

  // Determine status color themes
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Food Processing":
        return {
          bg: "bg-blue-50 text-blue-700 border-blue-100",
          text: "text-blue-700",
          dot: "bg-blue-500"
        };
      case "Out for Delivery":
        return {
          bg: "bg-amber-50 text-amber-700 border-amber-100",
          text: "text-amber-700",
          dot: "bg-amber-500"
        };
      case "Delivered":
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-100",
          text: "text-emerald-700",
          dot: "bg-emerald-500"
        };
      default:
        return {
          bg: "bg-slate-50 text-slate-700 border-slate-100",
          text: "text-slate-700",
          dot: "bg-slate-500"
        };
    }
  };

  return (
    <div className="py-8 animate-in fade-in duration-300" id="my-orders-page">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <ClipboardList size={22} className="text-red-500" />
            My Placed Orders
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time trackings of your active kitchen dispatches & history.
          </p>
        </div>

        {token && (
          <button
            onClick={getOrders}
            disabled={loading}
            className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 disabled:bg-slate-5 w-fit border border-slate-200 text-slate-600 hover:text-slate-800 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer transition-all active:scale-95 shadow-sm"
          >
            <RefreshCw size={13} className={`stroke-[2.5] ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? "Refreshing..." : "Refresh Tracking Status"}</span>
          </button>
        )}
      </div>

      {!token ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 border border-slate-100 rounded-3xl text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
            <ClipboardList size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-700">Account login required</h3>
          <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
            Please register or sign in to track your current food prep schedules and review order statements.
          </p>
          <button
            onClick={() => setShowLogin(true)}
            className="mt-6 bg-slate-950 hover:bg-slate-800 text-white font-bold rounded-full px-6 py-2.5 text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
          >
            Sign In Now
          </button>
        </div>
      ) : loading && orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-slate-400">
          <Loader2 size={36} className="animate-spin text-red-500 mb-4" />
          <p className="text-xs font-semibold uppercase tracking-wider">Syncing order entries...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 border border-slate-100 rounded-3xl text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
            <Box size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-700">No dispatch histories</h3>
          <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
            You haven't checked out any gourmet delicacies yet. Head back to the store front to initiate food prep!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusTheme = getStatusStyle(order.status);
            const itemsSummary = order.items.map(i => `${i.name} x ${i.quantity}`).join(", ");
            const totalItemsCount = order.items.reduce((acc, curr) => acc + curr.quantity, 0);

            // Timeline calculations mapping
            const stages = ["Food Processing", "Out for Delivery", "Delivered"];
            const currentStageIndex = stages.indexOf(order.status);

            return (
              <div
                key={order._id}
                className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col space-y-4"
                id={`customer-order-box-${order._id}`}
              >
                {/* Meta details Header bar */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-50 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-400 select-all font-mono">#{order._id}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {new Date(order.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                    
                    <h4 className="font-bold text-slate-800 text-sm mt-1 sm:max-w-xl truncate" title={itemsSummary}>
                      {itemsSummary}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {/* Payment label */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                      order.payment 
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                        : "bg-amber-50 text-amber-600 border-amber-100"
                    }`}>
                      {order.payment ? "Paid via Stripe" : "Pending Payment"}
                    </span>

                    {/* Status badge */}
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${statusTheme.bg}`}>
                      <span className={`h-2 w-2 rounded-full ${statusTheme.dot} ${order.status !== 'Delivered' ? 'animate-ping' : ''}`}></span>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Tracking timeline */}
                <div className="py-2 px-1 sm:px-6">
                  <div className="relative flex items-center justify-between w-full">
                    {/* Absolute horizontal connect strip */}
                    <div className="absolute left-0 right-0 h-1 bg-slate-100 -z-[1] top-1/2 -translate-y-1/2"></div>
                    <div 
                      className="absolute left-0 h-1 bg-red-400 -z-[1] top-1/2 -translate-y-1/2 transition-all duration-500"
                      style={{
                        width: `${currentStageIndex === 0 ? "0%" : currentStageIndex === 1 ? "50%" : "100%"}`
                      }}
                    ></div>

                    {/* Stage 1: Prep */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                        currentStageIndex >= 0 
                          ? "bg-red-500 border-red-500 text-white shadow-md shadow-red-500/20" 
                          : "bg-white border-slate-205 text-slate-400"
                      }`}>
                        <Box size={14} />
                      </div>
                      <span className={`text-[10px] sm:text-xs mt-1.5 text-center font-bold ${currentStageIndex >= 0 ? "text-slate-800" : "text-slate-400"}`}>
                        Prep Kitchen
                      </span>
                    </div>

                    {/* Stage 2: Courier */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                        currentStageIndex >= 1 
                          ? "bg-red-500 border-red-500 text-white shadow-md shadow-red-500/20" 
                          : "bg-white border-slate-200 text-slate-400"
                      }`}>
                        <Truck size={14} />
                      </div>
                      <span className={`text-[10px] sm:text-xs mt-1.5 text-center font-bold ${currentStageIndex >= 1 ? "text-slate-800" : "text-slate-400"}`}>
                        Out for Delivery
                      </span>
                    </div>

                    {/* Stage 3: Arrived */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                        currentStageIndex >= 2 
                          ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20" 
                          : "bg-white border-slate-200 text-slate-400"
                      }`}>
                        <CheckCircle2 size={14} />
                      </div>
                      <span className={`text-[10px] sm:text-xs mt-1.5 text-center font-bold ${currentStageIndex >= 2 ? "text-emerald-600" : "text-slate-400"}`}>
                        Delivered
                      </span>
                    </div>

                  </div>
                </div>

                {/* Sub row pricing indicators */}
                <div className="pt-3 border-t border-slate-50 flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs font-semibold text-slate-500 bg-slate-50/50 p-3 rounded-xl">
                  <div className="flex gap-4">
                    <span>Items Count: <strong className="text-slate-800 font-bold">{totalItemsCount}</strong></span>
                    <span>•</span>
                    <span className="truncate">Destination: <strong className="text-slate-800 font-bold">{order.address.street}, {order.address.city}</strong></span>
                  </div>
                  <div>
                    <span>Grand Total: <strong className="text-red-500 font-black text-sm">${order.amount.toFixed(2)}</strong></span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
