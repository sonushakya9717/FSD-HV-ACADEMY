const express = require('express');
const request = require('request');
const config = require('config');
const auth = require('../../middleware/auth')
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Profile = require('../../models/Profiles')
const User = require('../../models/User');
const Post = require('../../models/Post');
const { json } = require('express');


// Get @route api/profile/me
// Get the current user profile
router.get('/me', auth, async (req, res) => {
    try {
        console.log(req.user)
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({ msg: "There is no profile for this user" });
        }

        res.json(profile);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error")
    }
});


// Post @route api/profile
// Create or Update a user profile
router.post('/', [auth, [
    check('status', 'Status is required')
        .not()
        .isEmpty(),
    check('skills', 'Skills is required')
        .not()
        .isEmpty(),
]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            company,
            website,
            location,
            status,
            skills,
            bio,
            githubusername,
            youtube,
            facebook,
            instagram,
            linkedin,
            twitter,
        } = req.body;

        /// profile object 

        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (status) profileFields.status = status;
        if (skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim());
        }
        profileFields.social = {};
        if (bio) profileFields.bio = bio;
        if (githubusername) profileFields.githubusername = githubusername;
        if (twitter) profileFields.social.twitter = twitter;
        if (youtube) profileFields.social.youtube = youtube;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;
        if (facebook) profileFields.social.facebook = facebook;


        try {
            let profile = await Profile.findOne({ user: req.user.id })

            if (profile) {
                // Update needed
                profile = await Profile.findOneAndUpdate({ user: req.user.id },
                    { $set: profileFields },
                    { new: true });
                return res.json(profile)
            }

            // Need to create
            profile = new Profile(profileFields)
            console.log("hello")
            profile.save()
            res.json(profile)

        } catch (err) {
            console.error(err.message)
            res.status(500).send('Server Error')
        }
    })


// get @route api/profile
// get all the profiles
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        return res.json(profiles);
    } catch (err) {
        console.error(err.message)
        res.status(500).send("server Error")
    }
})



// get @route api/profile/user/:user_id
// get all the profiles
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({ msg: "there is no such profile" })
        }
        return res.json(profile);
    } catch (err) {
        console.error(err.message)
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: "there is no such profile" })
        }
        res.status(500).send("server Error")
    }
})



// delete Profile, user and posts
    
router.delete('/', auth, async (req, res) => {
    try {
        // remove users posts
        await Post.deleteMany({ user: req.user.id })
        // remove profile
        await Profile.findOneAndDelete({ user: req.user.id });

        // remove user
        await User.findOneAndDelete({ _id: req.user.id })

        return res.json({ msg: "User Deleted" })
    } catch (err) {
        console.error(err.message)

        res.status(500).send("server Error")
    }
})


// put @route api/profile/experience
// updating experience

router.put('/experience', [auth, [
    check('title', 'Title is required')
        .not()
        .isEmpty(),
    check('company', 'Company is required')
        .not()
        .isEmpty(),
    check('from', 'From date is required')
        .not().isEmpty(),
    check('to', 'To date is required')
        .not().isEmpty()
]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;

        const add_experience = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }

        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.experience.unshift(add_experience);

            await profile.save()
            res.json(profile);
        } catch (err) {
            console.error(err);
            res.status(500).send("Server Error")
        }
    })


//delete @route api/profile/experience/ex.id
// deleting experience

router.delete('/experience/:ex_id', auth,
    async (req, res) => {
        try {
            const profile = await Profile.findOne({ user: req.user.id });

            const remove_index = profile.experience.map(item => item.id).indexOf
                (req.params.ex_id);

            profile.experience.splice(remove_index, 1);

            await profile.save()
            res.json(profile.experience)
        } catch (err) {
            console.error(err)
            res.send('Server Error')
        }

    })




// put @route api/profile/education
// updating or adding education

router.post('/education', [auth, [
    check('school', 'School is required')
        .not()
        .isEmpty(),
    check('degree', 'Degree is required')
        .not()
        .isEmpty(),
    check('fieldofstudy', 'fieldofstudy is required')
        .not().isEmpty(),
    check('from', 'from date is required')
        .not().isEmpty(),
    check('to', 'To date is required')
        .not().isEmpty()
]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        } = req.body;

        const add_education = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        }

        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.education.unshift(add_education);

            await profile.save()
            res.json(profile);
        } catch (err) {
            console.error(err);
            res.status(500).send("Server Error")
        }
    })

//delete @route api/profile/education/edu_id
// deleting education

router.delete('/education/:edu_id', auth,
    async (req, res) => {
        try {
            const profile = await Profile.findOne({ user: req.user.id });

            const remove_index = profile.education.map(item => item.id).indexOf
                (req.params.ex_id);

            profile.education.splice(remove_index, 1);

            await profile.save()
           return res.json(profile.education)
        } catch (err) {
            console.error(err.message)
            res.send('Server Error')
        }

    })


// Get @route api/profile/github/:username
// get user github repo.

router.get('/github/:username', (req, res) => {
    try {
        const option = {
            url: `https://api.github.com/users/${req.params.username}/repos?per_page=6&sort=created:asc
            &client_id=${config.get('githubClientId')}&client_secret=${config.get('githubsecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        }

        request(option, (error, response, body) => {
            if (error) {
                console.error(error)
            }
            if (response.statusCode != 200) {
                return res.status(404).json({ msg: "No such github profile found" });
            }

            res.send(JSON.parse(body))
        })
    } catch (err) {
        console.error(err.message)
        res.status(500).send("server error")
    }
})

module.exports = router;

