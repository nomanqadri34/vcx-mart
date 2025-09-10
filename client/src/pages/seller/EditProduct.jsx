import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  PhotoIcon,
  XMarkIcon,
  PlusIcon,
  FolderIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import api from "../../services/api";
import toast from "react-hot-toast";
import ImageUpload from "../../components/ImageUpload";
import CategorySelector from "../../components/CategorySelector";
import { useAuth } from "../../contexts/AuthContext";

const EditProduct = () => {
  const [categories, setCategories] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [keyHighlights, setKeyHighlights] = useState([]);
  const [productInfo, setProductInfo] = useState([]);
  const [productDetailsCustomFields, setProductDetailsCustomFields] = useState([]);
  const [dynamicProductDetails, setDynamicProductDetails] = useState([]);
  const navigate = useNavigate();
  const { productId } = useParams();
  const { user, isAuthenticated } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated) {
      toast.error("Please log in to access this page");
      navigate("/login");
      return;
    }

    // Check if user is a seller
    if (user && user.role !== "seller" && user.role !== "admin") {
      toast.error("You need to be a seller to access this page");
      navigate("/seller/become-seller");
      return;
    }

    fetchCategories();
    fetchProduct();
  }, [isAuthenticated, user, navigate, productId]);

  // Show loading state while checking authentication
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data.data.categories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      // Fallback to mock data if API fails
      setCategories([
        { _id: "1", name: "Electronics" },
        { _id: "2", name: "Fashion" },
        { _id: "3", name: "Home & Garden" },
        { _id: "4", name: "Sports" },
        { _id: "5", name: "Books" },
      ]);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${productId}`);
      const productData = response.data.data.product;

      console.log("Fetched product for editing:", productData);
      setProduct(productData);

      // Set form values
      reset({
        name: productData.name,
        sku: productData.sku,
        brand: productData.brand || "",
        price: productData.price || productData.basePrice,
        basePrice: productData.basePrice || productData.price,
        description: productData.description,
        shortDescription: productData.shortDescription || "",
        weight: productData.weight || "",
        lowStockThreshold: productData.lowStockThreshold || 10,

        metaTitle: productData.metaTitle || "",
        metaDescription: productData.metaDescription || "",
        status: productData.status || "draft",
      });

      // Set category
      if (productData.category) {
        setSelectedCategory(productData.category);
      }

      // Set images
      if (productData.images && productData.images.length > 0) {
        setSelectedImages(productData.images);
      }

      // Set additional fields
      if (productData.sizes && productData.sizes.length > 0) {
        setSizes(productData.sizes);
      }
      if (productData.colors && productData.colors.length > 0) {
        setColors(productData.colors);
      }
      if (
        productData.keyHighlightsCustomFields &&
        productData.keyHighlightsCustomFields.length > 0
      ) {
        setKeyHighlights(productData.keyHighlightsCustomFields);
      }
      if (
        productData.productInformationCustomFields &&
        productData.productInformationCustomFields.length > 0
      ) {
        setProductInfo(productData.productInformationCustomFields);
      }
      if (
        productData.productDetailsCustomFields &&
        productData.productDetailsCustomFields.length > 0
      ) {
        setProductDetailsCustomFields(productData.productDetailsCustomFields);
      }
      if (
        productData.dynamicProductDetails &&
        productData.dynamicProductDetails.length > 0
      ) {
        setDynamicProductDetails(productData.dynamicProductDetails);
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
      if (error.response?.status === 404) {
        toast.error("Product not found");
        navigate("/seller/products");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to edit this product");
        navigate("/seller/products");
      } else {
        toast.error("Failed to load product");
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (selectedImages.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }

    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare product data
      const productData = {
        ...data,
        category: selectedCategory._id,
        images: selectedImages.map((img, index) => ({
          url: img.url,
          publicId: img.publicId,
          alt: img.alt || `${data.name} - Image ${index + 1}`,
          isPrimary: index === 0,
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

      console.log("Updating product with data:", productData);

      const response = await api.put(`/products/${productId}`, productData);

      toast.success("Product updated successfully!");
      navigate("/seller/products");
    } catch (error) {
      console.error("Product update error:", error);

      // Handle different types of errors
      if (error.response?.status === 401) {
        toast.error("Your session has expired. Please log in again.");
        navigate("/login");
        return;
      }

      if (error.response?.status === 403) {
        toast.error("You don't have permission to update this product.");
        return;
      }

      if (error.response?.data?.error?.details) {
        // Handle validation errors
        const details = error.response.data.error.details;
        if (Array.isArray(details)) {
          details.forEach((detail) => {
            toast.error(detail.msg || detail.message || detail);
          });
        } else {
          toast.error(details);
        }
      } else {
        const errorMessage =
          error.response?.data?.error?.message || "Failed to update product";
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-green-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              to="/seller/products"
              className="inline-flex items-center text-saffron-600 hover:text-saffron-700"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-1" />
              Back to Products
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600 mt-2">
            Update your product information and settings
          </p>
        </div>

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
                  SKU *
                </label>
                <input
                  {...register("sku", { required: "SKU is required" })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                  placeholder="Product SKU"
                />
                {errors.sku && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.sku.message}
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
                  allowCreate={true}
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
                  Status *
                </label>
                <select
                  {...register("status", {
                    required: "Status is required",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
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

              {/* Dynamic Product Details Custom Fields */}
              <div className="border border-gray-300 p-4 rounded-md">
                <h3 className="text-md font-semibold text-gray-800 mb-3">Custom Product Specifications</h3>
                <p className="text-sm text-gray-600 mb-3">Add your own custom product details like dimensions, warranty, special features, etc.</p>
                {productDetailsCustomFields.map((field, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      placeholder="Field Name (e.g., Warranty, Dimensions)"
                      value={field.fieldName}
                      onChange={(e) => {
                        const updated = [...productDetailsCustomFields];
                        updated[index].fieldName = e.target.value;
                        setProductDetailsCustomFields(updated);
                      }}
                      className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-saffron-500 focus:ring-saffron-500 sm:text-sm"
                      required={productDetailsCustomFields.length > 0}
                    />
                    <select
                      value={field.fieldType}
                      onChange={(e) => {
                        const updated = [...productDetailsCustomFields];
                        updated[index].fieldType = e.target.value;
                        setProductDetailsCustomFields(updated);
                      }}
                      className="block w-1/6 rounded-md border-gray-300 shadow-sm focus:border-saffron-500 focus:ring-saffron-500 sm:text-sm"
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="select">Dropdown</option>
                      <option value="textarea">Long Text</option>
                    </select>
                    <input
                      type="text"
                      placeholder={field.fieldType === 'select' ? 'Options (comma-separated)' : 'Value or Description'}
                      value={field.fieldValue}
                      onChange={(e) => {
                        const updated = [...productDetailsCustomFields];
                        updated[index].fieldValue = e.target.value;
                        setProductDetailsCustomFields(updated);
                      }}
                      className="block w-1/2 rounded-md border-gray-300 shadow-sm focus:border-saffron-500 focus:ring-saffron-500 sm:text-sm"
                      required={productDetailsCustomFields.length > 0}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setProductDetailsCustomFields(
                          productDetailsCustomFields.filter((_, i) => i !== index)
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
                    setProductDetailsCustomFields([
                      ...productDetailsCustomFields,
                      { fieldName: "", fieldType: "text", fieldValue: "" },
                    ])
                  }
                  className="mt-2 text-sm text-saffron-600 hover:text-saffron-800"
                >
                  Add Custom Specification
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
              disabled={isSubmitting}
              className="px-6 py-2 bg-saffron-600 text-white rounded-md hover:bg-saffron-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </div>
              ) : (
                "Update Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
