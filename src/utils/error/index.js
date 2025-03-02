

export const syncHandler = (fn) =>{
    return (req, res,next) =>{
        fn(req, res, next).catch((err)=>{
           return res.status(500).json({msg:"Internal server error",message:err.message, stack:err.stack , err})
           return next(err)
        })
          
    }
}


export const globalErrorHandler = (error,req,res,next) => {
    if(process.env.MODE == 'DEV'){
        return res.status( error["cause"] || 500).json({msg:error.message, stack:error.stack,error});
    }
    return res.status(error["cause"] || 500).json({msg:error.message})
}