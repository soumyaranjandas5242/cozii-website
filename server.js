require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false
    }
});

db.connect((err) => {
    if (err) {
        console.error("MySQL connection error:", err);
    } else {
        console.log("MySQL connected");

        // CREATE TABLES AUTOMATICALLY

        db.query(`CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(200),
            price DECIMAL(10,2),
            image TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        db.query(`CREATE TABLE IF NOT EXISTS orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            customer_name VARCHAR(100),
            email VARCHAR(100),
            mobile VARCHAR(20),
            address TEXT,
            state VARCHAR(50),
            total_amount DECIMAL(10,2),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        db.query(`CREATE TABLE IF NOT EXISTS order_items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_id INT,
            product_name VARCHAR(200),
            price VARCHAR(20),
            qty INT,
            image TEXT,
            FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
        )`);

        console.log("Tables checked/created");
    }
});

// Test route
app.get("/", (req, res) => {
    res.send("Server is running");
});

// Save order
app.post("/order", (req, res) => {
    const { customerName, email, mobile, address, state, products, totalAmount } = req.body;

    const orderQuery = `
        INSERT INTO orders (customer_name, email, mobile, address, state, total_amount)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        orderQuery,
        [customerName, email, mobile, address, state, totalAmount],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Failed to save order");
            }

            const orderId = result.insertId;

            if (!products || products.length === 0) {
                return res.send("Order saved successfully");
            }

            const itemValues = products.map((item) => [
                orderId,
                item.name,
                item.price,
                item.qty,
                item.img
            ]);

            const itemQuery = `
                INSERT INTO order_items (order_id, product_name, price, qty, image)
                VALUES ?
            `;

            db.query(itemQuery, [itemValues], (err2) => {
                if (err2) {
                    console.log(err2);
                    return res.status(500).send("Order saved, but items failed");
                }

                res.send("Order saved successfully");
            });
        }
    );
});

// Get all orders
app.get("/orders", (req, res) => {
    db.query("SELECT * FROM orders ORDER BY id DESC", (err, orders) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Failed to fetch orders");
        }

        if (orders.length === 0) {
            return res.json([]);
        }

        const orderIds = orders.map((order) => order.id);

        db.query(
            "SELECT * FROM order_items WHERE order_id IN (?)",
            [orderIds],
            (err2, items) => {
                if (err2) {
                    console.log(err2);
                    return res.status(500).send("Failed to fetch order items");
                }

                const finalOrders = orders.map((order) => {
                    return {
                        ...order,
                        products: items.filter((item) => item.order_id === order.id)
                    };
                });

                res.json(finalOrders);
            }
        );
    });
});

// Add product
app.post("/product", (req, res) => {
    const { name, price, image } = req.body;

    const query = `
        INSERT INTO products (name, price, image)
        VALUES (?, ?, ?)
    `;

    db.query(query, [name, price, image], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Failed to add product");
        }

        res.send("Product added successfully");
    });
});

// Update product
app.put("/product/:id", (req, res) => {
    const { name, price } = req.body;
    const { id } = req.params;

    const query = `
        UPDATE products
        SET name = ?, price = ?
        WHERE id = ?
    `;

    db.query(query, [name, price, id], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Failed to update product");
        }

        res.send("Product updated successfully");
    });
});

// Get all products
app.get("/products", (req, res) => {
    db.query("SELECT * FROM products ORDER BY id DESC", (err, products) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Failed to fetch products");
        }

        res.json(products);
    });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server started on port " + PORT);
});