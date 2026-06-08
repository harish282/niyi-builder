<?php

declare(strict_types=1);

namespace NiyiBuilder\Admin;

/**
 * Strip default WordPress admin chrome on builder screens (admin bar, notices, etc.).
 */
final class BuilderChrome
{
    public static function suppress(): void
    {
        remove_action('in_admin_header', 'wp_admin_bar_render', 0);
        remove_action('admin_notices', 'update_nag', 3);
        remove_action('network_admin_notices', 'update_nag', 3);
        remove_action('user_admin_notices', 'update_nag', 3);

        remove_all_actions('admin_notices');
        remove_all_actions('all_admin_notices');
        remove_all_actions('network_admin_notices');
        remove_all_actions('user_admin_notices');
    }
}
