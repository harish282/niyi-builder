<?php

declare(strict_types=1);

namespace NiyiBuilder\Support;

final class Autoloader
{
    private const PREFIX = 'NiyiBuilder\\';

    public static function register(): void
    {
        spl_autoload_register([self::class, 'autoload']);
    }

    private static function autoload(string $class): void
    {
        if (!str_starts_with($class, self::PREFIX)) {
            return;
        }

        $relativeClass = substr($class, strlen(self::PREFIX));
        $relativePath = str_replace('\\', '/', $relativeClass) . '.php';
        $filePath = NIYI_BUILDER_INCLUDES_PATH . '/' . $relativePath;

        if (is_readable($filePath)) {
            require_once $filePath;
        }
    }
}
