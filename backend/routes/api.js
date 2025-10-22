require("express-router-group");
const express = require("express");
const middlewares = require("kernels/middlewares");
const { validate } = require("kernels/validations");
const exampleController = require("modules/examples/controllers/exampleController");
const router = express.Router({ mergeParams: true });

const userController = require("modules/user/userController");
const userValidation = require("modules/user/userValidation");

const postController = require("modules/post/postController");

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

// router.group("/user", userRouter );
// router.group("/admin", dashboardRouter); 
router.group("/post", validate([]), (router) => {
  router.get('/', postController.all),
  // router.get('/test', postController.test),
  router.get('/detail', postController.getbyID),
  router.post('/create',postController.createPost)
  // router.put('/edit/{id}',postController.editPost)
  // router.delete('/delete/{id}',postController.deletePost)
})

// User routes
router.group("/user", validate([]), (router) => {
  router.get('/', userController.all),
  // router.get('/:id/posts', userController.getPost),
  router.post('/create', checkSchema(userValidation.createUser), userController.create),
  router.put('/edit/:id', userController.update),
  router.delete('/delete/:id', userController.delete)
})

// Module Category routes
router.group("/category", validate([]), (router) => {
  router.get('/', categoryController.all),
  router.get('/:id', categoryController.getbyId),
  router.put('/edit/:id', checkSchema(categoryValidation.updateCategory), categoryController.update),
  router.post('/create',checkSchema(categoryValidation.createCategory),categoryController.create),
  router.delete('/delete/:id',categoryController.delete)
})

router.group("/example", validate([]), (router) => {
  router.get('/', exampleController.exampleRequest)
})

module.exports = router;
