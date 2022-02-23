const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const spotRoutes = require('./routes/spots');
const userRoutes = require('./routes/users');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./middleware/expressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const Joi = require('joi');

mongoose.connect('mongodb://localhost:27017/mountain-spot', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();
const port = 3000;

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use('/public', express.static('public'));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/spots', spotRoutes);
app.use('/' , userRoutes);

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
        req.flash('error' , err.message);
        console.log(err.stack);
        res.status(statusCode).redirect('back');
    //res.status(statusCode).render('error', { err })
})

app.get('/', (req, res) => {
    res.render('index.ejs')
});

<<<<<<< HEAD

=======
>>>>>>> 1d313819736e74531922cabb4a85ba3f1ad9ffc0
app.listen(port , () => {
    console.log(`Listening on port ${port}`);
})