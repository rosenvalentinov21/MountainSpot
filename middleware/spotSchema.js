const Joi = require('joi');

module.exports.spotSchema = Joi.object({
        title: Joi.string().required().min(3).max(30),
        description: Joi.string().required().min(10).max(200),
        location: Joi.string().min(3).max(30).required()
});
