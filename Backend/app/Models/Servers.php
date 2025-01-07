<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Servers extends Model
{
    protected $table = 'servers';

    protected $fillable = ['name', 'server_url'];

}
