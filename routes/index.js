var express = require('express');
var router = express.Router();
const userModel = require('./users');
const postModel = require('./posts');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const upload = require('./multer');

passport.use(new localStrategy(userModel.authenticate()));


passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get("/feed", function (req, res, next) {
  res.render("feed");
});


router.post("/register", async (req, res) => {
  try {
    const { username, email, fullname } = req.body;
    const userData = new userModel({
      username,
      email,
      fullname,
    });

    await userModel.register(userData, req.body.password);  // just await

    passport.authenticate('local')(req, res, function () {
      res.redirect('/profile');
    });

  } catch (err) {
    console.error('❌ Registration error:', err);
    res.redirect('/');
  }
});


router.post("/login", passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true

}));


router.get("/profile", isloggedIn, async function (req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
  .populate("posts")
  res.render("profile",{user});
 
});

router.post("/upload",isloggedIn, upload.single("file"), async function (req, res, next) {
  if(!req.file) {
    return res.status(404).send("No file uploaded.");
  }
 const user=await userModel.findOne({
    username: req.session.passport.user});
const post= await postModel.create({
    image: req.file.filename,
    imageText: req.body.filecaption,
    user: user._id
});
  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");

});


router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect('/');
  });
});

router.get("/login", function (req, res, next) {
  res.render("login", { error: req.flash('error') });
});

function isloggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

module.exports = router;