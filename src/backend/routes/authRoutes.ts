/**
 * Authentication Express Routes
 * /api/auth
 */

import { Router } from 'express';
import {
  handleCustomerSendOtp,
  handleCustomerVerifyOtp,
  handleGoogleAuth,
  handleConfirmAccountLinking,
  handleRiderSendOtp,
  handleRiderVerifyOtp,
  handleMerchantLogin,
  handleAdminLogin,
} from '../controllers/authController.js';
import { otpRateLimiter } from '../middlewares/rateLimiter.js';
import { sanitizeInputMiddleware } from '../middlewares/validator.js';

const router = Router();

// Apply sanitization middleware
router.use(sanitizeInputMiddleware);

// Customer Phone OTP
router.post('/customer/otp/send', otpRateLimiter, handleCustomerSendOtp);
router.post('/customer/otp/verify', handleCustomerVerifyOtp);

// Customer Google OAuth 2.0 & Account Linking
router.post('/google', handleGoogleAuth);
router.post('/account-link/confirm', handleConfirmAccountLinking);

// Rider Phone OTP
router.post('/rider/otp/send', otpRateLimiter, handleRiderSendOtp);
router.post('/rider/otp/verify', handleRiderVerifyOtp);

// Merchant & Admin Email/Password
router.post('/merchant/login', handleMerchantLogin);
router.post('/admin/login', handleAdminLogin);

export default router;
