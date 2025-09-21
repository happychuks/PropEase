import express, { Router } from 'express';
import { body, query } from 'express-validator';
import { 
  submitApplication, 
  getApplications, 
  getApplicationById, 
  reviewApplication,
  getApplicationStatus 
} from '../controllers/applicationController';
import { authenticate, authorize } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';

const router: Router = express.Router();

// @route   POST /api/applications
// @desc    Submit a new prospective tenant application
// @access  Public
router.post('/', [
  body('applicantEmail').isEmail().normalizeEmail(),
  body('applicantName').trim().notEmpty(),
  body('phoneNumber').trim().notEmpty(),
  body('dateOfBirth').isISO8601(),
  body('employmentStatus').isIn(['EMPLOYED', 'SELF_EMPLOYED', 'UNEMPLOYED', 'STUDENT', 'RETIRED']),
  body('familySize').isInt({ min: 1 }),
  body('desiredAccommodationType').isIn(['STUDIO', 'ONE_BEDROOM', 'TWO_BEDROOM', 'THREE_BEDROOM', 'MINI_FLAT', 'SELF_CONTAINED', 'DUPLEX']),
  body('previousAddress').trim().notEmpty(),
  body('reasonForLeaving').trim().notEmpty(),
  body('yearlyRentCapacity').isFloat({ min: 0 }),
  validateRequest
], submitApplication);

// @route   GET /api/applications/status
// @desc    Check application status by email
// @access  Public
router.get('/status', [
  query('email').isEmail().normalizeEmail(),
  validateRequest
], getApplicationStatus);

// @route   GET /api/applications
// @desc    Get all applications (landlord only)
// @access  Private (Landlord)
router.get('/', authenticate, authorize('LANDLORD'), getApplications);

// @route   GET /api/applications/:id
// @desc    Get application by ID (landlord only)
// @access  Private (Landlord)
router.get('/:id', authenticate, authorize('LANDLORD'), getApplicationById);

// @route   PUT /api/applications/:id/review
// @desc    Review application (approve/reject)
// @access  Private (Landlord)
router.put('/:id/review', [
  authenticate,
  authorize('LANDLORD'),
  body('applicationStatus').isIn(['APPROVED', 'REJECTED', 'UNDER_REVIEW']),
  body('reviewNotes').optional().trim(),
  validateRequest
], reviewApplication);

export default router;
