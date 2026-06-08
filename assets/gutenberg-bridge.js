/**
 * Block editor integration — choose Default Editor or Niyi Builder.
 */
(function (wp) {
  if (typeof window.niyiBuilderBridge === 'undefined' || !wp || !wp.element) {
    return;
  }

  var bridge = window.niyiBuilderBridge;
  var el = wp.element.createElement;

  function EditorChoicePanel() {
    if (!wp.editPost || !wp.editPost.PluginDocumentSettingPanel) {
      return null;
    }

    var Panel = wp.editPost.PluginDocumentSettingPanel;
    var Button = wp.components.Button;

    return el(
      Panel,
      {
        name: 'niyi-builder-editor-choice',
        title: bridge.panelTitle,
        className: 'niyi-builder-editor-choice-panel',
      },
      el('p', { className: 'niyi-builder-editor-choice__lead' }, bridge.panelDescription),
      el(
        'div',
        { className: 'niyi-builder-editor-choice__actions' },
        el(
          Button,
          {
            variant: 'primary',
            href: bridge.builderUrl,
            className: 'niyi-builder-editor-choice__btn',
          },
          bridge.builderLabel,
        ),
        el(
          Button,
          {
            variant: 'secondary',
            href: bridge.blockEditorUrl,
            className: 'niyi-builder-editor-choice__btn is-active',
            'aria-current': 'page',
          },
          bridge.defaultLabel,
        ),
      ),
      el('p', { className: 'niyi-builder-editor-choice__hint' }, bridge.panelHint),
    );
  }

  function HeaderLaunchButton() {
    if (!wp.plugins || !wp.plugins.PluginMoreMenuItem) {
      return null;
    }

    var PluginMoreMenuItem = wp.plugins.PluginMoreMenuItem;

    return el(
      PluginMoreMenuItem,
      {
        icon: 'layout',
        href: bridge.builderUrl,
      },
      bridge.builderLabel,
    );
  }

  function registerEditorChoicePlugin() {
    if (!wp.plugins || !wp.plugins.registerPlugin) {
      return false;
    }

    wp.plugins.registerPlugin('niyi-builder-editor-choice', {
      icon: 'layout',
      render: function () {
        return el(wp.element.Fragment, null, el(EditorChoicePanel), el(HeaderLaunchButton));
      },
    });

    return true;
  }

  function mountToolbarButton() {
    if (document.getElementById('niyi-builder-toolbar-launch')) {
      return true;
    }

    var toolbar =
      document.querySelector('.editor-header__toolbar') ||
      document.querySelector('.edit-post-header__toolbar');

    if (!toolbar) {
      return false;
    }

    var link = document.createElement('a');
    link.id = 'niyi-builder-toolbar-launch';
    link.href = bridge.builderUrl;
    link.className = 'components-button is-primary niyi-builder-toolbar-launch';
    link.textContent = bridge.builderLabel;
    toolbar.appendChild(link);

    return true;
  }

  function boot() {
    registerEditorChoicePlugin();

    if (!mountToolbarButton()) {
      var attempts = 0;
      var timer = window.setInterval(function () {
        attempts += 1;
        if (mountToolbarButton() || attempts >= 40) {
          window.clearInterval(timer);
        }
      }, 250);
    }
  }

  if (wp.domReady) {
    wp.domReady(boot);
  } else {
    document.addEventListener('DOMContentLoaded', boot);
  }
})(window.wp);
