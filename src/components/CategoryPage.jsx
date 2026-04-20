import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CategoryPage = ({ addToCart }) => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const { categoryName } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        // МАҢЫЗДЫ: DetailPage сияқты /shop сілтемесін қолданамыз
        fetch('https://8aefe87c60033c7c.mokky.dev/shop')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const filtered = categoryName
                        ? data.filter(item => item.category === categoryName)
                        : data;
                    setGames(filtered);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Деректерді алу қатесі:", err);
                setLoading(false);
            });
    }, [categoryName]);

    if (loading) return <h1 style={{ textAlign: 'center', marginTop: '50px' }}>Загрузка...</h1>;

    return (
        <div className="category-page">
            <button className="back-btn" onClick={() => navigate('/')}>Назад</button>
            
            <div className="grid-list">
                {games.length > 0 ? (
                    games.map(game => (
                        <div 
                            key={game.id} 
                            className="card" 
                            onClick={() => navigate(`/detail/${game.id}`)} 
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="card-img-box">
                                <img src={game.image || game.img} alt={game.title} />
                            </div>
                            
                            <div className="card-content">
                                <h3 className="card-price">{game.price} ₸</h3>
                                <p className="card-title">{game.title}</p>
                                
                                <button 
                                    className="add-to-cart-btn" 
                                    onClick={(e) => {
                                        e.stopPropagation(); // Карточканың onClick-і (navigate) істеп кетпеуі үшін
                                        addToCart(game);
                                    }}
                                >
                                    В корзину
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ textAlign: 'center', gridColumn: '1/-1' }}>Товары не найдены</p>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;