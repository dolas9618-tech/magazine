import React from 'react';

const CartPage = ({ cart, setCart }) => {
  // 1. Бағаны есептеуді дұрыстау
  const totalPrice = cart.reduce((sum, item) => {
    // Бағадан тек сандарды ғана қалдырып, соны санға айналдырамыз
    const price = Number(String(item.price).replace(/[^0-9]/g, '')) || 0;
    const qty = Number(item.quantity) || 1;
    return sum + (price * qty);
  }, 0);

  // Тауарды өшіру
  const removeItem = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  return (
    <div className="main-content">
      <h2 className="page-title">Ваша корзина</h2>
      
      {cart.length === 0 ? (
        <div className="empty-cart" style={{ textAlign: 'center', marginTop: '50px' }}>
          <p>Корзина бос... Тауар таңдаңыз.</p>
        </div>
      ) : (
        <div className="cart-list">
          {cart.map(item => (
            <div key={item.id} className="card" style={{
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '15px',
              padding: '20px',
              display: 'flex' // Row ретінде көрінуі үшін қосылды
            }}>
              <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
                <img 
                  src={item.image || item.img} 
                  alt={item.title} 
                  style={{width: '100px', height: '80px', objectFit: 'cover', borderRadius: '15px'}} 
                />
                <div>
                  <h4 style={{margin: '0 0 5px 0'}}>{item.title}</h4>
                  <p style={{margin: 0, fontWeight: 'bold'}}>
                    {/* Бағаны форматтап шығару */}
                    {Number(String(item.price).replace(/[^0-9]/g, '')).toLocaleString()} ₸ × {item.quantity}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => removeItem(item.id)} 
                className="close-x" 
                style={{
                  position: 'static', 
                  background: '#fceaea', 
                  color: '#e74c3c',
                  border: 'none',
                  borderRadius: '50%',
                  width: '35px',
                  height: '35px',
                  cursor: 'pointer',
                  fontSize: '20px'
                }}
              >
                &times;
              </button>
            </div>
          ))}

          <div style={{marginTop: '40px', textAlign: 'right', borderTop: '2px solid #eee', paddingTop: '20px'}}>
            <h3 style={{fontSize: '24px'}}>Итого: {totalPrice.toLocaleString()} ₸</h3>
            <button className="nav-cart-btn" style={{
              border: 'none', 
              cursor: 'pointer', 
              marginTop: '20px',
              width: '250px',
              padding: '15px',
              fontSize: '16px'
            }}>
              Оформить заказ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;