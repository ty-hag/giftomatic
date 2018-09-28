require('dotenv').config();

var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    WishlistItem = require('./models/wishlistItem'),
    Wishlist = require('./models/wishlist'),
    User = require('./models/user'),
    Comment = require('./models/comment'),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    userRoutes = require('./routes/routes_user'),
    listRoutes = require('./routes/routes_list'),
    itemRoutes = require('./routes/routes_item'),
    searchRoutes = require('./routes/routes_search'),
    commentRoutes = require('./routes/routes_comment'),
    invitationRoutes = require('./routes/routes_invitation'),
    expressSanitizer = require('express-sanitizer'),
    seedDB = require('./seed_callbacks');

mongoose.connect("mongodb://localhost:27017/giftOMatic", {useNewUrlParser: true});
//seedDB();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// PASSPORT CONFIG
app.use(require('express-session')({
    secret: process.env.AUTH_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Make logged-in user data available in every response (for ejs templates)
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

// Router
app.use('/user', userRoutes);
app.use('/user/:user_id/lists', listRoutes);
app.use('/user/:user_id/lists/:list_id/items', itemRoutes);
app.use('/user/:user_id/lists/:list_id/items/:id/comments', commentRoutes);
app.use('/search', searchRoutes);
app.use('/invitations', invitationRoutes);

///============== ROUTES ========================

// --------------- LANDING PAGE ---------------

app.get('/', function(req, res){
    res.render('landing');
});

// --------------- REGISTER, LOGIN, LOGOUT ROUTES ---------------
app.get('/register', function(req, res){
    res.render('register');
})

app.post('/register', function(req, res){
    var newUser = new User(
        {
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }
    );
    
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.render('register');
        } else {
            passport.authenticate("local")(req, res, function(){
                console.log(`${user.username} has registered.`);
                res.redirect(`/user/${user._id}`);
            });
        }
    });
});

app.get('/login', function(req, res){
    res.render('login');
})

app.post('/login',
    passport.authenticate('local',
    {failureRedirect: '/login'}
    ), function(req, res){
        User.findById(req.user._id, function(err, foundUser){
            if(err){
                console.log(err);
                res.redirect('/login');
            } else {
                res.redirect(`/user/${foundUser._id}`)
            }
        })
    }
);

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
})



//------------ LOGIN MIDDLEWARE ---------------------
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

function isCurrentUser(req, res, next){
    if(req.user === req.params.id){
        return next();
    }
    res.send("You do not have permission to access that thing!");
}

app.listen(process.env.PORT, function(){
    console.log("Gift-o-matic online!");
});