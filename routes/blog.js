const { Router } = require("express");
const multer = require("multer");
const router = Router();
const Blog = require("../models/blog");
const Comment = require("../models/comments");
// creating a storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./public/uploads/`);
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });
router.get("/create-new", (req, res) => {
  res.render("blog", {
    user: req.user,
  });
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;

  const blog = await Blog.create({
    title,
    body,
    coverImageUrl: `/uploads/${req.file.filename}`,
    createdBy: req.user._id,
  });

  return res.redirect(`/blogs/${blog._id}`);
});

router.get("/:blogId", async (req, res) => {
  const blog = await Blog.findById({ _id: req.params.blogId });
  const comments = await Comment.find({ blogId: blog._id }).populate(
    "createdBy"
  );
  return res.render("blogpage", {
    user: req.user,
    blog,
    comments,
  });
});

// post route for adding a comment to the blog
router.post("/:blogId/comment", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    createdBy: req.user._id,
    blogId: req.params.blogId,
  });
  return res.redirect(`/blogs/${req.params.blogId}`);
});

module.exports = router;
