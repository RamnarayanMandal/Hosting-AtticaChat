const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                res.status(401);
                throw new Error("User is not authorized");
                console.log("hi")
            }
            // Attach the decoded user data to the request object for further processing
            req.userAdministrator = decoded.userAdministrator;
            console.log(req.userAdministrator);
            next(); // Call next() to proceed to the next middleware or route handler
        });
    } else {
        // If the authorization header is missing or invalid
        res.status(401);
        throw new Error("Authorization header missing or invalid");
    }
});

module.exports = validateToken;
