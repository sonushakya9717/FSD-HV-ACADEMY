const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')
const User = require('../../models/User')

// @route api/users
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please write the valid email').isEmail(),
    check('password', 'Please enter the password 8 or more characters').isLength({ min: 8 })
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { name, email, password } = req.body;

        try {

            let user = await User.findOne({ email })
            // console.log(user);
            if (user) {
                return res.status(400).json({ errors: [{ msg: "User already exists" }] })
            }

            const avatar = gravatar.url(email, {
                s: 200,
                r: 'pg',
                d: 'mm',
            })

            user = new User({
                name,
                email,
                avatar,
                password,
            })

            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt)

            await user.save()

            const payload = {
                user: {
                    id: user.id,
                }
            }

            jwt.sign(payload,
                config.get('jwtSecret'),
                { expiresIn: 36000 },
                (err, token) => {
                    if (err) {
                        throw err
                    }
                    else {
                        res.json({ token });
                    }

                }
            )
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server error');
        }

    });

module.exports = router;