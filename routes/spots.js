const express = require('express');
const router = express.Router();
const Spot = require('../models/spot');

router.get('/new' , (req , res) => {
    res.render('spots/NewSpot');
})

router.route('/')
    .get(async (req , res) => 
    {
    const spots = await Spot.find({});
    res.render('spots/all' , {spots})
    })
    .post(async (req , res) => {
        const spot = new Spot(req.body);
        await spot.save();
        res.redirect(`spots/${spot._id}`);
    })

router.get('/:id/edit' , async (req , res) => {
    const spot = await Spot.findById(req.params.id);
    res.render('spots/edit', {spot});
})

router.route('/:id')
    .get(async (req , res) => {
        const spot = await Spot.findById(req.params.id);
        res.render('spots/show' , {spot});
    })
    .put(async (req , res) =>{
        const {id} = req.params;
        const spot = await Spot.findByIdAndUpdate(id , {...req.body});
        res.redirect(`/spots/${spot._id}`);
    })
    .delete(async(req , res) => {
        const {id} = req.params;
        await Spot.findByIdAndDelete(id);
        res.redirect('/spots');
    });

module.exports = router;