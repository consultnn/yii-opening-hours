<?php

namespace consultnn\openingHours;


use yii\web\AssetBundle;

class OpeningHoursAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
        'assets/openingHours.css',
    ];
    public $js = [
        'assets/openingHours.js',
    ];
    public $depends = [
        'yii\web\JqueryAsset',
    ];
}
