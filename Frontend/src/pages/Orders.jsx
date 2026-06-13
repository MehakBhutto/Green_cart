import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext.jsx'

const Orders = () => {
  const { axios } = useAppContext()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get('/api/order/user')
        if (data.success) setOrders(data.data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [axios])

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto py-16">
      <h1 className="text-2xl font-medium mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Order #{order._id}</p>
                  <p className="text-sm text-gray-500">Placed: {new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Total: ${order.totalPrice}</p>
                  <p className="text-sm">Status: {order.orderStatus ? 'Completed' : 'Pending'}</p>
                </div>
              </div>
              <div className="mt-3">
                <p className="font-medium">Address</p>
                <p className="text-sm text-gray-700">{order.address}</p>
              </div>
              <div className="mt-3">
                <p className="font-medium">Items</p>
                <ul className="list-disc ml-5 text-sm">
                  {order.products.map((p) => (
                    <li key={p.product._id || p.product}>{p.product.name || p.product} x {p.quantity}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
