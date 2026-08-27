<?php
$models = ['kajian', 'notulensi', 'artikel', 'survey', 'merchandise', 'klub'];
foreach($models as $model) {
    $path = "resources/views/admin/{$model}/index.blade.php";
    $content = file_get_contents($path);
    $content = str_replace("Str::limit", "\Illuminate\Support\Str::limit", $content);
    file_put_contents($path, $content);
}
echo "Views fixed!\n";
