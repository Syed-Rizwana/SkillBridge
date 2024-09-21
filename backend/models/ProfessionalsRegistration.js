const mongoose = require('mongoose');

const ProfDetails = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    skills: { type: String, required: true },
    price: { type: Number, required: true },
    gender: { type: String, required: true },
    about: { type: String },
    demoImages: { type: [String] }, // Store file paths or URLs for the images
    demoVideos: { type: [String] }, // Store file paths or URLs for the videos
    password: { type: String, required: true },
    notifications: [{
        handType: String,
        numberOfHands: String,
        address: String,
        startTime: String,
        endTime: String,
        userEmail: String,
        totalPrice: Number,
        profEmail: String,
        status: String
    }],
    myworks: { type: [String] },
    state: { type: String, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true },
    // token: { type: String }
});

module.exports = mongoose.model("ProfDetails", ProfDetails);
