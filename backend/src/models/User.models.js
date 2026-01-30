import mongoose,{Schema} from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new Schema({
    username:{
        type:String,
        required : [true,"Username is required "],
        unique : true,
        index: true

    },
    email:{
        type:String,
        required : [true,"Email is required "],
        unique : true,

    },
    fullname :{
        type:String,
        required : [true,"fullname is required "],
    },
    avatar:{
        type:String,
        required : [true,"Avatar is required "],
        
    },
    password:{
        type : String,
        required : [true,"Password required "],
        
    },
    watchHistory :{
        type : Schema.Types.ObjectId,
        ref:"Video"
    }

},{timestamps : true }
)

userSchema.pre("save",function(next){
    if(!this.isModified("password")) return next();
     this.password= bcrypt.hash(this.password,10)
     next();
})
userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign (
        {
         _id : this._id,
         email: this.email,
         username:this.username,
         fullname : this.fullname
    },
   process.env.ACCESS_TOKEN_SECRET, {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    }
)
}


userSchema.methods.generateRefereshToken=function(){
    return jwt.sign (
        {
         _id : this._id,
    },
   process.env.REFRESH_TOKEN_SECRET, {
        expiresIn : process.env.REFRESH_TOKEN_EXPIRY
    }
)
}

export const User = mongoose.model("User",userSchema)