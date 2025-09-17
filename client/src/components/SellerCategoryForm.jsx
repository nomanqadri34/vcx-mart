import React, { useState } from "react";
import { createPortal } from "react-dom";
import api from "../services/api";
import ImageUpload from "./ImageUpload";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const SellerCategoryForm = ({ onCategoryCreated, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const categoryData = { ...formData };

      // Add image data if uploaded
      if (uploadedImages.length > 0) {
        categoryData.image = {
          url: uploadedImages[0].url,
          publicId: uploadedImages[0].publicId,
        };
      }

      const response = await api.post("/categories", categoryData);

      toast.success("Category created successfully!");
      onCategoryCreated(response.data.data.category);
      onClose();
    } catch (error) {
      console.error("Failed to create category:", error);
      toast.error("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (images, isRemoval = false) => {
    if (isRemoval) {
      setUploadedImages(images);
    } else {
      setUploadedImages([...uploadedImages, ...images]);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 flex flex-col max-h-[90vh] relative">
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Create New Category
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-lg p-1 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col min-h-0 flex-1 relative"
        >
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 placeholder-gray-400"
                  placeholder="Enter category name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter category description"
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 resize-none placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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

          <div className="flex-shrink-0 border-t border-gray-200 p-4 bg-white sticky bottom-0 left-0 right-0 z-10">
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium bg-saffron-600 text-white rounded-md hover:bg-saffron-700 focus:outline-none focus:ring-2 focus:ring-saffron-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <PlusIcon className="h-4 w-4" />
                    <span>Create Category</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default SellerCategoryForm;
