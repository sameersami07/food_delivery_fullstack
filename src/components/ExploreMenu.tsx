import React from "react";

interface ExploreMenuProps {
  category: string;
  setCategory: (category: string) => void;
}

const MENU_LIST = [
  {
    menu_name: "Salad",
    menu_image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=120&auto=format&fit=crop&q=80"
  },
  {
    menu_name: "Rolls",
    menu_image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=120&auto=format&fit=crop&q=80"
  },
  {
    menu_name: "Deserts",
    menu_image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=120&auto=format&fit=crop&q=80"
  },
  {
    menu_name: "Sandwich",
    menu_image: "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=120&auto=format&fit=crop&q=80"
  },
  {
    menu_name: "Cake",
    menu_image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=120&auto=format&fit=crop&q=80"
  },
  {
    menu_name: "Pure Veg",
    menu_image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80"
  },
  {
    menu_name: "Pasta",
    menu_image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=120&auto=format&fit=crop&q=80"
  },
  {
    menu_name: "Noodles",
    menu_image: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=120&auto=format&fit=crop&q=80"
  }
];

export default function ExploreMenu({ category, setCategory }: ExploreMenuProps) {
  return (
    <div className="py-10 border-b border-slate-100" id="explore-menu">
      <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-2">
        Explore our menu
      </h2>
      <p className="text-slate-500 font-normal text-sm max-w-xl mb-8">
        Choose from our diverse categories of culinary items. Whether you are craving healthy greens, crispy rolls, creamy desserts, or noodles, we have it prepared.
      </p>

      {/* Horizontal horizontal flex list */}
      <div className="flex select-none items-center gap-6 sm:gap-8 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-200">
        {MENU_LIST.map((item, index) => {
          const isSelected = category === item.menu_name;
          return (
            <div
              key={index}
              onClick={() => setCategory(isSelected ? "All" : item.menu_name)}
              className="flex flex-col items-center flex-shrink-0 cursor-pointer group"
            >
              {/* Image bubble container */}
              <div className="relative p-1">
                <img
                  src={item.menu_image}
                  alt={item.menu_name}
                  referrerPolicy="no-referrer"
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shadow-md transition-all duration-300 transform group-hover:scale-105 group-active:scale-95 ${
                    isSelected
                      ? "ring-4 ring-red-500 ring-offset-2 scale-105"
                      : "ring-1 ring-slate-200/50"
                  }`}
                />
              </div>

              {/* Label text */}
              <p
                className={`mt-2.5 text-xs sm:text-sm transition-colors duration-200 ${
                  isSelected
                    ? "font-bold text-red-500"
                    : "font-medium text-slate-500 group-hover:text-slate-800"
                }`}
              >
                {item.menu_name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
