import React from 'react';
import { Heart } from 'lucide-react';
import {
  ProductInfo as ProductInfoWrapper,
  ProductTitle,
  ProductCondition,
  ReviewsSection,
  StarsContainer,
  StyledStar,
  ReviewCount,
  PriceSection,
  Price,
  InstallmentInfo,
  DiscountBadge,
  BestSellerBadge,
  ColorsSection,
  ColorsTitle,
  ColorOptions,
  ColorOption,
  FeaturesSection,
  FeaturesTitle,
  FeaturesList,
  FeatureItem,
} from './ProductDetail.styles';
import {
  formatPrice,
  calculateOriginalPrice,
  calculateInstallmentPrice,
  calculatePriceWithoutTaxes,
  calculateSalesCount,
  getConditionText,
} from '../../utils/productUtils';

interface ProductInfoProps {
  title: string;
  condition: string;
  totalReviews: number;
  rating: number;
  price: number;
  availableColors?: { name: string; image: string }[];
  features?: string[];
  selectedColor: number;
  onColorChange: (index: number) => void;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  title,
  condition,
  totalReviews,
  rating,
  price,
  availableColors,
  features,
  selectedColor,
  onColorChange,
}) => {
  const originalPrice = calculateOriginalPrice(price);
  const installmentPrice = calculateInstallmentPrice(price);
  const salesCount = calculateSalesCount(totalReviews);
  const priceWithoutTaxes = calculatePriceWithoutTaxes(price);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StyledStar key={index} filled={index < Math.floor(rating)} />
    ));
  };

  // Función para determinar si es best seller
  const isBestSeller = (totalReviews: number, rating: number): boolean => {
    return totalReviews >= 100 && rating >= 4.3;
  };

  return (
    <ProductInfoWrapper>
      
      <ProductCondition>
        {getConditionText(condition)} | +{salesCount} vendidos
      </ProductCondition>

      {isBestSeller(totalReviews, rating) && (
        <BestSellerBadge>MAS VENDIDO</BestSellerBadge>
      )}

      <ProductTitle>{title}</ProductTitle>

      <ReviewsSection>
        <ReviewCount>
          {rating.toFixed(1)}
        </ReviewCount>
        <StarsContainer>
          {renderStars(rating)}
        </StarsContainer>
        <ReviewCount>
          ({totalReviews})
        </ReviewCount>
      </ReviewsSection>

      <PriceSection>
        <Price>
          {formatPrice(price)}
          {/* <DiscountBadge>25% OFF</DiscountBadge> */}
        </Price>
        <InstallmentInfo>
          en 12 cuotas de {formatPrice(installmentPrice)} sin interés
        </InstallmentInfo>
      </PriceSection>

      {availableColors && availableColors.length > 0 && (
        <ColorsSection>
          <ColorsTitle>Color: <b>{availableColors[selectedColor]?.name}</b></ColorsTitle>
          <ColorOptions>
            {availableColors.map((color, index) => (
              <ColorOption
                key={index}
                isSelected={index === selectedColor}
                onClick={() => onColorChange(index)}
              >
                <img src={color.image} alt={color.name} />
              </ColorOption>
            ))}
          </ColorOptions>
        </ColorsSection>
      )}

      {features && features.length > 0 && (
        <FeaturesSection>
          <FeaturesTitle>Lo que tienes que saber de este producto</FeaturesTitle>
          <FeaturesList>
            {features.map((feature, index) => (
              <FeatureItem key={index}>{feature}</FeatureItem>
            ))}
          </FeaturesList>
        </FeaturesSection>
      )}
    </ProductInfoWrapper>
  );
}; 