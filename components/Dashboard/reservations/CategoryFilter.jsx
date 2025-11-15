import React from "react";

const CategoryFilter = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-4 md:mb-6">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-colors ${
            selectedCategory === category
              ? "bg-beauty-rose-500 text-white"
              : "bg-white text-beauty-slate hover:bg-beauty-rose-50 border border-beauty-rose-200"
          }`}
        >
          {category === "all" ? "Wszystkie" : category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
