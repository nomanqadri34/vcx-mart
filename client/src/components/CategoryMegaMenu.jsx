import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import api from '../services/api';

const CategoryMegaMenu = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories/tree');
      setCategories(response.data.data.categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleMouseEnter = (category) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveCategory(category);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setActiveCategory(null);
    }, 150);
  };

  const handleMenuMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMenuMouseLeave = () => {
    setIsOpen(false);
    setActiveCategory(null);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Main Categories */}
      <div className="flex items-center space-x-8">
        {categories.map((category) => (
          <div
            key={category._id}
            className="relative"
            onMouseEnter={() => handleMouseEnter(category)}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              to={`/category/${category._id}/products`}
              className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors ${
                activeCategory?._id === category._id
                  ? 'text-saffron-600'
                  : 'text-gray-700 hover:text-saffron-600'
              }`}
            >
              <span>{category.name}</span>
              {category.children && category.children.length > 0 && (
                <ChevronDownIcon className="h-4 w-4" />
              )}
            </Link>
          </div>
        ))}
      </div>

      {/* Mega Menu Dropdown */}
      {isOpen && activeCategory && activeCategory.children && activeCategory.children.length > 0 && (
        <div
          className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-200 z-50"
          onMouseEnter={handleMenuMouseEnter}
          onMouseLeave={handleMenuMouseLeave}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className={`grid gap-8 ${
              activeCategory.children.length <= 2 ? 'grid-cols-2' :
              activeCategory.children.length <= 3 ? 'grid-cols-3' :
              activeCategory.children.length <= 4 ? 'grid-cols-4' :
              'grid-cols-5'
            }`}>
              {activeCategory.children.map((subcategory) => (
                <div key={subcategory._id} className="space-y-4">
                  <Link
                    to={`/category/${subcategory._id}/products`}
                    className="block text-sm font-semibold text-gray-900 hover:text-saffron-600 transition-colors"
                  >
                    {subcategory.name}
                  </Link>
                  
                  {subcategory.children && subcategory.children.length > 0 && (
                    <ul className="space-y-2">
                      {subcategory.children.slice(0, 8).map((childCategory) => (
                        <li key={childCategory._id}>
                          <Link
                            to={`/category/${childCategory._id}/products`}
                            className="block text-sm text-gray-600 hover:text-saffron-600 transition-colors"
                          >
                            {childCategory.name}
                          </Link>
                        </li>
                      ))}
                      {subcategory.children.length > 8 && (
                        <li>
                          <Link
                            to={`/category/${subcategory._id}/products`}
                            className="block text-sm text-saffron-600 hover:text-saffron-700 font-medium"
                          >
                            View All ({subcategory.children.length})
                          </Link>
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryMegaMenu;