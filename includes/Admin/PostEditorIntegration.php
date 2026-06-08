<?php

declare(strict_types=1);

namespace NiyiBuilder\Admin;

use NiyiBuilder\Support\PluginAssets;
use WP_Post;

final class PostEditorIntegration
{
    /** Query flag: post.php?post={id}&action=edit&niyi-builder=1 */
    public const BUILDER_QUERY_FLAG = 'niyi-builder';

    /** @var list<string> */
    private const SUPPORTED_POST_TYPES = ['post', 'page'];

    public function register(): void
    {
        add_action('load-post.php', [$this, 'preparePostEditScreen']);
        add_action('load-post-new.php', [$this, 'preparePostNewScreen']);
        add_filter('replace_editor', [$this, 'replaceEditor'], 1, 2);
        add_filter('post_row_actions', [$this, 'addRowAction'], 10, 2);
        add_filter('page_row_actions', [$this, 'addRowAction'], 10, 2);
        add_action('enqueue_block_editor_assets', [$this, 'enqueueBlockEditorBridge']);
    }

    /**
     * WordPress only runs replace_editor inside post.php case 'edit'.
     * Ensure action=edit when the builder flag is present (otherwise core redirects to edit.php).
     */
    public function preparePostEditScreen(): void
    {
        if (! self::isBuilderQueryRequest()) {
            return;
        }

        // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- routing only
        if (empty($_REQUEST['action'])) {
            $_GET['action'] = 'edit';
            $_REQUEST['action'] = 'edit';
        }
    }

    public function preparePostNewScreen(): void
    {
        if (! self::isBuilderQueryRequest()) {
            return;
        }

        // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- routing only
        if (empty($_REQUEST['action'])) {
            $_GET['action'] = 'edit';
            $_REQUEST['action'] = 'edit';
        }
    }

    public function replaceEditor(bool $replace, WP_Post $post): bool
    {
        if ($replace || ! $this->shouldLoadBuilder($post)) {
            return $replace;
        }

        (new BuilderPageRenderer())->render($post);

        return true;
    }

    /**
     * @param array<string, string> $actions
     * @return array<string, string>
     */
    public function addRowAction(array $actions, WP_Post $post): array
    {
        if (! $this->canOpenBuilder($post)) {
            return $actions;
        }

        $builderUrl = self::getBuilderEditUrl($post->ID);

        if ($builderUrl === '') {
            return $actions;
        }

        $label = __('Edit with Niyi Builder', 'niyi-builder');
        $actions['niyi-builder'] = sprintf(
            '<a href="%s" aria-label="%s">%s</a>',
            esc_url($builderUrl),
            esc_attr(
                sprintf(
                    /* translators: %s: post title */
                    __('Edit &#8220;%s&#8221; with Niyi Builder', 'niyi-builder'),
                    _draft_or_post_title($post)
                )
            ),
            esc_html($label)
        );

        return $actions;
    }

    public function enqueueBlockEditorBridge(): void
    {
        $post = get_post();

        if (! $post instanceof WP_Post || ! $this->canOpenBuilder($post)) {
            return;
        }

        $builderUrl = self::getBuilderEditUrl($post->ID);

        if ($builderUrl === '') {
            return;
        }

        wp_enqueue_style(
            'niyi-builder-gutenberg-bridge',
            PluginAssets::url('assets/gutenberg-bridge.css'),
            [],
            NIYI_BUILDER_VERSION
        );

        wp_enqueue_script(
            'niyi-builder-gutenberg-bridge',
            PluginAssets::url('assets/gutenberg-bridge.js'),
            ['wp-plugins', 'wp-edit-post', 'wp-element', 'wp-components'],
            NIYI_BUILDER_VERSION,
            true
        );

        wp_localize_script(
            'niyi-builder-gutenberg-bridge',
            'niyiBuilderBridge',
            [
                'builderUrl' => $builderUrl,
                'label' => __('Edit with Niyi Builder', 'niyi-builder'),
            ]
        );
    }

    public static function getBuilderEditUrl(int $postId): string
    {
        $post = get_post($postId);

        if (! $post instanceof WP_Post) {
            return '';
        }

        if (! in_array($post->post_type, self::SUPPORTED_POST_TYPES, true)) {
            return '';
        }

        if (! current_user_can('edit_post', $postId)) {
            return '';
        }

        return add_query_arg(
            [
                'post' => $postId,
                'action' => 'edit',
                self::BUILDER_QUERY_FLAG => '1',
            ],
            admin_url('post.php')
        );
    }

    public static function isBuilderQueryRequest(): bool
    {
        // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only route flag
        $value = $_REQUEST[self::BUILDER_QUERY_FLAG] ?? null;

        return $value === '1' || $value === 1;
    }

    private function shouldLoadBuilder(WP_Post $post): bool
    {
        if (! self::isBuilderQueryRequest()) {
            return false;
        }

        return $this->canOpenBuilder($post);
    }

    private function canOpenBuilder(WP_Post $post): bool
    {
        if (! in_array($post->post_type, self::SUPPORTED_POST_TYPES, true)) {
            return false;
        }

        if (! post_type_supports($post->post_type, 'editor')) {
            return false;
        }

        if ($post->ID <= 0) {
            return false;
        }

        return current_user_can('edit_post', $post->ID);
    }
}
