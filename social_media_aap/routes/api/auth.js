const express = require('express');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const config = require('config')
const {check, validationResult} = require('express-validator');
const User = require('../../models/User');
const router = express.Router();

// @route api/auth
router.get('/',auth,async(req,res) =>{
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.send(user);
    } catch(err){
        console.error(err.message);
        res.status(500).send('server error')
    }
});


// @route api/auth
router.post('/',[
    check('email','Please write the valid email').isEmail(),
    check('password','Password is required').exists()
],
async (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json( {errors : errors.array() } )
     }

     const {email,password} = req.body;

     try{

         let user = await User.findOne({email})
            // console.log(user);
         if(!user){
             return res.status(400).json({errors:[{msg:"Invalid Credentials"}]})
         }

         const ismatch = await bcrypt.compare(password,user.password);

         if(!ismatch){
            return res.status(400).json({errors:[{msg:"Invalid Credentials"}]})
         }
         const payload = {
            user: {
                id:user.id,
            }
        }

        jwt.sign(payload,
            config.get('jwtSecret'),
            {expiresIn: 3600},
            (err,token) => {
                if(err) {
                    throw err
                }
                else{
                    res.json({token});
                }

            }
            )
     } catch(err){
       console.log(err.message);
       res.status(500).send('Server error'); 
     }
    
    });

module.exports = router;