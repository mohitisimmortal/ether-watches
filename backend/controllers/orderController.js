const Order = require("../models/orderSchema");
const userSchema = require("../models/userSchema");

exports.createOrder = async (req, res) => {
    try {
        const { items, shippingInfo } = req.body;

        const { username } = req.user;
        // Fetch the user from the database based on the username
        const user = await userSchema.findOne({ username });

        // Map the items from the request body to match the new schema structure
        const orderItems = items.map((item) => ({
            product: item.product, // Assuming item.product is the product ID
            quantity: item.quantity,
            name: item.name,       // Include the name from the request body
            price: item.price,     // Include the price from the request body
        }));

        const newOrder = new Order({
            user, // Include the user information
            items: orderItems, // Use the mapped order items
            shippingInfo,
        });

        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create the order.' });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ orderDate: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve orders.' });
    }
};

exports.getOrdersToUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const orders = await Order.find({ user: userId }).sort({ orderDate: -1 });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve orders.' });
    }
}