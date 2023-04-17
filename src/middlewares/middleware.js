const blogModel = require("../models/blogModel")
const jwt = require("jsonwebtoken")
const { isValidObjectId } = require("mongoose")

const authentication = async function (req, res, next) {
  try {
    let token = req.headers['x-api-key']
    if (!token) { return res.send("Token Not Found") }
   
    next()
  }
  catch (err) {
    res.status(401).send("UnAuthenticated, Please Login First")

  }
}
const authorization = async function (req, res, next) {
  try {
    let token = req.headers['x-api-key']
    let blogId = req.params.blogId
    if (!isValidObjectId(blogId))
      return res.status(400).send("Please Enter Valid Object Id")
    let blogdata = await blogModel.findById(blogId)
    if (!blogdata)
      return res.status(404).send("Blog Data not Found")
    let decodedToken = jwt.verify(token, 'myProjectSecretKey')
    if (decodedToken.authorId != blogdata.authorId) {
      return res.status(403).send("Unauthorised")
    }
    next()

  }
  catch (err) {
    console.log(err)
  }
}
module.exports.authentication = authentication
module.exports.authorization = authorization