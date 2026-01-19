<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Updated | SmartEnroll</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f9; color: #333333;">
    
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td style="padding: 20px 0; text-align: center;">
                
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e1e4e8;">
                    
                    <tr>
                        <td style="background-color: #3F9AAE; padding: 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px; text-transform: uppercase;">HFJLSJI</h1>
                            <p style="color: #e6f7f8; margin: 5px 0 0 0; font-size: 14px;">Account Update Notification</p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 15px 0; font-size: 16px; color: #555;">Dear <strong>{{ $user->name }}</strong>,</p>
                            
                            <p style="margin: 0 0 20px 0; line-height: 1.6; color: #555;">
                                This is an automated notification to inform you that your account profile has been modified by an administrator.
                            </p>

                            <p style="margin: 0 0 20px 0; line-height: 1.6; color: #555;">
                                Please review the summary of changes below:
                            </p>

                            <div style="background-color: #f8f9fa; border-left: 4px solid #3F9AAE; padding: 20px; margin: 25px 0; border-radius: 4px;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    @foreach($changes as $field => $newValue)
                                        <tr>
                                            <td width="35%" style="padding: 8px 0; font-size: 13px; text-transform: uppercase; color: #888; font-weight: bold; vertical-align: top;">
                                                {{ str_replace('_', ' ', $field) }}
                                            </td>
                                            <td style="padding: 8px 0; font-size: 14px; color: #333; vertical-align: top;">
                                                @if($field === 'password')
                                                    <span style="background-color: #e2e6ea; color: #333; padding: 4px 8px; border-radius: 4px; font-family: monospace; font-weight: bold; font-size: 15px;">
                                                        {{ $newValue }}
                                                    </span>
                                                    <div style="margin-top: 5px; font-size: 11px; color: #e74c3c;">
                                                        * Please keep your new password secure.
                                                    </div>

                                                @elseif($field === 'status')
                                                    <span style="font-weight: bold; padding: 2px 6px; border-radius: 3px; font-size: 12px; text-transform: uppercase; background-color: {{ $newValue == 'active' ? '#d4edda' : '#f8d7da' }}; color: {{ $newValue == 'active' ? '#155724' : '#721c24' }};">
                                                        {{ $newValue }}
                                                    </span>

                                                @else
                                                    <strong>{{ $newValue }}</strong>
                                                @endif
                                            </td>
                                        </tr>
                                    @endforeach
                                </table>
                            </div>

                            @if($user->status === 'inactive')
                                <div style="background-color: #fff3cd; color: #856404; padding: 15px; border-radius: 4px; font-size: 14px; border: 1px solid #ffeeba; margin-top: 20px;">
                                    <strong>⚠️ Important Notice:</strong> Your account is currently set to <strong>INACTIVE</strong>. You will not be able to access the system until your status is reactivated.
                                </div>
                            @endif

                            <p style="margin: 30px 0 0 0; line-height: 1.6; color: #555; font-size: 14px;">
                                If you did not authorize these changes, please contact the System Administrator immediately to secure your account.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
                            <p style="margin: 0 0 10px 0; font-size: 12px; color: #888;">
                                <strong>Confidentiality Notice:</strong> This email contains sensitive account information intended solely for the recipient.
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