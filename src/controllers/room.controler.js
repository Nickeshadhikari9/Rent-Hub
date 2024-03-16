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
        const lng = req.body.lng
        const lat = req.body.lat
        console.log(lng, lat)
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
const receiveLocation = async (req, res) => {
    try {
        const { lng, lat } = req.body
        if (lng && lat) {
            return res.redirect(`/room/add-room?lng=${lng}&lat=${lat}&message=Location Added`)
        }
    }
    catch (error) {
        console.log(error)
    }
}

const generateRoomDetailsHtml = function generateRoomDetailsHtml(rooms, isloggedIn) {
    let roomDetailsHtml = '';
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

        roomDetailsHtml += `</div>`;
    });
    return roomDetailsHtml;
}
const allRoomDetails = function allRoomDetails(room, user) {
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
  <div class="contact-lister">
  <a href="tel:${user.contactNum}"><button class="call-lister-btn">
  Call Lister
</button></a>
  <form class="email-form" action="/room/available-rooms/details" method="post">
  <input type="hidden" name="roomid" value="${room._id}">
      <textarea name="enquiry" placeholder="Write what you want to know about the room from the room lister"></textarea>
      <button type="submit">Submit</button>
  </form>
</div>

    <div class="map-container"></div>
</div>
</div>


        `

    return roomDetailsHtml;
}
const sendEnquiryEmail = async (listerEmail, listerName, userName, userEmail, userContact, enquiry, roomid) => {
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
            html: `<span style="font-size:20px;">Hello, ${listerName}</span><br><span style="font-size:16px;">Mr. ${userName} is intrested in the Room Listed by you.</span>
            <span style="font-size:16px;">Here's What is he Enquiring about:<br>"${enquiry}"<br>Here's the user E-mail: ${userEmail}<br>Contact Number:${userContact}</span>`
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
            }
            else {
                console.log("mail sent")
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
        const user_id=req.session.user
        const {roomid,enquiry}=req.body
        const user = await User.findOne({_id:user_id})
        const room = await Room.findOne({_id:roomid})
        if (user) {
            const userEmail = user.email
            const userName = user.fullName
            const userContact = user.contactNum
            const listerEmail = room.roomLister[0].listerEmail
            const listerName = room.roomLister[0].listerName
            sendEnquiryEmail(listerEmail, listerName, userName, userEmail, userContact, enquiry, roomid)
            return res.redirect(`/room/available-rooms/details?roomid=${roomid}&message=E-mail has been sent with your enquiry`);
        }
        else{
            console.log(error,"here")
            return res.json({error:"error aagaya"})
        }
    }
    catch(error){
        console.log(error,"now")
    }
}


module.exports = {
    addRoom, generateRoomDetailsHtml, allRoomDetails, receiveLocation, sendEmail, sendEmail
}
