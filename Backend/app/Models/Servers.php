<?php

namespace App\Models;
use App\Models\AssigendServer;
use Illuminate\Database\Eloquent\Model;


class Servers extends Model
{
    protected $table = 'servers';

    protected $fillable = ['name', 'server_url', 'platform'];
    public function assignedServers()
    {
        return $this->hasMany(AssigendServer::class, 'server_id', 'id');
    }
}
