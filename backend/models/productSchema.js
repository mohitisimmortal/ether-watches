const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    ratings: {
        type: Number,
        default: 0,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    collectionName: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        default: 1,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            },
        },
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

productSchema.methods.calculateAvgRating = function () {
    if (!this.reviews.length) {
        this.ratings = 0;
        this.numOfReviews = 0;
        return;
    }

    const totalRating = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.ratings = (totalRating / this.reviews.length).toFixed(1);
    this.numOfReviews = this.reviews.length;
};

productSchema.pre('save', function (next) {
    this.calculateAvgRating();
    next();
});

module.exports = mongoose.model("Product", productSchema);