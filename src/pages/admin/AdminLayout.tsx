import React, { useState, useEffect } from "react";
import { useStore } from "../../context/StoreContext";
import { FoodItem, OrderItem, OrderStatus } from "../../types";
import { PlusCircle, ClipboardList, Layers, Trash2, ShieldCheck, DollarSign, RefreshCw, Upload, Sparkles, Check, Loader2 } from "lucide-react";

export default function AdminLayout() {
  const {
    adminSubView,
    setAdminSubView,
    food_list,
    addNewFoodItem,
    deleteFoodItem,
    fetchAllOrders,
    updateOrderStatus,
    triggerAlert,
    user
  } = useStore();

  // Unified Admin state controllers
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loadOrders, setLoadOrders] = useState(false);

  useEffect(() => {
    if (adminSubView === "orders") {
      getAdminOrders();
    }
  }, [adminSubView]);

  const getAdminOrders = async () => {
    setLoadOrders(true);
    try {
      const data = await fetchAllOrders();
      // Sort orders descending by date
      const sorted = data.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setOrders(sorted);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadOrders(false);
    }
  };

  return (
    <div className="py-6 animate-in fade-in duration-300" id="admin-portal-root">
      
      {/* Banner message indicator */}
      <div className="bg-slate-950 text-white rounded-3xl p-5 mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4 relative overflow-hidden shadow-md">
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-red-600/20 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <span className="bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full select-none leading-none">
            Admin console
          </span>
          <h2 className="text-xl font-bold tracking-tight mt-1">Tomato Central Management</h2>
          <p className="text-xs text-slate-400 mt-0.5">Control live food catalog menus, record items checkout dispatches, and alter ship progress.</p>
        </div>
        <div className="relative z-10 text-xs text-slate-400 font-medium bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 self-start sm:self-auto">
          <ShieldCheck size={14} className="text-red-400" />
          <span>Logged in as: <strong>{user?.name || "Evaluating Controller"}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Left Side Sidebar select control bar */}
        <div className="md:col-span-1 space-y-2 flex flex-row md:flex-col overflow-x-auto md:overflow-visible pb-2 md:pb-0" id="admin-sidebar">
          <button
            onClick={() => setAdminSubView("orders")}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer w-full flex-shrink-0 md:flex-shrink ${
              adminSubView === "orders"
                ? "bg-red-500 text-white shadow-md shadow-red-500/10"
                : "bg-white hover:bg-slate-50 text-slate-600 border border-slate-100"
            }`}
          >
            <ClipboardList size={15} />
            <span>Manage Orders</span>
          </button>
          
          <button
            onClick={() => setAdminSubView("list")}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer w-full flex-shrink-0 md:flex-shrink ${
              adminSubView === "list"
                ? "bg-red-500 text-white shadow-md shadow-red-500/10"
                : "bg-white hover:bg-slate-50 text-slate-600 border border-slate-100"
            }`}
          >
            <Layers size={15} />
            <span>List Products</span>
          </button>

          <button
            onClick={() => setAdminSubView("add")}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer w-full flex-shrink-0 md:flex-shrink ${
              adminSubView === "add"
                ? "bg-red-500 text-white shadow-md shadow-red-500/10"
                : "bg-white hover:bg-slate-50 text-slate-600 border border-slate-100"
            }`}
          >
            <PlusCircle size={15} />
            <span>Add New Food</span>
          </button>
        </div>

        {/* Right side content sub-views templates */}
        <div className="md:col-span-3 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
          {adminSubView === "add" && (
            <AddSubView handleAddSubmit={addNewFoodItem} />
          )}

          {adminSubView === "list" && (
            <ListSubView food_list={food_list} handleDelete={deleteFoodItem} />
          )}

          {adminSubView === "orders" && (
            <OrdersSubView 
              orders={orders} 
              loading={loadOrders} 
              handleRefresh={getAdminOrders} 
              handleStatusUpdate={updateOrderStatus} 
            />
          )}
        </div>

      </div>
    </div>
  );
}

/* ============================================================================
   ADMIN SUB-VIEW: ADD NEW PRODUCT
   ============================================================================ */
const PRESET_GALLERY = [
  { label: "Greek Salad", url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500", cat: "Salad" },
  { label: "Burger", url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500", cat: "Sandwich" },
  { label: "Pasta Noodles", url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500", cat: "Pasta" },
  { label: "Brownie Desert", url: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500", cat: "Deserts" },
  { label: "Fancy Chocolate Cake", url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500", cat: "Cake" }
];

interface AddSubViewProps {
  handleAddSubmit: (food: Omit<FoodItem, "_id"> & { image?: string }) => Promise<boolean>;
}

function AddSubView({ handleAddSubmit }: AddSubViewProps) {
  const { generateFoodDetails, triggerAlert } = useStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Salad");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleGenerateWithAI = async () => {
    if (!name.trim()) {
      triggerAlert("Enter a food name or idea first, then click Generate with AI", "error");
      return;
    }

    setGenerating(true);
    const result = await generateFoodDetails(name.trim(), category);
    setGenerating(false);

    if (result) {
      setName(result.name);
      setDescription(result.description);
      setCategory(result.category);
      setPrice(String(result.suggestedPrice));
      triggerAlert("Menu details generated with Gemini AI!", "success");
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !price) return;

    setSaving(true);
    const success = await handleAddSubmit({
      name,
      description,
      price: Number(price),
      category,
      image: image || undefined
    });
    setSaving(false);

    if (success) {
      // Clear forms
      setName("");
      setDescription("");
      setPrice("");
      setCategory("Salad");
      setImage("");
    }
  };

  return (
    <div className="space-y-6" id="admin-add-subview">
      <div className="border-b border-slate-50 pb-3">
        <h3 className="text-lg font-bold text-slate-800">Enroll new Food Item</h3>
        <p className="text-xs text-slate-400 mt-0.5">Define metadata fields to inject items into our public store catalog.</p>
      </div>

      <form onSubmit={handleSubmitForm} className="space-y-4">
        
        {/* Row Description Image Asset */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase ml-1">Food Image visual (url)</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Paste custom image URL here..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="flex-grow bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:ring-1 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Quick photorealistic presets presets to simplify evaluation! */}
          <div className="mt-2 text-[10px] text-slate-400 font-semibold uppercase flex flex-wrap gap-2 items-center">
            <span>💡 Quick presets:</span>
            {PRESET_GALLERY.map((pres) => (
              <button
                key={pres.label}
                type="button"
                onClick={() => {
                  setImage(pres.url);
                  setName(pres.label);
                  setCategory(pres.cat);
                }}
                className="bg-slate-50 border border-slate-100 rounded px-2 py-1 text-slate-500 hover:text-red-500 hover:border-red-200 transition-all cursor-pointer font-bold leading-none flex items-center gap-1.5"
              >
                <span>{pres.label}</span>
                <Sparkles size={10} className="text-red-400" />
              </button>
            ))}
          </div>

          {/* Asset visualization card */}
          {image && (
            <div className="mt-3 relative rounded-xl w-48 aspect-video overflow-hidden border border-slate-100 bg-slate-50">
              <img src={image} className="w-full h-full object-cover" alt="Preview Frame" />
              <button
                type="button"
                onClick={() => setImage("")}
                className="absolute right-2 top-2 bg-slate-900/60 hover:bg-slate-900/80 text-white rounded-full p-1 transition-colors"
              >
                <Trash2 size={12} />
              </button>
            </div>
          )}
        </div>

        {/* Name and Price rows */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase ml-1">Product Name</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Spicy chicken biryani"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="flex-grow bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:ring-1 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={handleGenerateWithAI}
                disabled={generating || saving}
                className="flex-shrink-0 bg-violet-50 hover:bg-violet-100 disabled:opacity-50 border border-violet-200 text-violet-700 rounded-2xl px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
              >
                {generating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                <span>{generating ? "AI..." : "AI Generate"}</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 ml-1">Powered by Gemini — fills description, category &amp; price</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase ml-1">Price ($)</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                placeholder="21.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-8 pr-4 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:ring-1 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-slate-400"
              />
              <DollarSign size={13} className="absolute left-3.5 top-3.5 text-slate-400 font-bold" />
            </div>
          </div>
        </div>

        {/* Description line */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase ml-1">Product Description</label>
          <textarea
            rows={3}
            placeholder="Introduce ingredients, preps, and allergens information..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-1 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-slate-400 resize-none"
          ></textarea>
        </div>

        {/* Category picker rows */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase ml-1">Core Food Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full sm:w-64 bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:ring-1 focus:ring-red-500/20 focus:border-red-500 transition-all cursor-pointer"
          >
            {["Salad", "Rolls", "Deserts", "Sandwich", "Cake", "Pure Veg", "Pasta", "Noodles"].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-red-500 hover:bg-red-600 disabled:bg-slate-300 text-white rounded-full px-6 py-2.5 text-xs font-bold tracking-widest uppercase transition-all shadow-md cursor-pointer hover:shadow-lg hover:scale-105"
        >
          {saving ? "Registering Item..." : "Publish Food product"}
        </button>

      </form>
    </div>
  );
}

/* ============================================================================
   ADMIN SUB-VIEW: LIST INVENTORY PRODUCTS
   ============================================================================ */
interface ListSubViewProps {
  food_list: FoodItem[];
  handleDelete: (id: string) => Promise<boolean>;
}

function ListSubView({ food_list, handleDelete }: ListSubViewProps) {
  const [search, setSearch] = useState("");

  const filtered = food_list.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase()) || 
    f.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6" id="admin-list-subview">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-slate-50 pb-3">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Browse catalogue inventory</h3>
          <p className="text-xs text-slate-400 mt-0.5">Manage live food products and delete them dynamically.</p>
        </div>

        {/* Mini Search input */}
        <input
          type="text"
          placeholder="Filter catalog entries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-50 border border-slate-100 rounded-full py-1.5 px-4 text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:ring-1 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-slate-400 w-full sm:w-56"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-100">
        <table className="w-full text-xs text-left text-slate-500">
          <thead className="text-[10px] uppercase font-black tracking-wider text-slate-400 bg-slate-50 border-b border-slate-100 select-none">
            <tr>
              <th className="px-4 py-3">Visual</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3 text-center">Operation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((food) => (
              <tr key={food._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3">
                  <img src={food.image} alt={food.name} className="w-10 h-10 rounded-lg object-cover bg-slate-50 border border-slate-100" />
                </td>
                <td className="px-4 py-3 font-bold text-slate-700">{food.name}</td>
                <td className="px-4 py-3 font-semibold text-slate-400 uppercase tracking-wide text-[10px]">{food.category}</td>
                <td className="px-4 py-3 font-extrabold text-slate-800">${food.price.toFixed(2)}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleDelete(food._id)}
                    className="p-1.5 border border-red-50 text-red-500 hover:text-white hover:bg-red-500 rounded-lg hover:border-red-500 transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400 font-semibold">
                  No matching inventory entries listed.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================================================================
   ADMIN SUB-VIEW: MANAGE CLIENT DISPATCH ORDERS
   ============================================================================ */
interface OrdersSubViewProps {
  orders: OrderItem[];
  loading: boolean;
  handleRefresh: () => void;
  handleStatusUpdate: (orderId: string, status: string) => Promise<boolean>;
}

function OrdersSubView({ orders, loading, handleRefresh, handleStatusUpdate }: OrdersSubViewProps) {
  return (
    <div className="space-y-6" id="admin-orders-subview">
      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Review dispatch sheets</h3>
          <p className="text-xs text-slate-400 mt-0.5">Edit tracking statuses to update customers' delivery lines.</p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-205 text-slate-600 font-bold px-3 py-1.5 rounded-xl text-[10px] uppercase tracking-wider cursor-pointer active:scale-95 transition-transform"
        >
          <RefreshCw size={11} className={`${loading ? "animate-spin" : ""}`} />
          <span>Synchronize Sheet</span>
        </button>
      </div>

      {loading && orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 size={32} className="animate-spin text-red-500 mb-2" />
          <p className="text-[10px] font-bold uppercase tracking-wider">Syncing sheets...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-slate-400 font-semibold border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          There are currently no customer order tickets registered.
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => {
            const sumString = order.items.map(i => `${i.name} x ${i.quantity}`).join(", ");
            const totalItemsCount = order.items.reduce((acc, curr) => acc + curr.quantity, 0);

            return (
              <div
                key={order._id}
                className="border border-slate-100 hover:border-slate-350 p-5 rounded-2xl transition-all shadow-sm flex flex-col space-y-4"
              >
                {/* Meta head info */}
                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2 border-b border-slate-50 pb-3 text-xs">
                  <div>
                    <span className="font-bold text-red-500">Tomato Ticket Order</span>
                    <span className="text-slate-300 mx-2">|</span>
                    <span className="font-mono font-semibold text-slate-400">#{order._id}</span>
                  </div>
                  <span className="text-slate-400 font-bold">
                    {new Date(order.date).toLocaleDateString(undefined, {
                      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                    })}
                  </span>
                </div>

                {/* Grid info parameters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
                  {/* Summary lists Column */}
                  <div className="sm:col-span-2 space-y-2">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-1">Delicacies list</p>
                      <p className="font-extrabold text-slate-800 text-sm leading-snug">{sumString}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-1">
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-1">Customer Client</p>
                        <p className="text-slate-700 font-bold">{order.address.firstName} {order.address.lastName}</p>
                        <p className="text-slate-600 font-medium font-mono text-[10px] mt-0.5">{order.address.phone}</p>
                      </div>

                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-1">Fulfillment Spot</p>
                        <p className="text-slate-700 leading-normal max-w-xs">{order.address.street}, {order.address.city}, {order.address.zipCode}</p>
                      </div>
                    </div>
                  </div>

                  {/* Operational dispatch parameters settings Column */}
                  <div className="space-y-4 sm:border-l sm:border-slate-50 sm:pl-4">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-1">Financial State</p>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold">
                        <span className={`h-2 w-2 rounded-full ${order.payment ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                        <span className={order.payment ? 'text-emerald-600' : 'text-red-500'}>
                          {order.payment ? "Cleared Stripe" : "Awaiting Stripe Authorization"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-1">Adjust progress</p>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className={`w-full py-1.5 px-3 rounded-xl min-w-[140px] text-[11px] font-black uppercase tracking-wider outline-none border cursor-pointer ${
                          order.status === "Delivered"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : order.status === "Out for Delivery"
                            ? "bg-amber-50 text-amber-700 border-amber-100"
                            : "bg-blue-50 text-blue-700 border-blue-100"
                        }`}
                      >
                        {["Food Processing", "Out for Delivery", "Delivered"].map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Footer price */}
                <div className="flex justify-between items-center pt-2 border-t border-slate-50 text-xs text-slate-400 font-semibold bg-slate-50/50 p-2.5 rounded-xl">
                  <span>Count: <strong className="text-slate-700">{totalItemsCount} feeds</strong></span>
                  <span>Invoice Amount: <strong className="text-red-500 text-sm font-black">${order.amount.toFixed(2)}</strong></span>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
