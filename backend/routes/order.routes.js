const express = require("express");
const { protect } = require("../middleware/auth.middleware");
const {
  createOrder,
  getMyOrders,
  getOrderByNumber,
  cancelOrder,
} = require("../controllers/order.controller");

const router = express.Router();

router.post("/", createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/:orderNumber", getOrderByNumber);
router.put("/:id/cancel", protect, cancelOrder);

module.exports = router;
