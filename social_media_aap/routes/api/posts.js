const express = require('express');

const router = express.Router();

// @route api/Post
router.post('/',(req,res) => {
    console.log(req.body);
    res.send("Post route");
    });

module.exports = router;