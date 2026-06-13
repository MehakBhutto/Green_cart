import React from 'react'
import SingleView from '../components/SingleView'
import Product from '../components/Product'
import { useParams } from 'react-router-dom'

const ProductDetails = () => {
  const {category} = useParams()

  return (
    <div>
      <SingleView />
      <div className="flex flex-col items-center mt-20">
        <div className="flex flex-col items-center w-max">
          <p className="text-3xl font-medium">
            Related Products
          </p>
        <div className="w-20 h-0.5 bg-primary rounded-full mt-2">
        </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6 w-full">
          <Product category={category}/>
        </div>
      </div>

    </div>
  )
}

export default ProductDetails
