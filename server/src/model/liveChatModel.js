const mongoose = require("mongoose");

const liveChatSchema = mongoose.Schema({
    group: {
        type: String,
        default: ''
    },
    grade: {
        type: String,
        default: ''
    },
    employeeId: {
        type: String,
        default: ''
    },
    messages: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    video: {
        type: String,
        default: ''
    },
    document: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("liveChat", liveChatSchema);
