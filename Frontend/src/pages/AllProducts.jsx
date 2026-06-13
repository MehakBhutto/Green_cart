import React from 'react'
import { useLocation } from 'react-router-dom'
import Product from '../components/Product'

const AllProducts = () => {
  const location = useLocation()
  const searchQuery = new URLSearchParams(location.search).get('search')

  return (
    <>
    <br /><br /><br />
      <p className="text-2xl font-medium uppercase">
        {searchQuery ? `Search results for "${searchQuery}"` : 'All products'}
      </p>
      <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6'>
        <Product />
      </div>
    </>
  )
}

export default AllProducts
