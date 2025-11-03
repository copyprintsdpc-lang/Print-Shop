import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyJwt } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export const runtime = 'nodejs'

// Get all addresses
export async function GET(request: NextRequest) {
  try {
    const token = (await cookies()).get('sdp_session')?.value
    const payload = token ? verifyJwt(token) : null
    
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const user = await User.findOne({ email: payload.email })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      addresses: user.addresses || [],
      hasVerifiedAddress: user.addresses.some((addr: any) => addr.isVerified)
    })

  } catch (error) {
    console.error('Get addresses error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Add new address
export async function POST(request: NextRequest) {
  try {
    const token = (await cookies()).get('sdp_session')?.value
    const payload = token ? verifyJwt(token) : null
    
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const addressData = await request.json()

    // Validate required fields
    const required = ['line1', 'city', 'state', 'pincode']
    for (const field of required) {
      if (!addressData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    await dbConnect()
    const user = await User.findOne({ email: payload.email })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // If this is the first address or marked as default, set as default
    const isFirstAddress = !user.addresses || user.addresses.length === 0
    const isDefault = addressData.isDefault || isFirstAddress

    // If setting as default, unset other defaults
    if (isDefault && user.addresses) {
      user.addresses.forEach((addr: any) => {
        addr.isDefault = false
      })
    }

    // Add new address
    const newAddress = {
      type: addressData.type || 'both',
      label: addressData.label || 'Home',
      contactName: addressData.contactName || user.name,
      contactPhone: addressData.contactPhone || user.mobile,
      line1: addressData.line1,
      line2: addressData.line2 || '',
      landmark: addressData.landmark || '',
      city: addressData.city,
      state: addressData.state,
      pincode: addressData.pincode,
      country: addressData.country || 'IN',
      isDefault: isDefault,
      isVerified: false, // Addresses start unverified
      verifiedAt: null,
      verificationMethod: null
    }

    user.addresses.push(newAddress)
    
    // Update profile completion status
    user.profileComplete = user.verified && user.mobileVerified && user.addresses.length > 0
    user.canOrder = user.profileComplete

    await user.save()

    return NextResponse.json({
      success: true,
      message: 'Address added successfully',
      address: user.addresses[user.addresses.length - 1],
      profileComplete: user.profileComplete,
      canOrder: user.canOrder
    })

  } catch (error) {
    console.error('Add address error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Update address
export async function PATCH(request: NextRequest) {
  try {
    const token = (await cookies()).get('sdp_session')?.value
    const payload = token ? verifyJwt(token) : null
    
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { addressId, ...updates } = await request.json()

    if (!addressId) {
      return NextResponse.json({ error: 'Address ID is required' }, { status: 400 })
    }

    await dbConnect()
    const user = await User.findOne({ email: payload.email })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const address = user.addresses.id(addressId)
    if (!address) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    // Update fields
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        address[key] = updates[key]
      }
    })

    // If setting as default, unset others
    if (updates.isDefault) {
      user.addresses.forEach((addr: any) => {
        if (addr._id.toString() !== addressId) {
          addr.isDefault = false
        }
      })
    }

    // If address details changed, mark as unverified
    if (updates.line1 || updates.city || updates.state || updates.pincode) {
      address.isVerified = false
      address.verifiedAt = null
    }

    await user.save()

    return NextResponse.json({
      success: true,
      message: 'Address updated successfully',
      address
    })

  } catch (error) {
    console.error('Update address error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Delete address
export async function DELETE(request: NextRequest) {
  try {
    const token = (await cookies()).get('sdp_session')?.value
    const payload = token ? verifyJwt(token) : null
    
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const addressId = searchParams.get('id')

    if (!addressId) {
      return NextResponse.json({ error: 'Address ID is required' }, { status: 400 })
    }

    await dbConnect()
    const user = await User.findOne({ email: payload.email })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const address = user.addresses.id(addressId)
    if (!address) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    // If deleting default address, set another as default
    const wasDefault = address.isDefault
    address.deleteOne()

    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true
    }

    // Update profile completion
    user.profileComplete = user.verified && user.mobileVerified && user.addresses.length > 0
    user.canOrder = user.profileComplete

    await user.save()

    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully',
      profileComplete: user.profileComplete,
      canOrder: user.canOrder
    })

  } catch (error) {
    console.error('Delete address error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

