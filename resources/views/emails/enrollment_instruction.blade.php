<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Evaluation Result | SmartEnroll</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f9; color: #333333;">
    
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td style="padding: 20px 0; text-align: center;">
                
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e1e4e8;">
                    
                    <tr>
                        <td style="background-color: #3F9AAE; padding: 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px; text-transform: uppercase;">HFJLSJI</h1>
                            <p style="color: #e6f7f8; margin: 5px 0 0 0; font-size: 14px;">Academic Evaluation Result</p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 15px 0; font-size: 16px; color: #555;">Dear <strong>{{ $student->first_name }}</strong>,</p>
                            
                            <p style="margin: 0 0 20px 0; line-height: 1.6; color: #555;">
                                We are pleased to inform you that you have <strong>PASSED</strong> the academic evaluation for the current term. You are now qualified to proceed with enrollment for the next semester/grade level.
                            </p>

                            <div style="background-color: #f8f9fa; border-left: 4px solid #3F9AAE; padding: 20px; margin: 25px 0; border-radius: 4px;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td width="35%" style="padding: 5px 0; font-size: 13px; text-transform: uppercase; color: #888; font-weight: bold;">Student Name</td>
                                        <td style="padding: 5px 0; font-size: 14px; font-weight: bold; color: #333;">{{ $student->last_name }}, {{ $student->first_name }}</td>
                                    </tr>
                                    <tr>
                                        <td width="35%" style="padding: 5px 0; font-size: 13px; text-transform: uppercase; color: #888; font-weight: bold;">Current Level</td>
                                        <td style="padding: 5px 0; font-size: 14px; font-weight: bold; color: #333;">Grade {{ $student->grade_level }}</td>
                                    </tr>
                                    <tr>
                                        <td width="35%" style="padding: 5px 0; font-size: 13px; text-transform: uppercase; color: #888; font-weight: bold;">Strand</td>
                                        <td style="padding: 5px 0; font-size: 14px; font-weight: bold; color: #333;">
                                            <span style="background-color: #e2e6ea; padding: 2px 8px; border-radius: 4px;">{{ $student->strand->code ?? 'N/A' }}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="35%" style="padding: 5px 0; font-size: 13px; text-transform: uppercase; color: #888; font-weight: bold;">Evaluation Status</td>
                                        <td style="padding: 5px 0;">
                                            <span style="background-color: #d4edda; color: #155724; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: bold; text-transform: uppercase;">PASSED / CLEARED</span>
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <div style="border-top: 1px solid #eeeeee; margin: 30px 0;"></div>

                            <h3 style="color: #333; font-size: 18px; margin-bottom: 20px; text-align: center;">Next Steps for Enrollment</h3>

                            <div style="margin-bottom: 30px;">
                                <p style="font-size: 14px; color: #555; line-height: 1.6; margin-bottom: 15px;">
                                    Since you have been cleared by the system, you may now access your account to finalize your enrollment:
                                </p>
                                <ul style="font-size: 14px; color: #555; line-height: 1.6; padding-left: 20px;">
                                    <li><strong>Log in</strong> to the Student Portal using your credentials.</li>
                                    <li><strong>Validate</strong> your grades from the previous semester.</li>
                                    <li><strong>Select Subjects</strong> or Block Schedule for the upcoming semester.</li>
                                </ul>
                            </div>

                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <a href="{{ url('/') }}" style="background-color: #3F9AAE; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px; box-shadow: 0 2px 4px rgba(63, 154, 174, 0.3);">
                                            PROCEED TO ENROLLMENT
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <div style="background-color: #e7f1ff; border: 1px solid #b6d4fe; color: #084298; padding: 15px; border-radius: 5px; margin-top: 30px; font-size: 13px; text-align: center;">
                                <strong>💡 Reminder:</strong> Please settle any outstanding balances (if applicable) before the start of classes to avoid interruptions.
                            </div>

                        </td>
                    </tr>

                    <tr>
                        <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
                            <p style="margin: 0 0 10px 0; font-size: 12px; color: #888;">
                                <strong>Confidentiality Notice:</strong> This email contains academic records intended solely for the student named above.
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