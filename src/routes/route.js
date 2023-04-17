const express = require('express');
const router = express.Router();

const { createUser, userLogin } = require('../controllers/userController');
const { createblog, getblog, updateBlogData, deleteByParams } = require("../controllers/blogController")
const {authentication} = require('../middlewares/middleware')

router.post("/register", createUser); // createUser
router.post("/login", userLogin); //register user
router.post("/blogs", authentication,createblog) //create Blog
router.get("/blogs",authentication,getblog) //get Blog
router.put("/blogs/:blogId",authentication,updateBlogData)  //update the blog
router.delete("/blogs/:blogId",authentication,deleteByParams)  //update the blog
module.exports = router;