<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Record Updated | SmartEnroll</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f9; color: #333333;">
    
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td style="padding: 20px 0; text-align: center;">
                
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e1e4e8;">
                    
                    <tr>
                        <td style="background-color: #3F9AAE; padding: 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px; text-transform: uppercase;">HFJLSJI</h1>
                            <p style="color: #e6f7f8; margin: 5px 0 0 0; font-size: 14px;">Student Record Update Notification</p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 15px 0; font-size: 16px; color: #555;">Dear <strong>{{ $student->first_name }}</strong>,</p>
                            
                            <p style="margin: 0 0 20px 0; line-height: 1.6; color: #555;">
                                This is to inform you that your enrollment record has been updated by the school administration.
                            </p>

                            <p style="margin: 0 0 15px 0; line-height: 1.6; color: #555; font-size: 14px;">
                                Please review the summary of changes below:
                            </p>

                            <div style="background-color: #f8f9fa; border-left: 4px solid #3F9AAE; padding: 20px; margin: 20px 0; border-radius: 4px;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    @foreach($changes as $key => $value)
                                        <tr>
                                            <td width="40%" style="padding: 8px 0; font-size: 13px; text-transform: uppercase; color: #888; font-weight: bold; vertical-align: top;">
                                                {{ ucfirst(str_replace('_', ' ', $key)) }}
                                            </td>
                                            <td style="padding: 8px 0; font-size: 14px; color: #333; font-weight: bold; vertical-align: top;">
                                                {{ is_array($value) ? 'Updated' : $value }}
                                            </td>
                                        </tr>
                                    @endforeach
                                </table>
                            </div>

                            <div style="border-top: 1px solid #eeeeee; margin: 30px 0;"></div>

                            <h4 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">Enrollment Requirements Status</h4>

                            @php
                                $reqs = $student->requirements;
                                $complete = $reqs['psa'] && $reqs['diploma'] && $reqs['form137'] && $reqs['good_moral'];
                            @endphp

                            @if($complete)
                                <div style="background-color: #d1e7dd; border: 1px solid #badbcc; color: #0f5132; padding: 15px; border-radius: 5px; display: flex; align-items: flex-start;">
                                    <div style="margin-right: 15px; font-size: 20px;">✅</div>
                                    <div>
                                        <strong style="display: block; font-size: 15px; margin-bottom: 5px;">Requirements Complete!</strong>
                                        <p style="margin: 0; font-size: 13px;">Congratulations! Your enrollment requirements are fully complied. You are cleared for the next step.</p>
                                    </div>
                                </div>
                            @else
                                <div style="background-color: #fff3cd; border: 1px solid #ffecb5; color: #664d03; padding: 15px; border-radius: 5px; display: flex; align-items: flex-start;">
                                    <div style="margin-right: 15px; font-size: 20px;">⚠️</div>
                                    <div>
                                        <strong style="display: block; font-size: 15px; margin-bottom: 5px;">Missing Requirements</strong>
                                        <p style="margin: 0; font-size: 13px;">Our records show that you still have pending documents. Please submit the missing requirements to the Registrar's Office as soon as possible.</p>
                                    </div>
                                </div>
                            @endif

                            <p style="margin: 30px 0 0 0; line-height: 1.6; color: #999; font-size: 13px;">
                                If you have questions about these changes, please visit the Registrar's Office.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
                            <p style="margin: 0 0 10px 0; font-size: 12px; color: #888;">
                                <strong>Confidentiality Notice:</strong> This email contains student record information intended solely for the recipient.
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