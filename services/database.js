const client = require('mongodb').MongoClient()
const config = require('../config')

exports.dbConnect = () => {
  return new Promise((resolve, reject) => {
    client.connect(config.mongo, function (err, database) {
      if (err) {
        console.log('Connect to mongodb server failed')
        reject(err)
      } else {
        resolve(database)
      }
    })
  })
}
