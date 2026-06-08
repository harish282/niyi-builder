<?php

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

if (!defined('NIYI_BUILDER_FILE')) {
    define('NIYI_BUILDER_FILE', dirname(__DIR__) . '/niyi-builder.php');
}

if (!defined('NIYI_BUILDER_VERSION')) {
    define('NIYI_BUILDER_VERSION', '0.0.0');
}

if (!defined('NIYI_BUILDER_PATH')) {
    define('NIYI_BUILDER_PATH', plugin_dir_path(NIYI_BUILDER_FILE));
}

if (!defined('NIYI_BUILDER_URL')) {
    define('NIYI_BUILDER_URL', plugin_dir_url(NIYI_BUILDER_FILE));
}

if (!defined('NIYI_BUILDER_CONFIG_PATH')) {
    define('NIYI_BUILDER_CONFIG_PATH', NIYI_BUILDER_PATH . '/config');
}

if (!defined('NIYI_BUILDER_BOOTSTRAP_PATH')) {
    define('NIYI_BUILDER_BOOTSTRAP_PATH', NIYI_BUILDER_PATH . '/bootstrap');
}

/** PHP classes (`NiyiBuilder\` namespace). */
if (!defined('NIYI_BUILDER_INCLUDES_PATH')) {
    define('NIYI_BUILDER_INCLUDES_PATH', NIYI_BUILDER_PATH . '/includes');
}

/** @deprecated Use NIYI_BUILDER_INCLUDES_PATH */
if (!defined('NIYI_BUILDER_SRC_PATH')) {
    define('NIYI_BUILDER_SRC_PATH', NIYI_BUILDER_INCLUDES_PATH);
}

if (!defined('NIYI_BUILDER_VIEWS_PATH')) {
    define('NIYI_BUILDER_VIEWS_PATH', NIYI_BUILDER_PATH . '/resources/views');
}

if (!defined('NIYI_BUILDER_ASSETS_PATH')) {
    define('NIYI_BUILDER_ASSETS_PATH', NIYI_BUILDER_PATH . '/assets');
}

if (!defined('NIYI_BUILDER_BUILD_PATH')) {
    define('NIYI_BUILDER_BUILD_PATH', NIYI_BUILDER_PATH . '/build');
}

/** Gutenberg block definitions (`block.json`, PHP render callbacks). */
if (!defined('NIYI_BUILDER_BLOCKS_PATH')) {
    define('NIYI_BUILDER_BLOCKS_PATH', NIYI_BUILDER_PATH . '/blocks');
}

/** Visual editor React app source. */
if (!defined('NIYI_BUILDER_ADMIN_PATH')) {
    define('NIYI_BUILDER_ADMIN_PATH', NIYI_BUILDER_PATH . '/admin');
}
