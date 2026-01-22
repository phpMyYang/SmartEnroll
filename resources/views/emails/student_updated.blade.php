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

                            $masterList = [
                                'psa'        => 'PSA Birth Certificate',
                                'form137'    => 'Form 137 / SF10',
                                'good_moral' => 'Good Moral Certificate',
                                'diploma'    => 'Diploma / Certificate',
                                'card'       => 'Report Card (Form 138)'
                            ];

                            $pendingList = [];
                            foreach ($masterList as $key => $label) {
                                if (empty($savedReqs[$key]) || $savedReqs[$key] != true) {
                                    $pendingList[] = $label;
                                }
                            }
                        @endphp

                        @if(count($pendingList) === 0)
                            <div style="background-color: #dff9fb; border: 2px solid #2d3436; padding: 15px; text-align: center;">
                                <strong style="display: block; font-size: 16px; margin-bottom: 5px; color: #00b894;">✅ REQUIREMENTS COMPLETE</strong>
                                <p style="margin: 0; font-size: 13px;">Congratulations! Your enrollment requirements are fully complied.</p>
                            </div>
                        @else
                            <div style="background-color: #ffeaa7; border: 2px solid #2d3436; padding: 15px;">
                                <strong style="display: block; font-size: 16px; margin-bottom: 10px; color: #d63031; text-align: center;">⚠️ MISSING REQUIREMENTS</strong>
                                <ul style="font-size: 13px; padding-left: 20px; margin: 0; color: #d63031; font-weight: bold;">
                                    @foreach($pendingList as $item)
                                        <li style="margin-bottom: 3px;">{{ $item }}</li>
                                    @endforeach
                                </ul>
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