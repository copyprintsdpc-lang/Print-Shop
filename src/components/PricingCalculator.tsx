'use client'

import { useState, useEffect } from 'react'
import { Calculator, Clock, Truck, CheckCircle } from 'lucide-react'
import { Product, calculatePrice } from '@/lib/products'
import { formatINR } from '@/lib/currency'

interface PricingCalculatorProps {
  product: Product
  onPriceChange: (price: number, options: Record<string, string>) => void
  className?: string
}

export default function PricingCalculator({
  product,
  onPriceChange,
  className = ''
}: PricingCalculatorProps) {
  const [quantity, setQuantity] = useState(1)
  const [options, setOptions] = useState<Record<string, string>>({})
  const [calculatedPrice, setCalculatedPrice] = useState(0)
  const [deliveryTime, setDeliveryTime] = useState('')

  // Initialize default options
  useEffect(() => {
    const defaultOptions: Record<string, string> = {}
    product.options.forEach(option => {
      if (option.required && option.values.length > 0) {
        defaultOptions[option.name] = option.values[0].value
      }
    })
    setOptions(defaultOptions)
  }, [product])

  // Calculate price when quantity or options change
  useEffect(() => {
    const price = calculatePrice(product, quantity, options)
    setCalculatedPrice(price)
    onPriceChange(price, options)
  }, [product, quantity, options, onPriceChange])

  // Calculate delivery time
  useEffect(() => {
    const now = new Date()
    const cutoffTime = product.sameDayCutoff.split(':')
    const cutoff = new Date()
    cutoff.setHours(parseInt(cutoffTime[0]), parseInt(cutoffTime[1]), 0, 0)

    if (product.sameDayEligible && now < cutoff) {
      setDeliveryTime('Same Day')
    } else if (product.sameDayEligible) {
      setDeliveryTime('Next Day')
    } else {
      setDeliveryTime('2-3 Business Days')
    }
  }, [product])

  const handleOptionChange = (optionName: string, value: string) => {
    setOptions(prev => ({
      ...prev,
      [optionName]: value
    }))
  }

  const getSelectedOptionLabel = (optionName: string) => {
    const option = product.options.find(opt => opt.name === optionName)
    const selectedValue = options[optionName]
    const optionValue = option?.values.find(val => val.value === selectedValue)
    return optionValue?.label || ''
  }

  const getPriceBreakdown = () => {
    const breakdown = []
    let basePrice = product.basePrice

    // Find applicable tier
    if (product.pricingMethod === 'tier') {
      const applicableTier = product.pricingTiers
        .sort((a, b) => b.minQty - a.minQty)
        .find(tier => quantity >= tier.minQty)
      
      if (applicableTier) {
        basePrice = applicableTier.unitPrice
        breakdown.push({
          label: `${quantity} × ₹${basePrice} (${applicableTier.minQty}+ qty)`,
          amount: basePrice * quantity
        })
      } else {
        breakdown.push({
          label: `${quantity} × ₹${basePrice}`,
          amount: basePrice * quantity
        })
      }
    }

    // Add option costs
    product.options.forEach(option => {
      const selectedValue = options[option.name]
      if (selectedValue) {
        const optionValue = option.values.find(v => v.value === selectedValue)
        if (optionValue && optionValue.priceDelta !== 0) {
          breakdown.push({
            label: `${optionValue.label}`,
            amount: optionValue.priceDelta
          })
        }
      }
    })

    return breakdown
  }

  return (
    <div className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 ${className}`}>
      <div className="flex items-center space-x-2 mb-6">
        <Calculator className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Pricing Calculator</h3>
      </div>

      {/* Quantity Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-white mb-2">
          Quantity
        </label>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/20 text-white"
          >
            -
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 text-center border border-white/30 rounded-md px-3 py-2 bg-white/10 text-white placeholder-gray-300"
            min="1"
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/20 text-white"
          >
            +
          </button>
        </div>
      </div>

      {/* Product Options */}
      <div className="space-y-4 mb-6">
        {product.options.map((option) => (
          <div key={option.name}>
            <label className="block text-sm font-medium text-white mb-2">
              {option.name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              {option.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            
            {option.type === 'select' && (
              <select
                value={options[option.name] || ''}
                onChange={(e) => handleOptionChange(option.name, e.target.value)}
                className="w-full border border-white/30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/10 text-white"
                required={option.required}
              >
                <option value="" className="bg-gray-800 text-white">Select an option</option>
                                 {option.values.map((value) => (
                   <option key={value.value} value={value.value} className="bg-gray-800 text-white">
                     {value.label}
                     {value.priceDelta !== 0 && (
                       value.priceDelta > 0 ? ` (+₹${Math.abs(value.priceDelta)})` : ` (-₹${Math.abs(value.priceDelta)})`
                     )}
                   </option>
                 ))}
              </select>
            )}
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="border-t border-white/20 pt-4">
        <h4 className="text-sm font-medium text-white mb-3">Price Breakdown</h4>
        <div className="space-y-2">
          {getPriceBreakdown().map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-200">{item.label}</span>
              <span className="font-medium text-white">{formatINR(item.amount)}</span>
            </div>
          ))}
        </div>
        
        <div className="border-t border-white/20 mt-3 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-white">Total</span>
            <span className="text-2xl font-bold text-blue-400">{formatINR(calculatedPrice)}</span>
          </div>
        </div>
      </div>

      {/* Delivery Information */}
      <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-white">Delivery Time:</span>
            <span className="text-sm text-green-400 font-medium">{deliveryTime}</span>
          </div>
        </div>
        
        {product.sameDayEligible && (
          <div className="mt-2 flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-300">
              Same-day delivery available if ordered before {product.sameDayCutoff}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
