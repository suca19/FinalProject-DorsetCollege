import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Order {
  id: number;
  customerName: string;
  orderDate: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  total: number;
}

const sampleOrders: Order[] = [
  { id: 1, customerName: 'John Doe', orderDate: '2023-05-01', status: 'Delivered', total: 299.99 },
  { id: 2, customerName: 'Jane Smith', orderDate: '2023-05-02', status: 'Shipped', total: 149.99 },
  { id: 3, customerName: 'Bob Johnson', orderDate: '2023-05-03', status: 'Processing', total: 79.99 },
  { id: 4, customerName: 'Alice Brown', orderDate: '2023-05-04', status: 'Pending', total: 199.99 },
  { id: 5, customerName: 'Charlie Wilson', orderDate: '2023-05-05', status: 'Delivered', total: 399.99 },
];

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [isAddingOrder, setIsAddingOrder] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [newOrder, setNewOrder] = useState<Omit<Order, 'id'>>({
    customerName: '',
    orderDate: '',
    status: 'Pending',
    total: 0,
  });

  const filteredOrders = filterStatus
    ? orders.filter(order => order.status.toLowerCase() === filterStatus.toLowerCase())
    : orders;

  const statusColors = {
    Pending: 'bg-yellow-500',
    Processing: 'bg-blue-500',
    Shipped: 'bg-purple-500',
    Delivered: 'bg-green-500',
  };

  const handleAddOrder = () => {
    const id = Math.max(...orders.map(o => o.id), 0) + 1;
    setOrders([...orders, { ...newOrder, id }]);
    setNewOrder({
      customerName: '',
      orderDate: '',
      status: 'Pending',
      total: 0,
    });
    setIsAddingOrder(false);
  };

  const handleUpdateOrder = () => {
    if (editingOrder) {
      setOrders(orders.map(o => o.id === editingOrder.id ? editingOrder : o));
      setEditingOrder(null);
    }
  };

  const handleDeleteOrder = (id: number) => {
    setOrders(orders.filter(o => o.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        className="text-4xl font-bold text-primary-800 mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Orders
      </motion.h1>
      <motion.div
        className="mb-6 flex justify-between items-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <select
          className="w-64 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
        <button
          className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => setIsAddingOrder(true)}
        >
          Add New Order
        </button>
      </motion.div>
      {isAddingOrder && (
        <motion.div
          className="mb-6 bg-white p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold mb-4">Add New Order</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Customer Name"
              className="p-2 border rounded"
              value={newOrder.customerName}
              onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
            />
            <input
              type="date"
              className="p-2 border rounded"
              value={newOrder.orderDate}
              onChange={(e) => setNewOrder({ ...newOrder, orderDate: e.target.value })}
            />
            <select
              className="p-2 border rounded"
              value={newOrder.status}
              onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value as Order['status'] })}
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
            <input
              type="number"
              placeholder="Total"
              className="p-2 border rounded"
              value={newOrder.total}
              onChange={(e) => setNewOrder({ ...newOrder, total: parseFloat(e.target.value) })}
            />
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              onClick={() => setIsAddingOrder(false)}
            >
              Cancel
            </button>
            <button
              className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded"
              onClick={handleAddOrder}
            >
              Add Order
            </button>
          </div>
        </motion.div>
      )}
      <motion.div
        className="bg-white rounded-lg shadow-lg overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <table className="w-full">
          <thead className="bg-primary-600 text-white">
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <motion.tr
                key={order.id}
                className="border-b border-gray-200 hover:bg-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="p-3">{order.id}</td>
                <td className="p-3">{order.customerName}</td>
                <td className="p-3">{order.orderDate}</td>
                <td className="p-3">
                  <span className={`${statusColors[order.status]} text-white py-1 px-2 rounded-full text-sm`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-3">${order.total.toFixed(2)}</td>
                <td className="p-3">
                  <button
                    className="bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => setEditingOrder(order)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-accent-500 hover:bg-accent-600 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleDeleteOrder(order.id)}
                  >
                    Delete
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
      {editingOrder && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg w-96"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <h2 className="text-2xl font-bold mb-4">Edit Order</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Customer Name"
                className="w-full p-2 border rounded"
                value={editingOrder.customerName}
                onChange={(e) => setEditingOrder({ ...editingOrder, customerName: e.target.value })}
              />
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={editingOrder.orderDate}
                onChange={(e) => setEditingOrder({ ...editingOrder, orderDate: e.target.value })}
              />
              <select
                className="w-full p-2 border rounded"
                value={editingOrder.status}
                onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value as Order['status'] })}
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
              <input
                type="number"
                placeholder="Total"
                className="w-full p-2 border rounded"
                value={editingOrder.total}
                onChange={(e) => setEditingOrder({ ...editingOrder, total: parseFloat(e.target.value) })}
              />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={() => setEditingOrder(null)}
              >
                Cancel
              </button>
              <button
                className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded"
                onClick={handleUpdateOrder}
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Orders;

