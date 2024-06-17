const jwt = require('jsonwebtoken');
const jws = require('jws');
require('dotenv').config();


/*
 * Verify token
 */

exports.verifyToken = async(req, res, next) =>{
    try {
        const token = req.headers['authorization'];

        if (token != undefined){
            const payload = await new Promise((resolve, reject) => {
                jwt.verify(token, process.env.JWT_KEY, (error, decoded) => {
                    if(error){
                        reject(error);
                    } else {
                        resolve(decoded);
                    }
                });
            });

            req.user = payload;
            next();
        }else{
            res.status(403).json({ message: 'Access forbidden: missing token' });
        }
    } catch (error) {
        console.log(error);
        res.status(403).json({ message: 'Access forbidden: invalid token' });
    }
}