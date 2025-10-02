'use client'

import { useState, useEffect } from 'react'
import { 
  ShoppingCart, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  Package,
  DollarSign,
  Truck
} from 'lucide-react'

interface CartItem {
  id: string
  productId: string
  productName: string
  variant: string
  price: number
  quantity: number
  image?: string
  maxQuantity?: number
}

interface CartProps {
  isOpen: boolean
  onClose: () => void
  onCheckout: () => void
}

export default function Cart({ isOpen, onClose, onCheckout }: CartProps) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
      return
    }

    setItems(items.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ))
  }

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const clearCart = () => {
    setItems([])
  }

  const getSubtotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTax = () => {
    return getSubtotal() * 0.18 // 18% GST
  }

  const getShipping = () => {
    return getSubtotal() > 1000 ? 0 : 50 // Free shipping over ₹1000
  }

  const getTotal = () => {
    return getSubtotal() + getTax() + getShipping()
  }

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={onClose}
      />
      
      {/* Cart Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Shopping Cart ({getItemCount()})
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Package className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6">Add some products to get started</p>
                <button
                  onClick={onClose}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-gray-500">{item.variant}</p>
                      <p className="text-sm font-medium text-gray-900">
                        ₹{item.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.maxQuantity && item.quantity >= item.maxQuantity}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-4 space-y-4">
              {/* Price Breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {getShipping() === 0 ? 'Free' : `₹${getShipping().toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-medium">₹{getTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span>Total</span>
                  <span>₹{getTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={onCheckout}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Proceed to Checkout
                </button>
                
                <button
                  onClick={clearCart}
                  className="w-full text-red-600 py-2 px-4 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Clear Cart
                </button>
              </div>

              {/* Shipping Info */}
              {getShipping() > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <Truck className="w-4 h-4" />
                    <span>
                      Add ₹{(1000 - getSubtotal()).toFixed(2)} more for free shipping
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Cart Context for global state management
export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    const newItem: CartItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9)
    }
    
    setItems(prev => {
      const existingItem = prev.find(i => 
        i.productId === item.productId && i.variant === item.variant
      )
      
      if (existingItem) {
        return prev.map(i => 
          i.id === existingItem.id 
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      } else {
        return [...prev, newItem]
      }
    })
  }

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity } : item
    ))
  }

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotal = () => {
    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0)
    const tax = subtotal * 0.18
    const shipping = subtotal > 1000 ? 0 : 50
    return subtotal + tax + shipping
  }

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    getItemCount,
    getTotal
  }
}
