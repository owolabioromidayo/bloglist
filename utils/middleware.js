const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    res.locals.token =  authorization.substring(7)
  }else {
    res.locals.token = null
  }
  next()
}


const errorHandler = (err,req,res,next) => {
    if (err.name === 'ValidationError'){
        return res.status(400).json({err: [err.name, err.message]})
    } else if (err.name === 'JsonWebTokenError'){
        return res.status(401).json({err: "invalid token"})
    }else{
       return res.status(400).json({err : [err.name, err.message] })
    }
    next(err)
}

module.exports = {errorHandler, tokenExtractor}