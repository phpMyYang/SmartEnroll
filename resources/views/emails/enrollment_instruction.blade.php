<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Courier New', Courier, monospace; background-color: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border: 2px solid #000; box-shadow: 4px 4px 0px #000; }
        .header { background-color: #3C909E; color: white; padding: 15px; text-align: center; border-bottom: 2px solid #000; }
        .content { padding: 20px; color: #333; }
        .btn { display: inline-block; padding: 12px 24px; background-color: #F4D03F; color: #000; text-decoration: none; font-weight: bold; border: 2px solid #000; box-shadow: 2px 2px 0px #000; margin-top: 20px; }
        .btn:hover { background-color: #f1c40f; transform: translate(1px, 1px); box-shadow: 1px 1px 0px #000; }
        .details { background-color: #f9f9f9; border: 1px solid #ddd; padding: 10px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 style="margin:0;">SMARTENROLL SYSTEM</h2>
        </div>
        <div class="content">
            <h3>Congratulations, {{ $student->first_name }}!</h3>
            <p>We are pleased to inform you that you have <strong>PASSED</strong> the Entrance Examination / Evaluation.</p>

            <div class="details">
                <p><strong>Applicant Name:</strong> {{ $student->last_name }}, {{ $student->first_name }}</p>
                <p><strong>Grade Level:</strong> Grade {{ $student->grade_level }}</p>
                <p><strong>Track/Strand:</strong> {{ $student->strand->code ?? 'N/A' }}</p>
            </div>

            <p>You may now proceed to the next step of your enrollment. Please follow the instructions below based on your level:</p>

            <hr style="border: 1px dashed #000;">

            <h4>📝 ENROLLMENT INSTRUCTIONS</h4>
            
            <p><strong>FOR GRADE 11 (New Enrollees):</strong></p>
            <ul>
                <li>Click the button below to proceed to the Enrollment Landing Page.</li>
                <li>Review your student details.</li>
                <li>Select your block/schedule for the <strong>1st Semester</strong>.</li>
            </ul>

            <p><strong>FOR GRADE 11 (Moving to 2nd Sem) & GRADE 12:</strong></p>
            <ul>
                <li>Proceed to the Landing Page using the link below.</li>
                <li>Validate your grades from the previous semester.</li>
                <li>Select your subjects for the upcoming semester.</li>
            </ul>

            <center>
                <a href="{{ url('/') }}" class="btn">PROCEED TO ENROLLMENT PAGE</a>
            </center>

            <br><br>
            <p style="font-size: 12px; color: #666;">Note: Please bring your original requirements (Report Card, Good Moral, PSA, etc.) to the Registrar's Office for verification.</p>
        </div>
    </div>
</body>
</html>