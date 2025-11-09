import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { requireAdminAuth } from '@/lib/adminAuth'

export const runtime = 'nodejs'

/**
 * DELETE /api/admin/users/cleanup
 * 
 * Deletes all customer users while preserving admin/staff accounts
 * Requires admin authentication
 */
export async function DELETE(request: NextRequest) {
  try {
    // Verify admin authentication - only super_admin can delete users
    const { admin, error } = await requireAdminAuth(request, undefined, 'super_admin')
    if (error || !admin) {
      return error || NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    await dbConnect()

    // Get confirmation from request body
    const body = await request.json().catch(() => ({}))
    const { confirm } = body

    // Count users before deletion
    const totalUsers = await User.countDocuments()
    const customerUsers = await User.countDocuments({ role: 'customer' })
    const adminUsers = await User.countDocuments({ role: 'admin' })
    const staffUsers = await User.countDocuments({ role: 'staff' })
    const noRoleUsers = await User.countDocuments({ 
      $or: [
        { role: { $exists: false } },
        { role: null }
      ]
    })

    const usersToDelete = customerUsers + noRoleUsers

    // If no confirmation, return preview
    if (!confirm) {
      return NextResponse.json({
        preview: true,
        message: 'This is a preview. Send confirm:true to proceed.',
        stats: {
          total: totalUsers,
          toDelete: usersToDelete,
          toKeep: adminUsers + staffUsers,
          breakdown: {
            customers: customerUsers,
            noRole: noRoleUsers,
            admins: adminUsers,
            staff: staffUsers,
          }
        }
      })
    }

    // Proceed with deletion
    if (usersToDelete === 0) {
      return NextResponse.json({
        success: true,
        message: 'No customer users to delete',
        deleted: 0,
        remaining: totalUsers
      })
    }

    const deleteQuery = {
      $or: [
        { role: 'customer' },
        { role: { $exists: false } },
        { role: null }
      ]
    }

    const result = await User.deleteMany(deleteQuery)

    // Count remaining
    const remainingUsers = await User.countDocuments()
    const remainingAdmins = await User.countDocuments({ role: 'admin' })
    const remainingStaff = await User.countDocuments({ role: 'staff' })

    return NextResponse.json({
      success: true,
      message: 'Customer users deleted successfully',
      deleted: result.deletedCount,
      remaining: {
        total: remainingUsers,
        admins: remainingAdmins,
        staff: remainingStaff,
      },
      deletedBy: {
        email: admin.email,
        role: admin.role,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('User cleanup error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to delete users',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/users/cleanup
 * 
 * Preview what would be deleted
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const { admin, error } = await requireAdminAuth(request)
    if (error || !admin) {
      return error || NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await dbConnect()

    // Count users
    const totalUsers = await User.countDocuments()
    const customerUsers = await User.countDocuments({ role: 'customer' })
    const adminUsers = await User.countDocuments({ role: 'admin' })
    const staffUsers = await User.countDocuments({ role: 'staff' })
    const noRoleUsers = await User.countDocuments({ 
      $or: [
        { role: { $exists: false } },
        { role: null }
      ]
    })

    const usersToDelete = customerUsers + noRoleUsers

    return NextResponse.json({
      preview: true,
      stats: {
        total: totalUsers,
        toDelete: usersToDelete,
        toKeep: adminUsers + staffUsers,
        breakdown: {
          customers: customerUsers,
          noRole: noRoleUsers,
          admins: adminUsers,
          staff: staffUsers,
        }
      },
      warning: 'To delete, send DELETE request with { "confirm": true }'
    })

  } catch (error) {
    console.error('User cleanup preview error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user stats' },
      { status: 500 }
    )
  }
}

