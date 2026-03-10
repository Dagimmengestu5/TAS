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
     */
    public function redirect($provider)
    {
        \Log::info("Socialite redirect request received for provider: {$provider}");
        
        if (!in_array($provider, ['google', 'github'])) {
            return response()->json(['message' => 'Invalid provider'], 400);
        }

        try {
            $redirectUri = config("services.{$provider}.redirect");
            \Log::info("Redirecting via URI: " . $redirectUri);

            $url = Socialite::driver($provider)
                ->stateless()
                ->redirectUrl($redirectUri)
                ->redirect()
                ->getTargetUrl();
                
            return response()->json(['url' => $url]);
        } catch (\Exception $e) {
            \Log::error("Socialite redirect error: " . $e->getMessage());
            return response()->json(['message' => "Failed to initialize {$provider} login: " . $e->getMessage()], 500);
        }
    }

    /**
     * Obtain the user information from the provider.
     */
    public function callback($provider)
    {
        try {
            \Log::info("Socialite callback hit for {$provider}");
            $redirectUri = config("services.{$provider}.redirect");
            
            $socialUser = Socialite::driver($provider)
                ->stateless()
                ->redirectUrl($redirectUri)
                ->user();
            
            \Log::info("Auth successful for: " . $socialUser->getEmail());

            $user = User::where($provider . '_id', $socialUser->getId())
                        ->orWhere('email', $socialUser->getEmail())
                        ->first();

            if (!$user) {
                \Log::info("Creating new user account");
                $role = Role::where('name', 'candidate')->first();
                $user = User::create([
                    'name' => $socialUser->getName() ?? $socialUser->getNickname() ?? 'Scholar',
                    'email' => $socialUser->getEmail(),
                    'password' => bcrypt(Str::random(24)),
                    'role_id' => $role ? $role->id : null,
                    $provider . '_id' => $socialUser->getId(),
                    'avatar_url' => $socialUser->getAvatar(),
                    'email_verified_at' => now(),
                ]);
            } else {
                \Log::info("Updating existing user account");
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
            $frontendUrl = config('app.frontend_url') ?: 'https://bot2.netwebup.com';
            $finalRedirect = rtrim($frontendUrl, '/') . '/auth/callback?token=' . $token;
            
            \Log::info("Redirecting back to frontend: " . $finalRedirect);
            return redirect()->away($finalRedirect);

        } catch (\Exception $e) {
            \Log::error("Socialite callback error: " . $e->getMessage());
            return response()->json(['message' => 'Login failed: ' . $e->getMessage()], 500);
        }
    }
}
