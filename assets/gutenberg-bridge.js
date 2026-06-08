/**
 * Adds "Edit with Niyi Builder" in the block editor (sidebar + header fallback).
 */
(function (wp) {
  if (typeof window.niyiBuilderBridge === 'undefined') {
    return;
  }

  var bridge = window.niyiBuilderBridge;
  var mounted = false;

  function launchLink(props) {
    var className = props.className || 'components-button is-secondary niyi-builder-launch-btn';

    return wp.element.createElement(
      'a',
      {
        id: 'niyi-builder-launch',
        href: bridge.builderUrl,
        className: className,
      },
      bridge.label,
    );
  }

  function registerSidebarPlugin() {
    if (!wp.plugins || !wp.editPost || !wp.editPost.PluginPostStatusInfo) {
      return false;
    }

    wp.plugins.registerPlugin('niyi-builder-launch', {
      render: function () {
        return wp.element.createElement(
          wp.editPost.PluginPostStatusInfo,
          {},
          launchLink({ className: 'niyi-builder-launch-btn niyi-builder-launch-btn--panel' }),
        );
      },
    });

    return true;
  }

  function mountHeaderFallback() {
    if (mounted) {
      return true;
    }

    var toolbar =
      document.querySelector('.editor-header__toolbar') ||
      document.querySelector('.edit-post-header__toolbar') ||
      document.querySelector('.edit-post-header');

    if (!toolbar || document.getElementById('niyi-builder-launch')) {
      return Boolean(document.getElementById('niyi-builder-launch'));
    }

    var link = document.createElement('a');
    link.id = 'niyi-builder-launch';
    link.href = bridge.builderUrl;
    link.className = 'components-button is-secondary niyi-builder-launch-btn';
    link.textContent = bridge.label;
    toolbar.appendChild(link);
    mounted = true;

    return true;
  }

  function boot() {
    registerSidebarPlugin();

    if (mountHeaderFallback()) {
      return;
    }

    var attempts = 0;
    var timer = window.setInterval(function () {
      attempts += 1;

      if (mountHeaderFallback() || attempts >= 40) {
        window.clearInterval(timer);
      }
    }, 250);
  }

  if (wp && wp.domReady) {
    wp.domReady(boot);
  } else {
    document.addEventListener('DOMContentLoaded', boot);
  }
})(window.wp);
