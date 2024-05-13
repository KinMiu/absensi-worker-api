require('dotenv').config()
module.exports = {
  rmq: `amqp://${process.env.RMQ_USER}:${process.env.RMQ_PASS}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}/%2f${process.env.RMQ_VHOST}?heartbeat=60`,
  // mongo:
  // 'mongodb+srv://admin:uo5sgXzc9?tz9mdWo@cluster0.c84ve12.mongodb.net/absensiRFID'
  // 'mongodb+srv://admin:uo5sgXzc9tz9mdWo@cluster0.c84ve12.mongodb.net/absensiRFID?retryWrites=true&w=majority'

  mongo: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`
}


// db.createUser({
//   user: "admin",
//   pwd: "12345",
//   roles: [
//     "readWrite", "dbAdmin"
//   ]
// })