const express = require("express");
const path = require("path");
const app = require('../app.js');
const router = express.Router();

const { logoutUser,registerUser,loginUser, forget_password, resetPassword } = require("../controllers/user.controller");
const { verifyUserSession, redirectLoggedInUser, addLogoutButton, addRoomtButton} = require("../middlewares/auth.middleware");
const { messagePopup,successLogoutMessagePopup, receiveUserId} = require("../middlewares/user.middleware");

const publicPath = (path.join(__dirname, '../../public'));
app.use('/user/css', express.static(path.join(__dirname, '../../public/css'), { type: 'text/css' }));
app.use('/user/js', express.static(path.join(__dirname, '../../public/js'), { type: 'text/javascript' }));
app.use('/user/reset-password/css', express.static(path.join(__dirname, '../../public/css'), { type: 'text/css' }));
app.use('/user/reset-password/js', express.static(path.join(__dirname, '../../public/js'), { type: 'text/javascript' }));
app.use('/user/reset-loggedin-password/css', express.static(path.join(__dirname, '../../public/css'), { type: 'text/css' }));
app.use('/user/reset-loggedin-password/js', express.static(path.join(__dirname, '../../public/js'), { type: 'text/javascript' }));

router.get('/login',redirectLoggedInUser,messagePopup(`${publicPath}/login.html`),successLogoutMessagePopup, async (req, res) => {
    return res.send(res.locals.modifiedHtmlContent);
});
router.get('/forget-password',redirectLoggedInUser,messagePopup(`${publicPath}/forgetPasswordEmail.html`),successLogoutMessagePopup, async (req, res) => {
    return res.send(res.locals.modifiedHtmlContent);
});
router.get('/reset-password/:user_id',redirectLoggedInUser,messagePopup(`${publicPath}/resetPassword.html`),receiveUserId, async (req, res) => {
    return res.send(res.locals.modifiedHtmlContent);
});
router.get('/reset-loggedin-password/:user_id',addLogoutButton(`${publicPath}/resetLoggedInPassword.html`),addRoomtButton,receiveUserId, async (req, res) => {
    return res.send(res.locals.modifiedHtmlContent);
});
router.get('/register',redirectLoggedInUser,messagePopup(`${publicPath}/registration.html`), async (req, res) => {
    return res.send(res.locals.modifiedHtmlContent);
});

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/forget-password').post(forget_password);
router.route('/reset-password').post(resetPassword);
router.route('/logout').get(verifyUserSession, logoutUser);

module.exports = router;