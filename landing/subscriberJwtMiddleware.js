require('dotenv').config();

module.exports = (req, res, next) => {
    const token = req.headers['authorization'];
    console.log('middle', process.env.JWT_SUB);
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    if (token !== process.env.JWT_SUB) {
        return res.status(403).json({ message: 'Invalid token' });
    }

    next();
};