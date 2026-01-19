<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Credentials | SmartEnroll</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f9; color: #333333;">
    
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td style="padding: 20px 0; text-align: center;">
                
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e1e4e8;">
                    
                    <tr>
                        <td style="background-color: #3F9AAE; padding: 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px; text-transform: uppercase;">HFJLSJI</h1>
                            <p style="color: #e6f7f8; margin: 5px 0 0 0; font-size: 14px;">Official Account Notification</p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 15px 0; font-size: 16px; color: #555;">Dear <strong>{{ $user->name }}</strong>,</p>
                            
                            <p style="margin: 0 0 20px 0; line-height: 1.6; color: #555;">
                                We are pleased to inform you that an administrative account has been successfully created for you in the <strong>SmartEnroll System</strong>. You may now access the portal to manage enrollment records and system configurations.
                            </p>

                            <p style="margin: 0 0 20px 0; line-height: 1.6; color: #555;">
                                Please find your temporary login credentials below. For security purposes, we strongly recommend changing your password immediately after your first login.
                            </p>

                            <div style="background-color: #f8f9fa; border-left: 4px solid #3F9AAE; padding: 20px; margin: 25px 0; border-radius: 4px;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td width="30%" style="padding: 5px 0; font-size: 13px; text-transform: uppercase; color: #888; font-weight: bold;">System Role</td>
                                        <td style="padding: 5px 0; font-size: 14px; font-weight: bold; color: #333;">{{ strtoupper($user->role) }}</td>
                                    </tr>
                                    <tr>
                                        <td width="30%" style="padding: 5px 0; font-size: 13px; text-transform: uppercase; color: #888; font-weight: bold;">Username / Email</td>
                                        <td style="padding: 5px 0; font-size: 14px; font-weight: bold; color: #333;">{{ $user->email }}</td>
                                    </tr>
                                    <tr>
                                        <td width="30%" style="padding: 5px 0; font-size: 13px; text-transform: uppercase; color: #888; font-weight: bold;">Temporary Password</td>
                                        <td style="padding: 5px 0;">
                                            <span style="background-color: #e2e6ea; color: #333; padding: 4px 8px; border-radius: 4px; font-family: monospace; font-size: 16px; letter-spacing: 1px;">{{ $password }}</span>
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <p style="margin: 0 0 30px 0; line-height: 1.6; color: #555;">
                                To activate your account, please click the verification button below. This link will expire in 24 hours.
                            </p>

                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <a href="{{ $verificationUrl }}" style="background-color: #3F9AAE; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px; box-shadow: 0 2px 4px rgba(63, 154, 174, 0.3);">Verify Email & Access Account</a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 30px 0 0 0; font-size: 13px; color: #999; line-height: 1.5; text-align: center;">
                                If the button above does not work, please copy and paste the following URL into your web browser:<br>
                                <a href="{{ $verificationUrl }}" style="color: #3F9AAE; text-decoration: underline;">{{ $verificationUrl }}</a>
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
                            <p style="margin: 0 0 10px 0; font-size: 12px; color: #888;">
                                <strong>Confidentiality Notice:</strong> This email and any attachments are for the sole use of the intended recipient. If you have received this email in error, please notify the system administrator immediately.
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #aaa;">
                                &copy; {{ date('Y') }} SmartEnroll System. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
                
                <p style="margin: 20px 0 0 0; font-size: 12px; color: #aaa;">This is an automated system message. Please do not reply.</p>

            </td>
        </tr>
    </table>

</body>
</html>