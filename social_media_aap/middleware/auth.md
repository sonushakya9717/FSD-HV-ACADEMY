const jwt = require('jsonwebtoken'); :> We are reqiuring jwt to use it's functionality. i am using so that i can know the user identity and can use authentication mechanism. 


const config = require('config'); :> requiring so that i can use configration files which i have setup.

module.exports = function (req, res, next) :> Creating one middleware which will take the token from the headers and will authenticate that token if it is there. And if that token is verified then the next() function run.