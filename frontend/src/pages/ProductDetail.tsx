import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, LoadingSpinner, ErrorMessage } from '../styles/GlobalStyles';

// Hooks personalizados
import { useProductDetail, useImageGallery, useQuantityDropdown } from '../hooks/useProductDetail';
import { useProductActions } from '../hooks/useProductActions';

// Componentes modulares
import {
  ImageGallery,
  ProductInfo,
  PurchaseSidebar,
  ProductDescription,
  ProductBreadcrumb
} from '../components/ProductDetail';

// Estilos organizados
import {
  ProductContainer,
  ProductWrapper,
  MainProductCard
} from '../components/ProductDetail/ProductDetail.styles';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Hooks personalizados para separar la lógica
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
  
  // Estado local para componentes específicos
  const [selectedColor, setSelectedColor] = useState(0);

  // Acciones del producto
  const { handleBuyNow, handleAddToCart } = useProductActions({
    product,
    quantity
  });

  // Estados de carga y error
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
        <ProductBreadcrumb />

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