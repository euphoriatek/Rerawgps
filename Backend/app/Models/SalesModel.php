<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesModel extends Model
{
    use HasFactory;
    protected $table = 'sales';

 protected $fillable = ['imei', 'name', 'user_id', 'expire', 'expire_date'];

    // You can also define casts for specific attributes, like dates
    protected $casts = [
        'expire_date' => 'date',
    ];
}
