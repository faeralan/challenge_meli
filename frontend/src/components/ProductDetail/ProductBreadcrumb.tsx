import React from 'react';
import { Breadcrumb } from './ProductDetail.styles';

interface ProductBreadcrumbProps {
  category?: string;
  subcategory?: string;
}

export const ProductBreadcrumb: React.FC<ProductBreadcrumbProps> = ({
  category = "Gaming",
  subcategory = "Nintendo"
}) => {
  return (
    <Breadcrumb>
      <a href="/">Volver al listado</a> {'>'} <a href="#">{category}</a> {'>'} {subcategory}
    </Breadcrumb>
  );
}; 