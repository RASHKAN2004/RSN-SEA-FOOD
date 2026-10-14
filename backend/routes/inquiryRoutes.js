const express = require('express');
const {
  createInquiry,
  getInquiries,
  updateInquiryStatus,
} = require('../controllers/inquiryController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/', createInquiry);
router.get('/', protect, adminOnly, getInquiries);
router.put('/:id/status', protect, adminOnly, updateInquiryStatus);

module.exports = router;
