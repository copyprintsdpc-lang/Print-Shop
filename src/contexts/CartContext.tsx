'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { strapiUtils } from '@/lib/strapi'

export interface CartItem {
  id: string
  productId: string
  variantId: string
  name: string
  variant: string
  price: number
  quantity: number
  specifications: Record<string, any>
  image?: string
}

export interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
  discount: number
  promoCode?: string
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'APPLY_PROMO'; payload: { code: string; discount: number } }
  | { type: 'REMOVE_PROMO' }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  applyPromoCode: (code: string) => Promise<{ success: boolean; message: string }>
  removePromoCode: () => void
} | null>(null)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        )
        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) - state.discount,
          itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        }
      }
      
      const newItems = [...state.items, action.payload]
      return {
        ...state,
        items: newItems,
        total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) - state.discount,
        itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0)
      }
    }
    
    case 'REMOVE_ITEM': {
      const filteredItems = state.items.filter(item => item.id !== action.payload)
      return {
        ...state,
        items: filteredItems,
        total: filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) - state.discount,
        itemCount: filteredItems.reduce((sum, item) => sum + item.quantity, 0)
      }
    }
    
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(1, action.payload.quantity) }
          : item
      )
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) - state.discount,
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      }
    }
    
    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemCount: 0,
        discount: 0,
        promoCode: undefined
      }
    
    case 'APPLY_PROMO': {
      const newTotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      return {
        ...state,
        discount: action.payload.discount,
        promoCode: action.payload.code,
        total: newTotal - action.payload.discount
      }
    }
    
    case 'REMOVE_PROMO': {
      const newTotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      return {
        ...state,
        discount: 0,
        promoCode: undefined,
        total: newTotal
      }
    }
    
    default:
      return state
  }
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  discount: 0
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('sdpc-cart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        dispatch({ type: 'CLEAR_CART' })
        parsedCart.items.forEach((item: CartItem) => {
          dispatch({ type: 'ADD_ITEM', payload: item })
        })
        if (parsedCart.promoCode && parsedCart.discount > 0) {
          dispatch({ 
            type: 'APPLY_PROMO', 
            payload: { code: parsedCart.promoCode, discount: parsedCart.discount } 
          })
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sdpc-cart', JSON.stringify(state))
  }, [state])

  const addToCart = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const applyPromoCode = async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { promotionAPI } = await import('@/lib/strapi')
      const currentTotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const result = await promotionAPI.validatePromo(code, currentTotal)
      
      if (result.valid && result.discount) {
        dispatch({ 
          type: 'APPLY_PROMO', 
          payload: { code, discount: result.discount } 
        })
        return { success: true, message: `Promo code applied! ₹${result.discount} discount` }
      } else {
        return { success: false, message: result.message || 'Invalid promo code' }
      }
    } catch (error) {
      return { success: false, message: 'Error validating promo code' }
    }
  }

  const removePromoCode = () => {
    dispatch({ type: 'REMOVE_PROMO' })
  }

  return (
    <CartContext.Provider value={{
      state,
      dispatch,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      applyPromoCode,
      removePromoCode
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
