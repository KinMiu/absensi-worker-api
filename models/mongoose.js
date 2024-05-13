const mongoose = require('mongoose')
const Schema = mongoose.Schema
const conn = require('../database/connection')

const CollectionSchema = new Schema({
  key: {
    type: Number
  }
}, {
  versionKey: false,
  collection: 'collection_name'
})

module.exports = conn.db().model('collection_name', CollectionSchema)