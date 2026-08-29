// Handles admin image uploads for product photos.
async function uploadImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file received' });
  }
  const relativeUrl = `/uploads/products/${req.file.filename}`;
  res.status(201).json({ success: true, url: relativeUrl, filename: req.file.filename });
}

module.exports = { uploadImage };
