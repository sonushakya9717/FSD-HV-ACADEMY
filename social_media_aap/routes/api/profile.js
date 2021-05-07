const express = require('express');
const auth = require('../../middleware/auth')
const router = express.Router();
const {check, validationResult} = require('express-validator');
const Profile = require('../../models/Profiles')
const User = require('../../models/User')


// Get @route api/profile/me
// Get the current user profile
router.get('/me',auth,async(req,res) => {
    try{
        console.log(req.user)
        const profile = await Profile.findOne({user:req.user.id}).populate('user',['name','avatar']);

        if(!profile){
            return res.status(400).json({msg:"There is no profile for this user"});
        }

        res.json(profile);
    }catch(err){
        console.log(err.message);
        res.status(500).send("Server error")
    }
});


// Post @route api/profile
// Create or Update a user profile
router.post('/',[auth,[
    check('status', 'Status is required')
    .not()
    .isEmpty(),
    check('skills', 'Skills is required')
    .not()
    .isEmpty(),
]],
async(req,res) => {
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {
        company,
        website,
        location,
        status,
        skills,
        bio,
        githubusername,
        experience,
        education,
        social,
    } = req.body;

    /// profile object 

    const profileFields = {};
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(status) profileFields.status = status;
    if(skills) {
        profileFields.skills=skills.split(',').map(skill =>skill.trim());
    }
    if(bio) profileFields.bio = bio;
    if(githubusername) profileFields.githubusername = githubusername;
    if(experience) profileFields.experience = experience;
    if(education) profileFields.education = education;
    if(social) profileFields.social = social;
})


module.exports = router;