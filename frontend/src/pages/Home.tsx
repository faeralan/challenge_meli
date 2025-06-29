import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { colors, Container, LoadingSpinner, ErrorMessage } from '../styles/GlobalStyles';
import { Product } from '../types';
import apiService from '../services/api';

const HomeContainer = styled.div`
  min-height: 100vh;
  background-color: ${colors.gray[100]};
  padding: 20px 0;
`;

const HomeHeader = styled.div`
  background: ${colors.white};
  padding: 20px 0;
  border-bottom: 1px solid ${colors.gray[300]};
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 400;
  color: ${colors.gray[700]};
  text-align: center;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: ${colors.gray[600]};
  text-align: center;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 0 16px;

  @media (min-width: 768px) {
    gap: 24px;
    padding: 0 24px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
`;

const ProductCard = styled(Link)`
  background: ${colors.white};
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  display: block;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

const ProductImage = styled.div`
  width: 100%;
  height: 200px;
  background: ${colors.gray[100]};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.3s ease;
  }

  ${ProductCard}:hover & img {
    transform: scale(1.05);
  }
`;

const ProductInfo = styled.div`
  padding: 16px;
`;

const ProductTitle = styled.h3`
  font-size: 14px;
  font-weight: 400;
  color: ${colors.gray[700]};
  margin-bottom: 8px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductPrice = styled.div`
  font-size: 24px;
  font-weight: 300;
  color: ${colors.gray[700]};
  margin-bottom: 8px;
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: ${colors.gray[600]};
`;

const StarRating = styled.div`
  display: flex;
  gap: 1px;
`;

const StarIcon = styled(Star)<{ filled: boolean }>`
  width: 12px;
  height: 12px;
  fill: ${props => props.filled ? '#3483fa' : 'none'};
  color: #3483fa;
`;

const ProductCondition = styled.span`
  font-size: 12px;
  color: ${colors.gray[500]};
  text-transform: capitalize;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const ErrorContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${colors.gray[600]};

  h3 {
    font-size: 20px;
    margin-bottom: 8px;
    color: ${colors.gray[700]};
  }

  p {
    font-size: 16px;
  }
`;

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const productsData = await apiService.getProducts();
        setProducts(productsData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarIcon key={index} filled={index < Math.floor(rating)} />
    ));
  };

  if (loading) {
    return (
      <HomeContainer>
        <Container>
          <LoadingContainer>
            <LoadingSpinner />
          </LoadingContainer>
        </Container>
      </HomeContainer>
    );
  }

  if (error) {
    return (
      <HomeContainer>
        <Container>
          <ErrorContainer>
            <ErrorMessage>
              {error}
            </ErrorMessage>
          </ErrorContainer>
        </Container>
      </HomeContainer>
    );
  }

  if (products.length === 0) {
    return (
      <HomeContainer>
        <Container>
          <EmptyState>
            <h3>No hay productos disponibles</h3>
            <p>Vuelve más tarde para ver nuestros productos.</p>
          </EmptyState>
        </Container>
      </HomeContainer>
    );
  }

  return (
    <HomeContainer>
      <HomeHeader>
        <Container>
          <Title>Productos destacados</Title>
        </Container>
      </HomeHeader>

      <Container>
        <ProductsGrid>
          {products.map((product) => (
            <ProductCard key={product.id} to={`/product/${product.id}`}>
              <ProductImage>
                <img 
                  src={product.mainImage || product.images[0]} 
                  alt={product.title}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/300x200?text=Sin+Imagen';
                  }}
                />
              </ProductImage>
              
              <ProductInfo>
                <ProductCondition>
                  {product.condition === 'new' ? 'Nuevo' : 'Usado'}
                </ProductCondition>
                
                <ProductTitle>{product.title}</ProductTitle>
                
                <ProductPrice>
                  {formatPrice(product.price)}
                </ProductPrice>
                
                <ProductRating>
                  <StarRating>
                    {renderStars(product.rating)}
                  </StarRating>
                  <span>({product.totalReviews})</span>
                </ProductRating>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductsGrid>
      </Container>
    </HomeContainer>
  );
};

export default Home; 