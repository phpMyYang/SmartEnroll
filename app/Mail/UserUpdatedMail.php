<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class UserUpdatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $changes; // Array ng mga nabago

    public function __construct($user, $changes = [])
    {
        $this->user = $user;
        $this->changes = $changes;
    }

    public function build()
    {
        return $this->subject('Account Information Updated')
                    ->view('emails.updated');
    }
}