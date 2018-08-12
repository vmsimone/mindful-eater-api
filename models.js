const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const foodSchema = mongoose.Schema({
    "name": {type: String, required: true},
    "category": {type: String, required: true},
    "nutrients": {
        "calories": {type: Number, required: true},
        "carbs": {type: Number, required: true},
        "fat": {type: Number, required: true},
        "iron": {type: Number, required: true},
        "protein": {type: Number, required: true},
        "sugars": {type: Number, required: true}
    },
    "user": {type: String, required: true}
});

foodSchema.methods.serialize = function() {
    return {
        id: this._id,
        name: this.name,
        category: this.category,
        nutrients: this.nutrients,
        user: this.user
    };
};

const Food = mongoose.model('Food', foodSchema, 'foods');

module.exports = { Food };