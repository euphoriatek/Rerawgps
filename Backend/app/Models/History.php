<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class History extends Model
{
    use HasFactory;

    protected $table = 'history';

    protected $fillable = [
        'group_id',
        'sale_agent_id',
        'pois_id',
        'user_id',
        'plan_id'
    ];
    public function pois()
    {
        return $this->hasMany(Poi::class, 'id', 'pois_id');
    }
    public function group()
    {
        return $this->belongsTo(Group::class, 'group_id', 'id');
    }
    public function salesAgent()
    {
        return $this->belongsTo(SalesModel::class, 'sale_agent_id', 'id');
    }
}
