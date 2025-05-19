<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Poi extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'pois';
    protected $fillable = [
        'name',
        'poi_id',
        'regaykar_user_id',
        'description',
        'map_icon_id',
        'group_id',
        'group_name',
        'active',
        'status',
        'coordinates',
        'sales_agent_id'
    ];
    public $timestamps = true;
    public function groups()
    {
        return $this->hasMany(AssignedPoi::class, 'poi_id', 'id');
    }
    public function pendingGroups(){
        return $this->belongsTo(AssignedPoi::class, 'id', 'poi_id');
    }
  
}