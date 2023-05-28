const jwt = require('jsonwebtoken');

const createToken = (id) => {
    const token = jwt.sign({ id }, process.env.jwt_SECRET, { expiresIn: '1d' });
    return token;
};

function refreshToken(id) {
    const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
    return refreshToken
}


module.exports = { createToken, refreshToken };