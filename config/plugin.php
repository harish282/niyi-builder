<?php

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

return [
    'app' => [
        /** production | development */
        'env' => 'development',
        'debug' => true,
        /**
         * Visual editor console logging (admin.js).
         * Set enabled => true while developing; keep false in production.
         */
        'logging' => [
            'enabled' => true,
        ],
    ],
    /**
     * Admin React bundle. When vite_dev.enabled is true, scripts load from the
     * Vite dev server (run `npm run dev` from the repo root).
     */
    'assets' => [
        'vite_dev' => [
            'enabled' => false,
            'host' => 'localhost',
            'port' => 5173,
        ],
    ],
];
