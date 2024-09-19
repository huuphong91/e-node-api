const JWT = require('jsonwebtoken');

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = JWT.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: '2 days' });

        const refreshToken = JWT.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: '7 days' });


        JWT.verify(accessToken, publicKey, (err, decoded) => {
            if (err) {
                console.log('error verify::', err);
            } else {
                 console.log('decode verify::', decoded);
            }
        });

        return { accessToken, refreshToken };
    } catch (error) {
        return error;
    }
}

module.exports = {
    createTokenPair
}