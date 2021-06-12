This is the file where we will allow the user to login and check those cretdentials into USER model.

const bcrypt = require('bcryptjs'); :> Using to hash the password so that it will be safe.

const User = require('../../models/User'); :> Requiring this USER model to check if the credentials exists in it or not. So that we can know this user is registered.

const router = express.Router(); :> i can use express router functionality and can organize my auth routes in seperate file.

const { check, validationResult } = require('express-validator'); :> it is a middleware. We are using it to check wheather the form data passes by the user is correct form or not before doing any operation on that data or sending the response to the client.


router.post :> we are creating one post route "api/auth" which will take the credentials of the user and will authenticate the user and allow him to login.