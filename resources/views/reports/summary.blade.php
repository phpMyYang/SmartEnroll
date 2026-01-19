<!DOCTYPE html>
<html>
<head>
    <title>{{ $title }}</title>
    <style>
        /* PAGE SETTINGS: LEGAL PORTRAIT (8.5in x 14in) */
        @page { margin: 40px 50px; size: 8.5in 14in; } 
        
        body {
            /* FONT: Courier New for Retro/Technical Feel */
            font-family: 'Courier New', Courier, monospace;
            font-size: 11pt;
            color: #000;
            line-height: 1.3;
        }

        /* UTILITIES */
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        .uppercase { text-transform: uppercase; }
        .underline { text-decoration: underline; }

        /* HEADER */
        .header-container { text-align: center; margin-bottom: 20px; }
        .logo { width: 80px; height: auto; margin-bottom: 5px; }
        .school-name { font-size: 16pt; font-weight: bold; font-family: 'Courier New', Courier, monospace; }
        .school-addr { font-size: 9pt; font-family: 'Courier New', Courier, monospace; }

        /* LETTER META */
        .letter-meta { margin-bottom: 20px; margin-top: 30px; }
        
        /* DATA TABLES */
        table.data-table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 15px; font-size: 11pt; }
        table.data-table th, table.data-table td { border: 1px solid #000; padding: 6px; }
        
        /* ALIGNMENT FIXES */
        table.data-table th { background-color: #e0e0e0; text-align: center; font-weight: bold; }
        table.data-table td.label-col { text-align: left; } 
        table.data-table td.count-col { text-align: center; font-weight: bold; }

        /* SUMMARY BOX */
        .summary-box { 
            border: 2px solid #000; 
            padding: 10px; 
            text-align: center; 
            margin: 20px auto; 
            width: 50%;
            background: #f9f9f9;
        }

        /* SIGNATORIES LAYOUT (Fixed Centering) */
        .sig-table { width: 100%; margin-top: 50px; border: none; page-break-inside: avoid; }
        
        /* ✅ KEY FIX: Both columns are centered text-align */
        .sig-table td { 
            border: none; 
            vertical-align: top; 
            padding: 0; 
            text-align: center; 
        }
        
        .sig-name { 
            font-weight: bold; 
            text-transform: uppercase; 
            margin-top: 40px; 
            border-top: 1px solid #000; 
            display: inline-block; 
            width: 80%; /* Line width relative to column */
            padding-top: 5px;
            text-align: center;
        }
        .sig-role { font-size: 10pt; font-style: italic; display: block; margin: 0 auto;}

        /* FOOTER (Bottom of the document only) */
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 8pt;
            font-style: italic;
            border-top: 1px solid #ccc;
            padding-top: 10px;
            color: #555;
            page-break-inside: avoid;
        }
    </style>
</head>
<body>

    {{-- 1. LETTERHEAD --}}
    <div class="header-container">
        @if(isset($logo_path))
            <img src="{{ $logo_path }}" class="logo"><br>
        @endif
        <div class="school-name uppercase">HOLY FACE OF JESUS LYCEUM OF SAN JOSE INC.</div>
        <div class="school-addr uppercase">
            R AND J BUILDING LOT 6 AND 8 BLOCK 9 MAYON AVENUE,<br>
            AMITYVILLE, SAN JOSE, RODRIGUEZ, RIZAL
        </div>
        <div class="school-addr">Contact No.: 09164369291</div>
    </div>

    <hr style="border: 1px solid #000;">

    {{-- 2. LETTER BODY --}}
    <div class="letter-meta">
        <p><strong>Date:</strong> {{ $date_generated }}</p>
        <p><strong>To:</strong> The School Administrator</p>
        <p class="text-center font-bold underline uppercase" style="font-size: 14pt; margin: 30px 0;">
            SUBJECT: {{ $title }} FOR S.Y. {{ $school_year }}
        </p>
    </div>

    <p style="text-align: justify; text-indent: 40px;">
        This document serves as the official report regarding the <strong>{{ strtolower($title) }}</strong> of HFJLSJI for the School Year <strong>{{ $school_year }}</strong>. 
        {{ $description ?? 'Please find the detailed statistical breakdown below.' }}
    </p>

    {{-- 3. TOTAL SUMMARY --}}
    <div class="summary-box">
        <span style="font-size: 10pt;">GRAND TOTAL COUNT</span><br>
        <strong style="font-size: 20pt;">{{ $total }}</strong>
    </div>

    {{-- 4. DETAILED TABLES --}}
    
    {{-- Grade Level --}}
    <div class="font-bold uppercase" style="margin-top: 20px;">I. Breakdown by Grade Level</div>
    <table class="data-table">
        <thead>
            <tr>
                <th width="70%">Grade Level Category</th>
                <th width="30%">Student Count</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="label-col">Freshmen (Grade 11)</td>
                <td class="count-col">{{ $freshmen }}</td>
            </tr>
            <tr>
                <td class="label-col">Old Students (Grade 12)</td>
                <td class="count-col">{{ $old_students }}</td>
            </tr>
            <tr style="background: #f0f0f0;">
                <td class="text-right font-bold">SUBTOTAL</td>
                <td class="count-col">{{ $freshmen + $old_students }}</td>
            </tr>
        </tbody>
    </table>

    {{-- Strands --}}
    <div class="font-bold uppercase">II. Breakdown by Academic Strand</div>
    <table class="data-table">
        <thead>
            <tr>
                <th width="70%">Strand Code</th>
                <th width="30%">Student Count</th>
            </tr>
        </thead>
        <tbody>
            @forelse($by_strand as $code => $count)
            <tr>
                <td class="label-col">{{ $code }}</td>
                <td class="count-col">{{ $count }}</td>
            </tr>
            @empty
            <tr><td colspan="2" class="text-center">No data available.</td></tr>
            @endforelse
        </tbody>
    </table>

    {{-- Sections --}}
    <div class="font-bold uppercase">III. Breakdown by Section</div>
    <table class="data-table">
        <thead>
            <tr>
                <th width="70%">Section Name</th>
                <th width="30%">Student Count</th>
            </tr>
        </thead>
        <tbody>
            @forelse($by_section as $name => $count)
            <tr>
                <td class="label-col">{{ $name }}</td>
                <td class="count-col">{{ $count }}</td>
            </tr>
            @empty
            <tr><td colspan="2" class="text-center">No data available.</td></tr>
            @endforelse
        </tbody>
    </table>

    <p style="text-align: center; margin-top: 30px;">*** NOTHING FOLLOWS ***</p>

    {{-- 5. SIGNATORIES (Balanced Layout) --}}
    <table class="sig-table">
        <tr>
            {{-- LEFT COLUMN --}}
            <td width="50%">
                <p>Prepared & Generated by:</p>
                <div class="sig-name">{{ strtoupper($generated_by) }}</div><br>
                <span class="sig-role">System Administrator / Staff</span>
            </td>
            
            {{-- RIGHT COLUMN (Now identically centered as the left) --}}
            <td width="50%">
                <p>Certified Correct by:</p>
                <div class="sig-name">{{ strtoupper($registrar) }}</div><br>
                <span class="sig-role">School Registrar</span>
            </td>
        </tr>
    </table>

    {{-- 6. FOOTER --}}
    <div class="footer">
        This document is a system-generated report and serves as an official record of SmartEnroll Academy.<br>
        Any alteration, erasure, or tampering of this document is punishable under <br>
        <strong>Republic Act No. 10175 (Cybercrime Prevention Act of 2012)</strong> and <strong>Article 172 of the Revised Penal Code</strong>.<br>
        Report ID: {{ uniqid() }} | Generated on: {{ $date_generated }}
    </div>

</body>
</html>