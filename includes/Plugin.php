<?php

declare(strict_types=1);

namespace NiyiBuilder;

use NiyiBuilder\Admin\BuilderAdminPage;
use NiyiBuilder\Admin\PostEditorIntegration;

final class Plugin
{
    public function boot(): void
    {
        if (is_admin()) {
            (new PostEditorIntegration())->register();
            (new BuilderAdminPage())->register();
        }
    }
}
