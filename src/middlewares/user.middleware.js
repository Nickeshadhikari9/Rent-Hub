const User = require("../models/user.model.js");
const fs = require('fs')

const messagePopup = (filePath) => {
    return async (req, res, next) => {
        try {
            const htmlContent = fs.readFileSync(filePath, 'utf-8');
            const originalContent = '<!--Message Popup-->';
            let messagePopupContent = '';
            const error = req.query.error;
            if (error) {
                messagePopupContent = `
                <div id="popupContainer" style:"display:block;">
                    <div class="popup">
                        <p class="messageError"><i class="fa-solid fa-triangle-exclamation fa-sm" style="color: #ffffff;"></i>  ${error}.</p>
                    </div>
                </div>
                `;
            }
            else {
                messagePopupContent = originalContent
            }
            const modifiedHtmlContent = htmlContent.replace(originalContent, messagePopupContent);
            res.locals.modifiedHtmlContent = modifiedHtmlContent;
            next();
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    };
};

const successMessagePopup = async (req, res, next) => {
    try {
        const originalContent = '<!--Message Popup-->';
        let user
        if (req.session.user) {
            user = await User.findById(req.session.user)
        }
        if (req.session.admin) {

            user = await User.findById(req.session.admin)
        }
        let messagePopupContent = '';
        const success = req.query.success;
        if (success) {
            messagePopupContent = `
                <div id="successPopupContainer">
                    <div class="popup">
                        <p class="messageSuccess"><i class="fa-solid fa-circle-check fa-sm" style="color: #fcfcfc;"></i> ${success}.</p>
                    </div>
                </div>
                `;
        }
        else {
            messagePopupContent = originalContent
        }
        const modifiedHtmlContent = res.locals.modifiedHtmlContent.replace(originalContent, messagePopupContent);
        res.locals.modifiedHtmlContent = modifiedHtmlContent;
        next();
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error');
    }
};

const successLogoutMessagePopup = async (req, res, next) => {
    try {
        const originalContent = '<!--Message Popup-->';
        let messagePopupContent = '';
        const message = req.query.message;
        if (message) {
            messagePopupContent = `
                <div id="successPopupContainer">
                    <div class="popup">
                        <p class="messageSuccess"><i class="fa-solid fa-circle-check fa-sm" style="color: #fcfcfc;"></i>  ${message}.</p>
                    </div>
                </div>
                `;
        }
        else {
            messagePopupContent = originalContent
        }
        const modifiedHtmlContent = res.locals.modifiedHtmlContent.replace(originalContent, messagePopupContent);
        res.locals.modifiedHtmlContent = modifiedHtmlContent;
        next();
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error');
    }
};
const receiveUserId = async (req, res, next) => {
    try {
        const user_id = req.params.user_id
        const originalContent ='<!--user id-->';
        let messagePopupContent = '';
        if (user_id) {
            messagePopupContent =`<input type="hidden" name="user_id" value="${user_id}">`;
        }
        else {
            messagePopupContent = originalContent
        }
        const modifiedHtmlContent = res.locals.modifiedHtmlContent.replace(originalContent, messagePopupContent);
        res.locals.modifiedHtmlContent = modifiedHtmlContent;
        next();

    }
    catch (error) {

    }
}

module.exports = { messagePopup, successMessagePopup, successLogoutMessagePopup, receiveUserId }