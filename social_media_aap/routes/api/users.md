const gravatar = require('gravatar') :> i am using this to get the user avatar which user have on it's email.

const User = require('../../models/User') :> To store the user credentials in the USER model.


router.post :> Creating POST route "api/users" where user will register. And the data will be going to store in USER model with "with avatar too".