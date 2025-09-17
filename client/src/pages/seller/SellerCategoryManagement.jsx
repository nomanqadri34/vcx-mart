import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import ImageUpload from "../../components/ImageUpload";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  FolderIcon,
  XMarkIcon,
  TagIcon,
  PhotoIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const SellerCategoryManagement = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parent: "",
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchMainCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get("/categories?level=1");
      const sellerCategories = response.data.data.categories.filter(
        (cat) => {
          const createdBy = cat.createdBy?._id || cat.createdBy;
          return createdBy === user._id;
        }
      );
      setCategories(sellerCategories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const fetchMainCategories = async () => {
    try {
      const response = await api.get("/categories/main");
      setMainCategories(response.data.data.categories);
    } catch (error) {
      console.error("Failed to fetch main categories:", error);
      toast.error("Failed to fetch main categories");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        parent: formData.parent,
        createdBy: user._id,
        isActive: true,
      };

      if (!categoryData.parent) {
        toast.error("Please select a main category");
        setSubmitting(false);
        return;
      }

      if (!categoryData.name) {
        toast.error("Please enter a category name");
        setSubmitting(false);
        return;
      }

      if (uploadedImages.length > 0) {
        categoryData.image = {
          url: uploadedImages[0].url,
          publicId: uploadedImages[0].publicId,
        };
      }

      try {
        // First try to create/update
        const response = editingCategory
          ? await api.put(`/categories/${editingCategory._id}`, categoryData)
          : await api.post("/categories", categoryData);

        await fetchCategories();
        toast.success(
          editingCategory
            ? "Category updated successfully!"
            : "Category created successfully!"
        );
        setShowModal(false);
        setEditingCategory(null);
        resetForm();
      } catch (apiError) {
        console.error("API Error:", apiError);

        // For 500 errors, check if the category was actually created
        if (apiError.response?.status === 500) {
          try {
            // Give the server a moment to finish processing
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Check if the category exists
            const check = await api.get("/categories?level=1");
            const exists = check.data.data.categories.some(
              (cat) =>
                cat.name === categoryData.name && cat.createdBy === user._id
            );

            if (exists) {
              await fetchCategories();
              toast.success("Category was created successfully!");
              setShowModal(false);
              setEditingCategory(null);
              resetForm();
              return;
            }
          } catch (verifyError) {
            console.error("Verification error:", verifyError);
          }
        }

        // Show error message if we get here
        toast.error(
          apiError.response?.data?.message ||
            "Failed to save category. Please try again."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      parent: category.parent?._id || "",
    });

    // Set existing image if available
    if (category.image?.url) {
      setUploadedImages([
        {
          url: category.image.url,
          publicId: category.image.publicId,
        },
      ]);
    } else {
      setUploadedImages([]);
    }

    setShowModal(true);
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      await api.delete(`/categories/${categoryId}`);
      toast.success("Category deleted successfully!");
      fetchCategories();
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast.error("Failed to delete category");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      parent: "",
    });
    setUploadedImages([]);
  };

  const handleImageUpload = (images, isRemoval = false) => {
    if (isRemoval) {
      setUploadedImages(images);
    } else {
      setUploadedImages([...uploadedImages, ...images]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-green-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                My Categories
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                Create and manage your product categories
              </p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link
                to="/seller/products/add"
                className="inline-flex items-center px-3 sm:px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Add Product</span>
                <span className="sm:hidden">Add</span>
                <ArrowRightIcon className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
              </Link>
              <button
                onClick={() => {
                  setEditingCategory(null);
                  resetForm();
                  setShowModal(true);
                }}
                className="inline-flex items-center px-3 sm:px-4 py-2 text-sm bg-saffron-600 text-white rounded-lg hover:bg-saffron-700 transition-colors"
              >
                <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Create Subcategory</span>
                <span className="sm:hidden">Create</span>
              </button>
            </div>
          </div>
        </div>

        {/* Getting Started Guide */}
        {categories.length === 0 && !loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-start">
              <FolderIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 mb-3 sm:mb-0 sm:mt-1" />
              <div className="sm:ml-4">
                <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-2">
                  Get Started with Categories
                </h3>
                <p className="text-sm sm:text-base text-blue-700 mb-4">
                  Categories help organize your products and make them easier
                  for customers to find. Create categories first, then add
                  products to them.
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={() => {
                      setEditingCategory(null);
                      resetForm();
                      setShowModal(true);
                    }}
                    className="inline-flex items-center px-3 sm:px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                    Create Your First Category
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Categories Grid */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center">
              <FolderIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No categories created yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-3 sm:p-6">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                      {category.image?.url ? (
                        <img
                          src={category.image.url}
                          alt={category.name}
                          className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-saffron-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FolderIcon className="h-5 w-5 sm:h-6 sm:w-6 text-saffron-600" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-lg font-semibold text-gray-900 truncate">
                          {category.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {category.productCount || 0} products
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-saffron-600 transition-colors"
                      >
                        <PencilIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <TrashIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  </div>

                  {category.description && (
                    <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 text-xs sm:text-sm text-gray-500">
                    <span className="truncate">
                      Created{" "}
                      {new Date(category.createdAt).toLocaleDateString()}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs self-start sm:self-auto ${
                        category.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Form Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-xs sm:max-w-md flex flex-col max-h-[90vh]">
              <div className="flex-shrink-0 flex items-center justify-between p-3 sm:p-6 border-b border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  {editingCategory ? "Edit Category" : "Create New Category"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col min-h-0 flex-1"
              >
                <div className="flex-1 overflow-y-auto p-3 sm:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Main Category *
                      </label>
                      <select
                        value={formData.parent}
                        onChange={(e) =>
                          setFormData({ ...formData, parent: e.target.value })
                        }
                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-saffron-500 focus:border-saffron-500"
                        required
                      >
                        <option value="">Select main category</option>
                        {mainCategories.map((mainCat) => (
                          <option key={mainCat._id} value={mainCat._id}>
                            {mainCat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Subcategory Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-saffron-500 focus:border-saffron-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        rows={2}
                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-saffron-500 focus:border-saffron-500 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Category Image
                      </label>
                      <div className="h-[150px] border border-gray-200 rounded-md relative">
                        <ImageUpload
                          onUpload={handleImageUpload}
                          multiple={false}
                          folder="categories"
                          existingImages={uploadedImages}
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 border-t border-gray-200 p-3 sm:p-4 bg-white">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 text-sm bg-saffron-600 text-white rounded-lg hover:bg-saffron-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                          <span>
                            {editingCategory ? "Updating..." : "Creating..."}
                          </span>
                        </>
                      ) : (
                        <>
                          <span>
                            {editingCategory ? "Update" : "Create"} Category
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerCategoryManagement;
