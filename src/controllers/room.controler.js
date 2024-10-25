const express = require('express');
const app = require('../app.js');
const nodemailer = require("nodemailer")
const path = require('path');

const Room = require("../models/room.model.js");
const User = require('../models/user.model.js');

app.use(express.static(path.resolve("../../public")));

const addRoom = async (req, res) => {
    try {
        const { title, roomAddress, roomContactNum, price, description } = req.body;
        const lng = req.body.lng;
        const lat = req.body.lat;
        if (
            [title, roomAddress, roomContactNum, price].some((field) => field?.trim() === "")
        ) {
            return res.json({ error: "Field must not be empty." });
        }
        let roomImageFilePath = "";
        if (req.file) {
            roomImageFilePath = `${req.file.filename}`;
        } else {
            return res.json("No room image provided");
        }
        const roomCreated = await Room.create({
            title,
            roomAddress,
            roomContactNum,
            price,
            description: description || "",
            roomImage: roomImageFilePath,
            roomLister: [{
                listerId: req.user._id,
                listerName: req.user.fullName,
                listerEmail: req.user.email
            }],
            location: [{
                longitude: lng,
                latitude: lat
            }]
        });
        return res.redirect('/room/available-rooms?message=Room under Approval');
    }
    catch (error) {
        console.error("Error adding room:", error);
        return res.json({ error: "Internal server error." });
    }
};
const editRoomDetails = async (req, res) => {
    try {
        const roomid = req.body.roomId;
        const room = await Room.findById(roomid);
        const userId = req.body.userId;
        const { title, roomAddress, roomContactNum, price, description, previousImage } = req.body;
        if (
            [title, roomAddress, roomContactNum, price].some((field) => field?.trim() === "")
        ) {
            return res.json({ error: "Field must not be empty." });
        }
        let roomImageFilePath;
        if (req.file && req.file.filename) {
            roomImageFilePath = req.file.filename;
            
        }
         if ((room.title == title) && (room.roomAddress == roomAddress) && (room.roomContactNum == roomContactNum) && (room.price == price) && (room.description == description) && (roomImageFilePath == undefined)) {
            return res.redirect(`/room/my-listings/${userId}?message=No changes detected in Room Details`);
        } else {
            const roomCreated = await Room.findByIdAndUpdate(roomid, {
                title,
                roomAddress,
                roomContactNum,
                price,
                description: description || "",
                roomImage: roomImageFilePath,
                approved: false
            }, { new: true });
            return res.redirect(`/room/my-listings/${userId}?message=Updated Room under Approval`);
        }
    }
    catch (error) {
        console.error("Error adding room:", error);
        return res.json({ error: "Internal server error." });
    }
};
const receiveLocation = async (req, res) => {
    try {
        const { lng, lat } = req.body;
        if (lng && lat) {
            return res.redirect(`/room/add-room?lng=${lng}&lat=${lat}&message=Location Added`)
        }
    }
    catch (error) {
        console.log(error)
    }
}

const generateRoomDetailsHtml = function generateRoomDetailsHtml(rooms, isloggedIn, userId, roomAvailable) {
    let roomDetailsHtml = '';
    if (roomAvailable) {
        rooms.forEach(room => {
            roomDetailsHtml += `
        <div class="room">
                <img class="room-image" src="/temp/${room.roomImage}" alt="Room Image">
                <h3 class="room-title">${room.title}</h3>
            <div class="room-info">
                <span class="heading">Price:</span>
                <span class="room-price">Rs. ${room.price}</span>
            </div>
            <div class="room-info">
                <span class="heading">Address:</span>
                <span class="room-address">${room.roomAddress}</span>
            </div>
        `;
            if (isloggedIn) {
                roomDetailsHtml += `
                <center><form action="/room/available-rooms/details?roomid=${room._id}" method="get">
                    <input type="hidden" name="roomid" value="${room._id}">
                    <input class="view-details" type="submit" value="View Details">
                </form></center>
            `;
            }
            else { '' }
            if (userId) {
                if (room.approved == true) {
                    roomDetailsHtml += `
                <center><form action="/room/edit-room?roomid=${room._id}" method="get">
                <input type="hidden" name="roomid" value="${room._id}">
                    <input class="edit-details" type="submit" value="Edit Details">
                </form></center>
            `;
                }
                else {
                    roomDetailsHtml += `<br><center><span class="status">Approval Status: Pending</span></center>`;
                }
                roomDetailsHtml += ` <center><form action="/room/delete-room" method="post">
            <input type="hidden" name="roomid" value="${room._id}">
            <input type="hidden" name="userid" value="${userId}">
            <input class="delete" type="submit" value="Delete Room">
        </form></center>`
            }
            else { '' }

            roomDetailsHtml += `</div>`;
        })
    } else {
        roomDetailsHtml += `<center><span style="text-align:center;font-size:20px;">You haven't Listed any Room yet.</span></center>`
    }
    return roomDetailsHtml;
}
const allRoomDetails = function allRoomDetails(room, user, roomListerIsUser) {
    let roomDetailsHtml = '';
    roomDetailsHtml += `
<div class="room">
  <div class="room-content">
    <div class="room-image">
        <img class="room-image-details" src="/temp/${room.roomImage}" alt="Room Image">
    </div>
    <div class="room-details">
        <h3 class="room-title">${room.title}</h3>
        <div class="room-info">
            <span class="heading">Price:</span>
            <span class="room-price">Rs. ${room.price}</span>
        </div>
        <div class="room-info">
            <span class="heading">Address:</span>
            <span class="room-address">${room.roomAddress}</span>
        </div>
        <div class="room-info">
            <span class="heading">Phone:</span>
            <span class="room-contact">${room.roomContactNum}</span>
        </div>
        <div class="room-info">
            <span class="heading">Description:</span>
            <span class="room-description">${room.description}</span>
        </div>
        <div class="room-info">
            <span class="heading">Room Lister:</span>
            <span class="room-listerName">${room.roomLister[0].listerName}</span>
        </div>
    </div>
  </div>
  <input type="hidden" class="longitude" value="${room.location[0].longitude}">
  <input type="hidden" class="latitude" value="${room.location[0].latitude}">
  <div class="room-container">
 `
    if (roomListerIsUser == true) {
        roomDetailsHtml += ``
    } else {
        roomDetailsHtml += `
    <div class="contact-lister">
    <a href="tel:${user.contactNum}"><button class="call-lister-btn">
    Call Lister
  </button></a><form class="email-form" action="/room/available-rooms/details" method="post">
  <input type="hidden" name="roomid" value="${room._id}">
      <textarea name="enquiry" placeholder="Write what you want to know about the room from the room lister"></textarea>
      <button type="submit">Submit</button>
      </form>
      </div>`
    }
    roomDetailsHtml+=`<div class="map-container"></div>
</div>
</div>`
    return roomDetailsHtml;
}
const editingRoomDetails = function editingRoomDetails(roomId, room, userId) {
    let roomDetailsHtml = '';
    roomDetailsHtml += `
    <form id="edit-form" action="/room/edit-room" method="post" enctype="multipart/form-data">
    <label class="myListings">Edit Form</label><br>
        <label for="title">Title:</label><br>
        <input class="edit-room-title" type="text" id="title" name="title" value="${room.title}"><br>
        <label for="price">Address:</label><br>
        <input class="edit-room-address" type="text" id="roomAddress" name="roomAddress" value="${room.roomAddress}"><br>
        <label for="description">Contact Number:</label><br>
        <input class="edit-room-price" type="text" id="contact" name="roomContactNum" value="${room.roomContactNum}"><br>
        <label for="roomAddress">Price:</label><br>
        <input class="edit-room-price" type="text" id="price" name="price" value="${room.price}" min="0"><br>
        <label for="roomAddress">Description:</label><br>
        <textarea class="edit-room-description" id="description" name="description">${room.description}</textarea><br>
        <input type="hidden" name="previousImage" value="${room.roomImage}">
        <input type="hidden" name="userId" value="${userId}">
        <input type="hidden" name="roomId" value="${roomId}">
        <label for="roomImage">Image of Room:</label>
        <div class="custom-file-input">
            <input type="file" id="roomImage" name="roomImage" accept="image/*">
            <label class="custom-file-input-btn" for="roomImage">Choose File</label>
        </div>
        <input class="edit-room-btn" type="submit" value="Edit">
    </form>
`;
    return roomDetailsHtml;
}
const deleteRoom = async (req, res) => {
    try {
        const roomId = req.body.roomid
        const userId = req.body.userid
        const deleteRoom = await Room.findByIdAndDelete(roomId)
        return res.redirect(`/room/my-listings/${userId}?message=Room Deleted`);
    }
    catch (error) {
        console.error('Error approving room:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
const sendEnquiryEmail = async (listerEmail, listerName, userName, userEmail, userContact, enquiry, roomid,roomTitle) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: process.env.APP_PORT,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.APP_EMAIL,
                pass: process.env.APP_PASSWORD
            }
        });
        const mailOptions = {
            from: process.env.APP_EMAIL,
            to: listerEmail,
            subject: "Room Enquiry by User",
            html: `<p style="font-size: 18px; font-family: Arial, sans-serif; line-height: 1.5;">
            <strong>Hello, ${listerName},</strong>
            <br><br>
            We wanted to inform you that Mr. ${userName} has shown interest in the room listed by you. Entitled: <b>${roomTitle}</b>.
        </p>
        <p style="font-size: 16px; font-family: Arial, sans-serif; line-height: 1.5;">
            Here's what he is enquiring about:<br>
            <em>"${enquiry}"</em><br><br>
            User's Email: ${userEmail}<br>
            Contact Number: ${userContact}
        </p>
        `
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
            }
            else {
                return res.redirect(`/room/available-rooms/details?roomid=${roomid}&message=E-mail has been sent with your enquiry`);
            }
        })
    }
    catch (error) {
        console.log(error)
    }
}
const sendEmail = async (req, res) => {
    try {
        const user_id = req.session.user
        const { roomid, enquiry } = req.body
        const user = await User.findOne({ _id: user_id })
        const room = await Room.findOne({ _id: roomid })
        if (user) {
            const userEmail = user.email
            const userName = user.fullName
            const userContact = user.contactNum
            const listerEmail = room.roomLister[0].listerEmail
            const listerName = room.roomLister[0].listerName
            const roomTitle = room.title
            sendEnquiryEmail(listerEmail, listerName, userName, userEmail, userContact, enquiry, roomid, roomTitle)
            return res.redirect(`/room/available-rooms/details?roomid=${roomid}&message=E-mail has been sent with your enquiry`);
        }
        else {
            console.log(error, "here")
            return res.json({ error: "error aagaya" })
        }
    }
    catch (error) {
        console.log(error, "now")
    }
}


module.exports = {
    addRoom, generateRoomDetailsHtml, allRoomDetails, receiveLocation, sendEmail, sendEmail, editingRoomDetails, editRoomDetails, deleteRoom
}
