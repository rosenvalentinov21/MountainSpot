const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Spot = require('./models/spot');
const spots = require('./routes/spots');

mongoose.connect('mongodb://localhost:27017/mountain-spot', {
    useNewUrlParser: true,
    useUnifiedTopology: true
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
app.use('/spots', spots);



app.get('/', (req, res) => {
    res.render('index.ejs')
});

app.get('/spots/new' , (req , res) => {
    res.render('NewSpot.ejs');
})

app.get('/spots/spots' , async (req , res) => {
    const spots = await Spot.find({});
    res.render('spots' , {spots});
})

app.post('/spots/spots' , async (req , res) => {
    const spot = new Spot(req.body);
    await spot.save();
    res.redirect(`/spots/${spot._id}`);
})

app.get('/spots/spots/:id' , async (req , res) => {
    const spot = await Spot.findById(req.params.id);
    res.render('show' , {spot});
})

app.get('/spots/spots/:id/edit' , async (req , res) => {
    const spot = await Spot.findById(req.params.id);
    res.render('edit', {spot});
})

app.put('/spots/spots/:id' , async (req , res) =>{
    const {id} = req.params;
    const spot = await Spot.findByIdAndUpdate(id , {...req.body});
    res.redirect(`/spots/${spot._id}`);
})

app.delete('/spots/:id' , async(req , res) => {
    const {id} = req.params;
    await Spot.findByIdAndDelete(id);
    res.redirect('/spots');
})




app.listen(port , () => {
    console.log(`Listening on port ${port}`);
})