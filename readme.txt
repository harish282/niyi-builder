=== Niyi Builder ===
Contributors: harish282
Tags: page builder, gutenberg, visual editor, blocks
Requires at least: 6.4
Tested up to: 6.8
Requires PHP: 8.1
Stable tag: 0.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Open-source visual page builder that stores native Gutenberg blocks — no shortcode lock-in.

== Description ==

Niyi Builder provides Elementor-style visual editing while saving real Gutenberg block markup in post content. Deactivate the plugin and your content remains readable in the block editor.

**Features (in development)**

* Visual canvas with toolbar shell
* JSON layout schema (v0) with serializer round-trip to Gutenberg
* Layout blocks: container, grid, spacer
* Content blocks: heading, text, button, image, icon, video
* Form builder (planned)
* Responsive controls (planned)

== Installation ==

1. Upload the plugin folder to `/wp-content/plugins/niyi-builder/` or install the release zip.
2. Activate the plugin through the **Plugins** screen in WordPress.
3. Open **Niyi Builder** in the admin menu.

== Frequently Asked Questions ==

= Does this replace the block editor? =

No. Niyi Builder is a visual admin tool that outputs standard Gutenberg blocks you can edit elsewhere.

= Is my content locked in? =

No. Content is stored as native block comments (`<!-- wp:... -->`), not proprietary shortcodes.

== Changelog ==

= 0.0.0 =
* Initial development release: plugin scaffold, serializer, editor shell UI.

== Upgrade Notice ==

= 0.0.0 =
Early development release — not recommended for production sites yet.
