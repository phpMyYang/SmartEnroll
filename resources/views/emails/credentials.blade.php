<!DOCTYPE html>
<html>
<head>
    <title>Account Credentials</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f6f9; padding: 20px;">
    
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
        <h2 style="color: #2C3E50; text-align: center;">Welcome to SmartEnroll!</h2>
        
        <p>Hello <strong>{{ $user->name }}</strong>,</p>
        
        <p>An account has been created for you by the administrator. Please find your login credentials below:</p>
        
        <div style="background-color: #f0f4f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Role:</strong> {{ strtoupper($user->role) }}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> {{ $user->email }}</p>
            <p style="margin: 5px 0;"><strong>Password:</strong> <span style="background: #fff; padding: 2px 5px; border: 1px solid #ccc;">{{ $password }}</span></p>
        </div>

        <p>Before you can login, you need to verify your email address.</p>

        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ $verificationUrl }}" style="background-color: #3498db; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Verify Account & Login
            </a>
        </div>

        <p style="font-size: 12px; color: #7f8c8d;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            {{ $verificationUrl }}
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;">
        <p style="text-align: center; font-size: 11px; color: #aaa;">
            © {{ date('Y') }} SmartEnroll System. All rights reserved.
        </p>
    </div>

</body>
</html>