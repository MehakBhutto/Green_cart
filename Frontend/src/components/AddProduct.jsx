import React, { useState } from 'react'
import toast from 'react-hot-toast'

const AddProduct = () => {

    const [name, SetName] = useState('')
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('')
    const [price, setPrice] = useState(0)
    const [image, setImages] = useState([])
    const [offerPrice, setOfferPrice] = useState(0)

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData()
        image.forEach((file) => {
            if (file) {
                formData.append('images', file)
            }
        })
        formData.append('name', name)
        formData.append('description', description)
        formData.append('category', category)
        formData.append('price', price)
        formData.append('offerPrice', offerPrice)

        try {
            const response = await fetch('http://localhost:8080/api/product/admin', {
                method: 'POST',
                credentials: 'include',
                body: formData,
            })

            if (!response.ok) {
                const errorText = await response.text()
                console.error('Product add failed:', response.status, errorText)
                toast.error('Failed to add product')
                return
            }

            toast.success('Product added successfully')
            // reset form
            SetName('')
            setDescription('')
            setCategory('')
            setPrice(0)
            setOfferPrice(0)
            setImages([])
        } catch (err) {
            console.error(err)
            toast.error('Network error while adding product')
        }
    }

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
            <form onSubmit={handleSubmit}
            className="md:p-10 p-4 space-y-5 max-w-lg">
                <div>
                    <p className="text-base font-medium">Product Image</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                        {Array(4).fill('').map((_, index) => (
                            <label key={index} htmlFor={`image${index}`}>
                                <input accept="image/*" type="file" id={`image${index}`} hidden 
                                onChange={(e) => {
                                    const newImages = [...image];
                                    newImages[index] = e.target.files[0];
                                    setImages(newImages)
                                }}/>
                                <img className="max-w-24 cursor-pointer" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/uploadArea.png" alt="uploadArea" width={100} height={100} />
                            </label>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-name">
                        Product Name
                    </label>
                    <input id="product-name" type="text" 
                    value={name} onChange={(e) => SetName(e.target.value)}
                    placeholder="Type here" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                </div>
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-description">Product Description</label>
                    <textarea id="product-description" rows={4} 
                    value={description} onChange={(e) => setDescription(e.target.value)}
                    className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none" placeholder="Type here"></textarea>
                </div>
                <div className="w-full flex flex-col gap-1">
                    <label className="text-base font-medium" htmlFor="category">Category</label>
                    <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}
                    className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required>
                        <option value="">Select Category</option>
                        {[
                            { name: 'Vegetables' }, 
                            { name: 'Fruits' }, 
                            { name: 'Drinks' },
                            { name: 'Instant' },
                            { name: 'Dairy' },
                            { name: 'Bakery' },
                            { name: 'Grains' },
                        ].map((item, index) => (
                            <option key={index} value={item.name}>{item.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-5 flex-wrap">
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="product-price">Product Price</label>
                        <input id="product-price" type="number" 
                        value={price} onChange={(e) => setPrice(Number(e.target.value))}
                        placeholder="0" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                    </div>
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="offer-price">Offer Price</label>
                        <input id="offer-price" type="number" 
                        value={offerPrice} onChange={(e) => setOfferPrice(Number(e.target.value))}
                        placeholder="0" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                    </div>
                </div>
                <button type="submit"
                className="px-8 py-2.5 bg-indigo-500 text-white font-medium rounded">ADD</button>
            </form>
        </div>
  )
}

export default AddProduct
