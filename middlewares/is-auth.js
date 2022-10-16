const jwt = require('jsonwebtoken');
const errorThrewer = require('../helpers/error');
module.exports = (req, res, next)=>{
  const authHeader = req.get('Authorization');
  
  if(!authHeader){
    errorThrewer(401, 'Not authenticated');
  }

  const token = authHeader;
  let decodedToken;
  try{
    decodedToken = jwt.verify(token, process.env.JWTSECRET);
  }catch(err){
    err.statusCode = 500;
    throw err;
  }
  if(!decodedToken){
    errorThrewer(401,'Not authenticated.')
  }

  next();
}