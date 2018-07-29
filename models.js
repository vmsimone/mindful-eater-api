const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const foodSchema = mongoose.Schema({
    "name": "banana",
    "category": "fruit",
    "nutrients": {
        "carbs": 26.95,
        "calcium": 6,
        "fat": 0.39,
        "fiber": 3.1,
        "iron": 0.31,
        "protein": 1.29,
        "sugars": 14.43,
        "zinc": 0.18
    },
    "vitamins": {
        "A": 4,
        "B-6": 0.43,
        "B-12": 0,
        "C": 10.3,
        "D": 0,
        "E": 0.12,
        "K": 0.6
    },
    "allergens": [],
    "okayFor": ["vegan", "vegetarian", "pescetarian", "paleo", "gluten-free", "pork-free"]
});

const Food = mongoose.model('Food', foodSchema);

module.exports = { Food };