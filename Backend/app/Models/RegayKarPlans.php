<?php

namespace App\Models;
use App\Models\Group;
use App\Models\SalesModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; 

class RegayKarPlans extends Model
{
    protected $table = 'regaykar_plans';
    use HasFactory,SoftDeletes;

    protected $fillable = [
        'group_id',
        'user_id',
        'sale_agent_id',
        'activation_date'
    ];

    public function group()
    {
        return $this->belongsTo(Group::class, 'group_id', 'id');
    }
    public function sales()
    {
        return $this->belongsTo(SalesModel::class, 'sale_agent_id', 'id');
    }
}
