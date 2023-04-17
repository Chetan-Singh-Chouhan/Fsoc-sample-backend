const jwt = require("jsonwebtoken")

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

module.exports= {authentication}
