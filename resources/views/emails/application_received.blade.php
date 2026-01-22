<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Received | SmartEnroll</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Courier New', Courier, monospace; background-color: #eeeeee;">

    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;">
        <tr>
            <td style="padding: 20px 0; text-align: center;">
                
                <div style="max-width: 600px; margin: 0 auto; background-color: #fcfbf4; border: 3px solid #2d3436; padding: 0; box-shadow: 8px 8px 0px #2d3436; text-align: left;">
                    
                    {{-- HEADER --}}
                    <div style="background-color: #F4D03F; padding: 20px; border-bottom: 3px solid #2d3436; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; color: #2d3436;">
                            🎓 SmartEnroll
                        </h1>
                        <span style="font-size: 12px; font-weight: bold; background-color: #2d3436; color: #fff; padding: 2px 8px; margin-top: 5px; display: inline-block;">APPLICATION RECEIVED</span>
                    </div>

                    <div style="padding: 30px;">
                        <p style="font-size: 16px; margin-bottom: 20px;">
                            Dear <strong>{{ strtoupper($student->first_name) }} {{ strtoupper($student->last_name) }}</strong>,
                        </p>

                        <p style="font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
                            We formally acknowledge the receipt of your enrollment application on <strong>{{ $student->created_at->format('F d, Y') }}</strong>.
                        </p>

                        {{-- STUDENT INFO BOX --}}
                        <div style="background-color: #fff; border: 2px solid #2d3436; padding: 15px; margin-bottom: 25px;">
                            <table width="100%" cellpadding="5" cellspacing="0" style="font-size: 14px;">
                                <tr>
                                    <td style="font-weight: bold; color: #636e72;">LRN REFERENCE:</td>
                                    <td style="text-align: right; font-weight: bold;">{{ $student->lrn }}</td>
                                </tr>
                                <tr>
                                    <td style="font-weight: bold; color: #636e72;">STATUS:</td>
                                    <td style="text-align: right;">
                                        <span style="background-color: #ffeaa7; border: 1px solid #2d3436; padding: 2px 6px; font-weight: bold; color: #d35400;">PENDING</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="font-weight: bold; color: #636e72;">STRAND:</td>
                                    <td style="text-align: right;">{{ $student->strand->code ?? 'N/A' }}</td>
                                </tr>
                                {{-- ADDED: GRADE LEVEL --}}
                                <tr>
                                    <td style="font-weight: bold; color: #636e72;">GRADE LEVEL:</td>
                                    <td style="text-align: right;">{{ $student->grade_level }}</td>
                                </tr>
                                {{-- ADDED: SEMESTER --}}
                                <tr>
                                    <td style="font-weight: bold; color: #636e72;">SEMESTER:</td>
                                    <td style="text-align: right;">{{ $student->semester }}</td>
                                </tr>
                            </table>
                        </div>

                        {{-- SUBMISSION INSTRUCTIONS --}}
                        <div style="background-color: #dfe6e9; border: 2px dashed #2d3436; padding: 15px; margin-bottom: 25px;">
                            <strong style="display: block; font-size: 14px; color: #2d3436; text-transform: uppercase; margin-bottom: 10px;">
                                <span style="background-color: #2d3436; color: #fff; padding: 2px 5px;">NOTE</span> SUBMISSION INSTRUCTION:
                            </strong>
                            <p style="margin: 0; font-size: 13px; color: #2d3436;">
                                Please compile all physical documents in a <strong style="text-decoration: underline;">Long Yellow Folder</strong> with a plastic envelope.
                            </p>
                        </div>

                        <h4 style="border-bottom: 2px solid #2d3436; padding-bottom: 10px; font-size: 16px; margin-bottom: 15px;">REQUIREMENT CHECKLIST</h4>

                        {{-- CHECKLIST TABLE --}}
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px; border-collapse: collapse;">
                            @php
                                $rawReqs = $student->requirements;
                                if (is_string($rawReqs)) {
                                    $savedReqs = json_decode($rawReqs, true);
                                } elseif (is_array($rawReqs)) {
                                    $savedReqs = $rawReqs;
                                } else {
                                    $savedReqs = [];
                                }

                                $documents = [
                                    'PSA Birth Certificate'   => 'psa',
                                    'Form 137 / SF10'         => 'form137',
                                    'Good Moral Certificate'  => 'good_moral',
                                    'Diploma / Certificate'   => 'diploma',
                                    'Report Card (Form 138)'  => 'card'
                                ];

                                $isComplete = true;
                            @endphp

                            @foreach($documents as $label => $key)
                                @php
                                    $isVerified = !empty($savedReqs[$key]) && $savedReqs[$key] == true;
                                    if (!$isVerified) $isComplete = false;
                                @endphp
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #b2bec3; font-size: 13px; font-weight: bold; color: #2d3436;">
                                        {{ $label }}
                                    </td>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #b2bec3; text-align: right;">
                                        @if($isVerified)
                                            <span style="color: #00b894; font-weight: bold; font-size: 12px;">[ VERIFIED ]</span>
                                        @else
                                            <span style="color: #d63031; font-weight: bold; font-size: 12px;">[ TO FOLLOW ]</span>
                                        @endif
                                    </td>
                                </tr>
                            @endforeach
                        </table>

                        {{-- STATUS MESSAGE & ADVISORY --}}
                        @if($isComplete)
                            <div style="background-color: #dff9fb; border: 2px solid #2d3436; padding: 15px; text-align: center;">
                                <strong style="display: block; font-size: 16px; margin-bottom: 5px; color: #00b894;">✅ APPLICATION COMPLETE</strong>
                                <p style="margin: 0; font-size: 13px;">All requirements have been verified. Please proceed to the Registrar's Office to claim your Certificate of Registration (COR).</p>
                            </div>
                        @else
                            <div style="background-color: #ffeaa7; border: 2px solid #2d3436; padding: 15px; text-align: center;">
                                <strong style="display: block; font-size: 16px; margin-bottom: 5px; color: #d63031;">⚠️ PENDING REQUIREMENTS</strong>
                                {{-- UPDATED ADVISORY: NO DATE --}}
                                <p style="margin: 0; font-size: 13px;">Please go to the Registrar's Office to submit the missing documents.</p>
                            </div>
                        @endif

                        <p style="font-size: 14px; margin-top: 25px;">
                            Thank you for choosing our institution!
                        </p>
                    </div>

                    {{-- FOOTER --}}
                    <div style="background-color: #2d3436; color: #dfe6e9; padding: 15px; text-align: center; font-size: 11px;">
                        <p style="margin: 0 0 5px 0;">This is an automated system message. Please do not reply.</p>
                        <p style="margin: 0;">&copy; {{ date('Y') }} SmartEnroll System. All Rights Reserved.</p>
                    </div>

                </div>
            </td>
        </tr>
    </table>

</body>
</html>