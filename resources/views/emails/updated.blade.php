<!DOCTYPE html>
<html>
<head>
    <title>Account Updated</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f6f9; padding: 20px;">
    
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
        <h2 style="color: #2980b9; text-align: center;">Account Details Updated</h2>
        
        <p>Hello <strong>{{ $user->name }}</strong>,</p>
        
        <p>Your account information has been updated by the administrator. Below are the specific details that were changed:</p>
        
        <div style="background-color: #f8f9fa; border-left: 4px solid #2980b9; padding: 15px; margin: 20px 0;">
            <h3 style="margin-top: 0; font-size: 16px; color: #555;">Summary of Changes:</h3>
            
            <ul style="padding-left: 20px; color: #333;">
                @foreach($changes as $field => $newValue)
                    <li style="margin-bottom: 10px; line-height: 1.5;">
                        <strong style="text-transform: capitalize; color: #555;">
                            {{ str_replace('_', ' ', $field) }}:
                        </strong> 
                        
                        @if($field === 'password')
                            <div style="display: inline-block; background: #e8f0fe; border: 1px solid #b3d7ff; color: #004085; padding: 4px 10px; border-radius: 4px; font-family: monospace; font-weight: bold; margin-left: 5px;">
                                {{ $newValue }}
                            </div>
                            <span style="font-size: 11px; color: #e74c3c; margin-left: 5px;">(Keep this safe!)</span>

                        @elseif($field === 'status')
                            <span style="font-weight: bold; color: {{ $newValue == 'active' ? 'green' : 'red' }}; text-transform: uppercase;">
                                {{ $newValue }}
                            </span>
                        @else
                            <span style="color: #333;">{{ $newValue }}</span>
                        @endif
                    </li>
                @endforeach
            </ul>
        </div>

        <p>Current Account Status: <strong style="text-transform: uppercase;">{{ $user->status }}</strong></p>

        @if($user->status === 'inactive')
            <div style="background-color: #ffeeba; color: #856404; padding: 10px; border-radius: 4px; font-size: 13px;">
                <strong>Notice:</strong> Your account is currently inactive. You will not be able to log in until it is reactivated.
            </div>
        @endif

        <div style="margin-top: 30px; font-size: 12px; color: #7f8c8d;">
            <p>If you did not request these changes, please contact the System Administrator immediately.</p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;">
        <p style="text-align: center; font-size: 11px; color: #aaa;">
            © {{ date('Y') }} SmartEnroll System
        </p>
    </div>

</body>
</html>