<?php

declare(strict_types=1);

namespace NiyiBuilder\Support;

/**
 * Plugin asset URLs — always relative to the active plugin directory under wp-content/plugins/.
 */
final class PluginAssets
{
    public static function url(string $relativePath = ''): string
    {
        $base = trailingslashit(NIYI_BUILDER_URL);
        $relativePath = ltrim($relativePath, '/');

        if ($relativePath === '') {
            return $base;
        }

        return $base . $relativePath;
    }
}
