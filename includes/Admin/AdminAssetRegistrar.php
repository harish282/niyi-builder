<?php

declare(strict_types=1);

namespace NiyiBuilder\Admin;

use NiyiBuilder\Config\Config;

final class AdminAssetRegistrar
{
    private const MENU_SLUG = 'niyi-builder';
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

        wp_enqueue_style(
            'niyi-builder-admin-shell',
            plugins_url('assets/admin.css', NIYI_BUILDER_FILE),
            [],
            NIYI_BUILDER_VERSION
        );

        if ($this->isViteDevServer()) {
            $this->enqueueViteDevAssets();

            return;
        }

        $this->enqueueProductionAssets();
    }

    private function isViteDevServer(): bool
    {
        return (bool) Config::instance()->get('assets.vite_dev.enabled', false);
    }

    private function enqueueViteDevAssets(): void
    {
        $origin = $this->viteDevOrigin();

        $this->enqueueModuleScript('niyi-builder-vite-client', $origin . '/@vite/client', []);
        $this->enqueueModuleScript('niyi-builder-admin', $origin . '/src/main.tsx', ['niyi-builder-vite-client']);
    }

    private function enqueueProductionAssets(): void
    {
        $manifest = $this->loadManifest();

        if ($manifest === null) {
            return;
        }

        $entry = $manifest[self::MANIFEST_ENTRY] ?? null;

        if (!is_array($entry) || empty($entry['file']) || !is_string($entry['file'])) {
            return;
        }

        $buildUrl = plugins_url('build/', NIYI_BUILDER_FILE);
        $scriptUrl = $buildUrl . ltrim($entry['file'], '/');

        $this->enqueueModuleScript('niyi-builder-admin', $scriptUrl, []);

        if (!empty($entry['css']) && is_array($entry['css'])) {
            foreach ($entry['css'] as $index => $stylesheet) {
                if (!is_string($stylesheet) || $stylesheet === '') {
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

    /**
     * @return array<string, mixed>|null
     */
    private function loadManifest(): ?array
    {
        $manifestPath = NIYI_BUILDER_BUILD_PATH . '/manifest.json';

        if (!is_readable($manifestPath)) {
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

    private function viteDevOrigin(): string
    {
        $config = Config::instance();
        $host = (string) $config->get('assets.vite_dev.host', 'localhost');
        $port = (int) $config->get('assets.vite_dev.port', 5173);

        return 'http://' . $host . ':' . $port;
    }
}
