const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://admin:8R640k2ITOKUILGv@cluster0.mongodb.net/cozii?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Database connected to MongoDB Atlas"))
    .catch((err) => console.log("Database connection error:", err));
const cors = require("cors");

console.log("Database connected");
const express = require("express");
const Order = require("./models/order");
const app = express();
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.post("/order", async(req, res) => {

    try {

        const newOrder = new Order(req.body);

        await newOrder.save();

        res.send("Order saved in database");

    } catch (error) {

        res.status(500).send(error);

    }

});
app.get("/orders", async(req, res) => {

    try {

        const orders = await Order.find();

        res.json(orders);

    } catch (error) {

        res.status(500).send(error);

    }

});
app.listen(3000, () => {
    console.log("Server started on port 3000");
});

app.get("/orders", async(req, res) => {

    try {

        const orders = await Order.find();

        res.json(orders);

    } catch (error) {

        res.status(500).send(error);

    }

});
app.put("/product/:id", async(req, res) => {

    await Product.findByIdAndUpdate(req.params.id, req.body);

    res.send("Product updated");

});
const Product = mongoose.model("Product", {
    name: String,
    price: Number,
    image: String
});