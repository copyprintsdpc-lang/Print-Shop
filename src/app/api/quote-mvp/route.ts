import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { connectToDatabase } from '@/lib/db'
import QuoteRequest from '@/models/QuoteRequest'
import { notifyPrintCentre, notifyCustomer } from '@/lib/notifications'
import { getCloudFrontUrl, generateSignedCloudFrontUrl } from '@/lib/aws'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    
    const phone = formData.get('phone') as string
    const email = formData.get('email') as string
    const address = formData.get('address') as string
    const message = formData.get('message') as string
    const quantity = formData.get('quantity') as string
    const deliveryMethod = formData.get('deliveryMethod') as string

    // Validate required fields (paper size is now per-file, removed from global validation)
    if (!phone || !deliveryMethod) {
      return NextResponse.json({ 
        ok: false, 
        message: 'Phone number and delivery method are required' 
      }, { status: 400 })
    }

    // Note: Quantity is now handled per-file, validated after processing files

    // Validate delivery address if delivery method is selected
    if (deliveryMethod === 'delivery' && (!address || !address.trim())) {
      return NextResponse.json({ 
        ok: false, 
        message: 'Delivery address is required when delivery method is selected' 
      }, { status: 400 })
    }

    // Connect to database first (needed for rate limiting and quote creation)
    await connectToDatabase()
    
    // Rate limiting: Check if phone number has submitted more than 3 quotes in the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const recentQuotesCount = await QuoteRequest.countDocuments({
      'customer.phone': phone.trim(),
      createdAt: { $gte: oneHourAgo }
    })
    
    if (recentQuotesCount >= 3) {
      return NextResponse.json({
        ok: false,
        message: 'You have reached the maximum limit of 3 quote requests per hour. Please try again later.'
      }, { status: 429 })
    }

    // Handle file uploads with quantities, color modes, and paper sizes - check for filesWithQuantities first
    let filesWithQuantities: Array<{key: string, url?: string, quantity: number, name: string, colorMode: 'color' | 'grayscale', paperSize: string}> = []
    const filesWithQuantitiesData = formData.get('filesWithQuantities') as string
    
    if (filesWithQuantitiesData) {
      // Files are already uploaded to Cloudinary with quantities
      try {
        const parsed = JSON.parse(filesWithQuantitiesData)
        if (Array.isArray(parsed) && parsed.length > 0) {
          filesWithQuantities = parsed
            .map((file: any) => {
              const key = String(file?.key || file?.url || '').trim()
              if (!key) return null
              const colorMode = file?.colorMode === 'grayscale' ? 'grayscale' : 'color'
              const paperSize = String(file?.paperSize || 'A4 (8.3" × 11.7")').trim() || 'A4 (8.3" × 11.7")'
              const name = typeof file?.name === 'string' && file.name.trim() ? file.name.trim() : 'Unknown'
              const quantityValue = Number(file?.quantity)

              return {
                key,
                url: typeof file?.url === 'string' ? file.url : undefined,
                quantity: Number.isNaN(quantityValue) ? 1 : Math.max(1, quantityValue),
                name,
                colorMode,
                paperSize,
              } as {
                key: string
                url?: string
                quantity: number
                name: string
                colorMode: 'color' | 'grayscale'
                paperSize: string
              }
            })
            .filter((file): file is NonNullable<typeof file> => Boolean(file))
        }
      } catch (parseError) {
        console.error('Error parsing files with quantities:', parseError)
      }
    }
    
    // Fallback: If no filesWithQuantities, check for legacy fileUrls
    if (filesWithQuantities.length === 0) {
      const fileUrls = formData.get('fileUrls') as string
      if (fileUrls) {
        try {
          const urls = JSON.parse(fileUrls)
          if (Array.isArray(urls) && urls.length > 0) {
            // Convert legacy format to new format (default quantity 1, color mode color, paper size from form or A4)
            const legacySize = 'A4 (8.3" × 11.7")'
            filesWithQuantities = urls.map((url: string, index: number) => ({
              key: url,
              url,
              quantity: parseInt(quantity) || 1,
              name: `File ${index + 1}`,
              colorMode: 'color' as const,
              paperSize: legacySize
            }))
          }
        } catch (parseError) {
          console.error('Error parsing file URLs:', parseError)
        }
      }
    }
    
    // Final fallback: Check for direct file uploads (legacy support)
    if (filesWithQuantities.length === 0) {
      const files = formData.getAll('files') as File[]
      
      if (files.length === 0) {
        return NextResponse.json({ 
          ok: false, 
          message: 'Please upload at least one file' 
        }, { status: 400 })
      }

      // Save uploaded files locally (fallback)
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'quotes')
      
      for (const file of files) {
        if (file && file.size > 0) {
          try {
            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)
            
            // Create upload directory if it doesn't exist
            const { mkdir } = await import('fs/promises')
            await mkdir(uploadDir, { recursive: true })
            
            // Save file with timestamp
            const timestamp = Date.now()
            const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
            const filename = `${timestamp}_${sanitizedName}`
            const filepath = join(uploadDir, filename)
            
            await writeFile(filepath, buffer)
            const legacySize = formData.get('size') as string || 'A4 (8.3" × 11.7")'
            filesWithQuantities.push({
              key: `/uploads/quotes/${filename}`,
              url: `/uploads/quotes/${filename}`,
              quantity: parseInt(quantity) || 1,
              name: file.name,
              colorMode: 'color' as const,
              paperSize: legacySize
            })
          } catch (fileError) {
            console.error('File upload error:', fileError)
            // Continue processing even if file upload fails
          }
        }
      }
    }
    
    // Final validation
    if (filesWithQuantities.length === 0) {
      return NextResponse.json({ 
        ok: false, 
        message: 'Please upload at least one file' 
      }, { status: 400 })
    }
    
    // Validate all files have valid quantities, color modes, and paper sizes
    for (const file of filesWithQuantities) {
      if (!file.key || !file.key.toString().trim()) {
        return NextResponse.json({
          ok: false,
          message: `Missing storage key for file: ${file.name}. Please re-upload the file.`
        }, { status: 400 })
      }
      if (!file.quantity || file.quantity < 1) {
        return NextResponse.json({ 
          ok: false, 
          message: `Invalid quantity for file: ${file.name}. Minimum quantity is 1.` 
        }, { status: 400 })
      }
      if (!file.colorMode || !['color', 'grayscale'].includes(file.colorMode)) {
        // Default to color if not specified
        file.colorMode = 'color'
      }
      if (!file.paperSize || !file.paperSize.trim()) {
        return NextResponse.json({ 
          ok: false, 
          message: `Paper size is required for file: ${file.name}.` 
        }, { status: 400 })
      }
    }
    
    // Calculate total quantity
    const totalQuantity = filesWithQuantities.reduce((sum, file) => sum + file.quantity, 0)
    
    // Generate quote number in format Q-xxxx (4 digit sequence)
    // Database is already connected above
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const datePrefix = `Q-${year}${month}${day}`
    
    // Get count of quote requests with today's prefix
    let sequence = 1
    try {
      const existingQuotes = await QuoteRequest.find({
        quoteNumber: { $regex: `^${datePrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}` }
      }).sort({ quoteNumber: -1 }).limit(1)
      
      if (existingQuotes.length > 0 && existingQuotes[0].quoteNumber) {
        // Extract sequence number from the last quote number (last 4 digits)
        const lastNumber = existingQuotes[0].quoteNumber
        const lastSequence = parseInt(lastNumber.slice(-4)) || 0
        sequence = lastSequence + 1
      }
    } catch (countError) {
      console.error('Error counting existing quotes:', countError)
      // Continue with sequence = 1 if count fails
    }
    
    // Generate Q-xxxx format (e.g., Q-2511010001)
    const quoteNumber = `${datePrefix}${sequence.toString().padStart(4, '0')}`
    
    const normalizedFiles = filesWithQuantities.map(file => ({
      ...file,
      url: file.url || getCloudFrontUrl(file.key)
    }))

    // Build quote request data object
    const quoteRequestData: any = {
      quoteNumber,
      customer: {
        phone: phone.trim(),
      },
      delivery: {
        method: deliveryMethod as 'pickup' | 'delivery',
      },
      quantity: totalQuantity, // Total quantity (sum of all file quantities)
      files: normalizedFiles, // Files with individual quantities, color modes, and paper sizes
      status: 'new', // Use 'new' status as per spec
    }

    // Add optional fields only if they exist and are not empty
    if (email && email.trim()) {
      quoteRequestData.customer.email = email.trim()
    }
    if (address && address.trim()) {
      quoteRequestData.delivery.address = address.trim()
    }
    if (message && message.trim()) {
      quoteRequestData.message = message.trim()
    }

    // Create quote request with validation
    let quoteRequest
    try {
      quoteRequest = await QuoteRequest.create(quoteRequestData)
    } catch (createError: any) {
      console.error('QuoteRequest creation error:', createError)
      // If it's a duplicate quote number, try with next sequence
      if (createError.code === 11000 || createError.message?.includes('duplicate')) {
        const retryNumber = `${datePrefix}${(sequence + 1).toString().padStart(4, '0')}`
        quoteRequestData.quoteNumber = retryNumber
        quoteRequest = await QuoteRequest.create(quoteRequestData)
      } else {
        throw createError
      }
    }

    // Prepare file URLs for notifications (backward compatibility)
    const primaryPaperSize = normalizedFiles.length === 1
      ? normalizedFiles[0].paperSize
      : 'Multiple sizes'

    const fileUrls = normalizedFiles.map(file => {
      if (file.url && file.url.startsWith('http')) {
        return file.url
      }

      try {
        return generateSignedCloudFrontUrl(file.key)
      } catch (error) {
        console.warn('Failed to generate signed CloudFront URL for notification, falling back to unsigned URL.', error)
        return getCloudFrontUrl(file.key)
      }
    })
    const fileDetails = normalizedFiles.map(f => `${f.name} (${f.quantity} copies, ${f.colorMode}, ${f.paperSize})`).join(', ')

    // Send notifications to print centre (email + WhatsApp)
    try {
      await notifyPrintCentre('quote', {
        quoteNumber: quoteRequest.quoteNumber,
        customerPhone: phone.trim(),
        customerEmail: email?.trim(),
        paperSize: primaryPaperSize,
        quantity: totalQuantity,
        deliveryMethod: deliveryMethod as 'pickup' | 'delivery',
        deliveryAddress: address?.trim(),
        message: message?.trim(),
        files: fileUrls,
        fileDetails: fileDetails // Include file details with quantities
      })
    } catch (notifyError) {
      console.error('Failed to send notifications to print centre:', notifyError)
      // Don't fail the request if notifications fail
    }

    // Send confirmation to customer (email and/or WhatsApp)
    try {
      await notifyCustomer('quote', {
        quoteNumber: quoteRequest.quoteNumber,
        customerPhone: phone.trim(),
        customerEmail: email?.trim(),
        paperSize: primaryPaperSize,
        quantity: totalQuantity,
        deliveryMethod: deliveryMethod as 'pickup' | 'delivery',
        files: fileUrls,
        fileDetails: fileDetails // Include file details with quantities
      })
    } catch (notifyError) {
      console.error('Failed to send customer notifications:', notifyError)
      // Don't fail the request if notifications fail
    }

    return NextResponse.json({ 
      ok: true, 
      message: 'Quote request submitted successfully!',
      quoteId: quoteRequest._id.toString(),
      quoteNumber: quoteRequest.quoteNumber
    })

  } catch (error: any) {
    console.error('Quote request error:', error)
    
    // Provide more detailed error message for validation errors
    let errorMessage = 'Failed to submit quote request. Please try again.'
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors || {}).map((err: any) => err.message)
      errorMessage = `Validation error: ${validationErrors.join(', ')}`
    } else if (error.message) {
      errorMessage = error.message
    }
    
    return NextResponse.json({ 
      ok: false, 
      message: errorMessage 
    }, { status: 500 })
  }
}

