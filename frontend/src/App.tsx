import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalStyles } from './styles/GlobalStyles';
import Header from './components/Header';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';

function App() {
  return (
    <>
      <GlobalStyles />
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/login" element={<div>Login - Coming Soon</div>} />
              <Route path="/register" element={<div>Register - Coming Soon</div>} />
              <Route path="/search" element={<div>Search - Coming Soon</div>} />
              <Route path="/cart" element={<div>Cart - Coming Soon</div>} />
              <Route path="/profile" element={<div>Profile - Coming Soon</div>} />
              <Route path="/my-products" element={<div>My Products - Coming Soon</div>} />
              <Route path="*" element={<div>404 - Página no encontrada</div>} />
            </Routes>
          </main>
        </div>
      </Router>
    </>
  );
}

export default App;
