This is our main file where we are making the express server and calling all our routes in it..


require('express'); :> express is a module or we can say third party library so to use its functions we use to import it. 

const connectDB = require('./config/db') :> We have made one function for setup the connection of the mongodb database. So we are requiring that function from db file and assignig that in connectDB varialbe. And by writing " connectDB()" we are calling that database connection function.

const app = express(); :> to use express we need to create instance of express. so by using "express()" we are creating an object and assing that in app variable. 


app.use(express.json({ extended: false })); :>  As we are using POST and PUT methods. When we will try to get the data from req.body we need to use express.json() so that we can recognise that data into json object and can do further operation with that json object.


process.env.PORT :> So when our project will go in production level at that time it's not good to write our port no. in the server file. So we will be accessing the PORT no. from env file.