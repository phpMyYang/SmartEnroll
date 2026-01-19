<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Received | SmartEnroll</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f9; color: #333333;">
    
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td style="padding: 20px 0; text-align: center;">
                
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e1e4e8;">
                    
                    <tr>
                        <td style="background-color: #3F9AAE; padding: 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px; text-transform: uppercase;">HFJLSJI</h1>
                            <p style="color: #e6f7f8; margin: 5px 0 0 0; font-size: 14px;">Application Receipt Notification</p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 15px 0; font-size: 16px; color: #555;">Dear <strong>{{ $student->first_name }}</strong>,</p>
                            
                            <p style="margin: 0 0 20px 0; line-height: 1.6; color: #555;">
                                We formally acknowledge the receipt of your enrollment application on <strong>{{ $student->created_at->format('F d, Y') }}</strong>.
                            </p>

                            <div style="background-color: #f8f9fa; border-left: 4px solid #3F9AAE; padding: 20px; margin: 25px 0; border-radius: 4px;">
                                <h4 style="margin: 0 0 10px 0; color: #3F9AAE; text-transform: uppercase; font-size: 14px;">Submission Instructions</h4>
                                <p style="margin: 0 0 5px 0; font-size: 14px; color: #555;">
                                    Please compile all physical documents in a <strong style="text-decoration: underline;">Long Yellow Folder</strong>.
                                </p>
                                <p style="margin: 10px 0 0 0; font-size: 14px; color: #333;">
                                    Your Reference LRN: <strong style="font-size: 16px; background-color: #e2e6ea; padding: 2px 6px; border-radius: 4px;">{{ $student->lrn }}</strong>
                                </p>
                            </div>

                            <h3 style="color: #333; font-size: 18px; margin-top: 30px; border-bottom: 2px solid #eee; padding-bottom: 10px;">Requirement Checklist</h3>

                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 15px; border-collapse: collapse;">
                                @php
                                    $documents = [
                                        'PSA Birth Certificate' => 'psa',
                                        'Diploma' => 'diploma',
                                        'Form 137' => 'form137',
                                        'Good Moral Certificate' => 'good_moral'
                                    ];
                                @endphp

                                @foreach($documents as $label => $key)
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #555; font-size: 14px;">
                                            {{ $label }}
                                        </td>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; text-align: right;">
                                            @if($student->requirements[$key])
                                                <span style="background-color: #d4edda; color: #155724; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: bold; text-transform: uppercase;">
                                                    Verified
                                                </span>
                                            @else
                                                <span style="background-color: #f8d7da; color: #721c24; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: bold; text-transform: uppercase;">
                                                    To Follow
                                                </span>
                                            @endif
                                        </td>
                                    </tr>
                                @endforeach
                            </table>

                            @php
                                $reqs = $student->requirements;
                                $complete = $reqs['psa'] && $reqs['diploma'] && $reqs['form137'] && $reqs['good_moral'];
                            @endphp

                            <div style="margin-top: 30px;">
                                @if($complete)
                                    <div style="background-color: #d1e7dd; border: 1px solid #badbcc; color: #0f5132; padding: 15px; border-radius: 5px; text-align: center;">
                                        <strong style="display: block; font-size: 16px; margin-bottom: 5px;">✅ Application Complete</strong>
                                        <p style="margin: 0; font-size: 14px;">All requirements have been verified. Please proceed to the Registrar's Office to claim your Certificate of Registration (COR).</p>
                                    </div>
                                @else
                                    <div style="background-color: #fff3cd; border: 1px solid #ffecb5; color: #664d03; padding: 15px; border-radius: 5px; text-align: center;">
                                        <strong style="display: block; font-size: 16px; margin-bottom: 5px;">⚠️ Pending Requirements</strong>
                                        <p style="margin: 0; font-size: 14px;">Please visit the Registrar's Office on <strong>{{ now()->addDays(3)->format('F d, Y') }}</strong> to submit the missing documents marked as "To Follow".</p>
                                    </div>
                                @endif
                            </div>

                        </td>
                    </tr>

                    <tr>
                        <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
                            <p style="margin: 0 0 10px 0; font-size: 12px; color: #888;">
                                <strong>Confidentiality Notice:</strong> This email contains information intended solely for the applicant.
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