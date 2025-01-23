<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Poi extends Model
{
    use HasFactory;
    protected $table = 'pois';
    protected $fillable = [
        'name',
        'poi_id',
        'regaykar_user_id',
        'description',
        'map_icon_id',
        'active',
        'status',
        'coordinates'
    ];
    public $timestamps = true;
    public function groups()
    {
        return $this->hasMany(AssignedPoi::class, 'poi_id', 'id');
    }
  
}