<?php
$models = ['Kajian', 'Notulensi', 'Artikel', 'Survey', 'Merchandise', 'Klub'];
foreach($models as $model) {
    $path = "app/Models/{$model}.php";
    $content = file_get_contents($path);
    $content = str_replace("class {$model} extends Model\n{", "class {$model} extends Model\n{\n    protected \$fillable = ['title', 'description'];", $content);
    file_put_contents($path, $content);
}
echo "Models fixed properly!\n";
