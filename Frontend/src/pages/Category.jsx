import React from 'react'
import { useParams } from 'react-router-dom'
import Product from '../components/Product'
import { categories } from '../assets/assets';

const Category = () => {
    const {category} = useParams();
    const getCategoryText = () => {
       return categories.find((c) => c.path.toLowerCase() === category.toLowerCase())
    }
    const categoryText = getCategoryText()
  return (
    <div className='mt-16'>
        <div className="flex flex-col items-end w-max">
            <p className="text-2xl text-[#364153] font-semibold">{categoryText?.text.toUpperCase()}</p>
            <div className="w-16 h-0.5 bg-primary rounded-full mt-1">
            </div>
        </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6 w-full">
          <Product category={category}/>
        </div>
    </div>
  )
}

export default Category
