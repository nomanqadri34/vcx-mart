import React, { useState, useEffect } from "react";
import api from "../services/api";
import SellerCategoryForm from "./SellerCategoryForm";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  FolderIcon,
  TagIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

const CategorySelector = ({
  selectedCategory,
  onCategorySelect,
  className = "",
  allowCreate = false,
}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get("/categories/tree");
      setCategories(response.data.data.categories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleCategorySelect = (category) => {
    onCategorySelect(category);
    setShowDropdown(false);
  };

  const handleCategoryCreated = (newCategory) => {
    setCategories([...categories, newCategory]);
    handleCategorySelect(newCategory);
  };

  const renderCategoryTree = (categories, level = 0) => {
    return categories.map((category) => (
      <div key={category._id}>
        <div
          className={`flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer ${
            level > 0 ? `ml-${level * 4}` : ""
          } ${
            selectedCategory?._id === category._id
              ? "bg-saffron-50 border-l-2 border-saffron-500"
              : ""
          }`}
          onClick={() => handleCategorySelect(category)}
        >
          <div className="flex items-center space-x-2">
            {category.children && category.children.length > 0 ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpanded(category._id);
                }}
                className="p-1 hover:bg-gray-200 rounded"
              >
                {expandedCategories.has(category._id) ? (
                  <ChevronDownIcon className="h-3 w-3" />
                ) : (
                  <ChevronRightIcon className="h-3 w-3" />
                )}
              </button>
            ) : (
              <div className="w-5 h-5" />
            )}

            {level === 0 ? (
              <FolderIcon className="h-4 w-4 text-saffron-500" />
            ) : (
              <TagIcon className="h-3 w-3 text-gray-400" />
            )}

            <span className="text-sm text-gray-900">{category.name}</span>
          </div>
        </div>

        {expandedCategories.has(category._id) &&
          category.children &&
          category.children.length > 0 && (
            <div>{renderCategoryTree(category.children, level + 1)}</div>
          )}
      </div>
    ));
  };

  const getCategoryPath = (category) => {
    if (!category) return "Select a category";

    const path = [];
    let current = category;

    while (current) {
      path.unshift(current.name);
      current = current.parent;
    }

    return path.join(" > ");
  };

  if (loading) {
    return (
      <div className={`relative ${className}`}>
        <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
          <div className="animate-pulse flex space-x-2">
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`relative ${className}`}>
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-full px-3 py-2 text-left border border-gray-300 rounded-lg focus:ring-saffron-500 focus:border-saffron-500 bg-white flex items-center justify-between"
        >
          <span
            className={selectedCategory ? "text-gray-900" : "text-gray-500"}
          >
            {getCategoryPath(selectedCategory)}
          </span>
          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
        </button>

        {showDropdown && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {categories.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <FolderIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No categories available</p>
              </div>
            ) : (
              <div className="py-1">
                {renderCategoryTree(categories)}

                {allowCreate && (
                  <>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCreateForm(true);
                        setShowDropdown(false);
                      }}
                      className="w-full flex items-center space-x-2 p-2 text-saffron-600 hover:bg-saffron-50 transition-colors"
                    >
                      <PlusIcon className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Create New Category
                      </span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Overlay to close dropdown */}
        {showDropdown && (
          <div
            className="fixed inset-0 z-5"
            onClick={() => setShowDropdown(false)}
          />
        )}
      </div>

      {/* Category Creation Form */}
      {showCreateForm && (
        <SellerCategoryForm
          onCategoryCreated={handleCategoryCreated}
          onClose={() => setShowCreateForm(false)}
        />
      )}
    </>
  );
};

export default CategorySelector;
