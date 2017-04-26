const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    title:{
        type: String,
        required: true
        },
    link:{
        type: String,
        required: true
        },
    thumb: String,
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comments"
    }]
});


const Article = mongoose.model("article", articleSchema);

module.exports = Article;

