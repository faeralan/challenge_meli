import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;500;600;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Nunito Sans', Proxima Nova, -apple-system, Roboto, Arial, sans-serif;
    background-color: #ebebeb;
    color: #333;
    line-height: 1.4;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    border: none;
    cursor: pointer;
    font-family: inherit;
  }

  input, textarea {
    font-family: inherit;
    border: none;
    outline: none;
  }
`;

// Colores MercadoLibre
export const colors = {
  primary: '#3483fa',
  primaryHover: '#2968c8',
  secondary: '#00a650',
  warning: '#f79403',
  danger: '#f23d4f',
  gray: {
    100: '#f7f7f7',
    200: '#f5f5f5',
    300: '#e6e6e6',
    400: '#cccccc',
    500: '#999999',
    600: '#666666',
    700: '#333333',
  },
  white: '#ffffff',
  yellow: '#fff159',
  green: '#00a650',
  orange: '#f79403',
  blue: '#3483fa',
};

// Breakpoints
export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  large: '1200px',
};

// Componentes reutilizables
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;

  @media (min-width: ${breakpoints.tablet}) {
    padding: 0 24px;
  }
`;

export const Card = styled.div`
  background: ${colors.white};
  border-radius: 6px;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
  padding: 16px;
`;

export const Button = styled.button<{
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
  text-align: center;
  cursor: pointer;

  ${props => {
    switch (props.size) {
      case 'small':
        return `
          padding: 8px 16px;
          font-size: 14px;
          height: 32px;
        `;
      case 'large':
        return `
          padding: 16px 24px;
          font-size: 16px;
          height: 48px;
        `;
      default:
        return `
          padding: 12px 20px;
          font-size: 14px;
          height: 40px;
        `;
    }
  }}

  ${props => {
    switch (props.variant) {
      case 'secondary':
        return `
          background-color: ${colors.secondary};
          color: ${colors.white};
          &:hover {
            background-color: #00941c;
          }
        `;
      case 'danger':
        return `
          background-color: ${colors.danger};
          color: ${colors.white};
          &:hover {
            background-color: #e0293b;
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          color: ${colors.primary};
          border: 1px solid ${colors.primary};
          &:hover {
            background-color: ${colors.primary};
            color: ${colors.white};
          }
        `;
      default:
        return `
          background-color: ${colors.primary};
          color: ${colors.white};
          &:hover {
            background-color: ${colors.primaryHover};
          }
        `;
    }
  }}

  ${props => props.fullWidth && `
    width: 100%;
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    &:hover {
      background-color: ${colors.gray[400]};
    }
  }
`;

export const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: 12px;
  border: 1px solid ${props => props.hasError ? colors.danger : colors.gray[300]};
  border-radius: 6px;
  font-size: 14px;
  background-color: ${colors.white};
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 2px rgba(52, 131, 250, 0.2);
  }

  &::placeholder {
    color: ${colors.gray[500]};
  }
`;

export const Select = styled.select<{ hasError?: boolean }>`
  width: 100%;
  padding: 12px;
  border: 1px solid ${props => props.hasError ? colors.danger : colors.gray[300]};
  border-radius: 6px;
  font-size: 14px;
  background-color: ${colors.white};
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 2px rgba(52, 131, 250, 0.2);
  }
`;

export const TextArea = styled.textarea<{ hasError?: boolean }>`
  width: 100%;
  padding: 12px;
  border: 1px solid ${props => props.hasError ? colors.danger : colors.gray[300]};
  border-radius: 6px;
  font-size: 14px;
  background-color: ${colors.white};
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 2px rgba(52, 131, 250, 0.2);
  }

  &::placeholder {
    color: ${colors.gray[500]};
  }
`;

export const Badge = styled.span<{ 
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default' 
}>`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;

  ${props => {
    switch (props.variant) {
      case 'success':
        return `
          background-color: ${colors.secondary};
          color: ${colors.white};
        `;
      case 'warning':
        return `
          background-color: ${colors.warning};
          color: ${colors.white};
        `;
      case 'danger':
        return `
          background-color: ${colors.danger};
          color: ${colors.white};
        `;
      case 'info':
        return `
          background-color: ${colors.primary};
          color: ${colors.white};
        `;
      default:
        return `
          background-color: ${colors.gray[200]};
          color: ${colors.gray[700]};
        `;
    }
  }}
`;

export const Price = styled.span<{ size?: 'small' | 'medium' | 'large' }>`
  font-weight: 300;
  color: ${colors.gray[700]};

  ${props => {
    switch (props.size) {
      case 'small':
        return 'font-size: 18px;';
      case 'large':
        return 'font-size: 32px;';
      default:
        return 'font-size: 24px;';
    }
  }}
`;

export const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: ${colors.gray[600]};
`;

export const LoadingSpinner = styled.div`
  border: 2px solid ${colors.gray[200]};
  border-top: 2px solid ${colors.primary};
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const ErrorMessage = styled.div`
  background-color: #ffeaea;
  color: ${colors.danger};
  padding: 12px;
  border-radius: 6px;
  border: 1px solid ${colors.danger};
  font-size: 14px;
  margin: 8px 0;
`;

export const SuccessMessage = styled.div`
  background-color: #eafaf1;
  color: ${colors.secondary};
  padding: 12px;
  border-radius: 6px;
  border: 1px solid ${colors.secondary};
  font-size: 14px;
  margin: 8px 0;
`; 