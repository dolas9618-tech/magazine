import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const HomePage = ({ addToCart }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null); 
    const [count, setCount] = useState(1); 
    const navigate = useNavigate();
    const { categoryName } = useParams();
    const location = useLocation(); // URL-дегі ?node-id сияқты параметрлерді оқу үшін

    useEffect(() => {
        setLoading(true);
        
        // 1. Категория бойынша фильтр (сенің үлгің бойынша)
        let filter = '';
        if (categoryName === 'new') {
            filter = '?isNew=true';
        } else if (categoryName === 'sale') {
            filter = '?isSale=true';
        } else if (categoryName) {
            filter = `?category=${categoryName}`;
        }

        // 2. Figma стиліндегі қосымша параметрлер (тек адрес жолында көріну үшін)
        // Егер URL-де параметрлер болмаса, оларды қосамыз
        const figmaParams = "node-id=0-1&p=f&t=j8ESOqf0bnp3cd0s-0";
        if (!location.search.includes('node-id')) {
            const separator = filter ? '&' : '?';
            navigate(`${window.location.pathname}${filter}${separator}${figmaParams}`, { replace: true });
        }

        // 3. Mokky.dev-ке сұраныс жіберу
        const url = `https://8aefe87c60033c7c.mokky.dev/BAHANDI${filter}`;
        
        fetch(url)
            .then(res => res.json())
            .then(data => {
                // Деректерді ID бойынша сұрыптау
                const sortedData = Array.isArray(data) ? data.sort((a, b) => a.id - b.id) : [];
                setProducts(sortedData);
                setLoading(false);
            })
            .catch(err => {
                console.error("Деректерді алуда қате кетті:", err);
                setLoading(false);
            });
    }, [categoryName, navigate, location.search]);

    const openModal = (product) => {
        setSelectedProduct(product);
        setCount(1);
    };

    const closeModal = () => setSelectedProduct(null);

    const getCleanPrice = (price) => {
        return price ? Number(String(price).replace(/[^0-9]/g, '')) : 0;
    };

    if (loading) return <h2 className="loading-text">ЗАГРУЗКА...</h2>;

    return (
        <div className="home-page">
            <main className="main-content">
                <h2 className="page-title">
                    {categoryName === 'burgers' ? "Бургеры" : 
                     categoryName === 'new' ? "Новинки" :
                     categoryName === 'sale' ? "Скидки" : "Все товары"}
                </h2>

                <div className="grid-list">
                    {products.length > 0 ? (
                        products.map(item => (
                            <div key={item.id} className="card">
                                <div className="card-img-box" onClick={() => navigate(`/detail/${item.id}`)}>
                                    <img src={item.image || item.img} alt={item.title} />
                                </div>
                                <div className="card-content">
                                    <p className="card-title">{item.title}</p>
                                    <h3 className="card-price">{item.price} ₸</h3>
                                    <button className="add-to-cart-btn" onClick={() => openModal(item)}>
                                        В корзину
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Бұл категорияда тауар табылмады.</p>
                    )}
                </div>
            </main>

            {selectedProduct && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-x" onClick={closeModal}>&times;</button>
                        <div className="modal-body">
                            <div className="modal-img">
                                <img src={selectedProduct.image || selectedProduct.img} alt={selectedProduct.title} />
                            </div>
                            <div className="modal-info">
                                <div>
                                    <h2>{selectedProduct.title}</h2>
                                    <p className="modal-price-display">
                                        {selectedProduct.price} ₸ • {selectedProduct.weight || "260"} г
                                    </p>
                                    <p className="modal-desc">
                                        {selectedProduct.description || "Бургер с говяжьей котлетой, свежие овощи и фирменный соус."}
                                    </p>
                                </div>

                                <div className="modal-footer">
                                    <div className="counter-block">
                                        <button onClick={() => count > 1 && setCount(count - 1)}>−</button>
                                        <span>{count}</span>
                                        <button onClick={() => setCount(count + 1)}>+</button>
                                    </div>
                                    <button className="final-add-btn" onClick={() => {
                                        addToCart({ ...selectedProduct, quantity: count });
                                        closeModal();
                                    }}>
                                        В корзину | { (getCleanPrice(selectedProduct.price) * count).toLocaleString() } ₸
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;