<?php
use App\Models\JobPosting;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$jobCategory = 'pharmaceutical & healthcare';
$jobContext = 'pharmacist pharmaceutical & healthcare medical';

// Expanded dictionary from ApplicationController
$categoryKeywords = [
    'pharmaceutical & healthcare' => [
        'pharmacy', 'pharmacist', 'pharmacology', 'drug', 'medicine', 'medication',
        'doctor', 'physician', 'surgeon', 'surgery', 'specialist',
        'nurse', 'nursing', 'midwife', 'midwifery',
        'dentist', 'dental', 'dentistry', 'orthodontist',
        'medical', 'medicine', 'health', 'healthcare', 'clinic', 'clinical',
        'hospital', 'ward', 'icu', 'emergency', 'radiology', 'radiologist',
        'therapist', 'therapy', 'physiotherapy', 'physiotherapist',
        'optometrist', 'optometry', 'ophthalmology',
        'lab', 'laboratory', 'pathology', 'pathologist',
        'public health', 'community health', 'epidemiology',
        'biology', 'biochemistry', 'biomedical',
        'mbbs', 'md', 'bsc nursing', 'bpharm', 'mpharm', 'pharm',
        'bsc pharmacy', 'bsc health', 'bsc medicine',
        'medical school', 'health science', 'health sciences',
        'pharamcy', 'pharmasist', 'pharmacyst', 'nurce', 'docter',
        'medicin', 'helath', 'healtcare',
    ]
];

$targetKeywords = $categoryKeywords['pharmaceutical & healthcare'];

$testBackgrounds = [
    "nursing doctor",
    "bsc nursing",
    "docter and nurce",
    "sales manager",
    "software engineer",
    "pharmasist"
];

echo "Testing Category: {$jobCategory}\n----------------------\n";

foreach ($testBackgrounds as $bg) {
    preg_match_all('/\b\w{2,}\b/', strtolower($bg), $candMatches);
    $candidateWords = array_unique($candMatches[0]);

    $hasIntersection = false;
    $intersection = array_intersect($candidateWords, $targetKeywords);
    
    // Also check for exact multi-word phrases (like "bsc nursing")
    foreach($targetKeywords as $kw) {
        if (str_contains(strtolower($bg), strtolower($kw))) {
             $hasIntersection = true;
             $intersection[] = "[$kw (phrase match)]";
             break;
        }
    }

    if (count($intersection) > 0) {
        $hasIntersection = true;
    }

    $status = $hasIntersection ? "SUBMITTED" : "POOLED";
    echo str_pad("Background: '$bg'", 35) . " -> " . str_pad($status, 10) . " (Matches: " . implode(', ', $intersection) . ")\n";
}
