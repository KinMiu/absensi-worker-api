const moment = require('moment')
const chalk = require('chalk')


exports.consume = async (connection) => {
  let MSG_TYPE_STATE = true
  let channel = await connection.createChannel()
  channel.consume("AbsensiService", async (msg) => { // Jika ada pesan masuk
    const start = new Date()
    let message = JSON.parse(msg.content.toString())
    // console.log(message)
    if (message.MSG_TYPE === 0) {
      require('../controller/mac_address_controller').parse(msg, channel)
    } else if (message.MSG_TYPE == 1) {
      console.log(message)
      require('../controller/pengguna_controller').parse(msg, channel)
    } else if (message.MSG_TYPE === 2) {
      require('../controller/kelas_controller').parse(msg, channel)
    } else {
      // console.log(message)
      MSG_TYPE_STATE = false
      require('../controller/monitoring_controller').parse(msg, channel)
      channel.ack(msg)
      // console.log(chalk.bgRed(`[${moment().utcOffset("+07:00").format('DD-MM-YYYY HH:mm:ss')}] ${msg.fields.routingKey} - WRONG MSG_TYPE ${message}`))
    }
    const ms = new Date() - start
    if (MSG_TYPE_STATE !== false) console.log(chalk.bgBlue(`[${moment().utcOffset("+07:00").format('DD-MM-YYYY HH:mm:ss')}] ${msg.fields.routingKey} - ${ms}ms`))
  })
} 