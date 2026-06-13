import React, { useEffect, useState } from 'react'

const PList = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            try {
                const res = await fetch('http://localhost:8080/api/product')
                const json = await res.json()
                // backend returns { message, data }
                const data = json.data || json
                setProducts(Array.isArray(data) ? data : [])
            } catch (err) {
                setError(err.message || 'Failed to load products')
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    return (
        <div className="flex-1 py-10 flex flex-col justify-between">
            <div className="w-full md:p-10 p-4">
                <h2 className="pb-4 text-lg font-medium">All Products</h2>
                <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
                    {loading ? (
                        <div className="p-8">Loading...</div>
                    ) : error ? (
                        <div className="p-8 text-red-500">{error}</div>
                    ) : (
                        <table className="md:table-auto table-fixed w-full overflow-hidden">
                            <thead className="text-gray-900 text-sm text-left">
                                <tr>
                                    <th className="px-4 py-3 font-semibold truncate">Product</th>
                                    <th className="px-4 py-3 font-semibold truncate">Category</th>
                                    <th className="px-4 py-3 font-semibold truncate hidden md:block">Selling Price</th>
                                    <th className="px-4 py-3 font-semibold truncate">In Stock</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-500">
                                {products.map((product, index) => (
                                    <tr key={product._id || index} className="border-t border-gray-500/20">
                                        <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                                            <div className="border border-gray-300 rounded overflow-hidden">
                                                <img src={(product.image && product.image[0]) || '/assets/favicon.svg'} alt="Product" className="w-16" />
                                            </div>
                                            <span className="truncate max-sm:hidden w-full">{product.name}</span>
                                        </td>
                                        <td className="px-4 py-3">{product.category}</td>
                                        <td className="px-4 py-3 max-sm:hidden">${product.offerPrice ?? product.price}</td>
                                        <td className="px-4 py-3">
                                            <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                                                <input type="checkbox" className="sr-only peer" defaultChecked={product.inStock ?? true} />
                                                <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                                                <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                                            </label>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PList
