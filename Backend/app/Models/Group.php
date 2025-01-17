<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; 

class Group extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'start_date',
        'user_id',
        'sale_agent_id'
    ];

    public function assignedPois()
    {
        return $this->hasMany(AssignedPoi::class, 'group_id', 'id');
    }
    public function salesAgent()
    {
        return $this->hasMany(SalesModel::class, 'user_id', 'user_id');
    }
}
