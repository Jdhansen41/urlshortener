//Template for shortUrl
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema for mongoose object
const urlSchema = new Schema({
   
   originalUrl: String,
   shorterUrl: String
    
}, {timestamps: true}); //timestamps object will tell when created

const ModelClass = mongoose.model("shorturl", urlSchema);
            //Collection is shortUrl

module.exports = ModelClass;