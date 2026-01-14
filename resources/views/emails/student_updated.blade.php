<!DOCTYPE html>
<html>
<body>
    <h2>Information Updated</h2>
    <p>Hi {{ $student->first_name }}, your record has been updated by the admin.</p>

    <h3>Changes Made:</h3>
    <ul>
        @foreach($changes as $key => $value)
            <li><strong>{{ ucfirst(str_replace('_', ' ', $key)) }}:</strong> {{ is_array($value) ? 'Updated' : $value }}</li>
        @endforeach
    </ul>

    @php
        $reqs = $student->requirements;
        $complete = $reqs['psa'] && $reqs['diploma'] && $reqs['form137'] && $reqs['good_moral'];
    @endphp

    @if($complete)
        <p style="color: green;"><strong>Congratulations! Your requirements are now complete.</strong></p>
    @else
        <p style="color: red;"><strong>You still have missing requirements.</strong></p>
    @endif
</body>
</html>