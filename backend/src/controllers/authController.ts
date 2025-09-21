import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { RegisterRequest, LoginRequest, AuthRequest, ApiResponse } from '../types';

// Generate JWT Token
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  } as jwt.SignOptions);
};

// Generate Refresh Token
const generateRefreshToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  } as jwt.SignOptions);
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, phone, role }: RegisterRequest = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      } as ApiResponse);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    // Generate tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return res.status(201).json({
      success: true,
      data: {
        user,
        token,
        refreshToken
      },
      message: 'User registered successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration'
    } as ApiResponse);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      } as ApiResponse);
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      } as ApiResponse);
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      } as ApiResponse);
    }

    // Generate tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
        refreshToken
      },
      message: 'Login successful'
    } as ApiResponse);

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login'
    } as ApiResponse);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      } as ApiResponse);
    }

    return res.json({
      success: true,
      data: user,
      message: 'User retrieved successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Get me error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    } as ApiResponse);
  }
};

// @desc    Check email availability
// @route   GET /api/auth/check-email
// @access  Public
export const checkEmailAvailability = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Email parameter is required'
      } as ApiResponse);
    }

    // Check if email exists in users table
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    // Check if email exists in applications table
    const existingApplication = await prisma.prospectiveTenantApplication.findUnique({
      where: { applicantEmail: email }
    });

    const isAvailable = !existingUser && !existingApplication;

    return res.json({
      success: true,
      data: {
        email,
        available: isAvailable,
        message: isAvailable 
          ? 'Email is available' 
          : 'Email is already registered or used in an application'
      }
    } as ApiResponse);

  } catch (error) {
    console.error('Check email availability error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while checking email availability'
    } as ApiResponse);
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is required'
      } as ApiResponse);
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;

    // Check if user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, isActive: true }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      } as ApiResponse);
    }

    // Generate new access token
    const newToken = generateToken(user.id);

    return res.json({
      success: true,
      data: {
        token: newToken
      },
      message: 'Token refreshed successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    } as ApiResponse);
  }
};
