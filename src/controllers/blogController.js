const blogModel = require("../models/blogModel")
let moment = require('moment')
const jwt = require("jsonwebtoken")
const { isValidObjectId } = require("mongoose")

//=========================CREATE the blogs
const createblog = async function (req, res) {
  try {
    let data = req.body
    const { title, body } = req.body
    if (!title) return res.status(400).send({ status: false, message: "title is required" })
    if (!body) return res.status(400).send({ status: false, message: "body is required" })
    const token = req.headers['x-api-key']
    const decodedToken = jwt.verify(token, "secretKey");
    const userId = decodedToken.userId
    data['userId'] = userId
    let created = await blogModel.create(data)
    return res.status(201).send({ status: true, data: created })
  }
  catch (err) {
    res.status(500).send(err.message)
  }
}

//============================ GET the blogs
const getblog = async function (req, res) {
  try {
    const token = req.headers['x-api-key']
    const decodedToken = jwt.verify(token, 'secretKey')
    const userId = decodedToken.userId
    const blogData = await blogModel.find({ isDeleted: false, userId: userId, })
    if (!blogData)
      return res.status(404).send({
        status: false,
        message: "Blog doesnt exits in database"
      })
    return res.status(200).send({ status: true, data: blogData })
  }
  catch (err) {
    return res.status(500).send(err.message)
  }
}

//updating blog data 
const updateBlogData = async function (req, res) {
  try {
    const { title, body } = req.body
    if (Object.keys(req.body).length != 0) // checking if there is data in request's body or not
    {
      let blogId = req.params.blogId //storing blog id into variable
      if (!isValidObjectId(blogId)) return res.status(400).send({ status: false, message: "Blog id is not Valid" })
      let blogIDExist = await blogModel.findById(blogId) //validation - if user id valid or not
      //checking if blog is deleted or not
      if (blogIDExist.isDeleted == true) return res.status(404).send({ status: false, message: "This Blog is already Deleted" })
      let updatedBlogData = await blogModel.findByIdAndUpdate
        (
          blogId,
          {
            $set: {
              title: title,
              body: body,
            }
          },
          { new: true }
        )
      return res.status(200).send({ status: true, data: updatedBlogData })
    }
    else {
      return res.status(400).send({ status: false, message: "There is no Data in request's Body" })
    }
  }
  catch (err) {
    return res.status(500).send({ status: false, message: err.message })
  }
}
// delete blog

const deleteByParams = async function (req, res) {
  try {
    let userId = req.params.blogId;
    console.log(userId)
    if (!isValidObjectId(userId))
      return res.status(400).send({ status: false, message: "Please Enter Correct valid objectId" })
    let checkBlog = await blogModel.findById(userId)
    if (!userId)
      return res.status(400).send({ status: false, message: "blog not found" })
    if (checkBlog.isDeleted == true)
      return res.status(404).send({ status: false, message: "blog is already deleted...!" })
    let deleteBlog = await blogModel.findOneAndUpdate(
      { _id: userId },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    );
    return res.status(200).send({ status: true, data: deleteBlog })
  }
  catch (err) {
    return res.status(500).send({ status: false, message: err.message })
  }

}

module.exports = { getblog, createblog, updateBlogData, deleteByParams };

