const blogModel = require("../models/blogModel")
let moment = require('moment')
const { isValidObjectId } = require("mongoose")



//=========================CREATE the blogs
const createblog = async function(req, res){
  try{
    let data = req.body
    const{title,userId,tags,category,subcategory} = req.body
    if(!title) return res.status(400).send({status: false, msg:"title is required"})
    if(!body) return res.status(400).send({status: false, msg:"body is required"})
    if(!userId) return res.status(400).send({status: false, msg:"userId is required"})

   
  
    if(!isValidObjectId(userId)) res.status(400).send({status:false,msg:"Author id is not Valid"})
    const isAuthorIdValid = await userModel.findById(userId).count()
    if(isAuthorIdValid==0){
      res.status(404).send({status:false,msg:"Author id doesnt Exist"})
    }
    let created = await blogModel.create(data)
    res.send({status: true, data: created})
  }
  catch(err){
    res.status(500).send(err.message)
  }
}

//============================ GET the blogs

const getblog = async function(req,res){
    const {authorId,category,tags,subcategory} = req.query
    if(!authorId && !category && !tags && !subcategory)
    {
      let blogData = await blogModel.find({isDeleted : false , isPublished :true,})
      if(!blogData) 
        return res.status(404).send({
          status: false,
          msg: "Blog doesnt exits in database"
        })
      return res.status(200).send({ status: true,data:blogData})
    }
    const blogData =await blogModel.find({$or:[{authorId:authorId},{category:category}]})
    if(!blogData) 
        return res.status(404).send({
          status: false,
          msg: "Blog doesnt exits in database"
        })
    return res.status(200).send({ status: true,data:blogData})
    
  } 

//updating blog data 
const updateBlogData = async function(req,res){
  try
  {    
       const {title,body,tags,subcategory} = req.body
       if(Object.keys(req.body).length != 0) // checking if there is data in request's body or not
       {
           blogId = req.params.blogId //storing blog id into variable
           let blogIDExist = await blogModel.findById(blogId) //validation - if user id valid or not
           //checking if user is deleted or not
           if(blogIDExist.isDeleted==true) res.status(404).send({status:false,msg: "This Blog ID Doesn't Exist"})
           if("tags" in req.body || "subcategory" in req.body){
             await blogModel.findByIdAndUpdate(
               blogId,
               {$push:{tags:tags,subcategory:subcategory}},
               {new:true}
             )
           }
           if(blogIDExist.isPublished==false)
           {
               let updatedBlogData = await blogModel.findByIdAndUpdate
               (
                 blogId,
                 {$set:{
                   title:title,
                   body:body,
                   isPublished : true,
                   publishedAt : moment().format() //inserting date with moment library
                   }},
                 {new:true}
               )
               res.status(200).send({status:true,data:updatedBlogData})
           }
           else 
           {
             let updatedBlogData = await blogModel.findByIdAndUpdate
               (
                 blogId,
                 {$set:{
                   title:title,
                   body:body
                   }},
                 {new:true}
               )
               res.status(200).send({status:true,data:updatedBlogData}) 
           }
       }
       else 
       {
              res.status(400).send({status:false,msg:"There is no Data in request's Body"})
       }
    }
 catch(err)
 {
   res.status(500).send({status:false,msg:err.message})
 }
}
// delete blog

const deleteByParams = async function (req, res) {
  try {
        let userId = req.params.blogId;
        if(!isValidObjectId(userId))
          return res.status(400).send({status:false,msg:"Please Enter Correct valid objectId"})
        let checkBlog = await blogModel.findById(userId)
        if(!userId)
          return res.status(400).send({status:false,msg:"userId not found"})
        if (checkBlog.isDeleted == true)
          return res.status(404).send({status:false,msg: "blog is already deleted...!"})
        let deleteBlog = await blogModel.findOneAndUpdate(
            { _id: userId },
            { $set: { isDeleted: true, deletedAt: new Date() } },
            { new: true }
        );
          return res.status(200).send({ status: true, data: deleteBlog })


      }
      catch(err)
      {
          return res.status(500).send({ status: false, msg: err.message })
      }

}


const deleteByQuery = async function (req, res) {
  try {

      let data = req.query
      //console.log(data)
      let checkBlog = await blogModel.findOne(data)

      if(!checkBlog)
        return res.status(404).send({status:false,msg:"Data is nomatching"})

      if (checkBlog.isDeleted == true)
          return res.status(400).send({ status: false, msg: "blog is already deleted" })

          let deleteBlog = await blogModel.findOneAndUpdate(
               data,
              { $set: { isDeleted: true, deletedAt: new Date() } },
              { new: true,upsert:true}
          );

         return res.status(200).send({ status: true, data: deleteBlog })


  } catch (err) {
     return res.status(500).send({ status: false, msg: err.message })
  }

}


module.exports.getblog=getblog
module.exports.createblog = createblog 
module.exports.deleteByParams=deleteByParams
module.exports.updateBlogData = updateBlogData
module.exports.deleteByQuery=deleteByQuery
