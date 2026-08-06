/**
 * Authentication Controllers
 * Endpoints for Phone OTP, Google OAuth 2.0 with Account Linking, Email/Pass Login
 */

import { Request, Response } from 'express';
import {
  sendOtp,
  verifyOtpAndLogin,
  authenticateWithGoogleIdToken,
  confirmAccountLinking,
  loginWithEmailPassword,
} from '../services/authService.js';
import { validateMalaysianPhone } from '../middlewares/validator.js';

/**
 * POST /api/auth/customer/otp/send
 */
export async function handleCustomerSendOtp(req: Request, res: Response) {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber || !validateMalaysianPhone(phoneNumber)) {
      return res.status(400).json({
        success: false,
        code: 'INVALID_PHONE',
        message: 'Nombor telefon tidak sah. Gunakan format Malaysia (contoh: +60123456789).',
      });
    }

    const result = await sendOtp(phoneNumber, 'customer');
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * POST /api/auth/customer/otp/verify
 */
export async function handleCustomerVerifyOtp(req: Request, res: Response) {
  try {
    const { phoneNumber, otpCode } = req.body;

    if (!phoneNumber || !otpCode) {
      return res.status(400).json({
        success: false,
        message: 'Sila berikan nombor telefon dan kod OTP.',
      });
    }

    const result = await verifyOtpAndLogin(phoneNumber, otpCode, 'customer');
    return res.status(200).json({
      success: true,
      message: 'Log masuk berjaya!',
      user: result.user,
      tokens: result.tokens,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

/**
 * POST /api/auth/google
 * Google OAuth 2.0 Sign-In & Account Linking Check
 */
export async function handleGoogleAuth(req: Request, res: Response) {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Google ID Token diperlukan.',
      });
    }

    const result = await authenticateWithGoogleIdToken(idToken);

    if (result.status === 'ACCOUNT_LINKING_REQUIRED') {
      return res.status(200).json({
        success: true,
        requiresAccountLinking: true,
        tempToken: result.tempToken,
        message: result.message,
        existingAccount: result.existingAccount,
        googleProfile: result.googleProfile,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Log masuk Google berjaya!',
      user: result.user,
      tokens: result.tokens,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

/**
 * POST /api/auth/account-link/confirm
 */
export async function handleConfirmAccountLinking(req: Request, res: Response) {
  try {
    const { tempToken } = req.body;

    if (!tempToken) {
      return res.status(400).json({
        success: false,
        message: 'Token penyatuan akaun diperlukan.',
      });
    }

    const result = await confirmAccountLinking(tempToken);
    return res.status(200).json({
      success: true,
      message: result.message,
      user: result.user,
      tokens: result.tokens,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

/**
 * POST /api/auth/rider/otp/send & verify
 */
export async function handleRiderSendOtp(req: Request, res: Response) {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber || !validateMalaysianPhone(phoneNumber)) {
      return res.status(400).json({ success: false, message: 'Nombor telefon rider tidak sah.' });
    }
    const result = await sendOtp(phoneNumber, 'rider');
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function handleRiderVerifyOtp(req: Request, res: Response) {
  try {
    const { phoneNumber, otpCode } = req.body;
    const result = await verifyOtpAndLogin(phoneNumber, otpCode, 'rider');
    return res.status(200).json({
      success: true,
      message: 'Log masuk rider berjaya!',
      user: result.user,
      tokens: result.tokens,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

/**
 * POST /api/auth/merchant/login
 */
export async function handleMerchantLogin(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const result = await loginWithEmailPassword(email, password, 'merchant');
    return res.status(200).json({
      success: true,
      message: 'Log masuk Merchant CMS berjaya!',
      user: result.user,
      tokens: result.tokens,
    });
  } catch (error: any) {
    return res.status(401).json({ success: false, message: error.message });
  }
}

/**
 * POST /api/auth/admin/login
 */
export async function handleAdminLogin(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const result = await loginWithEmailPassword(email, password, 'admin');
    return res.status(200).json({
      success: true,
      message: 'Log masuk Admin Panel berjaya!',
      user: result.user,
      tokens: result.tokens,
    });
  } catch (error: any) {
    return res.status(401).json({ success: false, message: error.message });
  }
}
