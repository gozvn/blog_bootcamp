const authMiddleware = (middlewareArray) => {
    return [
        ...middlewareArray
    ]
}

module.exports = authMiddleware;