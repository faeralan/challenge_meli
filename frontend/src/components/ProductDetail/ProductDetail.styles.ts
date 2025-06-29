import styled from 'styled-components';
import { Star } from 'lucide-react';
import { colors, Button } from '../../styles/GlobalStyles';

// Colores exactos de MercadoLibre
export const meliColors = {
  blue: '#3483fa',
  blueHover: '#2968c8',
  green: '#00a650',
  orange: '#ff6600',
  lightBlue: '#e6f7ff',
  lightGreen: '#e8f5e8',
  gray: '#ebebeb',
  darkGray: '#666666',
  lightGray: '#999999',
  black: '#000000',
  border: '#e6e6e6'
};

// =============================================================================
// LAYOUT PRINCIPAL
// =============================================================================

export const ProductContainer = styled.div`
  background-color: ${meliColors.gray};
  min-height: 100vh;
  padding: 20px 0;
`;

export const ProductWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
`;

export const Breadcrumb = styled.div`
  font-size: 14px;
  color: ${meliColors.lightGray};
  margin-bottom: 16px;
  
  a {
    color: ${meliColors.blue};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const MainProductCard = styled.div`
  background: ${colors.white};
  border-radius: 6px;
  padding: 24px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 400px 1fr 350px;
    grid-template-rows: auto auto;
    gap: 32px;
  }
`;

// =============================================================================
// SECCIÓN DE IMÁGENES
// =============================================================================

export const ImageSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;

  @media (min-width: 768px) {
    align-items: center;
  }

  @media (min-width: 1024px) {
    grid-row: 1;
    grid-column: 1;
    align-items: stretch;
  }
`;

export const MobileProductTitle = styled.h1`
  font-size: 20px;
  font-weight: 400;
  color: #333;
  margin-bottom: 12px;
  line-height: 1.2;
  display: block;

  @media (min-width: 1024px) {
    display: none;
  }
`;

export const ImageGallery = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;

  @media (min-width: 768px) and (max-width: 1023px) {
    max-width: 500px;
    margin: 0 auto;
  }

  @media (min-width: 1024px) {
    flex-direction: row;
    height: 500px;
  }
`;

export const ThumbnailList = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  justify-content: center;
  order: 2;
  padding: 4px 0;
  
  @media (min-width: 1024px) {
    flex-direction: column;
    width: 72px;
    height: 100%;
    max-height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
    justify-content: flex-start;
    order: 0;
    padding: 0 4px 0 0;
  }

  &::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f5f5f5;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 2px;
    
    &:hover {
      background: #bbb;
    }
  }
`;

export const Thumbnail = styled.img<{ isActive: boolean }>`
  width: 50px;
  height: 50px;
  object-fit: contain;
  object-position: center;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid ${props => props.isActive ? meliColors.blue : meliColors.border};
  transition: border-color 0.2s ease;
  flex-shrink: 0;
  background-color: ${colors.white};
  padding: 4px;
  box-sizing: border-box;

  &:hover {
    border-color: ${meliColors.blue};
  }

  @media (min-width: 768px) {
    width: 60px;
    height: 60px;
  }

  @media (min-width: 1024px) {
    width: 64px;
    height: 64px;
  }
`;

export const MainImageContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.white};
  min-height: 300px;
  max-height: 500px;
  border-radius: 4px;
  position: relative;
  overflow: hidden;

  @media (min-width: 768px) {
    min-height: 400px;
  }

  @media (min-width: 1024px) {
    min-height: 500px;
  }
`;

export const MainImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  object-position: center;
  transition: opacity 0.3s ease;
  opacity: ${props => props.style?.opacity || 1};
`;

export const ImageLoadingSpinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid ${meliColors.blue};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
  }
`;

export const ImageErrorMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: ${meliColors.darkGray};
  font-size: 14px;
`;

// =============================================================================
// INFORMACIÓN DEL PRODUCTO
// =============================================================================

export const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 1024px) {
    grid-row: 1;
    grid-column: 2;
  }
`;

export const ProductTitle = styled.h1`
  font-size: 24px;
  font-weight: 400;
  color: #333;
  margin: 0;
  line-height: 1.2;
  display: none;

  @media (min-width: 1024px) {
    display: block;
    font-size: 28px;
  }
`;

export const ProductCondition = styled.div`
  font-size: 14px;
  color: ${meliColors.darkGray};
  margin-bottom: 4px;
`;

export const ReviewsSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

export const StarsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

export const StyledStar = styled(Star)<{ filled: boolean }>`
  width: 16px;
  height: 16px;
  fill: ${props => props.filled ? '#ffa500' : 'transparent'};
  color: #ffa500;
  stroke-width: 1.5;
`;

export const ReviewCount = styled.span`
  font-size: 13px;
  color: ${meliColors.blue};
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    text-decoration: none;
  }
`;

export const PriceSection = styled.div`
  margin-bottom: 24px;
`;

export const Price = styled.div`
  font-size: 36px;
  font-weight: 300;
  color: #333;
  line-height: 1;
  margin-bottom: 8px;

  @media (min-width: 768px) {
    font-size: 46px;
  }
`;

export const PriceDetails = styled.div`
  font-size: 14px;
  color: ${meliColors.darkGray};
  margin-bottom: 8px;
`;

export const InstallmentInfo = styled.div`
  font-size: 16px;
  color: ${meliColors.green};
  font-weight: 400;
  margin-bottom: 8px;
`;

export const DiscountBadge = styled.span`
  background-color: ${meliColors.orange};
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 3px;
  margin-left: 8px;
`;

export const ColorsSection = styled.div`
  margin-bottom: 20px;
`;

export const ColorsTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
`;

export const ColorOptions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const ColorOption = styled.div<{ isSelected: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid ${props => props.isSelected ? meliColors.blue : meliColors.border};
  cursor: pointer;
  transition: border-color 0.2s ease;
  overflow: hidden;
  position: relative;

  &:hover {
    border-color: ${meliColors.blue};
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const FeaturesSection = styled.div`
  margin-bottom: 20px;
`;

export const FeaturesTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
`;

export const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const FeatureItem = styled.li`
  font-size: 14px;
  color: ${meliColors.darkGray};
  margin-bottom: 8px;
  padding-left: 16px;
  position: relative;

  &:before {
    content: '•';
    color: ${meliColors.blue};
    font-weight: bold;
    position: absolute;
    left: 0;
  }
`;

// =============================================================================
// SIDEBAR DE COMPRA
// =============================================================================

export const PurchaseSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (min-width: 1024px) {
    grid-row: 1;
    grid-column: 3;
  }
`;

export const PurchaseBox = styled.div`
  border: 1px solid ${meliColors.border};
  border-radius: 6px;
  padding: 20px;
`;

export const ShippingInfo = styled.div`
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${meliColors.border};
`;

export const ShippingTitle = styled.div`
  font-size: 14px;
  color: ${meliColors.green};
  font-weight: 600;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ShippingDetails = styled.div`
  font-size: 12px;
  color: ${meliColors.darkGray};
`;

export const QuantitySection = styled.div`
  margin-bottom: 20px;
`;

export const QuantityLabel = styled.div`
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const QuantityDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

export const QuantityButton = styled.button`
  background: ${colors.white};
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${meliColors.blue};
  }

  &:focus {
    outline: none;
    border-color: ${meliColors.blue};
  }
`;

export const DropdownArrow = styled.span`
  font-size: 12px;
  color: ${meliColors.darkGray};
  transition: transform 0.2s ease;
  
  ${QuantityDropdown}[data-open="true"] & {
    transform: rotate(180deg);
  }
`;

export const QuantityOptions = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  background: ${colors.white};
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  display: ${props => props.isOpen ? 'block' : 'none'};
  min-width: 120px;
  white-space: nowrap;
`;

export const QuantityOption = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #f0f0f0;

  &:hover {
    background-color: #f5f5f5;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const StockInfo = styled.span`
  font-size: 12px;
  color: ${meliColors.lightGray};
  font-weight: normal;
`;

export const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const BuyNowButton = styled(Button)`
  background: ${meliColors.blue};
  color: white;
  font-size: 16px;
  font-weight: 600;
  height: 48px;
  border-radius: 6px;

  &:hover {
    background: ${meliColors.blueHover};
  }
`;

export const AddToCartButton = styled(Button)`
  background: ${meliColors.lightBlue};
  color: ${meliColors.blue};
  border: 1px solid ${meliColors.blue};
  font-size: 16px;
  font-weight: 600;
  height: 48px;
  border-radius: 6px;

  &:hover {
    background: #cceeff;
  }
`;

export const SellerSection = styled.div`
  border-top: 1px solid ${meliColors.border};
  padding-top: 16px;
  margin-top: 20px;
`;

export const SellerName = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

// =============================================================================
// DESCRIPCIÓN
// =============================================================================

export const DescriptionSection = styled.div`
  padding-top: 24px;
  border-top: 1px solid ${meliColors.border};

  @media (min-width: 1024px) {
    grid-row: 2;
    grid-column: 1 / 3;
  }
`;

export const DescriptionTitle = styled.h2`
  font-size: 24px;
  font-weight: 400;
  color: #333;
  margin-bottom: 16px;
`;

export const DescriptionText = styled.div`
  font-size: 16px;
  color: ${meliColors.darkGray};
  line-height: 1.5;
  margin-bottom: 16px;
`;

// =============================================================================
// MÉTODOS DE PAGO
// =============================================================================

export const PaymentMethodsCard = styled.div`
  border: 1px solid ${meliColors.border};
  border-radius: 6px;
  padding: 20px;
`;

export const PaymentMethodsTitle = styled.h3`
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin-bottom: 20px;
`;

export const PaymentSection = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const PaymentSectionTitle = styled.h4`
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
`;

export const PaymentSectionSubtitle = styled.p`
  font-size: 14px;
  color: ${meliColors.darkGray};
  margin-bottom: 12px;
  line-height: 1.4;
`;

export const PaymentMethodsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;

export const PaymentMethodIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colors.white};
  border: 1px solid ${meliColors.border};
  border-radius: 4px;
  padding: 8px;
  min-width: 60px;
  height: 36px;
  font-size: 12px;
  font-weight: 500;
  color: #333;
  
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

export const MercadoPagoIcon = styled(PaymentMethodIcon)`
  background: #009ee3;
  color: white;
  font-size: 10px;
  text-align: center;
  line-height: 1.2;
  padding: 4px 8px;
`;

export const PaymentMethodLink = styled.a`
  color: ${meliColors.blue};
  font-size: 14px;
  text-decoration: none;
  margin-top: 12px;
  display: inline-block;

  &:hover {
    text-decoration: underline;
  }
`; 