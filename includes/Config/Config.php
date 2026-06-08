<?php

declare(strict_types=1);

namespace NiyiBuilder\Config;

final class Config
{
    private static ?self $instance = null;

    /** @var array<string, mixed> */
    private array $items;

    private function __construct()
    {
        $this->items = $this->load();
    }

    public static function instance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    public function get(string $key, mixed $default = null): mixed
    {
        if ($key === '') {
            return $default;
        }

        $segments = explode('.', $key);
        $value = $this->items;

        foreach ($segments as $segment) {
            if (!is_array($value) || !array_key_exists($segment, $value)) {
                return $default;
            }

            $value = $value[$segment];
        }

        return $value;
    }

    /**
     * @return array<string, mixed>
     */
    private function load(): array
    {
        $file = NIYI_BUILDER_CONFIG_PATH . '/plugin.php';
        $config = is_readable($file) ? require $file : [];

        if (!is_array($config)) {
            $config = [];
        }

        if (!is_array($config['app'] ?? null)) {
            $config['app'] = [];
        }

        $config['app']['env'] = (string) ($config['app']['env'] ?? 'production');
        $config['app']['debug'] = (bool) ($config['app']['debug'] ?? false);

        if (!is_array($config['app']['logging'] ?? null)) {
            $config['app']['logging'] = [];
        }

        $config['app']['logging']['enabled'] = (bool) (
            $config['app']['logging']['enabled']
            ?? $config['app']['debug']
        );

        if (function_exists('apply_filters')) {
            $filtered = apply_filters('niyi_builder_config', $config);

            if (is_array($filtered)) {
                $config = $filtered;
            }
        }

        return $config;
    }
}
