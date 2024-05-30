import React, { useState } from 'react'
import Dashboard from './Components/Dashboard'
import { Route, Routes } from 'react-router-dom'
import Fav from './Components/Fav'

const App = () => {
   const [cartItems,setCartItems]=useState([]);
  return (
    <div>
      <h1>Cart items :{ cartItems.length}</h1>
     <Routes>
      <Route path="/" element={<Dashboard  cartItems={cartItems} setCartItems={setCartItems}/>} />
      <Route path="/Fav" element={<Fav  cartItems={cartItems} setCartItems={setCartItems}/>} />
     </Routes>
     
    </div>
  )
}

export default App