import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PostCard = ({ item }) => {
    const navigate = useNavigate();

    const handleOpen = () => {
        // Переходим на страницу деталей и передаем данные карточки
        navigate('/product', { state: { data: item } });
    };

    return (
        <Link to={`/detail/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="card" onClick={handleOpen} style={{ cursor: 'pointer' }}>
            <p className="card-title">{item.title}</p>
            <img src={item.image} alt={item.title} className="card-img" />
            <div className="price-tag">{item.price}</div> 
            <button className="view-button">Добавить в корзину</button>       
        </div>
        </Link>
    );
};

export default PostCard;