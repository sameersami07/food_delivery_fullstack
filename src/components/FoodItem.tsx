import React from "react";
import { useStore } from "../context/StoreContext";
import { Plus, Minus, Star } from "lucide-react";
import { FoodItem as FoodItemType } from "../types";

interface FoodItemProps {
  item: FoodItemType;
}

export default function FoodItem({ item }: FoodItemProps) {
  const { cartItems, addToCart, removeFromCart } = useStore();
  const quantity = cartItems[item._id] || 0;

  // Render yellow star ratings dynamically
  const renderStars = () => {
    return (
      <div className="flex items-center space-x-0.5 text-amber-400">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={13} fill="currentColor" className="stroke-transparent" />
        ))}
      </div>
    );
  };

  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group h-full"
      id={`food-card-${item._id}`}
    >
      {/* Food Visual Frame with add/remove indicators */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-50">
        <img
          src={item.image}
          alt={item.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Counter Overlay elements */}
        <div className="absolute bottom-3 right-3 z-10" id={`counter-overlay-${item._id}`}>
          {quantity === 0 ? (
            <button
              onClick={() => addToCart(item._id)}
              className="flex items-center space-x-1.5 bg-white text-slate-800 hover:text-red-500 rounded-full py-1.5 px-3 shadow-md border border-slate-100 font-semibold text-xs cursor-pointer transition-all active:scale-90 hover:scale-105"
            >
              <Plus size={14} className="stroke-[2.5]" />
              <span>Add</span>
            </button>
          ) : (
            <div className="flex items-center space-x-3 bg-red-500 text-white rounded-full p-1 shadow-lg ring-2 ring-white">
              <button
                onClick={() => removeFromCart(item._id)}
                className="w-6 h-6 rounded-full bg-red-600 hover:bg-red-700 font-bold text-white flex items-center justify-center transition-all active:scale-75 cursor-pointer"
              >
                <Minus size={12} className="stroke-[2.5]" />
              </button>
              
              <span className="text-xs font-bold w-4 text-center select-none">
                {quantity}
              </span>

              <button
                onClick={() => addToCart(item._id)}
                className="w-6 h-6 rounded-full bg-red-600 hover:bg-red-700 font-bold text-white flex items-center justify-center transition-all active:scale-75 cursor-pointer"
              >
                <Plus size={12} className="stroke-[2.5]" />
              </button>
            </div>
          )}
        </div>

        {/* Category Badge overlay */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200">
          {item.category}
        </span>
      </div>

      {/* Info elements */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1.5">
          <h3 className="font-bold text-slate-800 text-base leading-snug group-hover:text-red-500 transition-colors">
            {item.name}
          </h3>
        </div>

        {/* Dynamic Stars rating view */}
        <div className="mb-2">
          {renderStars()}
        </div>

        <p className="text-slate-400 text-xs font-normal leading-relaxed line-clamp-2 mb-4 flex-grow">
          {item.description}
        </p>

        <div className="flex justify-between items-center pt-2 border-t border-slate-50 mt-auto">
          <span className="text-slate-400 text-xs font-medium">Price</span>
          <span className="text-red-500 font-extrabold text-lg">
            ${item.price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
