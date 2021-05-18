const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth')
const User = require('../../models/User');
const Post = require('../../models/Post');
const Profile = require('../../models/Profiles');

const router = express.Router();



// @route api/Post
//create a post
router.post('/', [auth, [
    check('text', 'Text is required')
        .not().isEmpty()
]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        try {
            const user = await User.findById(req.user.id).select('-password');

            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            });

            const post = await newPost.save();
            res.json(post);
        } catch (err) {
            console.error(err.message)
            res.status(500).send('server error')
        }
    });

// @route Get api/post
// get all the posts
router.get('/', auth, async (req, res) => {
    try {

        const posts = await Post.find().sort({ date: -1 });
        return res.json(posts)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
})


// @route Get api/post/:post_id
// get the post by id
router.get('/:post_id', auth, async (req, res) => {
    try {

        const post = await Post.findById(req.params.post_id);
        if (!post) {
            return res.status(404).json({ msg: "No such post found" });
        }
        return res.json(post)
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: "No such post found" });
        }
        res.status(500).send('Server error')
    }
});


// @route delete api/post/:post_id
// delete a post
router.delete('/:post_id', auth, async (req, res) => {
    try {

        const post = await Post.findById(req.params.post_id);

        if (!post) {
            return res.status(404).json({ msg: "No such post found" });
        }

        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' })
        }

        await post.remove();
        return res.json({ msg: 'post removed' })
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: "No such post found" });
        }
        res.status(500).send('Server error')
    }
})



// @route Put api/post/like/:post_id
// like the post

router.put('/like/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);

        const flag = post.likes.find(like => like.user.toString() === req.user.id);
        if (flag === undefined) {
            post.likes.unshift({ user: req.user.id });
            await post.save()

            return res.json(post.likes)

        }
        res.status(400).json({ msg: 'post already liked' })

    } catch (err) {
        console.log(err.message)
        res.status(500).send("server error")
    }
});


// @route Put api/post/unlike/:post_id
// unlike the post

router.put('/unlike/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);

        const flag = post.likes.find(like => like.user.toString() === req.user.id);
        if (flag === undefined) {

            return res.status(400).json({ msg: 'post has not yet been liked' });
        }

        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

        post.likes.splice(removeIndex, 1);

        post.save();

        res.json(post.likes)

    } catch (err) {
        console.log(err.message)
        res.status(500).send("server error")
    }
});



//Post @route api/Post/comment/:post_id
// Comment on a post
router.post('/comment/:post_id', [auth, [
    check('text', 'Text is required')
        .not().isEmpty()
]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        try {
            const user = await User.findById(req.user.id).select('-password');
            const post = await Post.findById(req.params.post_id);
            console.log(post)
            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            };

            post.comments.unshift(newComment);
            await post.save();

            res.json(post.comments);
        } catch (err) {
            console.error(err.message)
            res.status(500).send('server error')
        }
    });



//delete @route api/Post/comment/:post_id/:comment_id
// delete a comment
router.delete('/comment/:post_id/:comment_id', auth, async (req, res) => {
    try {

        const post = await Post.findById(req.params.post_id);
        console.log(post)
        //pull out the comment
        const comment = post.comments.find(comment => comment.id == req.params.comment_id);

        // check if comment exist
        if (!comment) {
            return res.status(404).json({ msg: 'comment does not exist' });
        }

        // check user
        if (comment.user.toString() !== req.user.id) {
            return res.status(401)
        }

        const removeIndex = post.comments.
            map(comment => comment.user.toString())
            .indexOf(req.user.id);

        post.comments.splice(removeIndex, 1);

        post.save();

        res.json(post.comments)

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "server error" })
    }
})


module.exports = router;