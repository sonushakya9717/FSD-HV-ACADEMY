This is the file where there are all the routes dealing with the users Post.


router.post('/', [auth, [
    check('text', 'Text is required')
        .not().isEmpty()
]],
    async (req, res) :> created post route "api/post" it is a private route where user can create a post.

    it is a private route that means the current logged in can only visit this route and can create his posts only.

    const user = await User.findById(req.user.id).select('-password'); :> it will find the current user in the User model and will get the current user data from the User model except password.

    it will save the data passed by the user in the Post model.

    output :>
            send the post which is created as a json object in the response.

            Will send the server error if there is any issue creating a post.


router.get('/', auth, async (req, res) :> Created a get route "api/post" it is also a   private route as i am using auth. it will show all the posts posted by the users.

        const posts = await Post.find().sort({ date: -1 }); :> it will get all the posts from the Post model in the decending order by dates.

        output :>
                it will send a json object which will be have an array of posts.

                Will send the server error if there is any issue getting the posts.


    
 