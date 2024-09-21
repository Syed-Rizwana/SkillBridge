const mongoose = require('mongoose')

const booking = new mongoose.Schema({
    handType: String,
    numberOfHands: String,
    address: String,
    startTime: String,
    endTime: String,
    userEmail: String,
    totalPrice: String,
    profEmail:String,
    status:String
});

module.exports = mongoose.model("BookForm", booking);