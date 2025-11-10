import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyAdminToken } from '@/lib/adminAuth'

export default function AdminEntryPoint() {
  const token = cookies().get('sdp_session')?.value
  const admin = token ? verifyAdminToken(token) : null

  if (!admin) {
    redirect('/admin/login')
  }

  redirect('/admin/operations')
}

