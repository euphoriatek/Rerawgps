<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Str;
class SalesModel extends Authenticatable
{
    use HasApiTokens, HasFactory;
    protected $table = 'sales';
    protected $fillable = ['name', 'username', 'password', 'user_id'];
    protected $hidden = ['remember_token'];
    /**
     * Create a token and store it in the `sales_access_tokens` table.
     *
     * @param string $name
     * @param array $abilities
     * @return string
     */
 
    
}
