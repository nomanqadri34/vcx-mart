import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import api from '../services/api';

const DynamicCategoriesMegaMenu = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories/tree');
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const mainCategories = categories.filter(cat => cat.level === 0);

  const getSubcategories = (parentId) => {
    return categories.filter(cat => cat.parentCategory === parentId);
  };

  const getColumnCount = (subcategories) => {
    const count = subcategories.length;
    if (count <= 4) return 2;
    if (count <= 8) return 3;
    if (count <= 12) return 4;
    return 5;
  };

  const MegaMenuDropdown = ({ category }) => {
    const subcategories = getSubcategories(category._id);
    const columnCount = getColumnCount(subcategories);
    
    if (subcategories.length === 0) return null;

    const getGridClass = () => {
      switch(columnCount) {
        case 2: return 'grid-cols-2';
        case 3: return 'grid-cols-3';
        case 4: return 'grid-cols-4';
        case 5: return 'grid-cols-5';
        default: return 'grid-cols-3';
      }
    };

    return (
      <div className="absolute top-full left-0 w-full bg-white shadow-lg border-t-2 border-saffron-500 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className={`grid ${getGridClass()} gap-6`}>
            {subcategories.map((subcat) => {
              const childCategories = getSubcategories(subcat._id);
              return (
                <div key={subcat._id} className="space-y-3">
                  <Link
                    to={`/category/${subcat._id}/products`}
                    className="font-semibold text-gray-900 hover:text-saffron-600 block"
                  >
                    {subcat.name}
                  </Link>
                  {childCategories.length > 0 && (
                    <ul className="space-y-2">
                      {childCategories.map((child) => (
                        <li key={child._id}>
                          <Link
                            to={`/category/${child._id}/products`}
                            className="text-sm text-gray-600 hover:text-saffron-600 block"
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const MobileMenu = () => (
    <div className={`fixed inset-0 z-50 lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
      <div className="fixed top-0 left-0 w-80 h-full bg-white shadow-lg overflow-y-auto">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Categories</h2>
            <button onClick={() => setIsMobileMenuOpen(false)}>
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="p-4">
          {mainCategories.map((category) => {
            const subcategories = getSubcategories(category._id);
            return (
              <div key={category._id} className="mb-4">
                <Link
                  to={`/category/${category._id}/products`}
                  className="font-semibold text-gray-900 block py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
                {subcategories.length > 0 && (
                  <div className="ml-4 space-y-1">
                    {subcategories.map((subcat) => {
                      const childCategories = getSubcategories(subcat._id);
                      return (
                        <div key={subcat._id}>
                          <Link
                            to={`/category/${subcat._id}/products`}
                            className="text-gray-700 block py-1"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {subcat.name}
                          </Link>
                          {childCategories.length > 0 && (
                            <div className="ml-4 space-y-1">
                              {childCategories.map((child) => (
                                <Link
                                  key={child._id}
                                  to={`/category/${child._id}/products`}
                                  className="text-sm text-gray-600 block py-1"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  {child.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-8 h-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-b relative">
      {/* Mobile Menu Button */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex items-center space-x-2 text-gray-700"
        >
          <Bars3Icon className="h-6 w-6" />
          <span>Categories</span>
        </button>
      </div>

      {/* Desktop Menu */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-8">
            {mainCategories.map((category) => {
              const subcategories = getSubcategories(category._id);
              const hasSubcategories = subcategories.length > 0;

              return (
                <div
                  key={category._id}
                  className="relative"
                  onMouseEnter={() => hasSubcategories && setActiveDropdown(category._id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={`/category/${category._id}/products`}
                    className="flex items-center space-x-1 py-4 text-gray-700 hover:text-saffron-600 font-medium"
                  >
                    <span>{category.name}</span>
                    {hasSubcategories && (
                      <ChevronDownIcon className="h-4 w-4" />
                    )}
                  </Link>
                  
                  {hasSubcategories && activeDropdown === category._id && (
                    <MegaMenuDropdown category={category} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <MobileMenu />
    </div>
  );
};

export default DynamicCategoriesMegaMenu;