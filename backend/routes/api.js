require("express-router-group");
const express = require("express");
// const middlewares = require("kernels/middlewares");
const { validate } = require("kernels/validations");
const router = express.Router({ mergeParams: true });

const { authMiddleware, checkRole } = require("../modules/middleware/authMiddleware")

const publicController = require("modules/public/publicController");

const uploadController = require("modules/upload/uploadController");
const uploadMiddleware = require("modules/middleware/uploadMiddleware");

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

router.get("/", (req, res) => {
  res.send("Hello world");
});

//Upload file
router.group("/upload", validate([]), (router) => {
  router.post("/", authMiddleware, checkRole(1), uploadMiddleware.single('image'), uploadController.uploadImage)
});

// Public routes
router.group("/public", validate([]), (router) => {
  router.get("/category", publicController.getCategories);
  router.get("/category/:id", publicController.getCategoryById);
  router.get("/post", publicController.getPosts);
  router.get("/post/:id", publicController.getPostById);
  router.get("/comment/:id", publicController.getCommentsByPostId);
});

// Authentication 
router.group("/auth", validate([]), (router) => {
  router.post('/login', authController.login);
  router.post('/logout', authController.logout);
  router.post('/refreshtoken', authController.refreshToken);
  router.post('/googleOAuth', authController.googleLogin) // Dành cho Google Login

})

// Language module routes
router.group("/language", validate([]), (router) => {
  router.get('/', languageController.all);
  router.get('/:id', languageController.getById);
  router.post('/create', authMiddleware, checkRole(1), checkSchema(languageValidation.create), languageController.create);
  router.put('/edit/:id', authMiddleware, checkRole(1), checkSchema(languageValidation.update), languageController.update);
  router.delete('/delete/:id', authMiddleware, checkRole(1), languageController.delete);
});

// Tag module routes
router.group("/tag", validate([]), (router) => {
  router.get('/', tagController.all);
  router.post('/create', authMiddleware, checkRole(1), checkSchema(tagValidation.create), tagController.create);
  router.put('/edit/:id', authMiddleware, checkRole(1), checkSchema(tagValidation.update), tagController.update);
  router.delete('/delete/:id', authMiddleware, checkRole(1), tagController.delete);
});

// Comment module routes
router.group("/comment", validate([]), (router) => {
  router.get('/', commentController.all);
  router.get('/:id', commentController.getById);
  router.post('/create', authMiddleware, checkRole(1), commentController.create);
  router.put('/edit/:id', authMiddleware, checkRole(1), commentController.update);
  router.delete('/delete/:id', authMiddleware, checkRole(1), commentController.delete);
});

// Module Post routes
router.group("/post", validate([]), (router) => {
  router.get('/', authMiddleware, checkRole(1), postController.all);
  router.get('/:id', authMiddleware, checkRole(1), postController.getbyId);
  router.post('/create', authMiddleware, checkRole(1), checkSchema(postValidation.createPost), postController.create);
  router.put('/edit/:id', authMiddleware, checkRole(1), checkSchema(postValidation.editPost), postController.edit);
  router.delete('/delete/:id', authMiddleware, checkRole(1), postController.delete);
})
// User routes
router.group("/user", validate([]), (router) => {
  router.get('/', userController.all);
  router.get('/:id', userController.getbyId);
  router.post('/create', checkSchema(userValidation.createUser), userController.create);
  router.put('/edit/:id', authMiddleware, checkRole(1), checkSchema(userValidation.updateUser), userController.update);
  router.delete('/delete/:id', authMiddleware, checkRole(1), userController.delete);
})

// Module Category routes
router.group("/category", validate([]), (router) => {
  router.get('/', categoryController.all);
  router.get('/:id', authMiddleware, checkRole(1), categoryController.getbyId);
  router.put('/edit/:id', authMiddleware, checkRole(1), checkSchema(categoryValidation.updateCategory), categoryController.update);
  router.post('/create', authMiddleware, checkRole(1), checkSchema(categoryValidation.createCategory), categoryController.create);
  router.delete('/delete/:id', authMiddleware, checkRole(1), categoryController.delete);
})

module.exports = router;
