const fs = require('fs')
const Room = require("../models/room.model.js")
const User = require("../models/user.model.js")
const {generateRoomDetailsHtml, generateUserDetailsHtml, editingRoomDetailsAdmin}  = require("../controllers/admin.controller");

const displayUsersDetails = (filePath) => {
    return async (req, res, next) => {
        try {
            const htmlContent = fs.readFileSync(filePath, 'utf-8');
            const users = await User.find();
            const currentAdminId=req.session.admin;
            const modifiedHtmlContent = htmlContent.replace(' <!-- Admin Dashboard User -->', generateUserDetailsHtml(users,currentAdminId));
            res.locals.modifiedHtmlContent = modifiedHtmlContent
            next();
        } catch (error) {
            console.error('Error rendering HTML file:', error);
            res.status(500).send('Internal Server Error');
        }
    }
};

const displayRoomsDetails = (filePath) => {
    return async (req, res, next) => {
        try {
            const htmlContent = fs.readFileSync(filePath, 'utf-8');
            const rooms = await Room.find();
            const modifiedHtmlContent = htmlContent.replace('<!-- Admin Dashboard -->', generateRoomDetailsHtml(rooms));
            res.locals.modifiedHtmlContent = modifiedHtmlContent
            next();
        } catch (error) {
            console.error('Error rendering HTML file:', error);
            res.status(500).send('Internal Server Error');
        }
    }
};

const redirectLoggedInAdmin=async(req, res, next)=>{
    try{
        if(req.session.admin){
            return res.redirect('/admin/dashboard');    
        }
        next();
    }
    catch(error){
        return res.json({error:'Internal server error'});
    }
};
const displayMyRoomDetailsForm =  async (req, res, next) => {
    try {
        const roomId = req.query.roomid;
        const room = await Room.findById(roomId);
        const modifiedHtmlContent = res.locals.modifiedHtmlContent.replace('<!-- ROOM_DETAILS_PLACEHOLDER -->', editingRoomDetailsAdmin(room));
        res.locals.modifiedHtmlContent = modifiedHtmlContent
        next()
    } catch (error) {
        console.error('Error rendering room details page:', error);
        res.send('Internal Server Error');
    }
};
module.exports={displayUsersDetails,displayRoomsDetails,redirectLoggedInAdmin,displayMyRoomDetailsForm};