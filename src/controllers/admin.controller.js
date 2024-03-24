const User = require("../models/user.model.js")
const Room = require("../models/room.model.js")
const app = require('../app.js')
const express = require('express')
const path = require('path')
app.use(express.static(path.resolve("../../public")));
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        let existedAdmin = await User.findOne({ email, role: 'admin' });

        if (!existedAdmin) {
            return res.redirect('/admin/login?error=Admin not Registered');
        }

        const isPasswordValid = await User.matchPasswordAndGenerateToken(email, password)
        if (isPasswordValid) {
            req.session.admin = existedAdmin._id;
            return res.redirect('/admin/dashboard?success=Logged In Successfully');
        }

    } catch (error) {
        console.log(error)
        return res.redirect('/admin/login?error=' + encodeURIComponent(error.message));
    }
}
const logoutAdmin = async (req, res) => {
    try {
        req.session.destroy();
        return res
            .clearCookie("sessionID")
            .redirect('/admin/login?message=Logged Out Successfully');
    } catch (error) {
        console.error('Error logging out Admin:', error);
        return res.json({ error: 'Something went wrong' });
    }
}


const generateRoomDetailsHtml = function generateRoomDetailsHtml(rooms) {
    let roomDetailsHtml = '';
    rooms.forEach((room,index) => {
        const approveButton = room.approved ?
            '<span class="approved">Approved</span>' :
            `<form action="/admin/approved" method="post">
             <input type="hidden" name="roomid" value="${room._id}">
             <input class="approved-room-btn" type="submit" value="Approve">
         </form>`;
        const editForm = `
         <form id="edit-form" action="/admin/edit-room" method="post">
             <input type="hidden" name="roomid" value="${room._id}">
             <label for="title">Title:</label><br>
             <input class="edit-room-title" type="text" id="title" name="title" value="${room.title}"><br>
             <label for="price">Price:</label><br>
             <input class="edit-room-price" type="text" id="price" name="price" value="${room.price}"><br>
             <label for="roomAddress">Room Address:</label><br>
             <input class="edit-room-address" type="text" id="roomAddress" name="roomAddress" value="${room.roomAddress}"><br>
             <label for="description">Description:</label><br>
             <textarea class="edit-room-description" id="description" name="description">${room.description}</textarea><br>
             <input class="edit-room-btn" type="submit" value="Edit">
         </form>
     `;
        roomDetailsHtml += `
            <tr>
                <td>${index + 1}</td>
                <td><span class="room-lister">${rooms[index].roomLister[0].listerName}</span></td>
                <td><span class="room-title">${room.title}</span></td>
                <td><img class="room-image" src="/temp/${room.roomImage}" alt="Room Image"></td>
                <td><span class="room-price">Rs ${room.price}</span></td>
                <td><span class="room-address">${room.roomAddress}</span></td>
                <td><span class="room-description">${room.description}</span></td>
                <td>${approveButton}</td>
                <td>${editForm}</td>
                <td><form id="delete-room" action="/admin/delete-room" method="post">
                <input type="hidden" name="roomid" value="${room._id}">
                <input class="delete-room-btn" type="submit" value="Delete">
                </form></td>
            </tr>
        `;
    });
    return roomDetailsHtml;
}
const generateUserDetailsHtml = function generateUserDetailsHtml(users, currentAdminId) {
    let userDetailsHtml = '';
    users.forEach((user,index) => {
        let deleteButtonHtml=''
        let removeAdminButton=''
        if (!(currentAdminId == user._id)) {
            deleteButtonHtml = `
                <td>
                    <form id="delete-user" action="/admin/delete-user" method="post">
                        <input type="hidden" name="userid" value="${user._id}">
                        <input class="delete-user-btn" type="submit" value="Delete">
                    </form>
                </td>
            `;
        }
            if (user.role == 'admin' && !(currentAdminId == user._id)) {
                removeAdminButton=
                 `<form id="remove-admin" action="/admin/remove-admin" method="post">
                     <input type="hidden" name="adminid" value="${user._id}">
                     <input class="remove-admin-btn" type="submit" value="Remove Admin">
                  </form>`
             }
        
        userDetailsHtml += `
            <tr>
                <td>${index + 1}</td>
                <td><span class="user-username">${user.fullName}</span></td>
                <td><span class="user-email">${user.email}</span></td>
                <td><span class="user-contact">${user.contactNum}</span></td>
                <td><span class="user-address">${user.address}</span></td>
                <td><span class="user-role">${user.role}</span><br>${removeAdminButton}</td>
                <td><span class="user-gender">${user.gender}</span></td>
                ${deleteButtonHtml}
            </tr>
        `;
    });
    return userDetailsHtml;
}
const approveAdmin = async (req, res) => {
    try {
        const roomId = req.body.roomid;
        const updatedRoom = await Room.findByIdAndUpdate(roomId, { approved: true }, { new: true });
        if (!updatedRoom) {
            return res.status(404).json({ error: 'Room not found' });
        }
        return res.redirect('/admin/dashboard')

    } catch (error) {
        console.error('Error approving room:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteRoom = async (req, res) => {
    try {
        const roomId = req.body.roomid
        const deleteRoom = await Room.findByIdAndDelete(roomId)
        return res.redirect('/admin/dashboard')
    }
    catch (error) {
        console.error('Error approving room:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
const deleteUser = async (req, res) => {
    try {
        const userId = req.body.userid;
        const rooms = await Room.find();
        for (const room of rooms) {
                if (userId == room.roomLister[0].listerId) {
                    await Room.findByIdAndDelete(room._id);
                }
            }
        await User.findByIdAndDelete(userId);
        return res.redirect('/admin/dashboard-users');
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
const editRoom = async (req, res) => {
    try {
        const roomId = req.body.roomid
        const updatedTitle = req.body.title;
        const updatedPrice = req.body.price;
        const updatedRoomAddress = req.body.roomAddress;
        const updatedDescription = req.body.description;
        const updatedRoom = await Room.findByIdAndUpdate(roomId, {
            title: updatedTitle,
            price: updatedPrice,
            roomAddress: updatedRoomAddress,
            description: updatedDescription
        }, { new: true })
        return res.redirect('/admin/dashboard')

    }
    catch (error) {
        console.log("Error Editing Room", error)
    }
}
const addAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingAdmin = await User.findOne({ email, role: 'admin' });
        if (existingAdmin) {
            return res.redirect('/admin/new-admin?error=Admin already Exist');
        }
        let newAdmin;

        if (email.includes('@')) {
            newAdmin = await User.findOne({ email: email });
        }
        if (!newAdmin) {
            return res.redirect('/admin/new-admin?error=User not Registered');
        }

        const isPasswordValid = await User.matchPasswordAndGenerateToken(email, password)

        if (isPasswordValid) {
            const adminId = newAdmin._id
            const updateRole = await User.findByIdAndUpdate(adminId, { role: 'admin' })
            req.session.admin = adminId;
            return res.redirect('/admin/dashboard?success=Admin Added Successfully');
        }
        else {
            newAdmin.role = 'user';
            await newAdmin.save();
        }
    } catch (error) {
        return res.redirect('/admin/new-admin?error=' + encodeURIComponent(error.message));
    }
}
const removeAdmin= async(req,res)=>{
    try {
        const adminId = req.body.adminid
        const remove_Admin = await User.findByIdAndUpdate(adminId, {role: 'user'})
        return res.redirect('/admin/dashboard-users')
    }
    catch (error) {
        console.error('Error approving room:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

}

module.exports = {
    loginAdmin, logoutAdmin, approveAdmin, generateRoomDetailsHtml, deleteRoom, editRoom, addAdmin, generateUserDetailsHtml, deleteUser, removeAdmin
}