const express = require("express");
const rateLimit = require("express-rate-limit");
const { createUpload } = require("../middleware/upload.middleware");
const { submitContact } = require("../controllers/contact.controller");

const router = express.Router();
const contactUpload = createUpload("anti-store/contact");

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: { success: false, message: "Too many submissions, try again later." },
});

router.post("/", contactLimiter, contactUpload.single("referenceImage"), submitContact);

module.exports = router;
