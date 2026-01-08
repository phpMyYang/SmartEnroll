<?php

namespace App\Http\Controllers;

use App\Models\Strand;
use Illuminate\Http\Request;

class StrandController extends Controller
{
    // ✅ GET: Kunin lahat ng strands
    public function index()
    {
        // I-return natin na naka-sort mula sa pinakabago
        return Strand::latest()->get();
    }

    // ✅ POST: Mag-save ng bagong strand
    public function store(Request $request)
    {
        // Validation
        $validated = $request->validate([
            'code' => 'required|unique:strands,code|max:20', // Dapat unique ang code (e.g., STEM)
            'description' => 'required|string',
        ]);

        // Create
        $strand = Strand::create($validated);

        return response()->json([
            'message' => 'Strand created successfully',
            'strand' => $strand
        ]);
    }

    // ✅ PUT: Mag-update ng existing strand
    public function update(Request $request, $id)
    {
        $strand = Strand::find($id);

        if (!$strand) {
            return response()->json(['message' => 'Strand not found'], 404);
        }

        // Validation (Ignore current ID sa unique check para di mag-error kung di pinalitan ang code)
        $validated = $request->validate([
            'code' => 'required|max:20|unique:strands,code,' . $id,
            'description' => 'required|string',
        ]);

        // Update
        $strand->update($validated);

        return response()->json([
            'message' => 'Strand updated successfully',
            'strand' => $strand
        ]);
    }

    // ✅ DELETE: Magbura ng strand
    public function destroy($id)
    {
        $strand = Strand::find($id);

        if ($strand) {
            $strand->delete();
            return response()->json(['message' => 'Strand deleted successfully']);
        }

        return response()->json(['message' => 'Strand not found'], 404);
    }
}