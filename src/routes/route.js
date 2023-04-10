const express = require('express');
const router = express.Router();

const { createUser, userLogin } = require('../controllers/userController');
const {createblog,getblog,updateBlogData} = require("../controllers/blogController")

router.post("/register", createUser); // createUser
router.post("/login", userLogin); //register user
router.post("/blogs",createblog) //create Blog
router.get("/blogs",getblog) //get Blog
router.put("/blogs/:blogId",updateBlogData)  //update the blog

module.exports = router;