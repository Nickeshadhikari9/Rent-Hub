const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer")
const loginUser = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        const passwordMatching = await User.matchPasswordAndGenerateToken(identifier, password);
        if (passwordMatching) {
            req.session.user = passwordMatching._id;
            return res.redirect('/room/available-rooms?success=Logged In Successfully');
        }
    } catch (error) {
        return res.redirect('/user/login?error=' + encodeURIComponent(error.message));
    }
};

const registerUser = async (req, res) => {
    try {
        const { fullName, email, contactNum, address, gender, password } = req.body;
        const existedUserWithEmail = await User.findOne({ email });
        const existedUserWithNum = await User.findOne({ contactNum });
        if (existedUserWithEmail) {
            return res.redirect('/user/register?error=Email already Registered');
        }
        if (existedUserWithNum) {
            return res.redirect('/user/register?error=Number already Registered');
        }
        const newUser = await User.create({
            fullName,
            email,
            contactNum,
            address,
            gender,
            password
        });
        return res.redirect('/user/login?message=Registered Successfully');
    }
    catch (error) {
        return res.json({ error: "Internal server error." });
    }
};

const logoutUser = async (req, res) => {
    try {
        req.session.destroy();
        return res
        .clearCookie("sessionID")
        .redirect('/home?message=Logged Out Successfully');

    } catch (error) {
        console.error('Error logging out user:', error);
        return res.json({ error: 'Something went wrong' });
    }
};

const sendResetEmail= async(email,name,user_id)=>{
    try{
        const transporter=nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:process.env.APP_PORT,
            secure:false,
            requireTLS:true,
            auth:{
                user:process.env.APP_EMAIL,
                pass:process.env.APP_PASSWORD
            }
        });
        const mailOptions={
            from:process.env.APP_EMAIL,
            to:email,
            subject:"Reset Password Email",
            html:`<span style="font-size:20px">Hello, ${name}<br>Please click below to Reset Your Password &#9660;</span><br>
            <a href="${process.env.WEBSITE_URL}/${user_id}" style="font-size:20px;">Reset Password</a>`
        }
        transporter.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error)
            }
            else{
                return res.redirect('/user/forget-password?message=E-mail with Reset Password link has been sent');
            }
        })
    }
    catch(error){
        console.log(error)
    }
}

const forget_password= async(req,res)=>{
    try{
        const {email}=req.body;
        const existedUser = await User.findOne({ email });
        if (existedUser) {
            sendResetEmail(existedUser.email,existedUser.fullName,existedUser._id)
            return res.redirect('/user/forget-password?message=E-mail with Reset Password link has been sent');
        }
        else{
            return res.redirect('/user/forget-password/:user_id?error=User Not Registered');
        }

    }
    catch(error){
        console.log(error)
    }
}
const resetPassword= async(req,res)=>{
    const user_id=req.body.user_id;
    if(user_id){
        const {password}=req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const updatePassword= await User.findByIdAndUpdate(user_id,{password:hashedPassword});
        return res.redirect("/user/login")
    }
    else{
        return res.json({error:"user not found!"})
    }
}

module.exports = {loginUser,registerUser,logoutUser, forget_password, resetPassword};
