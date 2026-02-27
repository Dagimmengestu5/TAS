<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Mail\OtpVerificationMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Carbon\Carbon;

class OtpVerificationController extends Controller
{
    /**
     * Generate and send a 6-digit OTP to the user's email.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendOtp(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email is already verified.'], 400);
        }

        // Generate a 6-digit random code
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        
        $user->update([
            'otp_code' => $code
        ]);

        // Send OTP via Mail
        Mail::to($user->email)->send(new OtpVerificationMail($code, $user->email));

        return response()->json(['message' => 'A 6-digit verification code has been sent to your email.']);
    }

    /**
     * Verify the OTP code provided by the user.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email is already verified.']);
        }

        if ($user->otp_code !== $request->otp) {
            return response()->json(['message' => 'Invalid or expired verification code.'], 400);
        }

        // Code is valid
        $user->update([
            'email_verified_at' => Carbon::now(),
            'otp_code' => null // Clear the OTP code after successful verification
        ]);

        return response()->json(['message' => 'Email verified successfully.']);
    }
}
