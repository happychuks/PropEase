import express, { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';

const router: Router = express.Router();

// @route   GET /api/properties
// @desc    Get all properties
// @access  Public
router.get('/', (req, res) => {
  res.json({ message: 'Get properties endpoint - to be implemented' });
});

// @route   POST /api/properties
// @desc    Create new property
// @access  Private (Landlord)
router.post('/', authenticate, authorize('LANDLORD'), (req, res) => {
  res.json({ message: 'Create property endpoint - to be implemented' });
});

// @route   GET /api/properties/:id
// @desc    Get property by ID
// @access  Public
router.get('/:id', (req, res) => {
  res.json({ message: 'Get property by ID endpoint - to be implemented' });
});

// @route   PUT /api/properties/:id
// @desc    Update property
// @access  Private (Landlord)
router.put('/:id', authenticate, authorize('LANDLORD'), (req, res) => {
  res.json({ message: 'Update property endpoint - to be implemented' });
});

// @route   DELETE /api/properties/:id
// @desc    Delete property
// @access  Private (Landlord)
router.delete('/:id', authenticate, authorize('LANDLORD'), (req, res) => {
  res.json({ message: 'Delete property endpoint - to be implemented' });
});

export default router;
