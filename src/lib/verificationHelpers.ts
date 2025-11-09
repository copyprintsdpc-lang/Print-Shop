/**
 * Helper utilities for user verification
 */

import User from '@/models/User'
import dbConnect from '@/lib/mongodb'

/**
 * Auto-verify address when order is successfully delivered
 * Call this when order status changes to "delivered" or "completed"
 */
export async function verifyAddressOnDelivery(
  userId: string,
  addressId: string,
  method: 'delivery' | 'pickup' = 'delivery'
): Promise<boolean> {
  try {
    await dbConnect()
    
    const user = await User.findById(userId)
    if (!user) {
      console.error(`User not found: ${userId}`)
      return false
    }

    const address = user.addresses.id(addressId)
    if (!address) {
      console.error(`Address not found: ${addressId}`)
      return false
    }

    // Only verify if not already verified
    if (!address.isVerified) {
      address.isVerified = true
      address.verifiedAt = new Date()
      address.verificationMethod = method

      // Update canOrder status
      user.canOrder = user.verified && user.mobileVerified && user.addresses.some((a: any) => a.isVerified)
      
      await user.save()
      
      console.log(`✅ Address auto-verified for user ${user.email} via ${method}`)
      return true
    }

    return true // Already verified
  } catch (error) {
    console.error('Error verifying address on delivery:', error)
    return false
  }
}

/**
 * Check if user can place orders
 */
export async function canUserPlaceOrders(userId: string): Promise<{
  canOrder: boolean
  missing: string[]
}> {
  try {
    await dbConnect()
    
    const user = await User.findById(userId)
    if (!user) {
      return { canOrder: false, missing: ['account'] }
    }

    const missing: string[] = []
    
    if (!user.verified) missing.push('email')
    if (!user.mobileVerified) missing.push('phone')
    if (!user.addresses.some((a: any) => a.isVerified)) missing.push('address')

    return {
      canOrder: missing.length === 0,
      missing
    }
  } catch (error) {
    console.error('Error checking user order eligibility:', error)
    return { canOrder: false, missing: ['error'] }
  }
}

/**
 * Get user verification status
 */
export async function getUserVerificationStatus(userId: string) {
  try {
    await dbConnect()
    
    const user = await User.findById(userId)
    if (!user) return null

    const hasVerifiedAddress = user.addresses.some((a: any) => a.isVerified)
    
    return {
      email: {
        verified: user.verified,
        verifiedAt: user.emailVerifiedAt
      },
      phone: {
        verified: user.mobileVerified,
        verifiedAt: user.mobileVerifiedAt,
        number: user.mobile
      },
      address: {
        hasVerified: hasVerifiedAddress,
        total: user.addresses.length,
        verified: user.addresses.filter((a: any) => a.isVerified).length
      },
      canOrder: user.canOrder,
      profileComplete: user.profileComplete
    }
  } catch (error) {
    console.error('Error getting verification status:', error)
    return null
  }
}

/**
 * Bulk update verification status for existing users
 * Useful for migration or fixing data inconsistencies
 */
export async function updateVerificationStatus(userId: string) {
  try {
    await dbConnect()
    
    const user = await User.findById(userId)
    if (!user) return false

    // Recalculate status
    const hasVerifiedAddress = user.addresses.some((a: any) => a.isVerified)
    user.profileComplete = user.verified && user.mobileVerified && user.addresses.length > 0
    user.canOrder = user.verified && user.mobileVerified && hasVerifiedAddress

    await user.save()
    return true
  } catch (error) {
    console.error('Error updating verification status:', error)
    return false
  }
}

/**
 * Send verification reminder email
 * Can be called periodically for users with incomplete profiles
 */
export async function sendVerificationReminder(userId: string) {
  try {
    await dbConnect()
    
    const user = await User.findById(userId)
    if (!user || user.canOrder) return false // Already verified

    const missing: string[] = []
    if (!user.verified) missing.push('email')
    if (!user.mobileVerified) missing.push('phone number')
    if (!user.addresses.some((a: any) => a.isVerified)) missing.push('delivery address')

    if (missing.length === 0) return false

    // TODO: Send email reminder
    console.log(`📧 Verification reminder needed for ${user.email}: missing ${missing.join(', ')}`)
    
    return true
  } catch (error) {
    console.error('Error sending verification reminder:', error)
    return false
  }
}

