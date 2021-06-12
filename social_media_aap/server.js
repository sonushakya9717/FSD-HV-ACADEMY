const express = require('express');
const path = require('path')
const cors = require('cors')
const connectDB = require('./config/db')
const app = express();

app.use(cors())

connectDB();

app.use(express.json({ extended: false }));


app.use('/api/users', require('./routes/api/users'));

app.use('/api/post', require('./routes/api/posts'));

app.use('/api/auth', require('./routes/api/auth'));

app.use('/api/profile', require('./routes/api/profile'));


// Serve static assets in production
if(process.env.NODE_ENV === 'production'){
    // Set static folder
    app.use(express.static('client/build'));

    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    });
}


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));