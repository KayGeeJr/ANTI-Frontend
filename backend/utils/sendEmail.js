const nodemailer = require("nodemailer");

function escapeHtml(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail({ to, subject, html }) {
  return transporter.sendMail({
    from: `ANTI Store <${process.env.EMAIL_USER || "info@shopanti.online"}>`,
    to,
    subject,
    html,
  });
}

function welcomeEmail(name = "there") {
  return `<p>Hi ${escapeHtml(name)}, welcome to ANTI Store.</p>`;
}

function orderConfirmationEmail(order) {
  return `<p>Your order ${escapeHtml(order?.orderNumber || "")} has been received.</p>`;
}

function orderShippedEmail(order) {
  return `<p>Your order ${escapeHtml(order?.orderNumber || "")} has shipped.</p>`;
}

function adminNewOrderEmail(order) {
  return `<p>New order received: ${escapeHtml(order?.orderNumber || "")}</p>`;
}

function customOrderConfirmationEmail(inquiry) {
  return `<p>Your custom order request has been received, ${escapeHtml(inquiry?.name || "")}.</p>`;
}

function adminCustomOrderEmail(inquiry) {
  return `<p>New custom order inquiry from ${escapeHtml(inquiry?.name || "a customer")}.</p>`;
}

module.exports = {
  sendEmail,
  welcomeEmail,
  orderConfirmationEmail,
  orderShippedEmail,
  adminNewOrderEmail,
  customOrderConfirmationEmail,
  adminCustomOrderEmail,
};
