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
    seedDB = require('./seed_callbacks');

mongoose.connect("mongodb://localhost/giftOMatic");
//seedDB();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// PASSPORT CONFIG
app.use(require('express-session')({
    secret: "O-Meippe-ppe no beroberooon!",
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

//--------------USER ROUTES---------------------
// app.get('/user/:id', function(req, res){
//     User.findById(req.params.id, function(err, foundUser){
//         if(err){
//             console.log(err);
//             res.redirect(`/user/${req.user._id}`, {user: req.user._id});
//         } else {
//             res.render(`user`, {user: foundUser});
//         }
//     })
// })

// -------------LIST ROUTES---------------------

// LIST - INDEX
// app.get('/lists', isLoggedIn, function(req, res){
//     console.log(req.user);
//     Wishlist.find({}, function(err, allWishlists){
//         if(err){
//             console.log(err);
//             res.redirect('/');
//         } else {
//             res.render('lists', {wishlists: allWishlists});
//         }
//     });
// });

// USER THEN LIST // !@! don't know if this works, need to add ability for users to add lists
// app.get('/user/:id/lists', isLoggedIn, function(req, res){
//     User.findById(req.params.id).populate('myLists').exec(function(err, foundUser){
//         if(err){
//             console.log(err)
//             res.redirect(`/`) //!@! change this later
//         } else {
//             console.log('foundUser: ', foundUser);
//             res.render('lists', {user: foundUser});
//         }
//     })
// })

// // LIST - NEW
// app.get('/user/:id/lists/new', isLoggedIn, function(req, res){
//     User.findById(req.params.id, function(err, foundUser){
//         if(err){
//             console.log(err);
//             res.redirect('/') //!@! change this later
//         } else {
//             // passing user despite the fact that it should always be currentUser, never any other user
//             // UNLESS we allow users to create lists for others (ie parent for child)
//             res.render('newList', {user: foundUser});
//         }
//     })
// });

// // LIST - CREATE
// app.post('/user/:id/lists', isLoggedIn, function(req, res){
//     let listToCreate = req.body.newList;
//     Wishlist.create(req.body.newList, function(err, newList){
//         if(err){
//             console.log(err);
//             res.redirect(`/user/${req.params.id}/lists/new`);
//         } else {
//             User.findById(req.params.id, function(err, foundUser){
//                 if(err){
//                     console.log(err);
//                 } else {
//                     foundUser.myLists.push(newList._id);
//                     foundUser.save();
//                     res.redirect(`/user/${req.params.id}/lists/${newList._id}`);
//                 }
//             })
//         }
//     })
// })

// // LIST - SHOW
// app.get('/user/:user_id/lists/:list_id', isLoggedIn, function(req, res){
//     Wishlist.findById(req.params.list_id).populate('items').exec(function(err, foundList){
//         if(err){
//             console.log(err);
//             res.redirect("/lists");
//         } else {
//             User.findById(req.params.user_id, function(err, foundUser){
//                 if(err){
//                     console.log(err);
//                     res.redirect('/');
//                 } else {
//                     res.render('wishlist_items', {list: foundList, user: foundUser});
//                 }
//             })
//         }
//     });
// });

// --------------- ITEM ROUTES ---------------

// ITEM - INDEX - NOT BEING USED!
// app.get('/items', isLoggedIn, function(req, res){
//     WishlistItem.find({}, function(err, allWishlistItems){
//         if(err){
//             res.send("error");
//             console.log(err);
//         } else {
//             res.render("items", {wishlistItems:allWishlistItems});
//         }
//     });
// });

// // ITEM - CREATE
// app.post('/user/:user_id/lists/:list_id/items', isLoggedIn, function(req, res){
//     let newItem = req.body.wishlistItem;
//     WishlistItem.create(newItem, function(err, newlyCreatedItem){
//         if(err){
//             console.log(err);
//         } else {
//             Wishlist.findById(req.params.list_id, function(err, foundList){
//                 if(err){
//                     console.log(err);
//                 } else {
//                     foundList.items.push(newlyCreatedItem);
//                     foundList.save();
//                     res.json(newlyCreatedItem);
//                 }
//             });
//         }
//     });
// });

// // ITEM - SHOW
// app.get('/user/:user_id/lists/:list_id/items/:item_id', function(req, res){

//     WishlistItem.findById(req.params.item_id).populate("comments").exec(function(err, foundItem){
//         if(err){
//             console.log(err);
//             res.redirect('/');
//         } else {
//             User.findById(req.params.user_id).populate('myLists').exec(function(err, foundUser){
//                 if(err){
//                     console.log(err)
//                     res.redirect('/');
//                 } else {
//                     Wishlist.findById(req.params.list_id, function(err, foundList){
//                         if(err){
//                             console.log(err);
//                             res.redirect('/');
//                         } else {
//                             res.render('show', {item:foundItem, user:foundUser, list: foundList});
//                         }
//                     })
//                 }
//             })
            
//         }
//     });
// });

// // ITEM - UPDATE

// // ITEM - DELETE !@! Need to update route in ejs file
// app.delete('/user/:user_id/lists/:list_id/items/:item_id', function(req, res){
//     // First find the item you want to delete
//     WishlistItem.findById(req.params.item_id, function(err, foundItem){
//         if(err){
//             console.log(err);
//         } else if (foundItem.comments){
//             foundItem.comments.forEach(function(comment){
//                 Comment.findByIdAndRemove(comment._id, function(err){
//                     if(err){
//                         console.log(err);
//                     } 
//                 });
//             });
//         }
//     });
        
//     WishlistItem.findByIdAndRemove(req.params.item_id, function(err, item){
//         if(err){
//             console.log(err);
//         } else {
//             console.log(`'${item.name}' deleted.`);
//             res.redirect(`/user/${req.params.user_id}/lists/${req.params.list_id}`);
//         }
//     });
// });

// --------------- COMMENT ROUTES ---------------

// COMMENT - NEW
// app.get('/items/:id/comments/new', function(req, res){
//     WishlistItem.findById(req.params.id, function(err, foundItem){
//         if(err){
//             console.log(err);
//             res.redirect('/items');
//         } else {
//             res.render('newComment', {item: foundItem});
//         }
//     });
// });

// // COMMENT - CREATE
// app.post('/items/:id/comments', function(req, res){
    
//     Comment.create(req.body.comment, function(err, newComment){
//         if(err){
//             console.log(err);
//         } else {
//             newComment.author = req.user;
//             newComment.save();
//             WishlistItem.findById(req.params.id, function(err, itemToUpdate){
//                 if(err){
//                     console.log(err);
//                 }else{
//                     itemToUpdate.comments.push(newComment);
//                     itemToUpdate.save();
//                     res.json(newComment);
//                     console.log(`Comment added to '${itemToUpdate.name}'.`);
//                 }
//             });
//         }
//     });
// });

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

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Gift-o-matic online!");
});