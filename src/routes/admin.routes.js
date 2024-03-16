const express = require("express");
const path = require("path");
const router = express.Router();

const { loginAdmin, logoutAdmin, approveAdmin, deleteRoom, editRoom, addAdmin, deleteUser, removeAdmin } = require("../controllers/admin.controller.js");
const { displayUsersDetails,displayRoomsDetails, redirectLoggedInAdmin } = require("../middlewares/admin.middleware.js");
const { messagePopup,successMessagePopup, successLogoutMessagePopup} = require("../middlewares/user.middleware.js");
const { verifyAdminSession, clearCache } = require("../middlewares/auth.middleware.js");
const app = require('../app.js');

const publicPath = path.join(__dirname, '../../public');
app.use('/admin/css', express.static(path.join(__dirname, '../../public/css'), { type: 'text/css' }));
app.use('/admin/js', express.static(path.join(__dirname, '../../public/js'), { type: 'text/javascript' }));

router.get('/login', redirectLoggedInAdmin,messagePopup(`${publicPath}/adminLogin.html`),successLogoutMessagePopup, async (req, res) => {
    return res.send(res.locals.modifiedHtmlContent);
});
router.get('/new-admin', verifyAdminSession,messagePopup(`${publicPath}/newAdmin.html`), async (req, res) => {
    return res.send(res.locals.modifiedHtmlContent);
});
router.get('/dashboard', verifyAdminSession, clearCache, displayRoomsDetails(`${publicPath}/adminDashboard.html`),successMessagePopup, async (req, res) => {
    return res.send(res.locals.modifiedHtmlContent);
});
router.get('/dashboard-users', verifyAdminSession, clearCache, displayUsersDetails(`${publicPath}/adminDashboard_users.html`), async (req, res) => {
    return res.send(res.locals.modifiedHtmlContent);
});

router.route('/login').post(loginAdmin);
router.route('/logout').get(verifyAdminSession, logoutAdmin);
router.route('/approved').post(approveAdmin);
router.route('/delete-room').post(verifyAdminSession, deleteRoom);
router.route('/delete-user').post(verifyAdminSession, deleteUser);
router.route('/edit-room').post(verifyAdminSession, editRoom);
router.route('/new-admin').post(verifyAdminSession, addAdmin);
router.route('/remove-admin').post(verifyAdminSession, removeAdmin);

module.exports = router;