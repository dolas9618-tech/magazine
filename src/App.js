import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './components/HomePage';
import CartPage from './components/CartPage';
import PostDetailPage from './components/PostDetailPage'; 
import Footer from './components/Footer';

// ИСПРАВЛЕННЫЕ ПУТИ:
import AuthForm from './components/AuthForm'; 
import { AuthProvider, useAuth } from './components/AuthContext'; 

import './assets/style/style.css';

// Выносим Header в отдельный подкомпонент, чтобы внутри него работал useAuth
const Header = ({ cartCount }) => {
  const { user, logout } = useAuth();
  const figmaStyle = "node-id=0-1&p=f&t=j8ESOqf0bnp3cd0s-0";

  return (
    <header className="header">
      <Link to={`/?${figmaStyle}`} className="logo"><h1>BAHANDI</h1></Link>
      <nav className="nav-menu">
        <Link to={`/categories/burgers?${figmaStyle}`} className="nav-item">БУРГЕРЫ</Link>
        <Link to={`/categories/new?${figmaStyle}`} className="nav-item">НОВИНКИ</Link>
        
        {/* Динамическая кнопка: если вошел — имя, если нет — войти */}
        {user ? (
          <div className="user-menu">
            <span className="nav-item">{user.email}</span>
            <button onClick={logout} className="logout-btn">ВЫЙТИ</button>
          </div>
        ) : (
          <Link to="/auth" className="nav-item">ВОЙТИ</Link>
        )}

        <Link to={`/cart?${figmaStyle}`} className="nav-cart-btn">
          КОРЗИНА ({cartCount})
        </Link>
      </nav>
    </header>
  );
};

function App() {
  const [cart, setCart] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    fetch('https://8aefe87c60033c7c.mokky.dev/BAHANDI')
      .then(res => res.json())
      .then(data => {
        setAllProducts(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error("Деректерді жүктеу қатесі:", err));
  }, []);

  const addToCart = (product) => {
    setCart((prev) => {
      const isExist = prev.find(item => item.id === product.id);
      if (isExist) {
        return prev.map(item => 
          item.id === product.id ? {...item, quantity: item.quantity + (product.quantity || 1)} : item
        );
      }
      return [...prev, {...product, quantity: product.quantity || 1}];
    });
  };

  const cartCount = cart.reduce((a, b) => a + b.quantity, 0);

  return (
    <AuthProvider> {/* Оборачиваем всё приложение в контекст авторизации */}
      <BrowserRouter>
        <div className="App">
          <Header cartCount={cartCount} />

          <Routes>
            <Route path="/" element={<HomePage addToCart={addToCart} />} />
            <Route path="/categories/:categoryName" element={<HomePage addToCart={addToCart} />} />
            <Route path="/detail/:id" element={<PostDetailPage addToCart={addToCart} />} />
            <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} />} />
            <Route path="/auth" element={<AuthForm />} />
          </Routes>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;