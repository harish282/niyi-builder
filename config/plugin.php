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
];
