const Joi = require('joi');
const { number } = require('joi');

module.exports.reviewSchema = Joi.object({ 
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().min(10).max(50)
})