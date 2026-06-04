<?php

declare(strict_types=1);

namespace NiyiBuilder;

final class Activator
{
    public static function activate(): void
    {
        if (!current_user_can('activate_plugins')) {
            return;
        }

        update_option('niyi_builder_version', NIYI_BUILDER_VERSION, false);
        flush_rewrite_rules();
    }
}
