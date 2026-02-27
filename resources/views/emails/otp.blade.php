<x-mail::message>
# Verify Your Email Address

Welcome to **Droga Hub**! We are excited to have you on board.

To ensure the security of your account, please verify your email address. You can copy the exact 6-digit security code below:

<x-mail::panel>
# {{ $code }}
</x-mail::panel>

Or, simply click the button below to automatically verify your identity.

@php
    $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
    $verifyUrl = rtrim($frontendUrl, '/') . '/enter-otp?email=' . urlencode($email) . '&code=' . urlencode($code);
@endphp

<x-mail::button :url="$verifyUrl" color="success">
Verify My Email
</x-mail::button>

This code is valid for **15 minutes**. If you did not create an account or request this verification, no further action is required.

Best regards,<br>
**The Droga Hub Security Team**
</x-mail::message>
