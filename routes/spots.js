const express = require('express');
const router = express.Router();
const Spot = require('../models/spot');
const catchAsync = require('../middleware/catchAsync');
const expressError = require('../middleware/expressError');
const {spotSchema} = require('../middleware/spotSchema');
const Review = require('../models/review');
const {reviewSchema} = require('../middleware/reviewSchema');

const validateSpot = (req, res, next) => {
    const { error } = spotSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/new' , (req , res) => {
    res.render('spots/NewSpot');
})

router.route('/')
    .get(catchAsync(async (req , res) => 
    {
    const spots = await Spot.find({});
    res.render('spots/all' , {spots})
    }))
    .post(validateSpot ,catchAsync(async (req , res) => {
        const spot = new Spot(req.body);
        await spot.save();
        res.redirect(`spots/${spot._id}`);
    }))

router.get('/:id/edit' , catchAsync(async (req , res) => {
    const spot = await Spot.findById(req.params.id);
    res.render('spots/edit', {spot});
}))

router.route('/:id')
    .get(catchAsync(async (req , res) => {
        const spot = await Spot.findById(req.params.id).populate('reviews');;
        res.render('spots/show' , {spot});
    }))
    .put(validateSpot ,catchAsync(async (req , res) =>{
        const {id} = req.params;
        const spot = await Spot.findByIdAndUpdate(id , {...req.body});
        res.redirect(`/spots/${spot._id}`);
    }))
    .delete(catchAsync(async(req , res) => {
        const {id} = req.params;
        await Spot.findByIdAndDelete(id);
        res.redirect('/spots');
    }));

    router.post('/:id/reviews' ,validateReview , catchAsync(async (req , res) => {
        const spot = await Spot.findById(req.params.id);
        const review = new Review(req.body);
        spot.reviews.push(review);
        await review.save();
        await spot.save();
        res.redirect(`/spots/${spot._id}`);
    }))

module.exports = router;