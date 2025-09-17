import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  FolderIcon,
  TagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import ImageUpload from "../../components/ImageUpload";
import toast from "react-hot-toast";

const AdminCategoryManagement = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isFeatured: false,
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get("/categories?level=0");
      setCategories(response.data.data.categories || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!user || !user._id) {
        toast.error("Please login to continue");
        setSubmitting(false);
        return;
      }

      if (!formData.name.trim()) {
        toast.error("Please enter a category name");
        setSubmitting(false);
        return;
      }

      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        isFeatured: formData.isFeatured,
        isActive: true,
        createdBy: user._id
      };

      if (uploadedImages.length > 0) {
        categoryData.image = {
          url: uploadedImages[0].url,
          publicId: uploadedImages[0].publicId
        };
      }

      let response;
      if (editingCategory) {
        response = await api.put(`/categories/${editingCategory._id}`, categoryData);
        toast.success("Category updated successfully!");
      } else {
        response = await api.post("/categories", categoryData);
        toast.success("Category created successfully!");
      }

      setShowModal(false);
      setEditingCategory(null);
      resetForm();
      await fetchCategories();
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to create categories.");
      } else {
        const errorMsg = error.response?.data?.error?.message || error.response?.data?.message || "Failed to save category";
        toast.error(errorMsg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      isFeatured: category.isFeatured || false,
    });

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
      isFeatured: false,
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
                Categories
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                Create and manage main product categories
              </p>
            </div>
            <button
              onClick={() => {
                setEditingCategory(null);
                resetForm();
                setShowModal(true);
              }}
              className="inline-flex items-center px-3 sm:px-4 py-2 text-sm bg-saffron-600 text-white rounded-lg hover:bg-saffron-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              <span>Create Main Category</span>
            </button>
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
                  Main categories help organize products across your
                  marketplace. Create main categories that sellers can use to
                  list their products.
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
                        <div className="flex items-center space-x-2">
                          <p className="text-xs sm:text-sm text-gray-500">
                            {category.subcategoryCount || 0} subcategories
                          </p>
                          {category.isFeatured && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Featured
                            </span>
                          )}
                        </div>
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
                    <span className="px-2 py-1 rounded-full text-xs self-start sm:self-auto bg-green-100 text-green-800">
                      Active
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
                  {editingCategory ? "Edit Category" : "Create Main Category"}
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
                        Category Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-saffron-500 focus:border-saffron-500"
                        required
                        placeholder="Enter category name"
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
                        placeholder="Brief description of the category (optional)"
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

                    <div className="relative flex items-center">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          id="isFeatured"
                          checked={formData.isFeatured}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isFeatured: e.target.checked,
                            })
                          }
                          className="h-4 w-4 text-saffron-600 border-gray-300 rounded focus:ring-saffron-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="isFeatured"
                          className="font-medium text-gray-700"
                        >
                          Featured Category
                        </label>
                        <p className="text-gray-500 text-xs">
                          Featured categories are highlighted in the store
                        </p>
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
                        <span>
                          {editingCategory ? "Update" : "Create"} Category
                        </span>
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

export default AdminCategoryManagement;
