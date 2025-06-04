<?php
namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected $commands = [
        \App\Console\Commands\UpdatePlans::class,
        \App\Console\Commands\ClearHistoryRecords::class,
        \App\Console\Commands\SyncPoisDaily::class,
    ];

    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Schedule the "update:plans" command to run every minute and log the output
        $schedule->command('update:plans')
            ->everyMinute()
            ->sendOutputTo(storage_path('logs/command_output.log'));

        // Schedule the "clear:history-records" command to run daily at midnight
        $schedule->command('history-records')
        ->everyMinute()
        ->sendOutputTo(storage_path('logs/command_output.log'));

        $schedule->command('sync:pois')->dailyAt('00:00')
          ->sendOutputTo(storage_path('logs/synch_pois.log'));
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
