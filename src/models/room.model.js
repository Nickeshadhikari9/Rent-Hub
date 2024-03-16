const mongoose = require('mongoose');
const { Schema } = mongoose;
const roomSchema = new Schema(
    {
        title: {
            type: String,
        },
        roomAddress: {
            type: String,
            required: true,
        },
        roomContactNum: {
            type: String,
            required: true
        },
        price: {
            type: String,
            required: true
        },
        description: {
            type: String,
        },
        roomLister: [{
            listerId: { type: Schema.Types.ObjectId, ref: "User" },
            listerName: { type: String },
            listerEmail: { type: String },
            listerNumber:{ type:String}
        }],
        location:[{
            longitude:{type:Number},
            latitude:{type:Number}
        }],
        roomImage:{
            type:String
        },
        approved:{
            type:Boolean,
            default:false
        }
    },
    { timestamps: true }
);
const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
