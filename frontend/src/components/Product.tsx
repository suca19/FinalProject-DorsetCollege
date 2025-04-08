import { motion } from "framer-motion"
import React, {useState} from 'react';
import { Product } from "../types/Product.type";



const ProductForm = ({productList, setProductList, handleClose}: {productList: Product[], setProductList: React.Dispatch<React.SetStateAction<Product[]>>, handleClose: () => void}) => {
const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    category: '',
    price: 0,
    stock: 0,
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Math.max(...productList.map(p => p.id), 0) + 1;
    setProductList([...productList, { ...newProduct, id }]);
    setNewProduct({ name: '', category: '', price: 0, stock: 0 });
    handleClose();
  };

    return (<motion.form
    onSubmit={handleCreateProduct}
    className="mb-8 p-4 bg-white rounded-lg shadow"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    >
    <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
    <div className="grid grid-cols-2 gap-4">
      <input
        type="text"
        placeholder="Name"
        className="p-2 border rounded"
        value={newProduct.name}
        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Category"
        className="p-2 border rounded"
        value={newProduct.category}
        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Price"
        className="p-2 border rounded"
        value={newProduct.price}
        onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
        required
      />
      <input
        type="number"
        placeholder="Stock"
        className="p-2 border rounded"
        value={newProduct.stock}
        onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
        required
      />
    </div>
    <button type="submit" className="mt-4  py-2 px-4  bg-primary-500 text-white p-2 rounded font-bold hover:bg-primary-600">
      Add
    </button>
    </motion.form> );
}

export default ProductForm;
