<?php
$models = ['Kajian', 'Notulensi', 'Artikel', 'Survey', 'Merchandise', 'Klub'];
foreach($models as $model) {
    $path = "app/Http/Controllers/Admin/{$model}Controller.php";
    $content = file_get_contents($path);
    $content = str_replace("\$request->all()", "\$request->only(['title', 'description'])", $content);
    file_put_contents($path, $content);
}
echo "Controllers mass assignment fixed!\n";
