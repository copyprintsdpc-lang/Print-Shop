// OTP Service for sending SMS/WhatsApp
// This is a mock implementation for development
// In production, integrate with SMS providers like MSG91, Gupshup, etc.

export interface OTPService {
  sendSMS(mobile: string, message: string): Promise<boolean>
  sendWhatsApp(mobile: string, message: string): Promise<boolean>
}

class MockOTPService implements OTPService {
  async sendSMS(mobile: string, message: string): Promise<boolean> {
    // Mock SMS sending - in production, call actual SMS provider
    console.log(`📱 SMS to ${mobile}: ${message}`)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock success (in production, handle actual API response)
    return true
  }

  async sendWhatsApp(mobile: string, message: string): Promise<boolean> {
    // Mock WhatsApp sending - in production, call actual WhatsApp provider
    console.log(`💬 WhatsApp to ${mobile}: ${message}`)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock success (in production, handle actual API response)
    return true
  }
}

// Production SMS Service (uncomment and configure for production)
/*
class MSG91OTPService implements OTPService {
  private apiKey: string
  private senderId: string

  constructor() {
    this.apiKey = process.env.MSG91_API_KEY || ''
    this.senderId = process.env.MSG91_SENDER_ID || 'COPYPR'
  }

  async sendSMS(mobile: string, message: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.msg91.com/api/v5/flow/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authkey': this.apiKey,
        },
        body: JSON.stringify({
          flow_id: process.env.MSG91_OTP_FLOW_ID,
          sender: this.senderId,
          mobiles: `91${mobile}`,
          message: message,
        }),
      })

      return response.ok
    } catch (error) {
      console.error('SMS sending failed:', error)
      return false
    }
  }

  async sendWhatsApp(mobile: string, message: string): Promise<boolean> {
    // Implement WhatsApp sending via MSG91 or other provider
    return false
  }
}
*/

// Export the service instance
export const otpService = new MockOTPService()

// Helper function to format mobile number
export function formatMobileNumber(mobile: string): string {
  // Remove all non-digits
  const digits = mobile.replace(/\D/g, '')
  
  // Handle different formats
  if (digits.startsWith('91') && digits.length === 12) {
    return digits.substring(2) // Remove country code
  } else if (digits.length === 10) {
    return digits
  } else {
    throw new Error('Invalid mobile number format')
  }
}

// Helper function to validate mobile number
export function validateMobileNumber(mobile: string): boolean {
  const digits = mobile.replace(/\D/g, '')
  return digits.length === 10 && /^[6-9]/.test(digits)
}
