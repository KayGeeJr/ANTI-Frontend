const { sendEmail } = require("../utils/sendEmail");

function escapeHtml(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function contactEmail({ name, email, phone, message, imageUrl }) {
  const imageSection = imageUrl
    ? `<p><strong>Reference Image:</strong><br/><img src="${escapeHtml(imageUrl)}" style="max-width:400px" /></p>`
    : "";
  return `
    <h2>New Contact Inquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone || "—")}</p>
    <p><strong>Message:</strong><br/>${escapeHtml(message || "—").replace(/\n/g, "<br/>")}</p>
    ${imageSection}
  `;
}

function contactAutoReplyEmail(name) {
  return `
    <p>Hi ${escapeHtml(name)},</p>
    <p>Thank you for reaching out to ANTI. We have received your message and will get back to you within 1–2 business days.</p>
    <p>— The ANTI Team</p>
  `;
}

async function submitContact(req, res, next) {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email) {
      res.status(400);
      throw new Error("name and email are required");
    }

    const imageUrl = req.file?.path || null;

    await sendEmail({
      to: process.env.EMAIL_USER || "info@shopanti.online",
      subject: `New contact inquiry from ${name}`,
      html: contactEmail({ name, email, phone, message, imageUrl }),
    });

    sendEmail({
      to: email,
      subject: "We received your message — ANTI",
      html: contactAutoReplyEmail(name),
    }).catch(() => {});

    res.status(200).json({ success: true, message: "Message sent" });
  } catch (error) {
    next(error);
  }
}

module.exports = { submitContact };
