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

    /**
     * WP_Screen applies replace_editor again while admin-header.php runs set_current_screen().
     * Without this guard, BuilderPageRenderer::render() recurses until memory is exhausted.
     */
    private static bool $isReplacingEditor = false;

    public function register(): void
    {
        add_action('load-post.php', [$this, 'preparePostEditScreen']);
        add_action('load-post-new.php', [$this, 'preparePostNewScreen']);
        add_filter('replace_editor', [$this, 'replaceEditor'], 1, 2);
        add_filter('post_row_actions', [$this, 'addRowAction'], 10, 2);
        add_filter('page_row_actions', [$this, 'addRowAction'], 10, 2);
        add_filter('display_post_states', [$this, 'addPostState'], 10, 2);
        add_action('enqueue_block_editor_assets', [$this, 'enqueueBlockEditorBridge']);
        add_action('admin_footer', [$this, 'renderAddNewBuilderButton']);
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

        add_action('admin_enqueue_scripts', [$this, 'enqueueBuilderAppAssets']);
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

        add_action('admin_enqueue_scripts', [$this, 'enqueueBuilderAppAssets']);
    }

    public function enqueueBuilderAppAssets(): void
    {
        $post = $this->resolveBuilderPost();

        if (! $post instanceof WP_Post || ! $this->canOpenBuilder($post)) {
            return;
        }

        (new AdminAssetRegistrar())->enqueueBuilderAssets($post);
    }

    private function resolveBuilderPost(): ?WP_Post
    {
        $post = get_post();

        if ($post instanceof WP_Post) {
            return $post;
        }

        // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- routing only
        $postId = isset($_GET['post']) ? (int) $_GET['post'] : 0;

        if ($postId <= 0) {
            return null;
        }

        $resolved = get_post($postId);

        return $resolved instanceof WP_Post ? $resolved : null;
    }

    public function replaceEditor(bool $replace, WP_Post $post): bool
    {
        if (self::$isReplacingEditor) {
            return true;
        }

        if ($replace || ! $this->shouldLoadBuilder($post)) {
            return $replace;
        }

        // WP_Screen probes replace_editor during admin.php set_current_screen() — before
        // load-post.php / post.php case 'edit'. Signal replacement only; render later.
        if (! $this->isPostEditScreenReady()) {
            return true;
        }

        self::$isReplacingEditor = true;

        (new BuilderPageRenderer())->render($post);

        return true;
    }

    /**
     * True only when post.php / post-new.php has finished load-* hooks (safe to print admin UI).
     */
    private function isPostEditScreenReady(): bool
    {
        global $pagenow;

        if (! is_string($pagenow)) {
            return false;
        }

        if ($pagenow === 'post.php') {
            return did_action('load-post.php') > 0;
        }

        if ($pagenow === 'post-new.php') {
            return did_action('load-post-new.php') > 0;
        }

        return false;
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

        $builderAction = [
            'niyi-builder' => sprintf(
                '<a href="%s" class="niyi-builder" aria-label="%s">%s</a>',
                esc_url($builderUrl),
                esc_attr(
                    sprintf(
                        /* translators: %s: post title */
                        __('Edit &#8220;%s&#8221; with Niyi Builder', 'niyi-builder'),
                        _draft_or_post_title($post)
                    )
                ),
                esc_html__('Niyi Builder', 'niyi-builder')
            ),
        ];

        if (isset($actions['edit'])) {
            $edit = $actions['edit'];
            unset($actions['edit']);

            return ['edit' => $edit] + $builderAction + $actions;
        }

        return $builderAction + $actions;
    }

    /**
     * @param array<string, string> $postStates
     * @return array<string, string>
     */
    public function addPostState(array $postStates, WP_Post $post): array
    {
        if (! $this->canOpenBuilder($post)) {
            return $postStates;
        }

        if (self::isBuilderQueryRequest()) {
            $postStates['niyi_builder'] = __('Niyi Builder', 'niyi-builder');
        }

        return $postStates;
    }

    public function enqueueBlockEditorBridge(): void
    {
        $post = get_post();

        if (! $post instanceof WP_Post || ! $this->canOpenBuilder($post)) {
            return;
        }

        $builderUrl = self::getBuilderEditUrl($post->ID);
        $blockEditorUrl = self::getBlockEditorUrl($post->ID);

        if ($builderUrl === '' || $blockEditorUrl === '') {
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
            ['wp-plugins', 'wp-edit-post', 'wp-editor', 'wp-element', 'wp-components', 'wp-i18n'],
            NIYI_BUILDER_VERSION,
            true
        );

        wp_localize_script(
            'niyi-builder-gutenberg-bridge',
            'niyiBuilderBridge',
            [
                'builderUrl' => $builderUrl,
                'blockEditorUrl' => $blockEditorUrl,
                'builderLabel' => __('Niyi Builder', 'niyi-builder'),
                'defaultLabel' => __('Default Editor', 'niyi-builder'),
                'panelTitle' => __('Choose editor', 'niyi-builder'),
                'panelDescription' => __(
                    'Edit this content with the WordPress block editor or open the Niyi Builder visual canvas.',
                    'niyi-builder'
                ),
                'panelHint' => __(
                    'You are using the Default Editor. Switch anytime via Niyi Builder.',
                    'niyi-builder'
                ),
            ]
        );
    }

    /**
     * Add "Niyi Builder" next to "Add New" on post/page list screens.
     */
    public function renderAddNewBuilderButton(): void
    {
        $screen = function_exists('get_current_screen') ? get_current_screen() : null;

        if ($screen === null || $screen->base !== 'edit') {
            return;
        }

        if (! in_array($screen->post_type, self::SUPPORTED_POST_TYPES, true)) {
            return;
        }

        $postTypeObject = get_post_type_object($screen->post_type);

        if ($postTypeObject === null || ! current_user_can($postTypeObject->cap->create_posts)) {
            return;
        }

        $newUrl = add_query_arg(
            [
                'post_type' => $screen->post_type,
                self::BUILDER_QUERY_FLAG => '1',
            ],
            admin_url('post-new.php')
        );

        $label = esc_html__('Niyi Builder', 'niyi-builder');
        $button = sprintf(
            '<a href="%s" class="page-title-action niyi-builder-add-new">%s</a>',
            esc_url($newUrl),
            $label
        );
        ?>
        <script>
        document.addEventListener('DOMContentLoaded', function () {
            var wrap = document.querySelector('.wrap .wp-header-end');
            if (!wrap) {
                return;
            }
            wrap.insertAdjacentHTML('beforebegin', <?php echo wp_json_encode($button); ?>);
        });
        </script>
        <?php
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

    public static function getBlockEditorUrl(int $postId): string
    {
        $post = get_post($postId);

        if (! $post instanceof WP_Post) {
            return '';
        }

        if (! current_user_can('edit_post', $postId)) {
            return '';
        }

        $url = get_edit_post_link($postId, 'raw');

        if (! is_string($url) || $url === '') {
            return add_query_arg(
                [
                    'post' => $postId,
                    'action' => 'edit',
                ],
                admin_url('post.php')
            );
        }

        return remove_query_arg(self::BUILDER_QUERY_FLAG, $url);
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
