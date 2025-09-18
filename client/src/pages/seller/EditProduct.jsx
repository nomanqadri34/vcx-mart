import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import toast from 'react-hot-toast';

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${productId}`);
      const productData = response.data.data || response.data;
      setProduct(productData);
      
      reset({
        name: productData.name || '',
        description: productData.description || '',
        price: productData.price || 0,
        status: productData.status || 'draft'
      });
    } catch (error) {
      console.error('Failed to load product:', error);
      toast.error('Failed to load product');
      navigate('/seller/products');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      await api.put(`/products/${productId}`, data);
      toast.success('Product updated successfully!');
      navigate('/seller/products');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update product');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Product not found</p>
          <button 
            onClick={() => navigate('/seller/products')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Product Name</label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Product name"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              className="w-full px-3 py-2 border rounded-md"
              rows={4}
              placeholder="Product description"
            />
            {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              {...register('price', { required: 'Price is required', min: 0 })}
              type="number"
              step="0.01"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="0.00"
            />
            {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              {...register('status', { required: 'Status is required' })}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {errors.status && <p className="text-red-600 text-sm mt-1">{errors.status.message}</p>}
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/seller/products')}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;