<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Master List - {{ $section->name }}</title>
    <style>
        @page { margin: 30px 50px; }
        body {
            font-family: 'Courier New', Courier, monospace;
            font-size: 11pt;
            color: #000;
        }

        /* HEADER */
        .header-container { text-align: center; margin-bottom: 20px; }
        .logo { width: 80px; height: auto; margin-bottom: 5px; }
        .school-name { font-size: 16pt; font-weight: bold; text-transform: uppercase; }
        .school-address { font-size: 10pt; margin-top: 5px; text-transform: uppercase; }
        .contact-no { font-size: 10pt; margin-top: 2px; }

        .doc-title { text-align: center; font-weight: bold; text-decoration: underline; margin: 20px 0; font-size: 14pt; }

        /* INFO TABLE (UPDATED: NO LINES, STRAIGHT LAYOUT) */
        .meta-table { width: 100%; margin-bottom: 15px; font-size: 11pt; border-collapse: collapse; }
        .meta-table td { padding: 3px 0; vertical-align: top; }
        
        /* Labels are bold, Values are plain text (WALANG LINYA) */
        .meta-label { font-weight: bold; width: 15%; white-space: nowrap; }
        .meta-val { width: 35%; } /* Removed border-bottom here */

        /* STUDENTS TABLE */
        .students-table { width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 11pt; }
        .students-table th { border: 1px solid #000; padding: 5px; background: #eee; text-align: center; font-weight: bold; }
        .students-table td { border: 1px solid #000; padding: 4px; }
        .cat-row td { background-color: #ddd; font-weight: bold; padding-left: 10px; text-transform: uppercase; }

        /* FOOTER */
        .footer { margin-top: 40px; width: 100%; font-size: 10pt; }
        .signature-section { float: right; width: 250px; text-align: center; margin-top: 40px; }
        .signature-line { border-top: 1px solid #000; margin-bottom: 5px; }
    </style>
</head>
<body>
    @php
        $logoData = null;
        try {
            $path = public_path('images/logo.png');
            if (file_exists($path)) {
                $data = file_get_contents($path);
                $logoData = 'data:image/png;base64,' . base64_encode($data);
            }
        } catch (\Exception $e) {}
    @endphp

    {{-- HEADER --}}
    <div class="header-container">
        @if($logoData) <img src="{{ $logoData }}" class="logo"> <br> @endif
        <div class="school-name">HOLY FACE OF JESUS LYCEUM OF SAN JOSE INC.</div>
        <div class="school-address">
            R AND J BUILDING LOT 6 AND 8 BLOCK 9 MAYON AVENUE,<br>
            AMITYVILLE, SAN JOSE, RODRIGUEZ, RIZAL
        </div>
        <div class="contact-no">Contact No.: 09164369291</div>
    </div>

    <div class="doc-title">OFFICIAL CLASS MASTER LIST</div>

    {{-- SECTION INFO (CLEAN LAYOUT: WALANG LINYA) --}}
    <table class="meta-table">
        <tr>
            {{-- COLUMN 1 --}}
            <td class="meta-label">SECTION:</td>
            <td class="meta-val">{{ strtoupper($section->name) }}</td>
            
            {{-- COLUMN 2 --}}
            <td class="meta-label">SCHOOL YEAR:</td>
            <td class="meta-val">{{ $schoolYear }}</td>
        </tr>
        <tr>
            <td class="meta-label">STRAND:</td>
            <td class="meta-val">{{ $section->strand->code }}</td>
            
            <td class="meta-label">SEMESTER:</td>
            <td class="meta-val">{{ strtoupper($semester) }}</td>
        </tr>
        <tr>
            {{-- PINAGTABI KO NA DITO ANG GRADE LEVEL para "Isang Deretso" sa mata --}}
            <td class="meta-label">GRADE LEVEL:</td>
            <td class="meta-val" colspan="3">{{ $section->grade_level }}</td>
        </tr>
    </table>

    {{-- TABLE --}}
    <table class="students-table">
        <thead>
            <tr>
                <th width="8%">NO.</th>
                <th width="52%">FULL NAME</th>
                <th width="10%">SEX</th>
                <th width="30%">LRN</th>
            </tr>
        </thead>
        <tbody>
            {{-- MALE --}}
            <tr class="cat-row"><td colspan="4">MALE</td></tr>
            @forelse($males as $index => $s)
                <tr>
                    <td align="center">{{ $index + 1 }}</td>
                    <td>{{ strtoupper($s->last_name) }}, {{ strtoupper($s->first_name) }}</td>
                    <td align="center">M</td>
                    <td align="center">{{ $s->lrn }}</td>
                </tr>
            @empty
                <tr><td colspan="4" align="center" style="font-style: italic;">-- NO MALE STUDENTS --</td></tr>
            @endforelse

            {{-- FEMALE --}}
            <tr class="cat-row"><td colspan="4">FEMALE</td></tr>
            @forelse($females as $index => $s)
                <tr>
                    <td align="center">{{ $index + 1 }}</td>
                    <td>{{ strtoupper($s->last_name) }}, {{ strtoupper($s->first_name) }}</td>
                    <td align="center">F</td>
                    <td align="center">{{ $s->lrn }}</td>
                </tr>
            @empty
                <tr><td colspan="4" align="center" style="font-style: italic;">-- NO FEMALE STUDENTS --</td></tr>
            @endforelse
        </tbody>
    </table>

    {{-- FOOTER --}}
    <div class="footer">
        <div style="float: left;">
            Generated by: {{ $printedBy }} <br>
            Date: {{ now()->format('F d, Y h:i A') }}
        </div>
        
        <div class="signature-section">
            <div class="signature-line"></div>
            <div style="font-weight: bold; text-transform: uppercase;">CLASS ADVISER</div>
            <div style="font-size: 9pt; font-style: italic;">(Signature over Printed Name)</div>
        </div>
    </div>
</body>
</html>