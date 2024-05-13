exports.publish = async (channel) => {
  
  channel.publish('queue_name', new Buffer(data), {}) // queue-based
  
  channel.publish('exchange_name', 'routing_key', new Buffer(data, {})) // routing_key-based
}