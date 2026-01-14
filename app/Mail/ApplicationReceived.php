<?php
namespace App\Mail;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Student;

class ApplicationReceived extends Mailable
{
    use Queueable, SerializesModels;

    public $student;

    public function __construct(Student $student) 
    { 
        $this->student = $student; 
    }

    public function envelope(): Envelope 
    { 
        return new Envelope(subject: 'Application Received'); 
    }

    public function content(): Content 
    { 
        return new Content(view: 'emails.application_received'); 
    }
}