import {asyncHandler } from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/User.models.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { generateKey } from 'crypto'
import { ref } from 'process'

// const registerUser = asyncHandler(async(req,res)=>{
//     return res.status(200).json({
//         message:"ok"
//     })
// })
const generateAccessAndRefreshToken = async(userId) =>{
    try {
        
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        
        user.refreshToken=refreshToken
        await user.save({ validateBeforeSave : false })

        return {accessToken , refreshToken }

    } catch (error) {
        throw new ApiError(500, "Sonmething went wrong while gerating access and refresh token ")
    }

}


const registerUser=asyncHandler(async(req,res)=>{
    //get user deatils from fronted
    //validations not empty
    //check if user already exist : username,email
    //check for images & avatars
    //upload them to cloudinary
    // create user object -create entry in db
    // remove password, refresh_token field from reponse
    // chheck for user creatio 
    // return response
    const{username , fullname , password ,email } = req.body
    console.log("email:" ,email);

    // if(fullname === ""){
    //     throw new ApiError(400, "fullname Required ")
    // } 
    if(
        [fullname , email , username , password ].some((field)=>
            field?.trim() === "")
    ){
        throw new ApiError(400,"All fields are requied ")
    }

    const existedUser = await User.findOne({
        $or:[{ username }, { email }]
    })
    if(existedUser){
        throw new ApiError(401,"User with email already Existed ")
    }
    // console.log("avatar",req.files.avatar)
    
    console.log("BODY:", req.body);
console.log("FILES:", req.files);   
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "avatar file is required ")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "avater file is required ")
    }

   const user = await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()

    })

    const createdUser =await  User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(400, " Eroor while registering user ")
    }

    return res.status(201).json(
        new ApiResponse (200, createdUser ,"user registerd successfully")
    );
});

const loginUser = asyncHandler(async(req,res)=>{
    //req.body -> data
    //data validation
    // check if data exist in db with correct match
    //access and refresh token
    //send cookie
    const{userame , email, password } = req.body
    
    if(!userame || !password ){
        throw new ApiError(400, "username or email required ")
    }
    const user = await User.findOne({
        $and:[{email},{username}]
    })
    if(!user){
        throw new ApiError(404, "user not Exist ")
    }
    const isPasswordVaild = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(404, "Invalid user credentials  ")
    }

    const { accessToken , refreshToken } = generateAccessAndRefreshToken(user._id)

    const loggedUser = await User.findById(user._id).select("-password -refreshToken")

    const option={
        httpOnly: true ,
        secure : true
    }

    return res.status(200).cookie("accessToken ",accessToken , option)
    .cookie("Refresh Token ",refreshToken, option )
    .json(
        new ApiResponse(200),
        {
            user : loggedUser , accessToken , refreshToken 
        },
        "User successfullly LoggedIn "
    )
})

export {registerUser , loginUser }