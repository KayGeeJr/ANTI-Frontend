const express = require("express");
const { protect } = require("../middleware/auth.middleware");
const { admin } = require("../middleware/admin.middleware");
const { upload } = require("../middleware/upload.middleware");
const {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");

const router = express.Router();

router.get("/", getCategories);
router.get("/:slug", getCategoryBySlug);
router.post("/", protect, admin, upload.single("image"), createCategory);
router.put("/:id", protect, admin, upload.single("image"), updateCategory);
router.delete("/:id", protect, admin, deleteCategory);

module.exports = router;
