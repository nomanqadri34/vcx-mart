import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TagIcon, 
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import api from '../services/api';
import toast from 'react-hot-toast';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const defaultCategoryImage = 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop';

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchCategoryData(selectedCategory._id);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories');
      const allCategories = response.data.data.categories || [];
      const mainCategories = allCategories.filter(cat => cat.level === 0);
      setCategories(mainCategories);
      
      // Auto-select first category
      if (mainCategories.length > 0 && !selectedCategory) {
        setSelectedCategory(mainCategories[0]);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryData = async (categoryId) => {
    try {
      setProductsLoading(true);
      const [subcategoriesRes, productsRes] = await Promise.all([
        api.get(`/categories?parent=${categoryId}`),
        api.get(`/products?category=${categoryId}&limit=20`)
      ]);
      
      const subcategories = subcategoriesRes.data.data.categories || [];
      const categoryProducts = productsRes.data.data.products || [];
      
      setProducts({ subcategories, products: categoryProducts });
    } catch (error) {
      console.error('Failed to fetch category data:', error);
      setProducts({ subcategories: [], products: [] });
    } finally {
      setProductsLoading(false);
    }
  };

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsSidebarOpen(false);
  };

  const getCategoryImage = (category) => {
    if (category.image?.url) return category.image.url;
    if (category.image && typeof category.image === 'string') return category.image;
    return defaultCategoryImage;
  };

  const ProductCard = ({ product }) => (
    <Link to={`/product/${product._id}`} className="group">
      <div className="bg-white rounded-lg shadow-sm group-hover:shadow-md transition-all duration-200 overflow-hidden">
        <div className="aspect-square overflow-hidden">
          <img 
            src={product.images?.[0]?.url || defaultCategoryImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-3">
          <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">{product.name}</h3>
          <p className="text-saffron-600 font-semibold">₹{product.price || product.basePrice}</p>
        </div>
      </div>
    </Link>
  );

  const SubcategoryCard = ({ subcategory }) => (
    <Link to={`/category/${subcategory._id}/products`} className="group">
      <div className="bg-white rounded-lg shadow-sm group-hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100">
        <div className="aspect-video overflow-hidden">
          <img 
            src={getCategoryImage(subcategory)}
            alt={subcategory.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 group-hover:text-saffron-600 transition-colors">
            {subcategory.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{subcategory.description}</p>
        </div>
      </div>
    </Link>
  );

  const Sidebar = () => (
    <div className={`fixed lg:relative top-0 lg:top-auto bottom-16 lg:bottom-auto left-0 z-50 w-72 bg-white shadow-lg transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col lg:h-auto`}>
      <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
        <h2 className="font-semibold text-gray-900">Categories</h2>
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden p-1 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
      
      <div className="p-4 flex-shrink-0">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500"
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 pb-4">
        {loading ? (
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredCategories.map((category) => (
              <button
                key={category._id}
                onClick={() => handleCategorySelect(category)}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-left transition-colors ${
                  selectedCategory?._id === category._id
                    ? 'bg-saffron-50 text-saffron-700 border-l-4 border-saffron-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <img 
                    src={getCategoryImage(category)}
                    alt={category.name}
                    className="w-8 h-8 rounded object-cover"
                  />
                  <span className="font-medium text-sm">{category.name}</span>
                </div>
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 pb-16 md:pb-0">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-600 hover:text-saffron-600"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Categories</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex min-h-[calc(100vh-4rem)] lg:min-h-screen">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Right Panel */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {selectedCategory ? selectedCategory.name : 'Categories'}
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  {selectedCategory ? selectedCategory.description || 'Explore subcategories and products' : 'Select a category to view details'}
                </p>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 pb-20 md:pb-6">
            {!selectedCategory ? (
              <div className="text-center py-12">
                <TagIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Category</h3>
                <p className="text-gray-600">Choose a category from the sidebar to view subcategories and products</p>
              </div>
            ) : productsLoading ? (
              <div className="space-y-6">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-gray-200 aspect-video rounded-lg"></div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Subcategories */}
                {products.subcategories?.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Subcategories</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {products.subcategories.map((subcategory) => (
                        <SubcategoryCard key={subcategory._id} subcategory={subcategory} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Products */}
                {products.products?.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Products</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {products.products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {(!products.subcategories?.length && !products.products?.length) && (
                  <div className="text-center py-12">
                    <TagIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Content Available</h3>
                    <p className="text-gray-600">This category doesn't have any subcategories or products yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;