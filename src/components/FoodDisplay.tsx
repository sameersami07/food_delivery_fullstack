import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import FoodItem from "./FoodItem";
import { Search, SlidersHorizontal, Layers, X } from "lucide-react";

interface FoodDisplayProps {
  category: string;
}

export default function FoodDisplay({ category }: FoodDisplayProps) {
  const { food_list } = useStore();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter food items based on selected category and text search query
  const filteredFood = food_list.filter((item) => {
    const matchesCategory = category === "All" || item.category === category;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-8" id="food-display-section">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            Top dishes near you
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Displaying {filteredFood.length} gourmet choices {category !== "All" && `in "${category}"`}
          </p>
        </div>

        {/* Live Search Input and control */}
        <div className="relative max-w-sm w-full sm:w-72">
          <input
            type="text"
            placeholder="Search gourmet menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-full py-2 pl-9 pr-8 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-slate-400"
          />
          <Search size={14} className="absolute left-3.5 top-3 text-slate-400 font-semibold" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-full transition-colors cursor-pointer"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Grid structure */}
      {filteredFood.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredFood.map((item) => (
            <div key={item._id} className="animate-fade-in">
              <FoodItem item={item} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4 animate-bounce">
            <SlidersHorizontal size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-700">No delicious matches found</h3>
          <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
            There are no gourmet food items matching your active category or search filter criteria.
          </p>
          {(category !== "All" || searchQuery !== "") && (
            <button
              onClick={() => {
                setSearchQuery("");
                // Just let dynamic filters reset in view
              }}
              className="mt-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-full px-5 py-2 text-xs transition-transform cursor-pointer hover:shadow-sm"
            >
              Clear Search Query
            </button>
          )}
        </div>
      )}
    </div>
  );
}
