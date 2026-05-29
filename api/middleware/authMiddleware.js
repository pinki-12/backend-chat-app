import jwt from "jsonwebtoken"
export const protect = async (req, res, next)=>{
    try{
    const token = req.cookies.token
    if(!token){
        return res.status(401).json({
            message:"unauthorized"
        })
    }
    const decoded = await jwt.verify(token,process.env.JWT_SECRET)
    if(!decoded){
        return res.status(401).json({
            message:"invalid credentials"
        })
    }
    req.user = decoded
    next()
    }
    catch(err){
        return res.status(500).json({
            message:err.message,
        })
    }
}