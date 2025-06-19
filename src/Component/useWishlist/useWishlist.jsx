import { useEffect, useState } from 'react';
import axios from 'axios';

const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userToken = localStorage.getItem('userToken');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchWishlist = async () => {
      if (userToken) {
        try {
          const res = await axios.get(`${config.API_URL}/wishlist`, {
            headers: { Authorization: `Bearer ${userToken}` },
          });
          const items = res.data.data.map((item) => item.product.id);
          setWishlistItems(items);
        } catch {
          setError('Failed to fetch wishlist');
        }
      } else {
        const local = JSON.parse(localStorage.getItem('wishlist')) || [];
        setWishlistItems(local);
      }
      setLoading(false);
    };

    fetchWishlist();
  }, [userToken]);

  const addToWishlist = async (productId) => {
    if (userToken) {
      try {
        await axios.post(
          `${config.API_URL}/wishlist`,
          { productId, userId },
          { headers: { Authorization: `Bearer ${userToken}` } }
        );
        setWishlistItems((prev) => [...prev, productId]);
      } catch {
        setError('Failed to add to wishlist');
      }
    } else {
      const updated = [...wishlistItems, productId];
      setWishlistItems(updated);
      localStorage.setItem('wishlist', JSON.stringify(updated));
    }
  };

  const removeFromWishlist = async (productId) => {
    if (userToken) {
      try {
        await axios.delete(`${config.API_URL}/wishlist`, {
          headers: { Authorization: `Bearer ${userToken}` },
          data: { productId },
        });
        setWishlistItems((prev) => prev.filter((id) => id !== productId));
      } catch {
        setError('Failed to remove from wishlist');
      }
    } else {
      const updated = wishlistItems.filter((id) => id !== productId);
      setWishlistItems(updated);
      localStorage.setItem('wishlist', JSON.stringify(updated));
    }
  };

  const isWishlisted = (productId) => wishlistItems.includes(productId);

  return { wishlistItems, addToWishlist, removeFromWishlist, isWishlisted, loading, error };
};

export default useWishlist;
