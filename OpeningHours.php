<?php

namespace consultnn\openingHours;

use yii\base\Widget;
use yii\helpers\Html;

/**
 * Created by PhpStorm.
 * User: Leksanov Artem
 * Date: 10.04.15
 * Time: 12:19
 */

class OpeningHours extends Widget
{
    /**
     * @var \yii\base\Model
     */
    public $schedule;

    /**
     * @var \yii\widgets\ActiveForm
     */
    public $form;
    
    public function init()
    {
        OpeningHoursAsset::register($this->view);

        $this->view->registerJs("$('#" . $this->getId() . "').openingHours();");

        return parent::init();
    }

    public function run()
    {
        $hours = [];
        for ($i = 0; $i < 25; $i++) {
            $hours[$i] = $i < 10 ? '0'.$i : $i;
        }

        $minutes = [];
        for ($i = 0; $i < 60; $i++) {
            $minutes[$i] = $i < 10 ? '0'.$i : $i;
        }

        $content = '';

        $content .= Html::beginTag('div', ['id' => $this->getId()]);
        $content .= Html::beginTag('div', ['class' => 'control']);

        $content .= $this->renderButtons();

        $content .= Html::beginTag('div', ['class' => 'opening-hours-block time']);
            $content .= Html::beginTag('div', ['class' => 'inputs']);
                $content .= Html::tag('span', '', ['class' => 'glyphicon glyphicon-time']);
                $content .= Html::dropDownList('work-from-hours', null, $hours, ['class' => 'form-control work-from-hours']).' : ';
                $content .= Html::dropDownList('work-from-minutes', null, $minutes, ['class' => 'form-control work-from-minutes']).' — ';
                $content .= Html::dropDownList('work-to-hours', null, $hours, ['class' => 'form-control work-to-hours']).' : ';
                $content .= Html::dropDownList('work-to-minutes', null, $minutes, ['class' => 'form-control work-to-minutes']);
            $content .= Html::endTag('div');
            $content .= Html::beginTag('div', ['class' => 'inputs timeout-block', 'style' => 'display:none']);
                $content .= Html::tag('span', '', ['class' => 'glyphicon glyphicon-cutlery']);
                $content .= Html::dropDownList('timeout-from-hours', null, $hours, ['class' => 'form-control timeout-from-hours']).' : ';
                $content .= Html::dropDownList('timeout-from-minutes', null, $minutes, ['class' => 'form-control timeout-from-minutes']).' — ';
                $content .= Html::dropDownList('timeout-to-hours', null, $hours, ['class' => 'form-control timeout-to-hours']).' : ';
                $content .= Html::dropDownList('timeout-to-minutes', null, $minutes, ['class' => 'form-control timeout-to-minutes']);
            $content .= Html::endTag('div');
            $content .= Html::a('круглосуточно', '#', ['class' => 'dotted alltime-btn']);
            $content .= Html::a('перерыв', '#', ['class' => 'dotted timeout-btn']);
            $content .= Html::tag('div', '', ['class' => 'shirma']);
        $content .= Html::endTag('div');

        $content .= Html::a(Html::tag('span', '', ['class' => 'glyphicon glyphicon-plus-sign']), '#', ['class' => 'link add-control-btn']);

        $content .= Html::endTag('div');

        foreach ($this->schedule->getDays() as $day) {
            $content .= $this->form->field($this->schedule, "{$day}[0][from][hours]", ['options' => ['class' => null]])->hiddenInput()->label(false);
            $content .= $this->form->field($this->schedule, "{$day}[0][from][minutes]", ['options' => ['class' => null]])->hiddenInput()->label(false);

            $content .= $this->form->field($this->schedule, "{$day}[0][to][hours]", ['options' => ['class' => null]])->hiddenInput()->label(false);
            $content .= $this->form->field($this->schedule, "{$day}[0][to][minutes]", ['options' => ['class' => null]])->hiddenInput()->label(false);

            $content .= $this->form->field($this->schedule, "{$day}[1][from][hours]", ['options' => ['class' => null]])->hiddenInput()->label(false);
            $content .= $this->form->field($this->schedule, "{$day}[1][from][minutes]", ['options' => ['class' => null]])->hiddenInput()->label(false);

            $content .= $this->form->field($this->schedule, "{$day}[1][to][hours]", ['options' => ['class' => null]])->hiddenInput()->label(false);
            $content .= $this->form->field($this->schedule, "{$day}[1][to][minutes]", ['options' => ['class' => null]])->hiddenInput()->label(false);
        }

        $content .= Html::endTag('div');

        return $content;
    }

    private function renderButtons()
    {
        $content = '';

        $content .= Html::beginTag('div', ['class' => 'opening-hours-block date']);
        $content .= Html::beginTag('div');

        $content .= Html::tag('button', 'пн', ['class' => 'btn', 'data-day-of-week' => 'mon']);
        $content .= Html::tag('button', 'вт', ['class' => 'btn', 'data-day-of-week' => 'tue']);
        $content .= Html::tag('button', 'ср', ['class' => 'btn', 'data-day-of-week' => 'wed']);
        $content .= Html::tag('button', 'чт', ['class' => 'btn', 'data-day-of-week' => 'thu']);
        $content .= Html::tag('button', 'пт', ['class' => 'btn', 'data-day-of-week' => 'fri']);
        $content .= Html::tag('button', 'сб', ['class' => 'btn', 'data-day-of-week' => 'sat']);
        $content .= Html::tag('button', 'вс', ['class' => 'btn', 'data-day-of-week' => 'sun']);

        $content .= Html::endTag('div');
        $content .= Html::a('ежедневно', '#', ['class' => 'dotted everyday-btn']);
        $content .= Html::endTag('div');

        return $content;
    }
}
