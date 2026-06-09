<?php

declare(strict_types=1);

namespace NiyiBuilder\Admin;

use NiyiBuilder\Support\PluginAssets;

/**
 * Loads front-end block + theme styles on the builder canvas (Gutenberg-like WYSIWYG).
 */
final class BuilderThemeStyles
{
    public function enqueue(): void
    {
        $this->enqueueBlockLibraryStyles();
        $this->enqueueGlobalStyles();
        $this->enqueueThemeStylesheet();
        $this->enqueueEditorStyles();
        $this->enqueueCanvasLayoutStyles();
    }

    private function enqueueBlockLibraryStyles(): void
    {
        $version = get_bloginfo('version');

        if (! wp_style_is('wp-block-library', 'registered')) {
            wp_register_style(
                'wp-block-library',
                includes_url('css/dist/block-library/style.min.css'),
                [],
                $version
            );
        }

        wp_enqueue_style('wp-block-library');

        if (current_theme_supports('wp-block-styles')) {
            if (! wp_style_is('wp-block-library-theme', 'registered')) {
                wp_register_style(
                    'wp-block-library-theme',
                    includes_url('css/dist/block-library/theme.min.css'),
                    ['wp-block-library'],
                    $version
                );
            }

            wp_enqueue_style('wp-block-library-theme');
        }

        if (wp_style_is('wp-reset-editor-styles', 'registered')) {
            wp_enqueue_style('wp-reset-editor-styles');
        }
    }

    private function enqueueGlobalStyles(): void
    {
        if (function_exists('wp_enqueue_global_styles')) {
            wp_enqueue_global_styles();
        }
    }

    private function enqueueThemeStylesheet(): void
    {
        $theme = wp_get_theme();

        if (is_child_theme()) {
            $parent = wp_get_theme(get_template());

            wp_enqueue_style(
                'niyi-builder-parent-theme',
                get_template_directory_uri() . '/style.css',
                ['wp-block-library'],
                $parent->get('Version')
            );
        }

        wp_enqueue_style(
            'niyi-builder-theme',
            get_stylesheet_uri(),
            is_child_theme() ? ['niyi-builder-parent-theme'] : ['wp-block-library'],
            $theme->get('Version')
        );
    }

    private function enqueueEditorStyles(): void
    {
        global $editor_styles;

        if (empty($editor_styles) || ! current_theme_supports('editor-styles')) {
            return;
        }

        $themeVersion = wp_get_theme()->get('Version');

        foreach ($editor_styles as $index => $style) {
            if (! is_string($style) || $style === '') {
                continue;
            }

            $handle = 'niyi-builder-editor-style-' . (string) $index;

            if (preg_match('~^(https?:)?//~', $style)) {
                wp_enqueue_style($handle, $style, ['niyi-builder-theme'], $themeVersion);

                continue;
            }

            wp_enqueue_style(
                $handle,
                get_theme_file_uri($style),
                ['niyi-builder-theme'],
                $themeVersion
            );
        }
    }

    private function enqueueCanvasLayoutStyles(): void
    {
        $version = get_bloginfo('version');
        $deps = ['wp-block-library', 'niyi-builder-theme'];

        if (wp_style_is('global-styles', 'registered')) {
            $deps[] = 'global-styles';
        }

        wp_enqueue_style(
            'niyi-builder-canvas-layout',
            includes_url('css/dist/edit-post/classic.min.css'),
            $deps,
            $version
        );
    }
}
