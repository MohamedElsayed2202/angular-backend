const error = (error, req, res, next)=>{
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).send({message: message});
}   

module.exports = error;