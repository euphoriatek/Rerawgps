<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SaleAgent extends Model
{
    use HasFactory;
    protected $table = 'sale_agents';

    protected $fillable = ['name', 'email', 'password','is_deleted'];
     /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = ['password'];
    public $timestamps = true;
}

