<?php

namespace consultnn\openingHours;


use yii\web\AssetBundle;

class OpeningHoursAsset extends AssetBundle
{
    public $sourcePath = '@vendor/consultnn/yii2-opening-hours/assets';

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
