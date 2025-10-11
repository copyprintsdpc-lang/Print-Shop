import { chromium, FullConfig } from '@playwright/test'

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown...')
  
  const browser = await chromium.launch()
  const page = await browser.newPage()
  
  try {
    // Clean up test data if needed
    console.log('🗑️ Cleaning up test data...')
    
    // Login as admin to clean up
    await page.goto('http://localhost:3000/admin/login')
    await page.fill('input[name="email"]', 'admin@sdpcprint.com')
    await page.fill('input[name="password"]', 'admin123')
    await page.click('button[type="submit"]')
    
    // Wait for login
    await page.waitForURL('http://localhost:3000/admin')
    
    // Clean up test orders
    try {
      const ordersResponse = await page.request.get('http://localhost:3000/api/admin/orders')
      const orders = await ordersResponse.json()
      
      if (orders.orders && orders.orders.length > 0) {
        console.log(`🗑️ Cleaning up ${orders.orders.length} test orders...`)
        
        for (const order of orders.orders) {
          try {
            await page.request.delete(`http://localhost:3000/api/admin/orders/${order._id}`)
          } catch (error) {
            console.log(`⚠️ Failed to delete order: ${order._id}`)
          }
        }
      }
    } catch (error) {
      console.log('⚠️ Failed to clean up orders')
    }
    
    // Clean up test quotes
    try {
      const quotesResponse = await page.request.get('http://localhost:3000/api/admin/quotes')
      const quotes = await quotesResponse.json()
      
      if (quotes.quotes && quotes.quotes.length > 0) {
        console.log(`🗑️ Cleaning up ${quotes.quotes.length} test quotes...`)
        
        for (const quote of quotes.quotes) {
          try {
            await page.request.delete(`http://localhost:3000/api/admin/quotes/${quote._id}`)
          } catch (error) {
            console.log(`⚠️ Failed to delete quote: ${quote._id}`)
          }
        }
      }
    } catch (error) {
      console.log('⚠️ Failed to clean up quotes')
    }
    
    // Clean up test users (except admin)
    try {
      const usersResponse = await page.request.get('http://localhost:3000/api/admin/users')
      const users = await usersResponse.json()
      
      if (users.users && users.users.length > 0) {
        const testUsers = users.users.filter((user: any) => 
          user.email.includes('test') || 
          user.email.includes('example.com') ||
          user.email.includes('john.doe')
        )
        
        if (testUsers.length > 0) {
          console.log(`🗑️ Cleaning up ${testUsers.length} test users...`)
          
          for (const user of testUsers) {
            try {
              await page.request.delete(`http://localhost:3000/api/admin/users/${user._id}`)
            } catch (error) {
              console.log(`⚠️ Failed to delete user: ${user._id}`)
            }
          }
        }
      }
    } catch (error) {
      console.log('⚠️ Failed to clean up users')
    }
    
    console.log('✅ Global teardown completed successfully')
    
  } catch (error) {
    console.error('❌ Global teardown failed:', error)
    // Don't throw error to avoid failing the test suite
  } finally {
    await browser.close()
  }
}

export default globalTeardown
