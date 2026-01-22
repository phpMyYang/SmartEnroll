<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEnrollmentRequest extends FormRequest
{
    public function authorize() { return true; }

    public function rules()
    {
        $studentId = $this->route('id'); // Get ID if updating

        return [
            'lrn' => ['required', 'digits:12', $studentId ? Rule::unique('students')->ignore($studentId) : 'unique:students,lrn'],
            'last_name' => 'required|string',
            'first_name' => 'required|string',
            'email' => ['required', 'email', $studentId ? Rule::unique('students')->ignore($studentId) : 'unique:students,email'],
            'contact_number' => 'required',
            'date_of_birth' => 'required|date',
            'strand_id' => 'required|exists:strands,id',
            // Allow other fields to be nullable or string
            'middle_name' => 'nullable', 'suffix' => 'nullable', 'gender' => 'required',
            'home_address' => 'required', 'guardian_name' => 'required', 'guardian_contact' => 'required'
        ];
    }
}