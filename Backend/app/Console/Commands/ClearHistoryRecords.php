<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ClearHistoryRecords extends Command
{
    protected $signature = 'history-records';
    protected $description = 'Clear History Records';

    public function handle()
    {
        $users = DB::table('users')->get();  // Get all users with their history_duration

        foreach ($users as $user) {
            // Get all history records for each user
            DB::table('history')
                ->where('user_id', $user->id)
                ->where('created_at', '<', Carbon::now()->subDays($user->history_duration)) // Check if created_at is older than the duration
                ->update(['deleted_at' => now()]); // Update deleted_at field
        }

        // $currentDate = now();
        // $users = User::where('role', 'user')
        //     ->where('is_active', 1)
        //     ->whereNotNull('history_duration')
        //     ->get();

        // foreach ($users as $user) {
        //     $inactivityPeriod = $currentDate->diffInDays($user->updated_at);

        //     if ($inactivityPeriod > $user->history_duration) {
        //         DB::table('history')->where('user_id', $user->id)->update(['deleted_at' => now()]);
        //         $this->info("History records deleted for user: {$user->username}");
        //     }
        // }
        
        $this->info('History records cleanup completed.');
    }
}
