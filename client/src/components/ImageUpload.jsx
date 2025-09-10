import React, { useState } from "react";
import {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
} from "../utils/cloudinary";
import {
  PhotoIcon,
  XMarkIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";

const ImageUpload = ({
  onUpload,
  multiple = false,
  folder = "products",
  maxFiles = 5,
  existingImages = [],
  className = "",
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    if (multiple && fileArray.length + existingImages.length > maxFiles) {
      alert(`Maximum ${maxFiles} images allowed`);
      return;
    }

    if (!multiple && fileArray.length > 1) {
      alert("Only one image allowed");
      return;
    }

    setUploading(true);
    try {
      let uploadedImages;

      if (multiple) {
        uploadedImages = await uploadMultipleToCloudinary(fileArray, folder);
      } else {
        const result = await uploadToCloudinary(fileArray[0], folder);
        uploadedImages = [result];
      }

      onUpload(uploadedImages);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload images. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className={className}>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center hover:border-saffron-400 transition-colors ${
          dragActive ? "border-saffron-400 bg-saffron-50" : "border-gray-300"
        } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />

        <div className="space-y-4">
          {uploading ? (
            <div className="flex flex-col items-center">
              <CloudArrowUpIcon className="h-12 w-12 text-saffron-500 animate-bounce" />
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <PhotoIcon className="h-12 w-12 text-gray-400" />
              <div className="text-sm text-gray-600">
                <p className="font-medium">Click to upload or drag and drop</p>
                <p>PNG, JPG, GIF up to 10MB</p>
                {multiple && (
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum {maxFiles} images
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Show existing images */}
      {existingImages.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {existingImages.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image.url}
                alt={`Upload ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => {
                  const newImages = existingImages.filter(
                    (_, i) => i !== index
                  );
                  onUpload(newImages, true); // true indicates removal
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
