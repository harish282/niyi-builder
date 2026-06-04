<?php

declare(strict_types=1);

namespace NiyiBuilder;

use NiyiBuilder\Admin\BuilderAdminPage;

final class Plugin
{
    public function boot(): void
    {
        if (is_admin()) {
            (new BuilderAdminPage())->register();
        }
    }
}
