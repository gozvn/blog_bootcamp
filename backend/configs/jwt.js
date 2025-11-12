module.exports = {
    secret : process.env.JWT_SECRET || 'secret',

    ttl: '1d', // thời gian sống của access token
}
