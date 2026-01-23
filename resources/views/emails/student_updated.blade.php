<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Record Updated | SmartEnroll</title>
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
                        <span style="font-size: 12px; font-weight: bold; background-color: #2d3436; color: #fff; padding: 2px 8px; margin-top: 5px; display: inline-block;">RECORD UPDATE</span>
                    </div>

                    <div style="padding: 30px;">
                        <p style="font-size: 16px; margin-bottom: 20px;">
                            Dear <strong>{{ strtoupper($student->first_name) }} {{ strtoupper($student->last_name) }}</strong>,
                        </p>

                        <p style="font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
                            This is to inform you that your enrollment record has been updated by the school administration.
                        </p>

                        {{-- SUMMARY OF CHANGES --}}
                        <div style="background-color: #dfe6e9; border: 2px dashed #2d3436; padding: 15px; margin-bottom: 25px;">
                            <strong style="display: block; font-size: 14px; color: #2d3436; text-transform: uppercase; margin-bottom: 10px;">
                                <span style="background-color: #2d3436; color: #fff; padding: 2px 5px;">INFO</span> SUMMARY OF CHANGES:
                            </strong>
                            
                            <table width="100%" cellpadding="5" cellspacing="0" style="font-size: 13px;">
                                @foreach($changes as $key => $value)
                                    <tr>
                                        <td style="font-weight: bold; color: #636e72; width: 40%; vertical-align: top;">
                                            {{ ucfirst(str_replace('_', ' ', $key)) }}:
                                        </td>
                                        <td style="color: #2d3436; font-weight: bold; vertical-align: top;">
                                            {{ is_array($value) ? 'Updated' : $value }}
                                        </td>
                                    </tr>
                                @endforeach
                            </table>
                        </div>

                        <h4 style="border-bottom: 2px solid #2d3436; padding-bottom: 10px; font-size: 16px; margin-bottom: 15px;">REQUIREMENT STATUS</h4>

                        {{-- CHECKLIST LOGIC --}}
                        @php
                            $rawReqs = $student->requirements;
                            if (is_string($rawReqs)) {
                                $savedReqs = json_decode($rawReqs, true);
                            } elseif (is_array($rawReqs)) {
                                $savedReqs = $rawReqs;
                            } else {
                                $savedReqs = [];
                            }

                            $isComplete = true;

                            // 1. PRIORITY REQUIREMENTS (Added 2x2 Picture)
                            $priorityDocs = [
                                'PSA Birth Certificate'   => 'psa',
                                'Report Card (Form 138)'  => 'card',
                                '2x2 Picture (2pcs)'      => 'picture' 
                            ];

                            // 2. SUPPORTING DOCUMENTS
                            $supportingDocs = [
                                'Form 137 / SF10'         => 'form137',
                                'Good Moral Certificate'  => 'good_moral',
                                'Diploma / Certificate'   => 'diploma'
                            ];
                        @endphp

                        {{-- SECTION 1: PRIORITY REQUIREMENTS --}}
                        <h4 style="border-bottom: 2px solid #d63031; padding-bottom: 5px; font-size: 14px; margin-bottom: 10px; color: #d63031; text-transform: uppercase;">
                            🚨 Priority Requirements
                        </h4>
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px; border-collapse: collapse;">
                            @foreach($priorityDocs as $label => $key)
                                @php
                                    $isVerified = !empty($savedReqs[$key]) && $savedReqs[$key] == true;
                                    if (!$isVerified) $isComplete = false;
                                @endphp
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #fab1a0; font-size: 13px; font-weight: bold; color: #2d3436;">
                                        {{ $label }} <span style="color: #d63031;">*</span>
                                    </td>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #fab1a0; text-align: right;">
                                        @if($isVerified)
                                            <span style="color: #00b894; font-weight: bold; font-size: 12px;">[ VERIFIED ]</span>
                                        @else
                                            <span style="background-color: #d63031; color: #fff; padding: 2px 6px; font-weight: bold; font-size: 10px; border-radius: 2px;">REQUIRED</span>
                                        @endif
                                    </td>
                                </tr>
                            @endforeach
                        </table>

                        {{-- SECTION 2: SUPPORTING DOCUMENTS --}}
                        <h4 style="border-bottom: 2px solid #2d3436; padding-bottom: 5px; font-size: 14px; margin-bottom: 10px; color: #2d3436; text-transform: uppercase;">
                            📄 Supporting Documents
                        </h4>
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px; border-collapse: collapse;">
                            @foreach($supportingDocs as $label => $key)
                                @php
                                    $isVerified = !empty($savedReqs[$key]) && $savedReqs[$key] == true;
                                    if (!$isVerified) $isComplete = false;
                                @endphp
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #b2bec3; font-size: 13px; font-weight: bold; color: #636e72;">
                                        {{ $label }}
                                    </td>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #b2bec3; text-align: right;">
                                        @if($isVerified)
                                            <span style="color: #00b894; font-weight: bold; font-size: 12px;">[ VERIFIED ]</span>
                                        @else
                                            <span style="color: #636e72; font-weight: bold; font-size: 11px;">[ TO FOLLOW ]</span>
                                        @endif
                                    </td>
                                </tr>
                            @endforeach
                        </table>

                        {{-- STATUS MESSAGE --}}
                        @if($isComplete)
                            <div style="background-color: #dff9fb; border: 2px solid #2d3436; padding: 15px; text-align: center;">
                                <strong style="display: block; font-size: 16px; margin-bottom: 5px; color: #00b894;">✅ REQUIREMENTS COMPLETE</strong>
                                <p style="margin: 0; font-size: 13px;">Congratulations! Your enrollment requirements are fully complied.</p>
                            </div>
                        @else
                            <div style="background-color: #ffeaa7; border: 2px solid #2d3436; padding: 15px; text-align: center;">
                                <strong style="display: block; font-size: 16px; margin-bottom: 5px; color: #d63031;">⚠️ PENDING REQUIREMENTS</strong>
                                <p style="margin: 0; font-size: 13px;">Please submit the missing documents to the Registrar's Office.</p>
                            </div>
                        @endif

                        {{-- ADVISORY BOX --}}
                        <div style="background-color: #dfe6e9; border: 2px dashed #2d3436; padding: 15px; margin-top: 20px; text-align: center; border-radius: 5px;">
                            <strong style="display: block; font-size: 14px; color: #2d3436; text-transform: uppercase; margin-bottom: 5px;">📢 Important Advisory</strong>
                            <p style="margin: 0; font-size: 13px; font-weight: bold; color: #2d3436;">
                                Please go to the Registrar's Office to complete the enrollment.
                            </p>
                        </div>

                        <p style="font-size: 14px; margin-top: 25px;">
                            If you have questions, please visit the Registrar's Office.
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