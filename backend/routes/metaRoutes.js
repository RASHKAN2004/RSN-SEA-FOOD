const express = require('express');
const { SRI_LANKA_DISTRICTS, DEFAULT_DISTRICT } = require('../config/districts');

const router = express.Router();

router.get('/districts', (req, res) => {
  res.json({ success: true, districts: SRI_LANKA_DISTRICTS, defaultDistrict: DEFAULT_DISTRICT });
});

router.get('/business', (req, res) => {
  res.json({
    success: true,
    business: {
      name: process.env.BUSINESS_NAME || 'RSN Sea Food',
      location: 'Kalpitiya, Puttalam District, Sri Lanka',
      slogan: 'Fresh From Kalpitiya. Quality You Can Trust.',
      whatsappNumber: process.env.WHATSAPP_NUMBER || '94750519450',
      whatsappDisplay: '0750519450',
      defaultDistrict: DEFAULT_DISTRICT,
    },
  });
});

module.exports = router;
