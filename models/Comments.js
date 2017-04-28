const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentsSchema = new Schema({
    body: {
        type: String
    },
    author: {
        type: String
    }
});


const Comments = mongoose.model("comments", commentsSchema);

module.exports = Comments;
