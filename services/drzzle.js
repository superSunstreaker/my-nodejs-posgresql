import { drizzle } from 'drizzle-orm/node-postgres';
// You can specify any property from the node-postgres connection options
const db = drizzle({ 
  connection: { 
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});
 

async function getMultiple(page = 1) {
  const result = await db.execute('select 1');

  return result
}

module.exports = {
  getMultiple
}