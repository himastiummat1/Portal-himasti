<?php
$models = ['Kajian', 'Notulensi', 'Artikel', 'Survey', 'Merchandise', 'Klub'];
foreach($models as $model) {
    $path = "app/Models/{$model}.php";
    $content = file_get_contents($path);
    $content = str_replace('use HasFactory;', "use HasFactory;\n    protected \$fillable = ['title', 'description'];", $content);
    file_put_contents($path, $content);
}
echo "Models updated!\n";
