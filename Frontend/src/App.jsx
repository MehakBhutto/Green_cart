import React from 'react'
import Navbar from './components/Navbar'
import { Toaster } from 'react-hot-toast'
import {Routes, Route, useLocation} from 'react-router-dom'
import { useAppContext } from './context/AppContext'
import Home from './pages/Home'
import AllProducts from './pages/AllProducts'
import Footer from './components/Footer'
import ProductDetails from './pages/ProductDetails'
import Category from './pages/Category'
import Cart from './pages/Cart'
import Dashboard from './pages/seller/Dashboard'
import ProductList from './pages/seller/ProductList'
import Order from './pages/seller/Order'
import Signin from './pages/Signin'
import Address from './pages/Address'
import Orders from './pages/Orders'
import AllOrders from './components/AllOrders'

const App = () => {
  const isSellerPath = useLocation().pathname.includes('seller')
  const { showUserLogin } = useAppContext()
  return (
    <div>
      <Toaster />
      {isSellerPath? null : <Navbar/>}
      {showUserLogin && <Signin />}
      <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/products' element={<AllProducts/>} />
          <Route path='products/:category' element={<Category/>}/>
          <Route path="/products/:category/:id" element={<ProductDetails />} />
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/address' element={<Address/>} />
          <Route path='/:userId/orders' element={<AllOrders/>} />
          <Route path='/orders' element={<Orders/>} />
          <Route path='/seller/:adminId/dashboard' element={<Dashboard/>}/>
          <Route path='/seller/:adminId/product-list' element={<ProductList/>}/>
          <Route path='/seller/:adminId/orders' element={<Order/>}/>
          <Route path='/seller' element={<Signin/>}/>
        </Routes>
        {isSellerPath? null : <Footer/>}
      </div>
    </div>
  )
}

export default App
