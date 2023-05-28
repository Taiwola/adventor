const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    image: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rating: [
        {
            star: Number,
            postedby: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        }
    ],
    totalRating: {
        type: String,
        default: 0
    },
    status: {
        type: String,
        enum: ['Not Interested', 'Interested'],
        default: 'Not Interested'
    },
    interested: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
});

postSchema.methods.format = function () {
    return {
        id: this._id,
        title: this.title,
        description: this.description,
        image: this.image,
        rating: this.rating,
        status: this.status,
        totalRating: this.totalRating
    }
}

const Post = mongoose.model('Post', postSchema);

module.exports = Post;