const sql = require('mssql')

const sqlConfig = {
  user: 'ss',
  password: '1234',
  database: 'phytogenx',
  server: 'localhost',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: false // change to true for local dev / self-signed certs
  }
}

async () => {
 try {
  // make sure that any items are correctly URL encoded in the connection string
  await sql.connect(sqlConfig)
  console.log('conexion de bd exitosa')
  //const result = await sql.query`select * from mytable where id = ${value}`
  //console.dir(result)
 } catch (err) {
  // ... error checks
  console.log(err)
 }
}
