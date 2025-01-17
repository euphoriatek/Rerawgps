<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssignedPoi extends Model
{
    use HasFactory;
    protected $table = 'assigned_pois';
    protected $fillable = ['group_id', 'pois_id','sale_agent_id'];
    public function poi()
    {
        return $this->belongsTo(Poi::class, 'pois_id', 'id');
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
