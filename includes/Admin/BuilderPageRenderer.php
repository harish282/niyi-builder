<?php

declare(strict_types=1);

namespace NiyiBuilder\Admin;

use WP_Post;

final class BuilderPageRenderer
{
    public function render(WP_Post $post): void
    {
        global $title, $post_type, $post_type_object;

        $post_type = $post->post_type;
        $post_type_object = get_post_type_object($post_type);
        $title = $post_type_object instanceof \WP_Post_Type
            ? $post_type_object->labels->edit_item
            : __('Edit Post', 'niyi-builder');

        $screen = function_exists('get_current_screen') ? get_current_screen() : null;

        if ($screen !== null) {
            $screen->is_block_editor(false);
        }

        BuilderChrome::suppress();

        remove_action('admin_print_scripts', 'print_emoji_detection_script');
        add_filter('screen_options_show_screen', '__return_false');
        add_filter('admin_body_class', [$this, 'filterAdminBodyClass']);

        require ABSPATH . 'wp-admin/admin-header.php';

        $viewPath = NIYI_BUILDER_VIEWS_PATH . '/builder-app.php';

        if (! is_readable($viewPath)) {
            wp_die(esc_html__('Builder view could not be loaded.', 'niyi-builder'));
        }

        require $viewPath;
    }

    public function filterAdminBodyClass(string $classes): string
    {
        return $classes . ' niyi-builder-editor-screen is-fullscreen-mode';
    }
}
