<?php

declare(strict_types=1);

namespace NiyiBuilder\Admin;

use NiyiBuilder\Config\Config;
use NiyiBuilder\Support\PluginAssets;
use WP_Post;

final class AdminAssetRegistrar
{
    private const MENU_SLUG = 'niyi-builder';
    private const SCRIPT_HANDLE = 'niyi-builder-admin';
    private const MANIFEST_ENTRY = 'src/main.tsx';

    public function register(): void
    {
        add_action('admin_enqueue_scripts', [$this, 'enqueue']);
    }

    public function enqueue(string $hookSuffix): void
    {
        if ($hookSuffix !== 'toplevel_page_' . self::MENU_SLUG) {
            return;
        }

        $this->enqueueAssets(null);
    }

    public function enqueueBuilderAssets(WP_Post $post): void
    {
        $this->enqueueAssets($post);
    }

    private function enqueueAssets(?WP_Post $post): void
    {
        wp_enqueue_style(
            'niyi-builder-admin-shell',
            PluginAssets::url('assets/admin.css'),
            ['wp-admin', 'common'],
            NIYI_BUILDER_VERSION
        );

        (new BuilderThemeStyles())->enqueue();

        $this->enqueueProductionAssets($post);
    }

    private function enqueueProductionAssets(?WP_Post $post): void
    {
        $manifest = $this->loadManifest();

        if ($manifest === null) {
            return;
        }

        $entry = $manifest[self::MANIFEST_ENTRY] ?? null;

        if (! is_array($entry) || empty($entry['file']) || ! is_string($entry['file'])) {
            return;
        }

        $buildUrl = PluginAssets::url('build/');
        $scriptUrl = $buildUrl . ltrim($entry['file'], '/');

        $this->enqueueModuleScript(self::SCRIPT_HANDLE, $scriptUrl, []);
        $this->localizeBootstrapConfig($post);

        if (! empty($entry['css']) && is_array($entry['css'])) {
            foreach ($entry['css'] as $index => $stylesheet) {
                if (! is_string($stylesheet) || $stylesheet === '') {
                    continue;
                }

                wp_enqueue_style(
                    'niyi-builder-admin-bundle-' . (string) $index,
                    $buildUrl . ltrim($stylesheet, '/'),
                    ['niyi-builder-admin-shell'],
                    NIYI_BUILDER_VERSION
                );
            }
        }
    }

    private function localizeBootstrapConfig(?WP_Post $post): void
    {
        $restPostUrl = '';

        if ($post instanceof WP_Post) {
            $route = rest_get_route_for_post($post);
            $restPostUrl = is_string($route) && $route !== '' ? rest_url($route) : '';
        }

        $config = [
            'postId' => $post?->ID ?? 0,
            'postType' => $post?->post_type ?? '',
            'postTitle' => $post instanceof WP_Post ? get_the_title($post) : '',
            'restUrl' => rest_url('wp/v2/'),
            'restPostUrl' => $restPostUrl,
            'nonce' => wp_create_nonce('wp_rest'),
            'content' => $post instanceof WP_Post ? (string) $post->post_content : '',
            'exitUrl' => $post instanceof WP_Post ? PostEditorIntegration::getBlockEditorUrl($post->ID) : '',
            'isDevShell' => ! ($post instanceof WP_Post),
            'loggingEnabled' => (bool) Config::instance()->get('app.logging.enabled', false),
        ];

        wp_localize_script(self::SCRIPT_HANDLE, 'niyiBuilderConfig', $config);
    }

    /**
     * @return array<string, mixed>|null
     */
    private function loadManifest(): ?array
    {
        $manifestPath = NIYI_BUILDER_BUILD_PATH . '/manifest.json';

        if (! is_readable($manifestPath)) {
            return null;
        }

        $contents = file_get_contents($manifestPath);

        if ($contents === false) {
            return null;
        }

        $decoded = json_decode($contents, true);

        return is_array($decoded) ? $decoded : null;
    }

    /**
     * @param list<string> $dependencies
     */
    private function enqueueModuleScript(string $handle, string $src, array $dependencies): void
    {
        wp_enqueue_script($handle, $src, $dependencies, null, true);
        wp_script_add_data($handle, 'type', 'module');
    }
}
