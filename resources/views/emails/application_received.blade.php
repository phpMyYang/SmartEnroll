<!DOCTYPE html>
<html>
<body>
    <h2>Hi {{ $student->first_name }},</h2>
    <p>We received your application on {{ $student->created_at->format('F d, Y') }}.</p>
    
    <div style="background: #fff3cd; padding: 15px; border: 1px solid #ffeeba;">
        <strong>NOTE:</strong> Please put your requirements in a <u>Long Yellow Folder</u>.
        Use your LRN: <strong>{{ $student->lrn }}</strong> to check status.
    </div>

    <h3>Requirement Status:</h3>
    <ul>
        <li>PSA Birth Certificate: {{ $student->requirements['psa'] ? '✅ COMPLETED' : '❌ TO FOLLOW' }}</li>
        <li>Diploma: {{ $student->requirements['diploma'] ? '✅ COMPLETED' : '❌ TO FOLLOW' }}</li>
        <li>Form 137: {{ $student->requirements['form137'] ? '✅ COMPLETED' : '❌ TO FOLLOW' }}</li>
        <li>Good Moral: {{ $student->requirements['good_moral'] ? '✅ COMPLETED' : '❌ TO FOLLOW' }}</li>
    </ul>

    @php
        $reqs = $student->requirements;
        $complete = $reqs['psa'] && $reqs['diploma'] && $reqs['form137'] && $reqs['good_moral'];
    @endphp

    @if($complete)
        <p style="color: green; font-weight: bold;">ALL REQUIREMENTS COMPLETED! Please proceed to the Registrar to get your COR.</p>
    @else
        <p style="color: red;">Please visit the Registrar on {{ now()->addDays(3)->format('F d, Y') }} to submit missing documents.</p>
    @endif
</body>
</html>