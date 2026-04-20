import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true); // Состояние: вход или регистрация
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let success = false;
    if (isLogin) {
      success = await login(email, password);
    } else {
      success = await register(email, password);
    }

    if (success) {
      navigate('/'); // Если всё ок, кидаем на главную
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'ВХОД' : 'РЕГИСТРАЦИЯ'}</h2>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="example@mail.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="input-group">
            <label>Пароль</label>
            <input 
              type="password" 
              placeholder="******" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="auth-submit-btn">
            {isLogin ? 'ВОЙТИ' : 'СОЗДАТЬ АККАУНТ'}
          </button>
        </form>

        <button 
          onClick={() => setIsLogin(!isLogin)} 
          className="auth-toggle-btn"
        >
          {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;