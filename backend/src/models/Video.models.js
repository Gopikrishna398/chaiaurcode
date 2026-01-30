import mongoose,{Schema} from 'mongoose'

const videoSchema = new Schema({
    videoFile:{
        type :String, //cloudinary URL
        required:true
    },
    thumbNail:{
        type :String, //cloudinary URL
        required:true
    },
    title:{
        type:String,
        required : [true,"title is required "],
    },
    description:{
        type:String,
        required : [true," description is required "],
    },
    duration:{
        type :Number,
        required :true,
    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }

},{timeseries : true }
)

export const Video = mongoose.model("Video",videoSchema)