<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Relations\Relation;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        if(\App::environment('production')) {
			$this->app->bind('path.public', function() {
				return base_path('public');
			});
		}
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Relation::morphMap([
            'state' => 'App\State',
            'localGovernment' => 'App\LocalGovernment'
		]);
    }
}
