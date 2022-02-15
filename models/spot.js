const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const review = require('./review');

const SpotSchema = new Schema({
    title: String ,
    description: String ,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

module.exports = mongoose.model('Spot' , SpotSchema);