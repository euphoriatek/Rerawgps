<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Language extends Model
{
    use HasFactory;

    // Allow mass assignment for the following fields
    protected $fillable = ['code', 'name', 'is_default'];
    public $timestamps = false;
}
