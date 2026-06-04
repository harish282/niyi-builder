<?php

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

return [
    'app' => [
        /** production | development */
        'env' => 'production',
        'debug' => false,
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
