const { Router } = require("express");
const router = Router();
const express = require('express')
const path = require("path");

const { addRoom, receiveLocation, sendEmail,editRoomDetails, deleteRoom } = require("../controllers/room.controler.js");
const { verifyUserSession, addLogoutButton, addRoomtButton } = require("../middlewares/auth.middleware");
const { displayRooms, displayMyRooms, displayRoomsDetails,displayMyRoomsDetailsForm, getLocation } = require("../middlewares/room.middleware");
const { successMessagePopup, successLogoutMessagePopup } = require("../middlewares/user.middleware");
const upload = require("../middlewares/multer.middleware.js");
const app = require('../app.js');

const publicPath = path.join(__dirname, '../../public');
app.use('/room/css', express.static(path.join(__dirname, '../../public/css'), { type: 'text/css' }));
app.use('/room/js', express.static(path.join(__dirname, '../../public/js'), { type: 'text/javascript' }));
app.use('/room/available-rooms/css', express.static(path.join(__dirname, '../../public/css'), { type: 'text/css' }));
app.use('/room/available-rooms/js', express.static(path.join(__dirname, '../../public/js'), { type: 'text/javascript' }));
app.use('/room/my-listings/css', express.static(path.join(__dirname, '../../public/css'), { type: 'text/css' }));
app.use('/room/my-listings/js', express.static(path.join(__dirname, '../../public/js'), { type: 'text/javascript' }));
app.use('/room/edit-room/css', express.static(path.join(__dirname, '../../public/css'), { type: 'text/css' }));
app.use('/room/edit-room/js', express.static(path.join(__dirname, '../../public/js'), { type: 'text/javascript' }));
app.use('/room/add-room/js', express.static(path.join(__dirname, '../../public/js'), { type: 'text/javascript' }));

router.get("/add-room", verifyUserSession, addLogoutButton(`${publicPath}/addRoom.html`),getLocation,successLogoutMessagePopup,addRoomtButton, async (req, res) => {
    return res.send(res.locals.modifiedHtmlContent);
});
router.get("/add-room/location", verifyUserSession, async (req, res) => {
    return res.sendFile(`${publicPath}/defaultmarker.html`)
});

router.get('/available-rooms', addLogoutButton(`${publicPath}/availableRoom.html`), displayRooms,addRoomtButton,successMessagePopup,successLogoutMessagePopup, async (req, res) => {
    return res.send(res.locals.modifiedHtmlContent);
});
router.get('/my-listings/:user_id',verifyUserSession, addLogoutButton(`${publicPath}/myListing.html`), displayMyRooms,addRoomtButton,successMessagePopup,successLogoutMessagePopup, async (req, res) => {
    return res.send(res.locals.modifiedHtmlContent);
});
router.get('/edit-room',verifyUserSession, addLogoutButton(`${publicPath}/editRoom.html`),displayMyRoomsDetailsForm,addRoomtButton, async (req, res) => {
    return res.send(res.locals.modifiedHtmlContent);
});

router.get('/available-rooms/details',verifyUserSession, addLogoutButton(`${publicPath}/roomDetails.html`), displayRoomsDetails,addRoomtButton,successLogoutMessagePopup, async (req, res) => {
    return res.send(res.locals.modifiedHtmlContent);
});

router.route('/add-room').post(
    upload.single("roomImage"),
    verifyUserSession,
    addRoom
);
router.route('/edit-room').post(
    upload.single("roomImage"),
    verifyUserSession,
    editRoomDetails
);

router.route('/add-room/location').post(receiveLocation)
router.route('/delete-room').post(verifyUserSession,deleteRoom)
router.route('/available-rooms/details').post(sendEmail)


module.exports = router;
