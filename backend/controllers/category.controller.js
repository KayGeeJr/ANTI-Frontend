const Category = require("../models/Category");
const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

async function getCategories(req, res, next) {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
}

async function createCategory(req, res, next) {
  try {
    const { name, description } = req.body;
    if (!name) {
      res.status(400);
      throw new Error("name is required");
    }
    const image = req.file ? { url: req.file.path, publicId: req.file.filename } : undefined;
    const category = await Category.create({ name, description, image });
    console.log("Created category:", category._id.toString());
    res.status(201).json({ success: true, category });
  } catch (error) {
    next(error);
  }
}

async function getCategoryBySlug(req, res, next) {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true });
    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }
    const products = await Product.find({ category: category._id, isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, category, products });
  } catch (error) {
    next(error);
  }
}

async function updateCategory(req, res, next) {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }
    if (req.body.name !== undefined) category.name = req.body.name;
    if (req.body.description !== undefined) category.description = req.body.description;
    if (req.body.video !== undefined) category.video = req.body.video || undefined;
    if (req.body.isActive !== undefined) category.isActive = req.body.isActive === true || req.body.isActive === "true";

    if (req.file) {
      if (category.image?.publicId) {
        try { await cloudinary.uploader.destroy(category.image.publicId); } catch {}
      }
      category.image = { url: req.file.path, publicId: req.file.filename };
    } else if (req.body.removeImage === "true") {
      if (category.image?.publicId) {
        try { await cloudinary.uploader.destroy(category.image.publicId); } catch {}
      }
      category.image = undefined;
    }

    await category.save();
    console.log("Updated category:", category._id.toString());
    res.json({ success: true, category });
  } catch (error) {
    next(error);
  }
}

async function deleteCategory(req, res, next) {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }
    category.isActive = false;
    await category.save();
    console.log("Archived category:", category._id.toString());
    res.json({ success: true, message: "Category archived" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
