#!/usr/bin/env node

/**
 * Danger: drops all collections in the target database except the MVP set.
 *
 * Usage:
 *   ENV_FILE=.env.production node scripts/cleanup-prod-db.js --apply
 *
 * By default (without --apply) the script runs in dry-run mode and only logs
 * the collections that would be removed.
 */

const path = require('path')
const { MongoClient } = require('mongodb')
const dotenv = require('dotenv')

const DEFAULT_ENV_FILE = '.env.local'
const KEEP_COLLECTIONS = new Set(['admins', 'quotes', 'pickups', 'services'])

async function run() {
  const envFile = process.env.ENV_FILE || DEFAULT_ENV_FILE
  dotenv.config({ path: path.resolve(envFile) })

  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error('❌ MONGODB_URI is missing. Set it in your env file or environment.')
    process.exit(1)
  }

  const dbName = extractDbName(uri)
  if (!dbName) {
    console.error('❌ Unable to determine database name from MONGODB_URI.')
    process.exit(1)
  }

  const isApply = process.argv.includes('--apply')

  console.log(`\n🔗 Connecting to MongoDB database: ${dbName}`)
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db(dbName)
    const collections = await db.listCollections().toArray()
    const dropCandidates = collections
      .map((col) => col.name)
      .filter((name) => !KEEP_COLLECTIONS.has(name))

    console.log(`\n✅ Collections to keep: ${Array.from(KEEP_COLLECTIONS).join(', ')}`)

    if (dropCandidates.length === 0) {
      console.log('🎉 Nothing to clean. Only MVP collections are present.\n')
      return
    }

    console.log('\n⚠️ Collections that will be dropped:')
    dropCandidates.forEach((name) => console.log(`   • ${name}`))

    if (!isApply) {
      console.log('\nDry run complete. Re-run with --apply to execute the cleanup.')
      console.log('Example: ENV_FILE=.env.production node scripts/cleanup-prod-db.js --apply\n')
      return
    }

    console.log('\n🚧 Dropping collections...')
    for (const name of dropCandidates) {
      await db.collection(name).drop()
      console.log(`   ✅ Dropped ${name}`)
    }

    console.log('\n🎯 Cleanup complete. Only MVP collections remain.\n')
  } catch (error) {
    console.error('\n❌ Cleanup failed:', error.message)
    process.exit(1)
  } finally {
    await client.close()
  }
}

function extractDbName(uri) {
  const match = uri.match(/mongodb(?:\+srv)?:\/\/[^/]+\/([^?]+)/i)
  return match ? match[1] : null
}

run()


