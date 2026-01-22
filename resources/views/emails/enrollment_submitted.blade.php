<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enrollment Application Received</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Courier New', Courier, monospace; background-color: #eeeeee;">

    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;">
        <tr>
            <td style="padding: 20px 0; text-align: center;">
                
                <div style="max-width: 600px; margin: 0 auto; background-color: #fcfbf4; border: 3px solid #2d3436; padding: 0; box-shadow: 8px 8px 0px #2d3436; text-align: left;">
                    
                    <div style="background-color: #F4D03F; padding: 20px; border-bottom: 3px solid #2d3436; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; color: #2d3436;">
                            🎓 SmartEnroll
                        </h1>
                        <span style="font-size: 12px; font-weight: bold; background-color: #2d3436; color: #fff; padding: 2px 8px; margin-top: 5px; display: inline-block;">OFFICIAL NOTIFICATION</span>
                    </div>

                    <div style="padding: 30px;">
                        <p style="font-size: 16px; margin-bottom: 20px;">
                            Dear <strong>{{ strtoupper($student->first_name) }} {{ strtoupper($student->last_name) }}</strong>,
                        </p>

                        <p style="font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
                            We have received your enrollment application for <strong>Grade {{ $student->grade_level }}</strong>. Your records have been saved in our system.
                        </p>

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
                                <tr>
                                    <td style="font-weight: bold; color: #636e72;">SCHOOL YEAR:</td>
                                    <td style="text-align: right;">{{ $student->school_year }}</td>
                                </tr>
                                <tr>
                                    <td style="font-weight: bold; color: #636e72;">SEMESTER:</td>
                                    <td style="text-align: right;">{{ $student->semester }}</td>
                                </tr>
                            </table>
                        </div>

                        {{-- --- FIXED: ROBUST REQUIREMENTS LOGIC --- --}}
                        @php
                            // 1. KUNIN ANG DATA
                            $rawReqs = $student->requirements;

                            // 2. SAFETY CHECK: Kung String, i-decode. Kung Array na, gamitin agad.
                            if (is_string($rawReqs)) {
                                $savedReqs = json_decode($rawReqs, true);
                            } elseif (is_array($rawReqs)) {
                                $savedReqs = $rawReqs;
                            } else {
                                $savedReqs = []; // Fallback kung null
                            }

                            // 3. Define MASTER LIST
                            $masterList = [
                                'psa'        => 'PSA Birth Certificate (Original/Photocopy)',
                                'form137'    => 'Form 137 / SF10 (School Record)',
                                'good_moral' => 'Certificate of Good Moral Character',
                                'diploma'    => 'Diploma / Certificate of Completion',
                                'card'       => 'Report Card (Form 138)' 
                            ];

                            // 4. Check alin ang PENDING (Missing or False)
                            $pendingList = [];
                            
                            foreach ($masterList as $key => $label) {
                                // Kung wala sa database (isset false) O KAYA naka-set sa false -> PENDING 'YUN
                                if (empty($savedReqs[$key])) {
                                    $pendingList[] = $label;
                                }
                            }
                        @endphp

                        @if(count($pendingList) > 0)
                            <div style="background-color: #dff9fb; border: 2px dashed #2d3436; padding: 15px;">
                                <p style="margin: 0 0 10px 0; font-weight: bold; text-transform: uppercase;">
                                    <span style="background-color: #d63031; color: #fff; padding: 2px 5px;">MISSING</span> PENDING REQUIREMENTS:
                                </p>
                                <p style="font-size: 13px; margin-bottom: 10px;">
                                    Please submit the hard copies of the following to the Registrar's Office to complete your enrollment:
                                </p>
                                <ul style="font-size: 13px; padding-left: 20px; margin: 0; color: #d63031; font-weight: bold;">
                                    
                                    {{-- I-loop ang listahan ng mga kulang --}}
                                    @foreach($pendingList as $item)
                                        <li style="margin-bottom: 5px;">{{ $item }}</li>
                                    @endforeach
                                    
                                    {{-- Laging isama ang 2x2 ID bilang reminder --}}
                                    <li style="margin-bottom: 5px; color: #2d3436;">2x2 ID Picture (White Background)</li>
                                </ul>
                            </div>
                        @else
                            {{-- Lalabas lang ito kapag 0 ang laman ng pendingList (All True) --}}
                            <div style="background-color: #dff9fb; border: 2px dashed #2d3436; padding: 15px;">
                                <p style="margin: 0; font-weight: bold; text-transform: uppercase; color: #00b894;">
                                    <span style="background-color: #00b894; color: #fff; padding: 2px 5px;">COMPLETE</span> ALL REQUIREMENTS SUBMITTED
                                </p>
                                <p style="font-size: 13px; margin-top: 5px;">
                                    Thank you! Your enrollment requirements are complete. Please wait for further announcements.
                                </p>
                            </div>
                        @endif

                        <p style="font-size: 14px; margin-top: 25px;">
                            Thank you for choosing our institution!
                        </p>
                    </div>

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