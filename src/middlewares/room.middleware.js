const Room = require("../models/room.model.js");
const User = require("../models/user.model.js");

const {generateRoomDetailsHtml, allRoomDetails, editingRoomDetails}=require("../controllers/room.controler.js")

const displayRooms =  async (req, res, next) => {
        try {
            const isloggedIn = req.session.user ? true : false;
            const userId="";
            const roomAvailable=true;
            const rooms = await Room.find({ approved: true });
            const addRoomButton = req.session.user ? '<center><a href="/room/add-room" class="add-room">Add Room</button></a></center>' : '<center><a href="/user/login" class="add-room">Login to Add Room</button></a></center>';
            const modifiedHtmlContent = res.locals.modifiedHtmlContent.replace('<!-- ROOM_DETAILS_PLACEHOLDER -->', addRoomButton + generateRoomDetailsHtml(rooms, isloggedIn,userId,roomAvailable));
            res.locals.modifiedHtmlContent = modifiedHtmlContent
            next()
        } catch (error) {
            console.error('Error rendering available rooms page:', error);
            res.send('Internal Server Error');
        }
};
const displayMyRooms = async (req, res, next) => {
    try {
        const userId = req.session.user;
        const allRooms = await Room.find({ "roomLister.listerId": userId });
        const roomAvailable = allRooms.length > 0;
        const isloggedIn = req.session.user ? true : false;
        const modifiedHtmlContent = res.locals.modifiedHtmlContent.replace('<!-- ROOM_DETAILS_PLACEHOLDER -->', generateRoomDetailsHtml(allRooms, isloggedIn, userId, roomAvailable));
        res.locals.modifiedHtmlContent = modifiedHtmlContent;
        next();
    } catch (error) {
        console.error('Error rendering available rooms page:', error);
        res.send('Internal Server Error');
    }
};


const displayRoomsDetails =  async (req, res, next) => {
    try {
        const roomId = req.query.roomid;
        const room = await Room.findById(roomId);
        const currentUserId=req.session.user;
        const userId= room.roomLister[0].listerId;
        const roomListerIsUser=(userId==currentUserId)?true:false;
        const user = await User.findById(userId);
        const modifiedHtmlContent = res.locals.modifiedHtmlContent.replace('<!-- ROOM_DETAILS_PLACEHOLDER -->', allRoomDetails(room,user,roomListerIsUser));
        res.locals.modifiedHtmlContent = modifiedHtmlContent
        next()
    } catch (error) {
        console.error('Error rendering room details page:', error);
        res.send('Internal Server Error');
    }
};
const displayMyRoomsDetailsForm =  async (req, res, next) => {
    try {
        const roomId = req.query.roomid;
        const userId=req.session.user;
        const room = await Room.findById(roomId);
        const modifiedHtmlContent = res.locals.modifiedHtmlContent.replace('<!-- ROOM_DETAILS_PLACEHOLDER -->', editingRoomDetails(roomId,room, userId));
        res.locals.modifiedHtmlContent = modifiedHtmlContent
        next()
    } catch (error) {
        console.error('Error rendering room details page:', error);
        res.send('Internal Server Error');
    }
};
const getLocation =  async (req, res, next) => {
    try {
        const {lng,lat} = req.query;
        const modifiedHtmlContent = res.locals.modifiedHtmlContent.replace('<!--lng,lat-->',
        `<input type="hidden" name="lng" value="${lng}">
        <input type="hidden" name="lat" value="${lat}">` );
        res.locals.modifiedHtmlContent = modifiedHtmlContent
        next()
    } catch (error) {
        console.error('Error rendering room details page:', error);
        res.send('Internal Server Error');
    }
};

module.exports={displayRooms, displayMyRooms , displayRoomsDetails, displayMyRoomsDetailsForm, getLocation}