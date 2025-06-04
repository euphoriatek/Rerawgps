<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Http\Controllers\PoiController;

class SyncPoisDaily extends Command
{
    protected $signature = 'sync:pois';
    protected $description = 'Synchronize POIs with the external server every night';

    public function handle()
    {
        $controller = new PoiController();
        $response = $controller->syncPois();
        $this->info("Synced POIs");
    }
}
