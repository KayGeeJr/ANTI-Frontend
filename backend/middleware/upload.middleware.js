const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const allowedFormats = ["jpg", "jpeg", "png", "webp"];

function createUpload(folder = "anti-store/products") {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      allowed_formats: allowedFormats,
      transformation: [{ width: 1200, crop: "limit", quality: "auto" }],
    },
  });

  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter(_req, file, cb) {
      if (file.mimetype && file.mimetype.startsWith("image/")) {
        cb(null, true);
        return;
      }
      const err = new Error("Only image files are allowed (e.g. JPG, PNG, WebP).");
      err.statusCode = 400;
      cb(err);
    },
  });
}

const upload = createUpload("anti-store/products");

module.exports = { upload, createUpload };
