<?php

namespace consultnn\openingHours;


use yii\web\AssetBundle;

class OpeningHoursAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
        'css/openingHours.css',
    ];
    public $js = [
        'js/openingHours.js',
    ];
    public $depends = [
        'yii\web\JqueryAsset',
    ];
}
