const mongoose = require('mongoose'); :>  importing mongoose library for mongodb and managing schema validation.

const config = require('config'); :> we are importing config folder to use the files for configuration.

const db = config.get('mongoURL'); :>  we are assigning ,"mongoURL" from config folder ,in variable named db.

connectDB = async ()  :>  we have made a function named connectDB, it is establishing the connection between mongoDB atlas and our server so that we perform the operation on that..

module.exports = connectDB :> we are exporting the connectDB function so that we can require this function where ever we need it.