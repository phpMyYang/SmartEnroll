<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class UserCredentialsMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $password;
    public $verificationUrl;

    // Tanggapin ang data mula sa Controller
    public function __construct($user, $password, $verificationUrl)
    {
        $this->user = $user;
        $this->password = $password;
        $this->verificationUrl = $verificationUrl;
    }

    public function build()
    {
        return $this->subject('Welcome to SmartEnroll - Account Credentials')
                    ->view('emails.credentials'); // Ito ang blade view na gagawin natin
    }
}