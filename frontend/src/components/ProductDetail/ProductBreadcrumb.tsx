import React from 'react';
import { Breadcrumb } from './ProductDetail.styles';

interface ProductBreadcrumbProps {
  category: string;
  title: string;
}

export const ProductBreadcrumb: React.FC<ProductBreadcrumbProps> = ({
  category,
  title
}) => {
  const truncatedTitle = title.length > 50 ? `${title.substring(0, 50)}...` : title;

  return (
    <Breadcrumb>
      <a href="/">Volver al listado</a> {'>'} <a href="#">{category}</a> {'>'} {truncatedTitle}
    </Breadcrumb>
  );
}; 