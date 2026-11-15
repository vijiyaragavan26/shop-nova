const express = require('express');
const router = express.Router();
const {
  getAddresses,
  addAddress,
  deleteAddress
} = require('../controllers/addressController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getAddresses);
router.post('/', addAddress);
router.delete('/:id', deleteAddress);

module.exports = router;
