import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup...')
  
  // Start browser
  const browser = await chromium.launch()
  const page = await browser.newPage()
  
  try {
    // Wait for application to be ready
    console.log('⏳ Waiting for application to be ready...')
    await page.goto('http://localhost:3000')
    await page.waitForLoadState('networkidle')
    
    // Check if application is running
    const title = await page.title()
    console.log(`✅ Application is running: ${title}`)
    
    // Setup test data if needed
    console.log('📊 Setting up test data...')
    
    // Create test admin user if not exists
    try {
      const adminResponse = await page.request.post('http://localhost:3000/api/admin/setup', {
        data: {
          email: 'admin@sdpcprint.com',
          password: 'admin123',
          name: 'Test Admin'
        }
      })
      
      if (adminResponse.ok()) {
        console.log('✅ Test admin user created/verified')
      }
    } catch (error) {
      console.log('ℹ️ Test admin user already exists or setup failed')
    }
    
    // Create test products if needed
    try {
      const productsResponse = await page.request.get('http://localhost:3000/api/products')
      const products = await productsResponse.json()
      
      if (!products.products || products.products.length === 0) {
        console.log('📦 Creating test products...')
        
        const testProducts = [
          {
            name: 'Business Cards',
            slug: 'business-cards',
            category: 'business-cards',
            tagline: 'Professional business cards',
            description: 'High-quality business cards with various options',
            basePrice: 100,
            minOrderQuantity: 100,
            isActive: true
          },
          {
            name: 'Posters',
            slug: 'posters',
            category: 'posters-banners',
            tagline: 'Large format posters',
            description: 'Eye-catching posters for events and promotions',
            basePrice: 200,
            minOrderQuantity: 10,
            isActive: true
          },
          {
            name: 'Flyers',
            slug: 'flyers',
            category: 'flyers',
            tagline: 'Marketing flyers',
            description: 'Effective marketing flyers for your business',
            basePrice: 50,
            minOrderQuantity: 100,
            isActive: true
          }
        ]
        
        for (const product of testProducts) {
          try {
            await page.request.post('http://localhost:3000/api/admin/products', {
              data: product
            })
          } catch (error) {
            console.log(`⚠️ Failed to create product: ${product.name}`)
          }
        }
        
        console.log('✅ Test products created')
      } else {
        console.log('ℹ️ Test products already exist')
      }
    } catch (error) {
      console.log('⚠️ Failed to setup test products')
    }
    
    console.log('✅ Global setup completed successfully')
    
  } catch (error) {
    console.error('❌ Global setup failed:', error)
    throw error
  } finally {
    await browser.close()
  }
}

export default globalSetup
