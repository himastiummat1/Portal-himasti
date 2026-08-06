<?php
$files = glob('database/migrations/2026_08_06_17*.php');
foreach($files as $file) {
    $content = file_get_contents($file);
    $content = str_replace("\$table->timestamps();", "\$table->string('title');\n            \$table->text('description');\n            \$table->timestamps();", $content);
    file_put_contents($file, $content);
}
echo "Migrations updated!\n";
