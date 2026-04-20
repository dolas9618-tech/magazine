import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PostDetailPage = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]); 
  const [newComment, setNewComment] = useState(""); // Жаңа пікір мәтіні
  const [isSubmitting, setIsSubmitting] = useState(false); // Жіберу күйі
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const resPost = await axios.get(`https://8aefe87c60033c7c.mokky.dev/BAHANDI/${id}`);
        setPost(resPost.data);

        try {
          // parentId арқылы осы тауарға тиісті пікірлерді сүзіп алу
          const resComments = await axios.get(`https://8aefe87c60033c7c.mokky.dev/comments?parentId=${id}`);
          setComments(resComments.data);
        } catch (commentErr) {
          console.warn("Пікірлер кестесі табылмады.");
        }

      } catch (error) {
        console.error("Тауарды жүктеу мүмкін болмады:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  // Пікір жіберу функциясы
  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post('https://8aefe87c60033c7c.mokky.dev/coments', {
        parentId: id, // Қай тауарға жазылғанын білу үшін
        text: newComment,
        date: new Date().toLocaleString()
      });

      // Жаңа пікірді тізімге қосу және форманы тазалау
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (err) {
      alert("Пікір жіберу кезінде қате шықты.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <h2 style={{textAlign: 'center', marginTop: '100px'}}>ЖҮКТЕЛУДЕ...</h2>;
  
  if (!post) return (
    <div style={{textAlign: 'center', padding: '100px'}}>
      <h1>Тауар табылмады</h1>
      <button onClick={() => navigate('/')}>Артқа қайту</button>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={() => navigate(-1)}>
      <div className="modal-content detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-x" onClick={() => navigate(-1)}>&times;</button>
        
        <div className="modal-body">
          <div className="modal-img">
            <img src={post.image} alt={post.title} />
          </div>

          <div className="modal-info">
            <div>
              <h2>{post.title}</h2>
              <p className="modal-price-display">
                {post.price.toLocaleString()} ₸ • {post.weight} г
              </p>
              <p className="modal-desc">{post.description}</p>
            </div>

            <div className="modal-footer">
              <div className="counter-block">
                <button onClick={() => quantity > 1 && setQuantity(quantity - 1)}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>

              <button 
                className="final-add-btn"
                onClick={() => {
                  if(addToCart) addToCart({ ...post, quantity });
                  navigate(-1);
                }}
              >
                В корзину | {(post.price * quantity).toLocaleString()} ₸
              </button>
            </div>
          </div>
        </div>
        
        <hr className="divider" />

        {/* ПІКІРЛЕР БӨЛІМІ */}
        <div className="comments-section" style={{padding: '20px'}}>
             <h3>Пікірлер ({comments.length})</h3>
             
             <div className="comments-list" style={{maxHeight: '200px', overflowY: 'auto', marginBottom: '20px'}}>
                {comments.length > 0 ? (
                  comments.map((item) => (
                    <div key={item.id} className="comment-item" style={{background: '#f9f9f9', padding: '10px', marginBottom: '10px', borderRadius: '8px'}}>
                      <p style={{margin: '0', fontSize: '14px'}}>{item.text}</p>
                      <small style={{color: '#888'}}>{item.date}</small>
                    </div>
                  ))
                ) : (
                  <p style={{color: '#999'}}>Әзірге пікір жоқ...</p>
                )}
             </div>

             {/* Пікір жазу формасы */}
             <form onSubmit={handleSendComment} style={{display: 'flex', gap: '10px'}}>
                <input 
                  type="text" 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Пікіріңізді қалдырыңыз..."
                  style={{flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ddd'}}
                />
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  style={{padding: '10px 20px', background: '#ff5e00', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer'}}
                >
                  {isSubmitting ? "..." : "Жіберу"}
                </button>
             </form>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;