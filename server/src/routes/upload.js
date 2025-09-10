const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');
const { auth } = require('../middleware/auth');

const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { message: 'No file uploaded' }
      });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '../../uploads/documents');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const ext = path.extname(req.file.originalname);
    const filename = `${timestamp}-${Math.random().toString(36).substr(2, 9)}${ext}`;
    const filepath = path.join(uploadsDir, filename);

    // Save file
    fs.writeFileSync(filepath, req.file.buffer);

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/documents/${filename}`;

    res.json({
      success: true,
      data: {
        url: fileUrl,
        cloudinaryId: filename,
        originalName: req.file.originalname
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Upload failed' }
    });
  }
};

// Test route to verify auth middleware
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Upload route is working' });
});

// Document upload route
router.post('/document', auth, upload.single('document'), uploadDocument);

module.exports = router;