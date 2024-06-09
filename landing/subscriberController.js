const { Subscriber } = require('../models/index');

/*
 * Create a subscriber
 */
exports.createSubscriber = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) return res.status(400).json({ message: "Email cannot be empty" });

        // Create the new subscriber
        await Subscriber.create({ email });

        res.status(201).json({ message: 'Subscriber successfully added' });

    } catch (error) {
        res.status(500).json({ message: 'Error processing data', error: error.message });
    }
};