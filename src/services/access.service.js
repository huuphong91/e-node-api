const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}

class AccessService {
    static signUp = async ({ name, email, password }) => {
        try {
            const holderShop = await shopModel.findOne({ email }).lean();

            if(holderShop) {
                return {
                    code: '40001',
                    message: 'Shop already exists',
                    status: 'error'
                }
            }

            const passwordHash = await bcrypt.hash(password, 10);
            const newShop = await shopModel.create({ name, email, password: passwordHash, roles: [RoleShop.SHOP] });

            if (newShop) {
                // create privateKey, publicKey
                // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'spki',
                //         format: 'pem'
                //     },
                //     privateKeyEncoding: {
                //         type: 'pkcs8',
                //         format: 'pem'
                //     }
                // });
                const privateKey = crypto.randomBytes(64).toString('hex');
                const publicKey = crypto.randomBytes(64).toString('hex');

                const keyStore = await KeyTokenService.createKeyToken({ 
                    userId: newShop._id, 
                    publicKey,
                    privateKey
                });

                if (!keyStore) {
                    return {
                        code: '50002',
                        message: 'Create key token failed',
                        status: 'error'
                    }
                }


                const tokens = await createTokenPair(
                  { userId: newShop._id, email },
                  publicKey,
                  privateKey
                );

                console.log('Create Token Success!!');

                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({fields: ['_id', 'name', 'email'], object: newShop }),
                        tokens
                    }
                }
            }

        } catch (error) {
            return {
                code: '50001',
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService;