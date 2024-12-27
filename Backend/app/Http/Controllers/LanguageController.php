<?php
namespace App\Http\Controllers;
use App\Models\Language;
use Illuminate\Http\Request;

class LanguageController extends Controller
{
    // Store a new language
    public function store(Request $request)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'code' => 'required|string|max:10|unique:languages,code', 
            'name' => 'required|string|max:100',
            'is_default' => 'nullable|boolean', 
        ]);
       
        $validated['is_default'] = $validated['is_default'] ?? false;   
        $language = Language::create($validated);

        return response()->json([
            'status' => true,
            'message' => 'success',
            'data' => $language
        ], 200);
    } 
}

