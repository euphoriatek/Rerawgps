<?php

namespace App\Models;
use App\Models\Servers;
use Illuminate\Database\Eloquent\Model;


class AssigendServer extends Model
{
    protected $table = 'assigned_servers';

    protected $fillable = ['user_id', 'server_id'];

    public function server()
    {
        return $this->belongsTo(Servers::class, 'server_id', 'id');
    }
}
