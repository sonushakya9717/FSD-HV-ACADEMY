const express = require('express');

const router = express.Router();

// @route api/Post
router.get('/',(req,res) => res.send("Post route"));

module.exports = router;