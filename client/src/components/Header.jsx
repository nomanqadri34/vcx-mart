import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  TagIcon,
  HomeIcon,
  BuildingStorefrontIcon,
  HeartIcon,
  CubeIcon,
  FireIcon,
  InformationCircleIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();


  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMenuOpen(false);
      setIsSearchFocused(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { name: "Home", path: "/", icon: HomeIcon },
    { name: "Products", path: "/products", icon: CubeIcon },
    { name: "Categories", path: "/categories", icon: TagIcon },
    { name: "Deals", path: "/deals", icon: FireIcon },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-18">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="VCX MART"
                  className="h-10 w-10 object-contain transition-transform group-hover:scale-105"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div
                  className="w-10 h-10 bg-gradient-to-br from-saffron-500 via-orange-500 to-green-500 rounded-xl items-center justify-center shadow-lg hidden"
                  style={{ display: "none" }}
                >
                  <span className="text-white font-bold text-lg">V</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold bg-gradient-to-r from-saffron-600 to-green-600 bg-clip-text text-transparent">
                  VCX MART
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group ${active
                    ? "bg-gradient-to-r from-saffron-50 to-orange-50 text-saffron-700 shadow-sm"
                    : "text-gray-600 hover:text-saffron-600 hover:bg-gradient-to-r hover:from-saffron-50 hover:to-orange-50"
                    }`}
                >
                  <Icon
                    className={`h-4 w-4 transition-transform group-hover:scale-110 ${active ? "text-saffron-600" : ""
                      }`}
                  />
                  <span>{link.name}</span>
                  {active && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-saffron-500 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Search Bar */}
          <div className="hidden sm:flex flex-1 max-w-xl mx-4 lg:mx-8">
            <form onSubmit={handleSearch} className="relative w-full group">
              <div
                className={`relative transition-all duration-300 ${isSearchFocused ? "transform scale-105" : ""
                  }`}
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Search products, brands, categories..."
                  className="w-full pl-12 pr-20 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 focus:bg-white transition-all duration-300 text-sm placeholder-gray-400"
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-4 top-3.5 transition-colors group-focus-within:text-saffron-500" />
                <button
                  type="submit"
                  className="absolute right-2 top-1.5 px-4 py-1.5 bg-gradient-to-r from-saffron-600 to-orange-600 text-white text-xs font-medium rounded-xl hover:from-saffron-700 hover:to-orange-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
            {/* Wishlist - Hidden on mobile */}
            <Link
              to="/user/wishlist"
              className="relative p-2.5 text-gray-600 hover:text-saffron-600 transition-all duration-200 group hidden sm:block rounded-xl hover:bg-saffron-50"
            >
              <HeartIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
              <span className="sr-only">Wishlist</span>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2.5 text-gray-600 hover:text-saffron-600 transition-all duration-200 group rounded-xl hover:bg-saffron-50"
            >
              <ShoppingCartIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Link>



            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 text-gray-600 hover:text-saffron-600 transition-all duration-200 p-2 rounded-xl hover:bg-saffron-50 group"
              >
                {isAuthenticated ? (
                  <>
                    <div className="w-8 h-8 bg-gradient-to-br from-saffron-500 via-orange-500 to-green-500 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                      <span className="text-white font-semibold text-sm">
                        {user?.firstName?.charAt(0) ||
                          user?.email?.charAt(0) ||
                          "U"}
                      </span>
                    </div>
                    <span className="hidden lg:block text-sm font-medium">
                      {user?.firstName || "User"}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                      <svg
                        className="h-4 w-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <span className="hidden lg:block text-sm font-medium">
                      Account
                    </span>
                  </>
                )}
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform ${isUserMenuOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 backdrop-blur-md">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-saffron-50 hover:text-saffron-600 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <HomeIcon className="h-4 w-4 mr-3" />
                          Dashboard
                        </Link>

                        {user?.role === "seller" && (
                          <Link
                            to="/seller/dashboard"
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-saffron-50 hover:text-saffron-600 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <BuildingStorefrontIcon className="h-4 w-4 mr-3" />
                            Seller Dashboard
                          </Link>
                        )}

                        {user?.role === "admin" && (
                          <Link
                            to="/admin/dashboard"
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-saffron-50 hover:text-saffron-600 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <CubeIcon className="h-4 w-4 mr-3" />
                            Admin Dashboard
                          </Link>
                        )}

                        <Link
                          to="/user/profile"
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-saffron-50 hover:text-saffron-600 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <svg
                            className="h-4 w-4 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          Profile
                        </Link>

                        <Link
                          to="/user/orders"
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-saffron-50 hover:text-saffron-600 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <svg
                            className="h-4 w-4 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          My Orders
                        </Link>
                      </div>

                      <div className="border-t border-gray-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg
                            className="h-4 w-4 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="py-1">
                      <Link
                        to="/login"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-saffron-50 hover:text-saffron-600 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <svg
                          className="h-4 w-4 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                          />
                        </svg>
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="flex items-center px-4 py-2.5 text-sm text-white bg-gradient-to-r from-saffron-600 via-orange-600 to-green-600 hover:from-saffron-700 hover:via-orange-700 hover:to-green-700 transition-all mx-2 rounded-xl shadow-md"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <svg
                          className="h-4 w-4 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                          />
                        </svg>
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2.5 text-gray-600 hover:text-saffron-600 transition-colors rounded-xl hover:bg-saffron-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
              <span className="sr-only">Toggle menu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden" ref={mobileMenuRef}>
          <div className="bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg">
            <div className="px-4 py-4 space-y-3">
              {/* Mobile Search - Show on all mobile devices */}
              <div className="pb-3 border-b border-gray-100 sm:hidden">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 focus:bg-white transition-all text-sm"
                  />
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-4 top-3.5" />
                </form>
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${active
                        ? "bg-gradient-to-r from-saffron-50 to-orange-50 text-saffron-700"
                        : "text-gray-700 hover:text-saffron-600 hover:bg-saffron-50"
                        }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Wishlist Link */}
              <Link
                to="/user/wishlist"
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-saffron-600 hover:bg-saffron-50 transition-all sm:hidden"
                onClick={() => setIsMenuOpen(false)}
              >
                <HeartIcon className="h-5 w-5" />
                <span>Wishlist ({wishlistCount})</span>
              </Link>

              {/* Mobile Cart Link */}
              <Link
                to="/cart"
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-saffron-600 hover:bg-saffron-50 transition-all sm:hidden"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCartIcon className="h-5 w-5" />
                <span>Cart ({cartCount})</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
