import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import axios from 'axios'

const AllOrders = () => {
    const {user} = useAppContext()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const boxIcon = "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/boxIcon.svg"

    const fetchOrders = async (url) => {
            setLoading(true)
            try {
                const { data } = await axios.get(url)
                if (data.success) {
                    setOrders(data.data || [])
                } else {
                    setError(data.message || 'Failed to load orders')
                }
            } catch (err) {
                setError(err?.response?.data?.message || err.message || 'Failed to load orders')
            } finally {
                setLoading(false)
            }
        }

    useEffect(() => {
        {user == false ? 
            fetchOrders('/api/order/admin') : fetchOrders('/api/order/user') 
        }
    }, [axios])

    return (
        <div className="md:p-10 p-4 space-y-4">
            <h2 className="text-lg font-medium">Orders List</h2>
            {loading && <div className="p-5 text-gray-500">Loading orders...</div>}
            {error && <div className="p-5 text-red-500">{error}</div>}
            {!loading && !error && orders.length === 0 && (
                <div className="p-5 text-gray-500">No orders found.</div>
            )}
            {orders.map((order, index) => (
                <div key={order._id || index} className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center gap-5 p-5 max-w-4xl rounded-md border border-gray-300 text-gray-800">
                    <div className="flex gap-5">
                        <img className="w-12 h-12 object-cover opacity-60" src={boxIcon} alt="boxIcon" />
                        <div className="flex flex-col justify-center gap-1">
                            {order.products?.map((item, itemIndex) => (
                                <p key={itemIndex} className="font-medium">
                                    {item.product?.name || item.name} <span className={`text-indigo-500 ${item.quantity < 2 && "hidden"}`}>x {item.quantity}</span>
                                </p>
                            ))}
                        </div>
                    </div>

                    <div className="text-sm">
                        {order.address ? (
                            <>
                                <p className='font-medium mb-1'>
                                    {order.address.firstName} {order.address.lastName}
                                </p>
                                <p>
                                    {order.address.street}, {order.address.city}, {order.address.state}, {order.address.zipcode}, {order.address.country}
                                </p>
                            </>
                        ) : (
                            <p className='font-medium mb-1'>No address provided</p>
                        )}
                    </div>

                    <p className="font-medium text-base my-auto text-black/70">${order.totalPrice ?? order.amount ?? 0}</p>

                    <div className="flex flex-col text-sm">
                        <p>Method: {order.paymentType ?? order.paymentType ?? 'N/A'}</p>
                        <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                        <p>Payment: {order.orderStatus ? "Paid" : "Pending"}</p>
                    </div>
                </div>
            ))}
        </div>
  )
}

export default AllOrders
