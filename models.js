const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const foodSchema = mongoose.Schema({
    "name": String,
    "category": String,
    "nutrients": {
        "carbs": Number,
        "calcium": Number,
        "fat": Number,
        "fiber": Number,
        "iron": Number,
        "protein": Number,
        "sugars": Number,
        "zinc": Number
    },
    "vitamins": {
        "A": Number,
        "B-6": Number,
        "B-12": Number,
        "C": Number,
        "D": Number,
        "E": Number,
        "K": Number
    },
    "allergens": [String],
    "okayFor": [String],
    "user": String
});

foodSchema.methods.serialize = function() {
    return {
        id: this._id,
        name: this.name,
        category: this.category,
        nutrients: this.nutrients,
        vitamins: this.vitamins,
        allergens: this.allergens,
        okayFor: this.okayFor
    };
};

const Food = mongoose.model('Food', foodSchema);

module.exports = { Food };