<?php

declare(strict_types=1);

namespace NiyiBuilder\Admin;

final class BuilderAdminPage
{
    private const MENU_SLUG = 'niyi-builder';

    public function register(): void
    {
        add_action('admin_menu', [$this, 'registerMenu']);
        add_filter('admin_body_class', [$this, 'filterAdminBodyClass']);
        (new AdminAssetRegistrar())->register();
    }

    public function filterAdminBodyClass(string $classes): string
    {
        $screen = function_exists('get_current_screen') ? get_current_screen() : null;

        if ($screen !== null && $screen->id === 'toplevel_page_' . self::MENU_SLUG) {
            return $classes . ' niyi-builder-editor-screen';
        }

        return $classes;
    }

    public function registerMenu(): void
    {
        // Dev shell only — primary entry is post/page edit (see PostEditorIntegration).
        add_menu_page(
            __('Niyi Builder (Dev)', 'niyi-builder'),
            __('Niyi Builder (Dev)', 'niyi-builder'),
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

        require $viewPath;
    }
}
