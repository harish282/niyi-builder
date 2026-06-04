<?php

declare(strict_types=1);

namespace NiyiBuilder\Admin;

final class BuilderAdminPage
{
    private const MENU_SLUG = 'niyi-builder';

    public function register(): void
    {
        add_action('admin_menu', [$this, 'registerMenu']);
        (new AdminAssetRegistrar())->register();
    }

    public function registerMenu(): void
    {
        add_menu_page(
            __('Niyi Builder', 'niyi-builder'),
            __('Niyi Builder', 'niyi-builder'),
            'edit_posts',
            self::MENU_SLUG,
            [$this, 'renderPage'],
            'dashicons-layout',
            58
        );
    }

    public function renderPage(): void
    {
        if (!current_user_can('edit_posts')) {
            wp_die(esc_html__('You do not have permission to access this page.', 'niyi-builder'));
        }

        $viewPath = NIYI_BUILDER_VIEWS_PATH . '/builder-app.php';

        if (!is_readable($viewPath)) {
            wp_die(esc_html__('Builder view could not be loaded.', 'niyi-builder'));
        }

        /** @var string $pageTitle */
        $pageTitle = __('Visual Builder', 'niyi-builder');

        require $viewPath;
    }
}
