This is the file where i have created all the routes dealing with user profile.

const auth = require('../../middleware/auth') :> User can have see profiles or can create profile when he/she is logged in. So for validating the user profile with current profile we need to have auth middleware.


const { check, validationResult } = require('express-validator'); :> for doing server side data validation.

Profile = require("../../models/Profile"); :> Getting profile model so that i can store or get the user profile data.

const { json } = require('express'); :> Getting json method from the express using destructuring to pass the data which we are getting from PUT or POST requests into json object.


router.get('/me', auth, async (req, res) :> Creating get route "api/profile/me" where we will going to get the profile of the current user.
i am passing auth middleware so that i can verify the current user.
 
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']); :> check if the current user have his profile or not in Profile model.
        
        if the profile is there it will send the profile data in response else it will so error "profile is not there."


router.post('/', [auth, [
    check('status', 'Status is required')
        .not()
        .isEmpty(),
    check('skills', 'Skills is required')
        .not()
        .isEmpty(),
]],
    async (req, res) :> Creating POST route "api/profile" where user can create his profile. Passing auth(middleware) because user can go to "api/profile" route and create his profile if he is logged in.


    check('status', 'Status is required') :> using express validator so that i can validate the status data if user passing or not before doing operation on that.



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
        } = req.body;  :> using destructing creating variables and getting their values from the req.body object.

        if (profile) :> check if profile already exists of the current use if yes then it will going to update the profile data else it will create a new profile in the Profile model.



router.get('/', async (req, res) :> Creating get route "api/profile" where user can see all the profiles of the users.

    const profiles = await Profile.find().populate('user', ['name', 'avatar']) :> Will find all the profiles from the Profile model and also extract the name and avatar from the User model of those profiles.

    it will return an array of object in response where each object is a profile of a user.

    if no profile is there then it will show a "server error".


router.get('/user/:user_id', async (req, res) :> Creating get route "api/profile/user/:id" where user can see the profile of a particular user by id.

    Here user should have to pass an id of which user he/she want to see profile.

    if there is no profile at that id then it will response with a message "There is no such profile".

    if (err.kind == 'ObjectId') :> We are checking the type or the structure of the id which is passed by the user. if it matches with the "ObjectId" then it will response with a message "there is no such profile" else it will server error in respnse.


router.delete('/', auth, async (req, res) :> Creating delete route "api/profile" where user can delte user and his posts and profile. 

    Logged in user can only delte his posts and profile or account. So for ensurning that we are using auth middleware in this route. 

    await Post.deleteMany({ user: req.user.id }) :> As posts can be more than one posted by a user. So this line is to find and delete all the posts of the logged in user from the Post model.


    await Profile.findOneAndDelete({ user: req.user.id }); :> So this line is to find and delete the logged in user profile from the Profile model.

    await User.findOneAndDelete({ _id: req.user.id }) :> So this line is to find and delete the logged in user from the User model.
    
    if data is delted then it will send a message in response "User deleted" else will response a server error.


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
    async (req, res) :>  Creating put route "api/profile/experience" where user can  update his experience with some details.

            using auth :> User can only update or can put his new experience when it is logged in or authenticated user.


            const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;  :>  Extracting data from the req.body and assigning them to variable using destructuring.

        const add_experience = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }  :> Creating new object with the data which we are getting from req.body.


        const profile = await Profile.findOne({ user: req.user.id }) :> Finding the current user profile from the Profile model.

        profile.experience.unshift(add_experience); :> Updating the data in profile experience array in the begining of that arraay. So that last experience will going to render at top of the page.

        if the profile is there of there current user it will update the experince and will send profile object in response else will send a response "server error".



router.delete('/experience/:exp_id', auth,
    async (req, res) :> Creating delete route "api/profile/experince/:exp_id" user can delete his experience from his profile only if the user is logged in.

    const profile = await Profile.findOne({ user: req.user.id }); :> Will find the current user profile in the Profile model.

    const remove_index = profile.experience.map(item => item.id).indexOf
                (req.params.exp_id); :> it will map through the current user profile experience array and will assign the index of the experience in the remove_index variable.

    profile.experience.splice(remove_index, 1) :> it will slice or remove the element from the experiece array of the current user profile by the given index.

    it will send the updated user profile in response esle will send the server error in response.



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
    async (req, res)  :>  Creating POST route "api/profile/exducation" where logged in user can update or can put his exducation details.



router.delete('/education/:edu_id', auth,
    async (req, res)  :> Creating delete route "api/profile/education/:edu_id" where user can delete his education from his profile only if the user is logged in.




router.get('/github/:username', (req, res) :> Created get route "api/profile/github/:username" where user can get github profile of the user by github username.

        request(option, (error, response, body) :> Putting request to get the data from the github by username.

        request takes two parameter one is the option which contain the url type of request and the header and second parmeter is a callback function.


    output:
        it will send the github data as an object in response if given username exist else will response with a message "No such profile found".

        if there is any issue while putting request then it will response a server error.

    






