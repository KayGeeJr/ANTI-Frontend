const crypto = require("crypto");
const mongoose = require("mongoose");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { sendEmail, welcomeEmail } = require("../utils/sendEmail");

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    isAdmin: user.isAdmin,
    emailVerified: user.emailVerified || false,
    addresses: user.addresses || [],
    wishlist: user.wishlist || [],
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("name, email and password are required");
    }
    if (!PASSWORD_REGEX.test(password)) {
      res.status(400);
      throw new Error("Password must be at least 8 characters and include an uppercase letter, lowercase letter, and number");
    }

    const existing = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (existing) {
      res.status(409);
      throw new Error("Email already in use");
    }

    const rawVerifyToken = crypto.randomBytes(32).toString("hex");
    const hashedVerifyToken = crypto.createHash("sha256").update(rawVerifyToken).digest("hex");

    const user = await User.create({
      name,
      email,
      password,
      emailVerificationToken: hashedVerifyToken,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    const token = generateToken(user._id.toString());

    const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const verifyUrl = `${baseUrl}/account/verify-email?token=${rawVerifyToken}`;

    sendEmail({
      to: user.email,
      subject: "Welcome to ANTI — please verify your email",
      html: `
        <p>Hi ${user.name}, welcome to ANTI Store!</p>
        <p>Please verify your email address by clicking the link below (expires in 24 hours):</p>
        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
      `,
    }).catch(() => {});

    res.status(201).json({ success: true, user: sanitizeUser(user), token });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("email and password are required");
    }

    const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    const token = generateToken(user._id.toString());
    res.json({ success: true, user: sanitizeUser(user), token });
  } catch (error) {
    next(error);
  }
}

async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.json({ success: true, user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    await user.save();
    res.json({ success: true, user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
}

async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400);
      throw new Error("currentPassword and newPassword are required");
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user || !(await user.comparePassword(currentPassword))) {
      res.status(401);
      throw new Error("Current password is incorrect");
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: "Password updated" });
  } catch (error) {
    next(error);
  }
}

async function addAddress(req, res, next) {
  try {
    const { label, street, city, province, postalCode, country, isDefault } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (isDefault) {
      user.addresses = user.addresses.map((a) => ({ ...a.toObject(), isDefault: false }));
    }

    user.addresses.push({ label, street, city, province, postalCode, country, isDefault: !!isDefault });
    await user.save();
    res.status(201).json({ success: true, addresses: user.addresses });
  } catch (error) {
    next(error);
  }
}

async function updateAddress(req, res, next) {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      res.status(404);
      throw new Error("Address not found");
    }

    const fields = ["label", "street", "city", "province", "postalCode", "country"];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) address[f] = req.body[f];
    });
    if (req.body.isDefault === true) {
      user.addresses.forEach((a) => {
        a.isDefault = a._id.toString() === addressId;
      });
    }
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    next(error);
  }
}

async function deleteAddress(req, res, next) {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      res.status(404);
      throw new Error("Address not found");
    }
    address.deleteOne();
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    next(error);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400);
      throw new Error("email is required");
    }

    const user = await User.findOne({ email: String(email).toLowerCase().trim() });
    // Always respond OK to avoid email enumeration
    if (!user) {
      return res.json({ success: true, message: "If that email exists, a reset link has been sent." });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save({ validateBeforeSave: false });

    const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/account/reset-password?token=${rawToken}`;

    await sendEmail({
      to: user.email,
      subject: "Reset your ANTI password",
      html: `
        <p>Hi ${user.name},</p>
        <p>You requested a password reset. Click the link below to set a new password. This link expires in 1 hour.</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you did not request this, you can safely ignore this email.</p>
      `,
    });

    res.json({ success: true, message: "If that email exists, a reset link has been sent." });
  } catch (error) {
    next(error);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      res.status(400);
      throw new Error("token and password are required");
    }
    if (!PASSWORD_REGEX.test(password)) {
      res.status(400);
      throw new Error("Password must be at least 8 characters and include an uppercase letter, lowercase letter, and number");
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    }).select("+password +passwordResetToken +passwordResetExpires");

    if (!user) {
      res.status(400);
      throw new Error("Reset token is invalid or has expired");
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const newToken = generateToken(user._id.toString());
    res.json({ success: true, message: "Password reset successful", token: newToken, user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
}

async function verifyEmail(req, res, next) {
  try {
    const { token } = req.params;
    if (!token) {
      res.status(400);
      throw new Error("Verification token is required");
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: new Date() },
    }).select("+emailVerificationToken +emailVerificationExpires");

    if (!user) {
      res.status(400);
      throw new Error("Verification token is invalid or has expired");
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    next(error);
  }
}

async function resendVerification(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400);
      throw new Error("email is required");
    }

    const user = await User.findOne({ email: String(email).toLowerCase().trim() })
      .select("+emailVerificationToken +emailVerificationExpires");

    if (!user || user.emailVerified) {
      return res.json({ success: true, message: "If that account exists and is unverified, a new email has been sent." });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    user.emailVerificationToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const verifyUrl = `${baseUrl}/account/verify-email?token=${rawToken}`;

    await sendEmail({
      to: user.email,
      subject: "Verify your ANTI email address",
      html: `
        <p>Hi ${user.name},</p>
        <p>Please verify your email address by clicking the link below. This link expires in 24 hours.</p>
        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
      `,
    });

    res.json({ success: true, message: "If that account exists and is unverified, a new email has been sent." });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  addAddress,
  updateAddress,
  deleteAddress,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
};
