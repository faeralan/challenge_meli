import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, LoadingSpinner, ErrorMessage } from '../styles/GlobalStyles';

// Custom hooks
import { useProductDetail, useImageGallery, useQuantityDropdown } from '../hooks/useProductDetail';
import { useProductActions } from '../hooks/useProductActions';

// Modular components
import {
  ImageGallery,
  ProductInfo,
  PurchaseSidebar,
  ProductDescription,
  ProductBreadcrumb
} from '../components/ProductDetail';

// Organized styles
import {
  ProductContainer,
  ProductWrapper,
  MainProductCard
} from '../components/ProductDetail/ProductDetail.styles';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Custom hooks to separate logic
  const { product, loading, error } = useProductDetail(id);
  const {
    selectedImageIndex,
    imageLoading,
    imageError,
    handleImageLoad,
    handleImageError,
    handleImageChange
  } = useImageGallery(product?.images || []);
  const {
    quantity,
    isQuantityDropdownOpen,
    getQuantityOptions,
    toggleQuantityDropdown,
    selectQuantity
  } = useQuantityDropdown(product?.stock || 1);
  
  // Local state for specific components
  const [selectedColor, setSelectedColor] = useState(0);

  // Product actions
  const { handleBuyNow, handleAddToCart } = useProductActions({
    product,
    quantity
  });

  // Loading and error states
  if (loading) {
    return (
      <ProductContainer>
        <Container>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
            <LoadingSpinner />
          </div>
        </Container>
      </ProductContainer>
    );
  }

  if (!product || error) {
    return (
      <ProductContainer>
        <Container>
          <ErrorMessage>
            Producto no encontrado
          </ErrorMessage>
        </Container>
      </ProductContainer>
    );
  }

  return (
    <ProductContainer>
      <ProductWrapper>
        <ProductBreadcrumb 
          category={product.category} 
          title={product.title}
        />

        <MainProductCard>
          {/* Galería de Imágenes */}
          <ImageGallery
            title={product.title}
            images={product.images}
            selectedImageIndex={selectedImageIndex}
            imageLoading={imageLoading}
            imageError={imageError}
            onImageChange={handleImageChange}
            onImageLoad={handleImageLoad}
            onImageError={handleImageError}
          />

          {/* Información del Producto */}
          <ProductInfo
            title={product.title}
            condition={product.condition}
            totalReviews={product.totalReviews}
            rating={product.rating}
            price={product.price}
            availableColors={product.availableColors}
            features={product.features}
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
          />

          {/* Sidebar de Compra */}
          <PurchaseSidebar
            product={product}
            quantity={quantity}
            isQuantityDropdownOpen={isQuantityDropdownOpen}
            getQuantityOptions={getQuantityOptions}
            toggleQuantityDropdown={toggleQuantityDropdown}
            selectQuantity={selectQuantity}
            onBuyNow={handleBuyNow}
            onAddToCart={handleAddToCart}
          />

          {/* Sección de Descripción */}
          <ProductDescription description={product.description} />
        </MainProductCard>
      </ProductWrapper>
    </ProductContainer>
  );
};

export default ProductDetail; 