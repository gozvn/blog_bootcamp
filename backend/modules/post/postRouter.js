const postController = require('./postControllers/postController.js');

module.exports = function(router) {
	router.get('/', postController.postRequest);
	router.post('/create', postController.createPost);
}
