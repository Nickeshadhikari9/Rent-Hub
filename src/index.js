const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const session = require('express-session');
const express = require('express');
const path = require('path');
const connectDB = require('./db/index.js');
const userRoute = require('./routes/user.routes.js');
const roomRoute = require('./routes/room.routes.js');
const adminRoute = require('./routes/admin.routes.js');
const { successLogoutMessagePopup } = require("../src/middlewares/user.middleware.js");
const { addLogoutButton } = require('./middlewares/auth.middleware.js');
const app = require('./app.js');
const PORT = process.env.PORT;

const publicPath = path.join(__dirname, '../public');
app.use(express.static(path.resolve("../public")));

const userSession = session({
  secret: process.env.USERSECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 2 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
});

const adminSession = session({
  secret: process.env.ADMINSECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: false,
    httpOnly: true,
  }
});

app.get("/",userSession, addLogoutButton(`${publicPath}/index.html`), async (req, res) => {
  res.send(res.locals.modifiedHtmlContent);
});

app.get("/home",userSession, addLogoutButton(`${publicPath}/index.html`),successLogoutMessagePopup, async (req, res) => {
  res.send(res.locals.modifiedHtmlContent);
});

app.get("/contact",userSession, addLogoutButton(`${publicPath}/contact.html`), async (req, res) => {
  res.send(res.locals.modifiedHtmlContent);
});

app.get("/service",userSession, addLogoutButton(`${publicPath}/service.html`), async (req, res) => {
  res.send(res.locals.modifiedHtmlContent);
});


app.use("/user", userSession, userRoute);
app.use("/admin", adminSession, adminRoute);
app.use("/room", userSession, roomRoute);
app.get("*", async(req,res)=>{
  res.sendFile(`${publicPath}/errorPage.html`)
})
connectDB().then(() => {
  app.listen(PORT);
  console.log(`Server is running.`);
});
