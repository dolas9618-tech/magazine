import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../assets/style/style.css';
import PostCard from './PostCard';

function PostList() {
    const [news, Setnews] = useState([]);
    const navigate = useNavigate();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const currentCategory = queryParams.get('category');

    useEffect(() => {
        async function fetchpost() {
            try {
                let url = 'https://e7e5954563b5bfc5.mokky.dev/posts';

                if (currentCategory) {
                    url += `?category=${currentCategory}`;
                }

                const response = await axios.get(url);

                console.log(response.data);
                Setnews(response.data);
            } catch (error) {
                console.log(error);
            }
        }

        fetchpost();
    }, [currentCategory]);
    const setFilter = (category) => {
        if (category) {
            navigate(`?category=${category}`);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="posts">
            <div>
                <button onClick={() => setFilter(null)}>Все новости</button>
                <button onClick={() => setFilter('Футбол')}>Футбол</button>
                <button onClick={() => setFilter('ММА')}>ММА</button>
            </div>

            <h2>
                Список новостей {currentCategory && `(Категория: ${currentCategory})`}
            </h2>

            {news.length > 0 ? (
                news.map((post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                    />
                ))
            ) : (
                <p>Загрузка новостей не удалась или пусто</p>
            )}
        </div>
    );
}

export default PostList;