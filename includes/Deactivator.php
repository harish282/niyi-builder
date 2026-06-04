<?php

declare(strict_types=1);

namespace NiyiBuilder;

final class Deactivator
{
    public static function deactivate(): void
    {
        flush_rewrite_rules();
    }
}
