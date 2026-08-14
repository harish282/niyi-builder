<?php

declare(strict_types=1);

namespace NiyiBuilder\Admin;

/**
 * Builds the stylesheet markup that styles the builder canvas like the native
 * Gutenberg editor canvas. Mirrors WordPress core's
 * `_wp_get_iframed_editor_assets()` (the exact code Gutenberg uses to assemble
 * its canvas styles) and additionally collects theme `add_editor_style` files,
 * so the Niyi canvas preview matches the block editor for the same content.
 */
final class BuilderThemeStyles
{
    /**
     * `<link>` + `<style>` tags for the canvas iframe head.
     */
    public function getCanvasStyleHtml(): string
    {
        global $wp_styles, $wp_scripts;

        if (! $wp_styles instanceof \WP_Styles) {
            return '';
        }

        $currentStyles  = $wp_styles;
        $currentScripts = $wp_scripts;

        // Clone the registries so enqueues below never leak into the admin page.
        $wp_styles  = new \WP_Styles();
        $wp_scripts = new \WP_Scripts();
        $wp_styles->registered  = $currentStyles->registered;
        $wp_scripts->registered = $currentScripts instanceof \WP_Scripts
            ? $currentScripts->registered
            : [];

        /*
         * Mirror Gutenberg: themes with a theme.json bring their own resets, so
         * classic themes only keep the reset styles.
         */
        $wp_styles->done = function_exists('wp_theme_has_theme_json') && wp_theme_has_theme_json()
            ? ['wp-reset-editor-styles']
            : [];

        // Block library + editor content styles (+ reset, base styles, layout).
        wp_enqueue_style('wp-edit-blocks');

        if (current_theme_supports('wp-block-styles')) {
            wp_enqueue_style('wp-block-library-theme');
        }

        // Front-end block assets (themes/plugins register their block CSS here).
        add_filter('should_load_block_editor_scripts_and_styles', '__return_false');
        /** This action is documented in wp-includes/script-loader.php */
        do_action('enqueue_block_assets');
        remove_filter('should_load_block_editor_scripts_and_styles', '__return_false');

        // Theme editor assets (e.g. Astra's block editor CSS + dynamic CSS + fonts).
        /** This action is documented in wp-includes/script-loader.php */
        do_action('enqueue_block_editor_assets');

        // editorStyle handles for every registered block type.
        $blockRegistry = \WP_Block_Type_Registry::get_instance();

        foreach ($blockRegistry->get_all_registered() as $blockType) {
            if (! is_array($blockType->editor_style_handles)) {
                continue;
            }

            foreach ($blockType->editor_style_handles as $styleHandle) {
                wp_enqueue_style($styleHandle);
            }
        }

        if (function_exists('wp_enqueue_global_styles')) {
            wp_enqueue_global_styles();
        }

        // Avoid breaking the captured output with a deprecation notice
        // (mirrors `_wp_get_iframed_editor_assets`).
        $hasEmojiStyles = has_action('wp_print_styles', 'print_emoji_styles');

        if ($hasEmojiStyles) {
            remove_action('wp_print_styles', 'print_emoji_styles');
        }

        ob_start();
        wp_print_styles();

        if (function_exists('wp_print_font_faces')) {
            wp_print_font_faces();
        }

        if (function_exists('wp_print_font_faces_from_style_variations')) {
            wp_print_font_faces_from_style_variations();
        }

        $styles = ob_get_clean();

        if ($hasEmojiStyles) {
            add_action('wp_print_styles', 'print_emoji_styles');
        }

        // Restore the original registries.
        $wp_styles  = $currentStyles;
        $wp_scripts = $currentScripts;

        return is_string($styles) ? trim($styles) : '';
    }

    /**
     * Theme `add_editor_style` stylesheet URLs, injected into the canvas like
     * Gutenberg does via get_block_editor_theme_styles().
     *
     * @return list<string>
     */
    public function getEditorStyleUrls(): array
    {
        global $editor_styles;

        if (empty($editor_styles) || ! current_theme_supports('editor-styles')) {
            return [];
        }

        $urls = [];

        foreach ($editor_styles as $style) {
            if (! is_string($style) || $style === '') {
                continue;
            }

            if (preg_match('~^(https?:)?//~', $style)) {
                $urls[] = $style;

                continue;
            }

            $urls[] = get_theme_file_uri($style);
        }

        return $urls;
    }
}
