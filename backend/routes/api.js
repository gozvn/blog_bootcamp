require("express-router-group");
const express = require("express");
const middlewares = require("kernels/middlewares");
const { validate } = require("kernels/validations");
const exampleController = require("modules/examples/controllers/exampleController");
const router = express.Router({ mergeParams: true });

const authMiddleware  = require("../modules/middleware/authMiddleware")

const tagController = require("modules/tag/tagController");
const tagValidation = require("modules/tag/tagValidation");

const authController = require("modules/auth/authController")
const commentController = require("modules/comment/commentController");

const languageController = require("modules/language/languageController");
const languageValidation = require("modules/language/languageValidation");

const userController = require("modules/user/userController");
const userValidation = require("modules/user/userValidation");

const postController = require("modules/post/postController");
const postValidation = require("modules/post/postValidation");

const categoryController = require("modules/category/categoryController");
const categoryValidation = require("modules/category/categoryValidation");
const { checkSchema } = require("express-validator");

// ===== EXAMPLE Request, make this commented =====
// router.group("/posts",middlewares([authenticated, role("owner")]),(router) => {
//   router.post("/create",validate([createPostRequest]),postsController.create);
//   router.put("/update/:postId",validate([updatePostRequest]),postsController.update);
//   router.delete("/delete/:postId", postsController.destroy);
// }
// );

router.get("/", authMiddleware, (req, res) => {
  res.send("Hello world");
});

// Authentication 
router.group("/auth", validate([]), (router) => {
  router.post('/login', authController.login);
  router.post('/logout', authController.logout);
  router.post('/refreshtoken', authController.refreshToken);
});

// router.group("/admin", dashboardRouter); 

// Language module routes
router.group("/language", validate([]), (router) => {
  router.get('/', languageController.all);
  router.get('/:id', languageController.getById);
  router.post('/create', checkSchema(languageValidation.create), languageController.create);
  router.put('/edit/:id', checkSchema(languageValidation.update), languageController.update);
  router.delete('/delete/:id', languageController.delete);
});

// Tag module routes
router.group("/tag", validate([]), (router) => {
  router.get('/', tagController.all);
  router.post('/create', checkSchema(tagValidation.create), tagController.create);
  router.put('/edit/:id', checkSchema(tagValidation.update), tagController.update);
  router.delete('/delete/:id', tagController.delete);
});

// Comment module routes
router.group("/comment", validate([]), (router) => {
  router.get('/', commentController.all);
  router.get('/:id', commentController.getById);
  router.post('/create', commentController.create);
  router.put('/edit/:id', commentController.update);
  router.delete('/delete/:id', commentController.delete);
});

// Module Post routes
router.group("/post", validate([]), (router) => {
  router.get('/', postController.all);
  router.get('/:id', postController.getbyId);
  router.post('/create', checkSchema(postValidation.createPost), postController.create);
  router.put('/edit/:id', checkSchema(postValidation.editPost), postController.edit);
  router.delete('/delete/:id', postController.delete);
})
// User routes
router.group("/user", validate([]), (router) => {
  router.get('/', userController.all);
  router.get('/:id', userController.getbyId);
  router.post('/create', checkSchema(userValidation.createUser), userController.create);
  router.put('/edit/:id', checkSchema(userValidation.updateUser), userController.update);
  router.delete('/delete/:id', userController.delete);
})

// Module Category routes
router.group("/category", validate([]), (router) => {
  router.get('/', categoryController.all);
  router.get('/:id', categoryController.getbyId);
  router.put('/edit/:id', checkSchema(categoryValidation.updateCategory), categoryController.update);
  router.post('/create',checkSchema(categoryValidation.createCategory),categoryController.create);
  router.delete('/delete/:id',categoryController.delete);
})

router.group("/example", validate([]), (router) => {
  router.get('/', exampleController.exampleRequest);
})

module.exports = router;
