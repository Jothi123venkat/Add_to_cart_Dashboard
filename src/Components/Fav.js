import { Delete } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';

const Fav = ({ cartItems, setCartItems }) => {
  const [favs, setFavs] = useState([]);

  const handleCartDelete = (item) => {
    const updatedCart = cartItems.filter((val) => val._id !== item._id);
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart)); 
  };

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCartItems);
  }, []);

  return (
    <div>
      { cartItems && cartItems.map((val) => (
        <>
          <img src={val.ImageURL} alt="img" style={{ width: '100px' }} />
          <Delete onClick={() => handleCartDelete(val)} />
        </>
      ))}
    </div>
  );
};

export default Fav;