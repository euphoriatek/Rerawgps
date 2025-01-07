<?php

namespace App\Models;
use App\Models\Servers;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class AssigendServer extends Model
{
    use SoftDeletes;
    protected $table = 'assigned_servers';
    protected $fillable = ['user_id', 'server_id'];
    public function server()
    {
        return $this->belongsTo(Servers::class, 'server_id', 'id');
    }
}
