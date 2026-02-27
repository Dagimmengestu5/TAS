<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Str;

class SocialiteController extends Controller
{
    /**
     * Redirect the user to the provider authentication page.
     *
     * @param string $provider
     * @return \Illuminate\Http\JsonResponse
     */
    public function redirect($provider)
    {
        if (!in_array($provider, ['google', 'github'])) {
            return response()->json(['message' => 'Invalid provider'], 400);
        }

        try {
            $url = Socialite::driver($provider)->stateless()->redirect()->getTargetUrl();
            return response()->json([
                'url' => $url,
            ]);
        } catch (\Exception $e) {
            \Log::error("Socialite redirect error for {$provider}: " . $e->getMessage());
            return response()->json([
                'message' => "Failed to initialize {$provider} login: " . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtain the user information from the provider.
     *
     * @param string $provider
     * @return \Illuminate\Http\JsonResponse
     */
    public function callback($provider)
    {
        if (!in_array($provider, ['google', 'github'])) {
            return response()->json(['message' => 'Invalid provider'], 400);
        }

        try {
            $socialUser = Socialite::driver($provider)->stateless()->user();
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to authenticate with ' . ucfirst($provider)], 400);
        }

        // Find or create user
        $user = User::where($provider . '_id', $socialUser->getId())
                    ->orWhere('email', $socialUser->getEmail())
                    ->first();

        if (!$user) {
            $role = Role::where('name', 'candidate')->first();
            
            $user = User::create([
                'name' => $socialUser->getName() ?? $socialUser->getNickname(),
                'email' => $socialUser->getEmail(),
                'password' => bcrypt(Str::random(24)), // Random password for OAuth users
                'role_id' => $role ? $role->id : null,
                $provider . '_id' => $socialUser->getId(),
                'avatar_url' => $socialUser->getAvatar(),
                'email_verified_at' => now(), // OAuth users are instantly verified
            ]);
        } else {
            // Update provider ID or verify email if missing
            $updates = [];
            
            if (empty($user->{$provider . '_id'})) {
                $updates[$provider . '_id'] = $socialUser->getId();
                $updates['avatar_url'] = $user->avatar_url ?? $socialUser->getAvatar();
            }
            
            if (empty($user->email_verified_at)) {
                $updates['email_verified_at'] = now();
            }

            if (!empty($updates)) {
                $user->update($updates);
            }
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
        return redirect()->away($frontendUrl . '/auth/callback?token=' . $token);
    }
}
