<?php
namespace App\Models;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\SoftDeletes;
class SalesModel extends Authenticatable
{
    use HasApiTokens, HasFactory, SoftDeletes;
    protected $table = 'sales';
    protected $fillable = ['name', 'username', 'password', 'user_id'];
    protected $hidden = ['remember_token', 'password'];
    /**
     * Create a token and store it in the `sales_access_tokens` table.
     *
     * @param string $name
     * @param array $abilities
     * @return string
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
    public function groups()
    {
        return $this->hasMany(AssignedPoi::class, 'sale_agent_id', 'id');
    }
}
