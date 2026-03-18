const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({

    customerName: String,
    email: String,
    mobile: String,
    address: String,
    state: String,

    products: Array,

    totalAmount: Number,

    status: {
        type: String,
        default: "Order Confirmed"
    },

    date: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Order", OrderSchema);