<?php
namespace App\Http\Controllers;

use App\Models\Translation;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\ValidationException;
class TranslationController extends Controller
{
    public function store(Request $request)
    {
        try {
           
            $validated = $request->validate([
                'key_name' => 'required|string|max:255',
                'language_code' => 'required|string|size:2',  
                'value' => 'required|string',
            ]);
            $translation = Translation::create([
                'key_name' => $validated['key_name'],
                'language_code' => $validated['language_code'],
                'value' => $validated['value'],
            ]);
    
            return response()->json([
                'status' => true,
                'message' => 'success',
                'data' => $translation
            ], 200);
    
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to add translation.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function getTranslation(Request $request)
    {

        try {
            $input =$request->all();
            $translation = Translation::where('language_code', $input['code'])->get();

            if ($translation) {
                return response()->json([
                    'status' => true,
                    'message' => 'success',
                    "data"=>$translation
                ], 200);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Fails',
                    'error' => 'Translation not found'
                ], 400);
            }

        }catch (\Exception $e) {
            return response()->json([
                'status'=>false,
                'error' => 'An unexpected error occurred',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}


