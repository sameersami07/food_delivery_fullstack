import React, { useState } from "react";
import Header from "../components/Header";
import ExploreMenu from "../components/ExploreMenu";
import FoodDisplay from "../components/FoodDisplay";
import AppDownload from "../components/AppDownload";

export default function Home() {
  const [category, setCategory] = useState("All");

  const handleScrollToMenu = () => {
    const target = document.getElementById("explore-menu");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <Header onExploreClick={handleScrollToMenu} />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
      <AppDownload />
    </div>
  );
}
