import React, { useState } from 'react';
import styled from 'styled-components';
import { Search, ShoppingCart } from 'lucide-react';
import { colors, Container } from '../styles/GlobalStyles';
import { Link, useNavigate } from 'react-router-dom';

const HeaderContainer = styled.header`
  background-color: ${colors.yellow};
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
  position: static;
  z-index: 100;
`;

const HeaderContent = styled(Container)`
  display: flex;
  align-items: center;
  padding: 12px 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    padding: 12px 16px;
  }
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  color: ${colors.gray[700]};
  text-decoration: none;
  flex-shrink: 0;
  min-width: fit-content;

  &:hover {
    color: ${colors.primary};
  }

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  flex: 1;
  max-width: 800px;
  position: relative;
  margin: 0 16px;
  min-width: 0;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    margin: 0;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 2px 0 0 2px;
  font-size: 16px;
  outline: none;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2);

  &::placeholder {
    color: ${colors.gray[500]};
  }

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 10px 12px;
  }
`;

const SearchButton = styled.button`
  padding: 12px 16px;
  background-color: ${colors.gray[200]};
  border: none;
  border-radius: 0 2px 2px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2);
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${colors.gray[300]};
  }

  svg {
    width: 18px;
    height: 18px;
    color: ${colors.gray[600]};
  }

  @media (max-width: 768px) {
    padding: 10px 12px;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  min-width: fit-content;

  @media (max-width: 768px) {
    gap: 8px;
    justify-content: center;
    width: 100%;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const AuthLink = styled(Link)`
  padding: 8px 12px;
  text-decoration: none;
  font-size: 14px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  color: ${colors.gray[700]};
  text-align: center;
  white-space: nowrap;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 6px 8px;
  }
`;

const CartButton = styled.button`
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  color: ${colors.gray[700]};

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  svg {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 768px) {
    padding: 6px;
  }
`;

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <TopRow>
          <Logo to="/">
            MercadoLibre
          </Logo>

          <SearchContainer>
            <form onSubmit={handleSearch} style={{ display: 'flex', width: '100%' }}>
              <SearchInput
                type="text"
                placeholder="Buscar productos, marcas y más..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <SearchButton type="submit">
                <Search />
              </SearchButton>
            </form>
          </SearchContainer>

          <UserSection>
            <CartButton onClick={() => navigate('/cart')}>
              <ShoppingCart />
            </CartButton>

            <AuthButtons>
              <AuthLink to="/login">Ingresá</AuthLink>
              <AuthLink to="/register">Creá tu cuenta</AuthLink>
            </AuthButtons>
          </UserSection>
        </TopRow>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header; 