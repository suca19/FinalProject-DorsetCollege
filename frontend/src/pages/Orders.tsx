import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ModalContainer from '../components/ModalContainer';
import useModal from '../hooks/useModal';
import Modal from '../components/Modals';
import { Product } from '../types/Product.type';
import ProductForm from '../components/Product';

const initialProducts: Product[] = [
  { id: 1, name: 'Laptop', category: 'Electronics', price: 999.99, stock: 50 },
  { id: 2, name: 'Smartphone', category: 'Electronics', price: 599.99, stock: 100 },
  { id: 3, name: 'Headphones', category: 'Accessories', price: 99.99, stock: 200 },
  { id: 4, name: 'Desk Chair', category: 'Furniture', price: 199.99, stock: 30 },
  { id: 5, name: 'Coffee Maker', category: 'Appliances', price: 79.99, stock: 75 },
];

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { modalOpen, open, close } = useModal();

  const filteredProducts = products.filter(({ name, category }) =>
    [name, category].some(field => field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(prevProducts => prevProducts.map(p => (p.id === editingProduct.id ? editingProduct : p)));
      setEditingProduct(null);
    }
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1 className="text-4xl font-bold text-primary-800 mb-8" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        Inventory
      </motion.h1>

      <motion.input type="text" placeholder="Search products..." className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} />
      
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="mt-4 py-2 px-4 bg-primary-500 text-white rounded font-bold hover:bg-primary-600" onClick={open}>
        Add
      </motion.button>
      
      {modalOpen && (
        <ModalContainer>
          <Modal text="Add New Product" type="dropIn" handleClose={close}>
            <ProductForm productList={products} setProductList={setProducts} handleClose={close} />
          </Modal>
        </ModalContainer>
      )}

      <motion.table className="w-full bg-white rounded-lg shadow-lg overflow-hidden" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
        <thead className="bg-primary-600 text-white">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Price</th>
            <th className="p-3 text-left">Stock</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <motion.tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <td className="p-3">{product.name}</td>
              <td className="p-3">{product.category}</td>
              <td className="p-3">${product.price.toFixed(2)}</td>
              <td className="p-3">{product.stock}</td>
              <td className="p-3">
                <button className="bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-2 px-4 rounded mr-2" onClick={() => setEditingProduct(product)}>
                  Edit
                </button>
                <button className="bg-accent-500 hover:bg-accent-600 text-white font-bold py-2 px-4 rounded" onClick={() => handleDeleteProduct(product.id)}>
                  Delete
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>

      {editingProduct && (
        <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.form onSubmit={handleUpdateProduct} className="bg-white p-8 rounded-lg shadow-xl" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
            <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
            <div className="grid grid-cols-2 gap-4">
              {(['name', 'category', 'price', 'stock'] as const).map((field) => (
                <input key={field} type={field === 'price' || field === 'stock' ? 'number' : 'text'} placeholder={field.charAt(0).toUpperCase() + field.slice(1)} className="p-2 border rounded" value={editingProduct[field].toString()} onChange={(e) => setEditingProduct({ ...editingProduct, [field]: field === 'price' || field === 'stock' ? parseFloat(e.target.value) : e.target.value })} required />
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button type="submit" className="bg-primary-500 text-white p-2 rounded hover:bg-primary-600 mr-2">Save Changes</button>
              <button type="button" className="bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400" onClick={() => setEditingProduct(null)}>Cancel</button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </div>
  );
};

export default Inventory;