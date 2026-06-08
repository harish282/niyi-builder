<?php

/**
 * Plugin Name: Niyi Builder
 * Description: Open-source visual page builder with native Gutenberg block output.
 * Version: 0.0.0
 * Requires at least: 6.4
 * Requires PHP: 8.1
 * Author: Niyish Technologies
 * Plugin URI: https://github.com/harish282/niyi-builder
 * Author URI: https://github.com/harish282
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: niyi-builder
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

/** Canonical plugin file path for hooks and asset URLs (must be __FILE__, not a derived path). */
define('NIYI_BUILDER_FILE', __FILE__);

require_once __DIR__ . '/bootstrap/constants.php';
require_once NIYI_BUILDER_INCLUDES_PATH . '/Support/Autoloader.php';

\NiyiBuilder\Support\Autoloader::register();

\NiyiBuilder\Config\Config::instance();

register_activation_hook(NIYI_BUILDER_FILE, [\NiyiBuilder\Activator::class, 'activate']);
register_deactivation_hook(NIYI_BUILDER_FILE, [\NiyiBuilder\Deactivator::class, 'deactivate']);

if (!defined('NIYI_BUILDER_BOOTED')) {
    define('NIYI_BUILDER_BOOTED', true);
    (new \NiyiBuilder\Plugin())->boot();
}
