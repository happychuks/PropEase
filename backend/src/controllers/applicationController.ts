import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { ProspectiveTenantApplicationRequest, ApplicationReviewRequest, AuthRequest, ApiResponse } from '../types';

// @desc    Submit a new prospective tenant application
// @route   POST /api/applications
// @access  Public
export const submitApplication = async (req: Request, res: Response) => {
  try {
    const applicationData: ProspectiveTenantApplicationRequest = req.body;

    // Check if application already exists for this email
    const existingApplication = await prisma.prospectiveTenantApplication.findUnique({
      where: { applicantEmail: applicationData.applicantEmail }
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'An application already exists for this email address'
      } as ApiResponse);
    }

    // Create application
    const application = await prisma.prospectiveTenantApplication.create({
      data: {
        applicantEmail: applicationData.applicantEmail,
        applicantName: applicationData.applicantName,
        phoneNumber: applicationData.phoneNumber,
        dateOfBirth: new Date(applicationData.dateOfBirth),
        employmentStatus: applicationData.employmentStatus,
        employerName: applicationData.employerName,
        familySize: applicationData.familySize,
        desiredAccommodationType: applicationData.desiredAccommodationType,
        previousAddress: applicationData.previousAddress,
        reasonForLeaving: applicationData.reasonForLeaving,
        yearlyRentCapacity: applicationData.yearlyRentCapacity
      }
    });

    // TODO: Send confirmation email to applicant

    return res.status(201).json({
      success: true,
      data: application,
      message: 'Application submitted successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Submit application error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during application submission'
    } as ApiResponse);
  }
};

// @desc    Get all applications (landlord only)
// @route   GET /api/applications
// @access  Private (Landlord)
export const getApplications = async (req: Request, res: Response) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const where = status ? { applicationStatus: status as any } : {};
    
    const [applications, total] = await Promise.all([
      prisma.prospectiveTenantApplication.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { submittedAt: 'desc' },
        include: {
          landlord: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      }),
      prisma.prospectiveTenantApplication.count({ where })
    ]);

    return res.json({
      success: true,
      data: applications,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      },
      message: 'Applications retrieved successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Get applications error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    } as ApiResponse);
  }
};

// @desc    Get application by ID (landlord only)
// @route   GET /api/applications/:id
// @access  Private (Landlord)
export const getApplicationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const application = await prisma.prospectiveTenantApplication.findUnique({
      where: { id },
      include: {
        landlord: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      } as ApiResponse);
    }

    return res.json({
      success: true,
      data: application,
      message: 'Application retrieved successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Get application by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    } as ApiResponse);
  }
};

// @desc    Review application (approve/reject)
// @route   PUT /api/applications/:id/review
// @access  Private (Landlord)
export const reviewApplication = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { applicationStatus, reviewNotes }: ApplicationReviewRequest = req.body;

    // Check if application exists
    const existingApplication = await prisma.prospectiveTenantApplication.findUnique({
      where: { id }
    });

    if (!existingApplication) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      } as ApiResponse);
    }

    // Update application
    const updatedApplication = await prisma.prospectiveTenantApplication.update({
      where: { id },
      data: {
        applicationStatus,
        reviewNotes,
        reviewedAt: new Date(),
        reviewedBy: req.user!.id
      },
      include: {
        landlord: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // If approved, create tenant account
    if (applicationStatus === 'APPROVED') {
      // TODO: Create tenant account and send credentials
      // TODO: Send approval email to applicant
    } else if (applicationStatus === 'REJECTED') {
      // TODO: Send rejection email to applicant
    }

    return res.json({
      success: true,
      data: updatedApplication,
      message: `Application ${applicationStatus.toLowerCase()} successfully`
    } as ApiResponse);

  } catch (error) {
    console.error('Review application error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during application review'
    } as ApiResponse);
  }
};

// @desc    Check application status by email
// @route   GET /api/applications/status
// @access  Public
export const getApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;

    const application = await prisma.prospectiveTenantApplication.findUnique({
      where: { applicantEmail: email as string },
      select: {
        id: true,
        applicantName: true,
        applicationStatus: true,
        submittedAt: true,
        reviewedAt: true,
        reviewNotes: true
      }
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'No application found for this email address'
      } as ApiResponse);
    }

    return res.json({
      success: true,
      data: application,
      message: 'Application status retrieved successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Get application status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    } as ApiResponse);
  }
};
