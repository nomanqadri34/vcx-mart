import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link, useParams } from "react-router-dom";
import {
  PhotoIcon,
  XMarkIcon,
  PlusIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";
import api from "../../services/api";
import toast from "react-hot-toast";
import ImageUpload from "../../components/ImageUpload";
import CategorySelector from "../../components/CategorySelector";
import { useAuth } from "../../contexts/AuthContext";

// Debounce utility
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const AddProduct = () => {
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [keyHighlights, setKeyHighlights] = useState([]);
  const [productInfo, setProductInfo] = useState([]);
  const [productDetailsCustomFields, setProductDetailsCustomFields] = useState([]);
  const [dynamicProductDetails, setDynamicProductDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { productId } = useParams();
  const isEditing = !!productId;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm();

  const watchedName = watch("name");

  // Define functions before useEffect to avoid hoisting issues
  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get("/categories/tree");
      const allCategories = response.data.data || [];
      setCategories(allCategories);
      setCategoriesCount(allCategories.length);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setCategories([]);
      setCategoriesCount(0);
    }
  }, []);

  const loadProduct = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading product with ID:', productId);

      if (!productId) {
        console.error('❌ No product ID provided');
        toast.error('No product ID provided');
        navigate('/seller/products');
        return;
      }

      if (productId.length !== 24) {
        console.warn(`⚠️ Product ID has ${productId.length} characters instead of 24:`, productId);
        // Continue anyway to see what happens
      }

      console.log('📡 Making API call to /products/' + productId);
      const response = await api.get(`/products/${productId}`);
      console.log('📦 API Response:', response.data);

      const product = response.data.data?.product || response.data.data || response.data;
      console.log('🎯 Extracted product:', product);

      if (!product) {
        console.error('❌ No product data found');
        toast.error('Product not found');
        navigate('/seller/products');
        return;
      }

      console.log('✅ Product loaded successfully, resetting form with:', {
        name: product.name,
        description: product.description,
        price: product.price,
        status: product.status
      });

      reset({
        name: product.name || '',
        description: product.description || '',
        shortDescription: product.shortDescription || '',
        brand: product.brand || '',
        price: product.price || 0,
        discountedPrice: product.discountedPrice || '',
        status: product.status || 'draft',
        isAccessory: product.isAccessory || false,
        weight: product.weight || '',
        lowStockThreshold: product.lowStockThreshold || 10,
        metaTitle: product.metaTitle || '',
        metaDescription: product.metaDescription || ''
      });

      if (product.category) {
        console.log('🏷️ Setting category:', product.category);
        setSelectedCategory(product.category);
      }
      if (product.images) {
        console.log('🖼️ Setting images:', product.images);
        setSelectedImages(product.images);
      }
      if (product.sizes) setSizes(product.sizes);
      if (product.colors) setColors(product.colors);
      if (product.keyHighlightsCustomFields) setKeyHighlights(product.keyHighlightsCustomFields);
      if (product.productInformationCustomFields) setProductInfo(product.productInformationCustomFields);
      if (product.dynamicProductDetails) setDynamicProductDetails(product.dynamicProductDetails);

      console.log('✅ Product data loaded and form populated');

    } catch (error) {
      console.error('❌ Failed to load product:', error);
      console.error('Error details:', error.response?.data);

      if (error.response?.status === 404) {
        toast.error('Product not found');
      } else if (error.response?.status === 400) {
        toast.error('Invalid product ID format');
      } else {
        toast.error('Failed to load product data');
      }

      // Don't navigate away immediately, show error state
      setLoading(false);
      return;
    } finally {
      setLoading(false);
    }
  }, [productId, navigate, reset]);

  useEffect(() => {
    console.log('🔄 useEffect triggered with:', {
      isAuthenticated,
      user: !!user,
      isEditing,
      productId,
      userRole: user?.role
    });

    // Check authentication
    if (!isAuthenticated) {
      console.log('❌ Not authenticated, redirecting to login');
      toast.error("Please log in to access this page");
      navigate("/login");
      return;
    }

    // Check if user is a seller
    if (user && user.role !== "seller" && user.role !== "admin") {
      console.log('❌ User is not a seller, redirecting');
      toast.error("You need to be a seller to access this page");
      navigate("/seller/become-seller");
      return;
    }

    console.log('✅ Authentication checks passed');

    fetchCategories();

    if (isEditing) {
      console.log('📝 In editing mode, calling loadProduct()');
      loadProduct();
    } else {
      console.log('➕ In add mode, not loading product');
      setLoading(false);
    }
  }, [isAuthenticated, user, navigate, isEditing, productId, fetchCategories, loadProduct]);

  // Show loading state while checking authentication or loading product
  if (!isAuthenticated || !user || (isEditing && loading)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isEditing && loading ? "Loading product data..." : "Loading..."}
          </p>
          {isEditing && (
            <p className="text-xs text-gray-400 mt-2">
              Product ID: {productId}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Debug: Show what's happening
  console.log('🔍 AddProduct render:', {
    isAuthenticated,
    user: !!user,
    isEditing,
    loading,
    productId,
    currentURL: window.location.href,
    params: useParams()
  });

  const onSubmit = async (data) => {
    if (selectedImages.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }

    if (!selectedCategory) {
      toast.error("Please select a category or create one first");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare product data with Cloudinary images
      const productData = {
        ...data,
        // SKU will be auto-generated on the backend
        category: selectedCategory._id,
        images: selectedImages.map((img, index) => ({
          url: img.url,
          publicId: img.publicId,
          alt: `${data.name} - Image ${index + 1}`,
          isPrimary: index === 0, // First image is primary
          order: index,
        })),
        // Ensure numeric fields are properly formatted
        price: parseFloat(data.price),
        basePrice: parseFloat(data.price), // Keep for backward compatibility
        weight: data.weight ? parseFloat(data.weight) : undefined,
        lowStockThreshold: data.lowStockThreshold
          ? parseInt(data.lowStockThreshold)
          : 10,
        discountedPrice: data.discountedPrice
          ? parseFloat(data.discountedPrice)
          : undefined,
        // Add arrays and custom fields
        sizes: sizes.filter((s) => s.size && s.stock >= 0),
        colors: colors,
        keyHighlightsCustomFields: keyHighlights.filter(
          (h) => h.heading && h.value
        ),
        productInformationCustomFields: productInfo.filter(
          (p) => p.heading && p.value
        ),
        productDetailsCustomFields: productDetailsCustomFields.filter(
          (f) => f.fieldName && f.fieldValue
        ),
        dynamicProductDetails: dynamicProductDetails.filter(
          (d) => d.fieldName && (d.fieldValue || d.fieldOptions)
        ),
        // Convert checkbox to boolean
        isAccessory: data.isAccessory === true || data.isAccessory === "true",
      };

      console.log("Sending product data:", productData);

      const response = isEditing
        ? await api.put(`/products/${productId}`, productData)
        : await api.post("/products", productData);

      toast.success(isEditing ? "Product updated successfully!" : "Product created successfully!");
      navigate("/seller/products");
    } catch (error) {
      console.error("Product creation error:", error);

      // Handle different types of errors
      if (error.response?.status === 401) {
        toast.error("Your session has expired. Please log in again.");
        navigate("/login");
        return;
      }

      // Handle specific error types
      const errorData = error.response?.data?.error;

      if (errorData?.code === 'DUPLICATE_SKU' || errorData?.code === 'DUPLICATE_SLUG') {
        toast.error("Unable to create product due to a system conflict. Please try again in a moment.");
        // Auto-retry after a short delay
        setTimeout(() => {
          toast.success("Retrying product creation...");
          handleSubmit(getValues())(); // Retry the submission
        }, 2000);
        return;
      }

      if (errorData?.details) {
        // Handle validation errors
        const details = errorData.details;
        if (Array.isArray(details)) {
          details.forEach((detail) => {
            toast.error(detail.msg || detail.message || detail);
          });
        } else {
          toast.error(details);
        }
      } else {
        const errorMessage = errorData?.message || "Failed to create product";
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleImageUpload = (images, isRemoval = false) => {
    if (isRemoval) {
      setSelectedImages(images);
    } else {
      setSelectedImages([...selectedImages, ...images]);
    }
  };

  // Show error state if there's an error
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-green-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Error Loading Page</strong>
            <p className="block sm:inline">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-saffron-600 text-white px-4 py-2 rounded hover:bg-saffron-700 mr-2"
          >
            Reload Page
          </button>
          <button
            onClick={() => navigate('/seller/products')}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-green-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditing ? "Update your product information" : "Create a new product listing for your store"}
          </p>
          {isEditing && productId && (
            <p className="text-xs text-gray-500 mt-1">
              Product ID: {productId} ({productId.length} characters)
            </p>
          )}
        </div>

        {/* Category Reminder Banner */}
        {categoriesCount === 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <FolderIcon className="h-8 w-8 text-amber-500 mt-1" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-amber-900 mb-2">
                  Create Categories First
                </h3>
                <p className="text-amber-700 mb-4">
                  Before adding products, you need to create categories to
                  organize them. Categories help customers find your products
                  easily.
                </p>
                <Link
                  to="/seller/categories"
                  className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create Categories First
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  {...register("name", {
                    required: "Product name is required",
                  })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <CategorySelector
                  selectedCategory={selectedCategory}
                  onCategorySelect={handleCategorySelect}
                  allowCreate={false}
                  className="w-full"
                />
                {!selectedCategory && (
                  <p className="mt-1 text-sm text-red-600">
                    Category is required
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand
                </label>
                <input
                  {...register("brand")}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                  placeholder="Brand name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <input
                  {...register("price", {
                    required: "Price is required",
                    min: { value: 0, message: "Price must be positive" },
                  })}
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discounted Price
                </label>
                <input
                  {...register("discountedPrice")}
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                  placeholder="0.00"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Optional: Set a sale price lower than the regular price
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  {...register("status", {
                    required: "Status is required",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                  defaultValue="draft"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.status.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Draft: Save for later editing • Active: Visible to customers •
                  Inactive: Hidden from customers • Out of Stock: Temporarily
                  unavailable
                </p>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    {...register("isAccessory")}
                    type="checkbox"
                    className="rounded border-gray-300 text-saffron-600 focus:ring-saffron-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Is Accessory Product
                  </span>
                </label>
                <p className="mt-1 text-xs text-gray-500">
                  Check if this is an accessory item (jewelry, bags, etc.)
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  {...register("description", {
                    required: "Description is required",
                  })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                  placeholder="Detailed product description"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description
                </label>
                <textarea
                  {...register("shortDescription")}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                  placeholder="Brief product summary"
                />
              </div>
            </div>
          </div>

          {/* Dynamic Product Details */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Product Details
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Create custom product details that are specific to your product. Add any fields you need like Gender, Material, Dimensions, Features, etc.
            </p>

            <div className="border border-gray-300 p-4 rounded-md">
              <h3 className="text-md font-semibold text-gray-800 mb-3">Custom Product Details</h3>
              {dynamicProductDetails.map((detail, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3 p-3 bg-gray-50 rounded-md">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Field Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Gender, Material, Size"
                      value={detail.fieldName}
                      onChange={(e) => {
                        const updated = [...dynamicProductDetails];
                        updated[index].fieldName = e.target.value;
                        setDynamicProductDetails(updated);
                      }}
                      className="w-full px-2 py-1 text-sm rounded-md border-gray-300 shadow-sm focus:border-saffron-500 focus:ring-saffron-500"
                      required={dynamicProductDetails.length > 0}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Field Type</label>
                    <select
                      value={detail.fieldType}
                      onChange={(e) => {
                        const updated = [...dynamicProductDetails];
                        updated[index].fieldType = e.target.value;
                        // Reset fieldValue when type changes
                        updated[index].fieldValue = "";
                        updated[index].fieldOptions = "";
                        setDynamicProductDetails(updated);
                      }}
                      className="w-full px-2 py-1 text-sm rounded-md border-gray-300 shadow-sm focus:border-saffron-500 focus:ring-saffron-500"
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="select">Dropdown</option>
                      <option value="textarea">Long Text</option>
                      <option value="checkbox">Checkbox</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {detail.fieldType === 'select' ? 'Options' : detail.fieldType === 'checkbox' ? 'Label' : 'Value'}
                    </label>
                    {detail.fieldType === 'select' ? (
                      <input
                        type="text"
                        placeholder="Option1, Option2, Option3"
                        value={detail.fieldOptions || ""}
                        onChange={(e) => {
                          const updated = [...dynamicProductDetails];
                          updated[index].fieldOptions = e.target.value;
                          setDynamicProductDetails(updated);
                        }}
                        className="w-full px-2 py-1 text-sm rounded-md border-gray-300 shadow-sm focus:border-saffron-500 focus:ring-saffron-500"
                      />
                    ) : detail.fieldType === 'textarea' ? (
                      <textarea
                        placeholder="Enter description"
                        value={detail.fieldValue}
                        onChange={(e) => {
                          const updated = [...dynamicProductDetails];
                          updated[index].fieldValue = e.target.value;
                          setDynamicProductDetails(updated);
                        }}
                        rows={2}
                        className="w-full px-2 py-1 text-sm rounded-md border-gray-300 shadow-sm focus:border-saffron-500 focus:ring-saffron-500"
                      />
                    ) : detail.fieldType === 'checkbox' ? (
                      <input
                        type="text"
                        placeholder="e.g., 'Is Premium'"
                        value={detail.fieldValue}
                        onChange={(e) => {
                          const updated = [...dynamicProductDetails];
                          updated[index].fieldValue = e.target.value;
                          setDynamicProductDetails(updated);
                        }}
                        className="w-full px-2 py-1 text-sm rounded-md border-gray-300 shadow-sm focus:border-saffron-500 focus:ring-saffron-500"
                      />
                    ) : (
                      <input
                        type={detail.fieldType === 'number' ? 'number' : 'text'}
                        placeholder={detail.fieldType === 'number' ? '0' : 'Enter value'}
                        value={detail.fieldValue}
                        onChange={(e) => {
                          const updated = [...dynamicProductDetails];
                          updated[index].fieldValue = e.target.value;
                          setDynamicProductDetails(updated);
                        }}
                        className="w-full px-2 py-1 text-sm rounded-md border-gray-300 shadow-sm focus:border-saffron-500 focus:ring-saffron-500"
                      />
                    )}
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() =>
                        setDynamicProductDetails(
                          dynamicProductDetails.filter((_, i) => i !== index)
                        )
                      }
                      className="w-full px-2 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">💡 Popular Product Detail Examples:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-blue-700">
                  <div>
                    <strong>Fashion:</strong> Gender, Material, Pattern, Fit Type, Sleeve Type, Care Instructions
                  </div>
                  <div>
                    <strong>Electronics:</strong> Brand, Model, Warranty, Compatibility, Power Rating, Dimensions
                  </div>
                  <div>
                    <strong>Home & Garden:</strong> Material, Dimensions, Weight, Color, Installation Required
                  </div>
                  <div>
                    <strong>Books:</strong> Author, Publisher, Language, Pages, ISBN, Edition
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setDynamicProductDetails([
                    ...dynamicProductDetails,
                    { fieldName: "", fieldType: "text", fieldValue: "", fieldOptions: "" },
                  ])
                }
                className="mt-4 px-4 py-2 bg-saffron-600 text-white rounded-md hover:bg-saffron-700 transition-colors"
              >
                ➕ Add Product Detail
              </button>
            </div>
          </div>

          {/* Sizes & Colors */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Sizes & Colors
            </h2>

            <div className="space-y-6">
              {/* Sizes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Sizes
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`size-${size}`}
                        checked={sizes.some((s) => s.size === size)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSizes([...sizes, { size, stock: 0 }]);
                          } else {
                            setSizes(sizes.filter((s) => s.size !== size));
                          }
                        }}
                        className="rounded border-gray-300 text-saffron-600 focus:ring-saffron-500"
                      />
                      <label
                        htmlFor={`size-${size}`}
                        className="text-sm font-medium text-gray-700"
                      >
                        {size}
                      </label>
                      {sizes.find((s) => s.size === size) && (
                        <input
                          type="number"
                          placeholder="Stock"
                          min="0"
                          value={sizes.find((s) => s.size === size)?.stock || 0}
                          className="w-16 px-2 py-1 text-xs border border-gray-300 rounded"
                          onChange={(e) => {
                            setSizes(
                              sizes.map((s) =>
                                s.size === size
                                  ? {
                                    ...s,
                                    stock: parseInt(e.target.value) || 0,
                                  }
                                  : s
                              )
                            );
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Colors
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {colors.map((color, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {color}
                      <button
                        type="button"
                        onClick={() =>
                          setColors(colors.filter((_, i) => i !== index))
                        }
                        className="ml-2 text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Add color"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const value = e.target.value.trim();
                        if (value && !colors.includes(value)) {
                          setColors([...colors, value]);
                          e.target.value = "";
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = e.target.previousElementSibling;
                      const value = input.value.trim();
                      if (value && !colors.includes(value)) {
                        setColors([...colors, value]);
                        input.value = "";
                      }
                    }}
                    className="px-4 py-2 bg-saffron-600 text-white rounded-md hover:bg-saffron-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Product Images
            </h2>

            <ImageUpload
              onUpload={handleImageUpload}
              multiple={true}
              folder="products"
              maxFiles={10}
              existingImages={selectedImages}
              className="w-full"
            />
          </div>

          {/* Inventory & Shipping */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Inventory & Shipping
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  {...register("weight")}
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Low Stock Threshold
                </label>
                <input
                  {...register("lowStockThreshold")}
                  type="number"
                  defaultValue={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                />
              </div>


            </div>
          </div>

          {/* Custom Fields */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Additional Information
            </h2>

            <div className="space-y-6">
              {/* Dynamic Key Highlights Fields */}
              <div className="border border-gray-300 p-4 rounded-md">
                <h3 className="text-md font-semibold text-gray-800 mb-3">Custom Key Highlights</h3>
                {keyHighlights.map((highlight, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      placeholder="Heading"
                      value={highlight.heading}
                      onChange={(e) => {
                        const updated = [...keyHighlights];
                        updated[index].heading = e.target.value;
                        setKeyHighlights(updated);
                      }}
                      className="block w-1/2 rounded-md border-gray-300 shadow-sm focus:border-saffron-500 focus:ring-saffron-500 sm:text-sm"
                      required={keyHighlights.length > 0}
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={highlight.value}
                      onChange={(e) => {
                        const updated = [...keyHighlights];
                        updated[index].value = e.target.value;
                        setKeyHighlights(updated);
                      }}
                      className="block w-1/2 rounded-md border-gray-300 shadow-sm focus:border-saffron-500 focus:ring-saffron-500 sm:text-sm"
                      required={keyHighlights.length > 0}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setKeyHighlights(
                          keyHighlights.filter((_, i) => i !== index)
                        )
                      }
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setKeyHighlights([
                      ...keyHighlights,
                      { heading: "", value: "" },
                    ])
                  }
                  className="mt-2 text-sm text-saffron-600 hover:text-saffron-800"
                >
                  Add Custom Highlight
                </button>
              </div>

              {/* Dynamic Product Information Fields */}
              <div className="border border-gray-300 p-4 rounded-md">
                <h3 className="text-md font-semibold text-gray-800 mb-3">Custom Product Information</h3>
                {productInfo.map((info, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      placeholder="Heading"
                      value={info.heading}
                      onChange={(e) => {
                        const updated = [...productInfo];
                        updated[index].heading = e.target.value;
                        setProductInfo(updated);
                      }}
                      className="block w-1/2 rounded-md border-gray-300 shadow-sm focus:border-saffron-500 focus:ring-saffron-500 sm:text-sm"
                      required={productInfo.length > 0}
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={info.value}
                      onChange={(e) => {
                        const updated = [...productInfo];
                        updated[index].value = e.target.value;
                        setProductInfo(updated);
                      }}
                      className="block w-1/2 rounded-md border-gray-300 shadow-sm focus:border-saffron-500 focus:ring-saffron-500 sm:text-sm"
                      required={productInfo.length > 0}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setProductInfo(
                          productInfo.filter((_, i) => i !== index)
                        )
                      }
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setProductInfo([...productInfo, { heading: "", value: "" }])
                  }
                  className="mt-2 text-sm text-saffron-600 hover:text-saffron-800"
                >
                  Add Custom Information
                </button>
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              SEO Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Title
                </label>
                <input
                  {...register("metaTitle")}
                  type="text"
                  maxLength={60}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                  placeholder="SEO title (max 60 characters)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  {...register("metaDescription")}
                  rows={2}
                  maxLength={160}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                  placeholder="SEO description (max 160 characters)"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/seller/products")}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="px-6 py-2 bg-saffron-600 text-white rounded-md hover:bg-saffron-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditing ? "Updating..." : "Creating..."}
                </div>
              ) : (
                isEditing ? "Update Product" : "Create Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
