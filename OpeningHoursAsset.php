<?php

namespace consultnn\openingHours;


use yii\web\AssetBundle;

class OpeningHoursAsset extends AssetBundle
{
    public $basePath = '@vendor/consultnn/yii2-opening-hours/assets';
    public $baseUrl = '@web';
    public $css = [
        'openingHours.css',
    ];
    public $js = [
        'openingHours.js',
    ];
    public $depends = [
        'yii\web\JqueryAsset',
    ];
}
