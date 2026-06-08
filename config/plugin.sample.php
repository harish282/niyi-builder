<?php

declare(strict_types=1);

/**
 * Sample plugin configuration. Copy to plugin.php and adjust for your environment.
 *
 *     cp config/plugin.sample.php config/plugin.php
 */

if (!defined('ABSPATH')) {
    exit;
}

return [
    'app' => [
        'env' => 'development',
        'debug' => true,
        'logging' => [
            'enabled' => true,
        ],
    ],
];
