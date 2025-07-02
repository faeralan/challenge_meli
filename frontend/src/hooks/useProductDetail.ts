import { useState, useEffect } from 'react';
import { Product } from '../types';
import apiService from '../services/api';

export const useProductDetail = (id: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const productData = await apiService.getProduct(id);
        setProduct(productData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
};

export const useImageGallery = (images: string[] = []) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const handleImageChange = (index: number) => {
    setSelectedImageIndex(index);
    setImageLoading(true);
    setImageError(false);
  };

  // Check if the current image is already loaded (for cached images)
  const checkImageLoaded = (imageSrc: string) => {
    if (!imageSrc) return;
    
    const img = new Image();
    img.onload = () => {
      setImageLoading(false);
      setImageError(false);
    };
    img.onerror = () => {
      setImageLoading(false);
      setImageError(true);
    };
    
    // If the image is already complete (in cache), execute onload immediately
    if (img.complete) {
      setImageLoading(false);
      setImageError(false);
    } else {
      img.src = imageSrc;
    }
  };

  useEffect(() => {
    if (images.length > 0) {
      setSelectedImageIndex(0);
      setImageLoading(true);
      setImageError(false);
      
      // Check if the first image is already loaded
      checkImageLoaded(images[0]);
    }
  }, [images]);

  // Check image when the selected index changes
  useEffect(() => {
    if (images[selectedImageIndex]) {
      checkImageLoaded(images[selectedImageIndex]);
    }
  }, [selectedImageIndex, images]);

  return {
    selectedImageIndex,
    imageLoading,
    imageError,
    handleImageLoad,
    handleImageError,
    handleImageChange,
  };
};

export const useQuantityDropdown = (initialStock: number = 1) => {
  const [quantity, setQuantity] = useState(1);
  const [isQuantityDropdownOpen, setIsQuantityDropdownOpen] = useState(false);

  const getQuantityOptions = (stock: number) => {
    const maxQuantity = Math.min(stock, 10);
    return Array.from({ length: maxQuantity }, (_, i) => i + 1);
  };

  const toggleQuantityDropdown = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setIsQuantityDropdownOpen(!isQuantityDropdownOpen);
  };

  const selectQuantity = (newQuantity: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setQuantity(newQuantity);
    setIsQuantityDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isQuantityDropdownOpen && !target.closest('[data-dropdown="quantity"]')) {
        setIsQuantityDropdownOpen(false);
      }
    };

    if (isQuantityDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isQuantityDropdownOpen]);

  useEffect(() => {
    if (initialStock === 1) {
      setQuantity(1);
    }
  }, [initialStock]);

  return {
    quantity,
    isQuantityDropdownOpen,
    getQuantityOptions,
    toggleQuantityDropdown,
    selectQuantity,
  };
}; 