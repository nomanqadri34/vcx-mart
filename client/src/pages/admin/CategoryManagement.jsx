import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import ImageUpload from "../../components/ImageUpload";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  FolderIcon,
  TagIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

const CategoryManagement = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parent: "",
    order: 0,
    isFeatured: false,
    metaTitle: "",
    metaDescription: "",
    commission: {
      rate: 10,
      type: "percentage",
    },
    image: null,
  });
  const [uploadedImages, setUploadedImages] = useState([]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const categoryData = { ...formData };

      // Add image data if uploaded
      if (uploadedImages.length > 0) {
        categoryData.image = {
          url: uploadedImages[0].url,
          publicId: uploadedImages[0].publicId,
        };
      }

      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, categoryData);
      } else {
        await api.post("/categories", categoryData);
      }

      setShowModal(false);
      setEditingCategory(null);
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error("Failed to save category:", error);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      parent: category.parent?._id || "",
      order: category.order,
      isFeatured: category.isFeatured,
      metaTitle: category.metaTitle || "",
      metaDescription: category.metaDescription || "",
      commission: category.commission || { rate: 10, type: "percentage" },
      image: category.image || null,
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
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await api.delete(`/categories/${categoryId}`);
        fetchCategories();
      } catch (error) {
        console.error("Failed to delete category:", error);
      }
    }
  };

  const toggleVisibility = async (category) => {
    try {
      await api.put(`/categories/${category._id}`, {
        ...category,
        isActive: !category.isActive,
      });
      fetchCategories();
    } catch (error) {
      console.error("Failed to toggle visibility:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      parent: "",
      order: 0,
      isFeatured: false,
      metaTitle: "",
      metaDescription: "",
      commission: {
        rate: 10,
        type: "percentage",
      },
      image: null,
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

  const toggleExpanded = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const renderCategoryTree = (categories, level = 0) => {
    return categories.map((category) => (
      <div key={category._id} className="border-b border-gray-200">
        <div
          className={`flex items-center justify-between p-4 hover:bg-gray-50 ${
            level > 0 ? `ml-${level * 6}` : ""
          }`}
        >
          <div className="flex items-center space-x-3">
            {category.children && category.children.length > 0 ? (
              <button
                onClick={() => toggleExpanded(category._id)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                {expandedCategories.has(category._id) ? (
                  <ChevronDownIcon className="h-4 w-4" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4" />
                )}
              </button>
            ) : (
              <div className="w-6 h-6" />
            )}

            <div className="flex items-center space-x-2">
              {level === 0 ? (
                <FolderIcon className="h-5 w-5 text-saffron-500" />
              ) : (
                <TagIcon className="h-4 w-4 text-gray-400" />
              )}
              <div>
                <h3 className="font-medium text-gray-900">{category.name}</h3>
                {category.description && (
                  <p className="text-sm text-gray-500">
                    {category.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {category.productCount || 0} products
            </span>

            {category.isFeatured && (
              <span className="px-2 py-1 text-xs bg-saffron-100 text-saffron-800 rounded-full">
                Featured
              </span>
            )}

            <span
              className={`px-2 py-1 text-xs rounded-full ${
                category.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {category.isActive ? "Active" : "Inactive"}
            </span>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => toggleVisibility(category)}
                className="p-2 text-gray-400 hover:text-gray-600"
                title={category.isActive ? "Hide category" : "Show category"}
              >
                {category.isActive ? (
                  <EyeIcon className="h-4 w-4" />
                ) : (
                  <EyeSlashIcon className="h-4 w-4" />
                )}
              </button>

              <button
                onClick={() => handleEdit(category)}
                className="p-2 text-gray-400 hover:text-saffron-600"
                title="Edit category"
              >
                <PencilIcon className="h-4 w-4" />
              </button>

              <button
                onClick={() => handleDelete(category._id)}
                className="p-2 text-gray-400 hover:text-red-600"
                title="Delete category"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {expandedCategories.has(category._id) &&
          category.children &&
          category.children.length > 0 && (
            <div className="ml-6">
              {renderCategoryTree(category.children, level + 1)}
            </div>
          )}
      </div>
    ));
  };

  const getAllCategoriesFlat = (categories, result = []) => {
    categories.forEach((category) => {
      result.push(category);
      if (category.children && category.children.length > 0) {
        getAllCategoriesFlat(category.children, result);
      }
    });
    return result;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Category Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage product categories and their hierarchy
              </p>
            </div>
            <button
              onClick={() => {
                setEditingCategory(null);
                resetForm();
                setShowModal(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-saffron-600 text-white font-medium rounded-lg hover:bg-saffron-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Category
            </button>
          </div>
        </div>

        {/* Categories List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              All Categories ({getAllCategoriesFlat(categories).length})
            </h2>
          </div>

          {categories.length === 0 ? (
            <div className="p-8 text-center">
              <FolderIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No categories found
              </h3>
              <p className="text-gray-500 mb-4">
                Get started by creating your first category
              </p>
              <button
                onClick={() => {
                  setEditingCategory(null);
                  resetForm();
                  setShowModal(true);
                }}
                className="inline-flex items-center px-4 py-2 bg-saffron-600 text-white font-medium rounded-lg hover:bg-saffron-700 transition-colors"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add First Category
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {renderCategoryTree(categories)}
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-saffron-500 focus:border-saffron-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parent Category
                    </label>
                    <select
                      value={formData.parent}
                      onChange={(e) =>
                        setFormData({ ...formData, parent: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-saffron-500 focus:border-saffron-500"
                    >
                      <option value="">Root Category</option>
                      {getAllCategoriesFlat(categories).map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-saffron-500 focus:border-saffron-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          order: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-saffron-500 focus:border-saffron-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commission Rate (%)
                    </label>
                    <input
                      type="number"
                      value={formData.commission.rate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          commission: {
                            ...formData.commission,
                            rate: parseFloat(e.target.value),
                          },
                        })
                      }
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-saffron-500 focus:border-saffron-500"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData({ ...formData, isFeatured: e.target.checked })
                    }
                    className="h-4 w-4 text-saffron-600 focus:ring-saffron-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isFeatured"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Featured Category
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      value={formData.metaTitle}
                      onChange={(e) =>
                        setFormData({ ...formData, metaTitle: e.target.value })
                      }
                      maxLength={60}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-saffron-500 focus:border-saffron-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      value={formData.metaDescription}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          metaDescription: e.target.value,
                        })
                      }
                      maxLength={160}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-saffron-500 focus:border-saffron-500"
                    />
                  </div>
                </div>

                {/* Category Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Image
                  </label>
                  <ImageUpload
                    onUpload={handleImageUpload}
                    multiple={false}
                    folder="categories"
                    existingImages={uploadedImages}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingCategory(null);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-saffron-600 text-white rounded-lg hover:bg-saffron-700 transition-colors"
                  >
                    {editingCategory ? "Update Category" : "Create Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManagement;
