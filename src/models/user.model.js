const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        contactNum: {
            type: String,
            required: true,
            unique: true
        },
        address: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['user', 'admin'], 
            default: 'user' 
        },
        gender: {
            type: String,
            enum: ['male', 'female','other']
        },
        salt: {
            type: String
        }
    },
    { timestamps: true }
)

userSchema.pre("save", async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        this.salt = salt;
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.statics.matchPasswordAndGenerateToken = async function (identifier, password) {
    let user
    if(identifier.includes("@")){
         user = await this.findOne({ email:identifier });
    }
    else{
        user = await this.findOne({ contactNum:identifier });
    }
    
    if (!user) {
        throw new Error("User not Registered")
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
        return user;
    } else {
        throw new Error("Password doesn't match")
    }
};

const User = mongoose.model("User", userSchema);
module.exports = User;
