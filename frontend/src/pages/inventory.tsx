"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import ModalContainer from "../components/ModalContainer"
import useModal from "../hooks/useModal"
import Modal from "../components/Modals"
import type { Product } from "../types/Product.type"
import ProductForm from "../components/Product"
import RoleBasedComponent from "../components/RoleBasedComponent"
import { useAuth } from "../contexts/AuthContext"

const sampleProducts: Product[] = [
  { id: 1, name: "Laptop", category: "Electronics", price: 999.99, stock: 50 },
  { id: 2, name: "Smartphone", category: "Electronics", price: 599.99, stock: 100 },
  { id: 3, name: "Headphones", category: "Accessories", price: 99.99, stock: 200 },
  { id: 4, name: "Desk Chair", category: "Furniture", price: 199.99, stock: 30 },
  { id: 5, name: "Coffee Maker", category: "Appliances", price: 79.99, stock: 75 },
]

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(sampleProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const { modalOpen, close, open } = useModal()
  const modalType = "dropIn"
  const { isAdmin } = useAuth()

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingProduct) {
      setProducts(products.map((p) => (p.id === editingProduct.id ? editingProduct : p)))
      setEditingProduct(null)
    }
  }

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        className="text-4xl font-bold text-primary-800 mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Inventory
      </motion.h1>

      {/* Search Input */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <input
          type="text"
          placeholder="Search products..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </motion.div>

      {/* botton for admins only */}
      <RoleBasedComponent requiredRole="admin">
        <motion.div className="mb-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="mt-4 py-2 px-4 bg-primary-500 text-white p-2 rounded font-bold hover:bg-primary-600"
            onClick={open}
          >
            Add Product
          </motion.button>
        </motion.div>
      </RoleBasedComponent>

      {modalOpen && (
        <ModalContainer>
          <Modal text={"Agregar Nuevo Producto"} type={modalType} handleClose={close}>
            <ProductForm productList={products} setProductList={setProducts} handleClose={close} />
          </Modal>
        </ModalContainer>
      )}

      {/* Product Table */}
      <motion.div
        className="bg-white rounded-lg shadow-lg overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <table className="w-full">
          <thead className="bg-primary-600 text-white">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Prize</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <motion.tr
                key={product.id}
                className="border-b border-gray-200 hover:bg-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="p-3">{product.name}</td>
                <td className="p-3">{product.category}</td>
                <td className="p-3">${product.price.toFixed(2)}</td>
                <td className="p-3">{product.stock}</td>
                <td className="p-3">
                  {/* everyone can see */}
                  <button
                    className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => alert(`Detalles de ${product.name}`)}
                  >
                    See
                  </button>

                  {/* Only Admins can edit and delete */}
                  <RoleBasedComponent requiredRole="admin">
                    <>
                      <button
                        className="bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-2 px-4 rounded mr-2"
                        onClick={() => setEditingProduct(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-accent-500 hover:bg-accent-600 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Delete
                      </button>
                    </>
                  </RoleBasedComponent>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Modal for Admins */}
      {isAdmin && editingProduct && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.form
            onSubmit={handleUpdateProduct}
            className="bg-white p-8 rounded-lg shadow-xl"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >
            <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nombre"
                className="p-2 border rounded"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Categoría"
                className="p-2 border rounded"
                value={editingProduct.category}
                onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Precio"
                className="p-2 border rounded"
                value={editingProduct.price}
                onChange={(e) => setEditingProduct({ ...editingProduct, price: Number.parseFloat(e.target.value) })}
                required
              />
              <input
                type="number"
                placeholder="Stock"
                className="p-2 border rounded"
                value={editingProduct.stock}
                onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number.parseInt(e.target.value) })}
                required
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button type="submit" className="bg-primary-500 text-white p-2 rounded hover:bg-primary-600 mr-2">
                Save
              </button>
              <button
                type="button"
                className="bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400"
                onClick={() => setEditingProduct(null)}
              >
                Cancel
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </div>
  )
}

export default Inventory

