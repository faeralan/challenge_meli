import React from 'react';
import {
  DescriptionSection,
  DescriptionTitle,
  DescriptionText
} from './ProductDetail.styles';

interface ProductDescriptionProps {
  description: string;
}

export const ProductDescription: React.FC<ProductDescriptionProps> = ({ description }) => {
  return (
    <DescriptionSection>
      <DescriptionTitle>Descripción</DescriptionTitle>
      <DescriptionText>
        {description}
      </DescriptionText>
    </DescriptionSection>
  );
}; 