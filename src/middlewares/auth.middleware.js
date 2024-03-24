const User = require("../models/user.model.js");
const fs = require('fs');

const verifyUserSession = async (req, res, next) => {
    try {
            if (!req.session || !req.session.user) {
            return res.redirect("/user/login")
        }
        const userId = req.session.user;
        const user = await User.findById(userId);
        if (!user) {
            return res.redirect('/home');
        }
        req.user = user;
        next();
    } catch (error) {
        console.error('Error verifying session:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const verifyAdminSession = async (req, res, next) => {
    try {
        if (!req.session || !req.session.admin) {
            return res.redirect('/admin/login')
        }
        const adminId = req.session.admin;
        const admin = await User.findById(adminId);
        if (!admin) {
            return res.redirect('/admin/login');
        }
        req.admin = admin;
        next();
    } catch (error) {
        console.error('Error verifying session:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const clearCache = (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
};

const addLogoutButton = (filePath) => {
    return async (req, res, next) => {
        try {
            const htmlContent = fs.readFileSync(filePath, 'utf-8');
            const originalContent = '<a href="/user/login" id="loginBtn"class="_signup">LOGIN</a><a href="/user/register" id="registerBtn" class="register-btn">REGISTRATION</a>';
            let logoutButton = originalContent;
            if (req.session.user) {
                const userId = req.session.user;
                const user = await User.findById(userId);

                if (user) {
                   const userName = user.fullName;
                    logoutButton = `<div class="user-dropdown" onclick="toggleDropdown()">
                    <span class="username">
                        <i class="fa-solid fa-user fa-sm" style="color: #ffffff;"></i>
                        ${userName}  
                        <i id="dropdownIcon" class="fa-solid fa-chevron-down fa-sm" style="color: #fafafa;"></i>
                    </span>
                    <div class="dropdown-content" id="dropdownContent">
                    <a href="/room/my-listings/${userId}">My Listings  <i class="fa-solid fa-door-open fa-sm" style="color: #066a6a;"></i></a>
                        <a href="/user/reset-loggedin-password/${userId}">Reset Password  <i class="fa-solid fa-key fa-sm" style="color: #066a6a;"></i></a>
                        <a href="/user/logout">Logout    <i class="fa-solid fa-arrow-right-from-bracket fa-sm" style="color: #066a6a;"></i></a>
                    </div>
                </div>
                
                `;
                }
            }
            const modifiedHtmlContent = htmlContent.replace(originalContent, logoutButton);
            res.locals.modifiedHtmlContent = modifiedHtmlContent;
            next();
        } catch (error) {
            console.error('Error rendering HTML file:', error);
            res.status(500).send('Internal Server Error');
        }
    };
};
const addRoomtButton =async (req, res, next) => {
        try {
            const originalContent ="<!--addroom-->";
            const addRoombtn = '<a href="/room/add-room"><li>ADD ROOM</li></a>';
            const user=req.session.user;
            const addRoomButton = user ? addRoombtn : originalContent;
            const modifiedHtmlContent = res.locals.modifiedHtmlContent.replace(originalContent, addRoomButton);
            res.locals.modifiedHtmlContent = modifiedHtmlContent;
            next()
        } catch (error) {
            console.error('Error rendering HTML file:', error);
            res.status(500).send('Internal Server Error');
        }
};

const redirectLoggedInUser=async(req, res, next)=>{
    try{
         if(req.session.user){
             return res.redirect('/home');
            
         }
        next();
    }
    catch(error){
        return res.json({error:'Internal server error'});
    }
};

module.exports = { verifyUserSession, verifyAdminSession, clearCache, addLogoutButton, redirectLoggedInUser, addRoomtButton
};

