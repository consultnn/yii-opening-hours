/**
 * Created by Leksanov Artem on 06.04.15.
 */

;(function ( $, window, document, undefined ) {

    "use strict";

    var pluginName = "openingHours",
        defaults = {
            pluginClass : "opening-hours"
        };

    function Plugin ( element, options ) {
        this.element = $(element);
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.control = null;
        this.idPrefix = null;

        var control = $(this.element).find('.control').clone();
        control.find('.everyday-btn, .add-control-btn').remove();
        this.control = control;

        this.init();
    }

    $.extend(Plugin.prototype, {
        init: function() {
            var plugin = this;

            $(plugin.element).addClass(plugin.settings.pluginClass);

            this.loadDataFromHiddenInputs();

            this.element.on('click', '.btn', function(event){
                var index = $(this).index();

                if($(this).hasClass('btn-info')){
                    $(this).removeClass('btn-info');
                } else {
                    $.each(plugin.element.find('.control .btn'), function(){
                        if($(this).index() == index){
                            $(this).removeClass('btn-info');
                        }
                    });

                    $(this).addClass('btn-info');
                }

                plugin.checkAvailableTimeControls();
                plugin.fillHiddenInputs();

                plugin.changeToggle();

                return false;
            });

            this.element.on('click', '.add-control-btn', function(event){
                if (plugin.element.find(".control").length < 7) {
                    plugin.createControl();
                } else {
                    $(event.target).closest("a").hide();
                }

                plugin.changeToggle();

                return false;
            });

            this.element.on('click', '.everyday-btn', function(event){
                plugin.element.find('.btn').addClass('btn-info');
                plugin.element.find('.control:not(:first)').remove();
                plugin.checkAvailableTimeControls();

                plugin.changeToggle();

                return false;
            });

            this.element.on('click', '.remove-control-btn', function(event){
                $(this).parent('.control').remove();
                plugin.fillHiddenInputs();
                plugin.element.find(".add-control-btn").show();

                plugin.changeToggle();

                return false;
            });

            this.element.on('click', '.alltime-btn', function(event){
                var parent = $(this).parent().parent('.control');
                parent.find('.work-from-hours').val(0);
                parent.find('.work-to-hours').val(24);
                parent.find('.work-from-minutes, .work-to-minutes').val(0);

                plugin.fillHiddenInputs();

                plugin.changeToggle();

                return false;
            });

            this.element.on('click', '.timeout-btn', function(event){
                var timeOutBlock = $(this).parent().find('.timeout-block');
                timeOutBlock.toggle();

                if($(this).text() == 'перерыв') {
                    $(this).text('без перерыва');
                } else {
                    timeOutBlock.find('select').val(0);
                    timeOutBlock.find('select:eq(0)').trigger('change');
                    $(this).text('перерыв');
                }

                plugin.changeToggle();

                return false;
            });

            this.element.on('change', 'select', function(event){
                plugin.fillHiddenInputs();

                plugin.changeToggle();

                return false;
            });
        },

        changeToggle: function() {
            this.element.find('input:first').trigger('change');
        },

        fillHiddenInputs: function() {
            var idPrefix = this.idPrefix;
            this.element.find('input[type="hidden"]').val(0);

            $.each(this.element.find('.control'), function() {
                var control = $(this);

                var work_from = [control.find('.work-from-hours').val(), control.find('.work-from-minutes').val()];
                var work_to = [control.find('.work-to-hours').val(), control.find('.work-to-minutes').val()];
                var timeout_from = [control.find('.timeout-from-hours').val(), control.find('.timeout-from-minutes').val()];
                var timeout_to = [control.find('.timeout-to-hours').val(), control.find('.timeout-to-minutes').val()];

                var range1_from = work_from;
                var range1_to = timeout_from;
                var range2_from = timeout_to;
                var range2_to = work_to;

                // проверка на перерыв
                if(timeout_from[0] == 0 && timeout_to[0] == 0) {
                    range1_to = work_to;
                    range2_from = [0, 0];
                    range2_to = [0, 0];
                }

                $.each(control.find('.btn-info'), function(){
                    var dayOfWeek = $(this).data('day-of-week');

                    $('#'+idPrefix+dayOfWeek+'-0-from-hours').val(range1_from[0]);
                    $('#'+idPrefix+dayOfWeek+'-0-from-minutes').val(range1_from[1]);
                    $('#'+idPrefix+dayOfWeek+'-0-to-hours').val(range1_to[0]);
                    $('#'+idPrefix+dayOfWeek+'-0-to-minutes').val(range1_to[1]);

                    $('#'+idPrefix+dayOfWeek+'-1-from-hours').val(range2_from[0]);
                    $('#'+idPrefix+dayOfWeek+'-1-from-minutes').val(range2_from[1]);
                    $('#'+idPrefix+dayOfWeek+'-1-to-hours').val(range2_to[0]);
                    $('#'+idPrefix+dayOfWeek+'-1-to-minutes').val(range2_to[1]);
                });
            });
        },

        loadDataFromHiddenInputs: function() {
            var tempData = {};
            var element = this.element;
            var plugin = this;

            $.each(element.find('input[type="hidden"]'), function(){
                var reg = /[a-z0-9_\-]([a-z]{3})-(0|1)-(from|to)-(hours|minutes)/i;
                var matches = reg.exec($(this).attr('id'));

                //var day = matches[1].charAt(0).toUpperCase() + matches[1].slice(1)
                var day = matches[1];
                var dateType = matches[2];
                var action = matches[3];
                var numberType = matches[4] == 'minutes' ? 1 : 0;

                if(!tempData[day]){
                    tempData[day] = [
                        {'from': [], 'to': []},
                        {'from': [], 'to': []}
                    ];
                }

                tempData[day][dateType][action][numberType] = $(this).val();

                if(!plugin.idPrefix) {
                    var reg = /^([a-z0-9_\-]+-)[a-z]{3}-(0|1)-(from|to)-(hours|minutes)$/i;
                    var matches = reg.exec($(this).attr('id'));
                    plugin.idPrefix = matches[1];
                }
            });

            var displayData = [];
            for(var day in tempData) {
                var range1_from = [tempData[day][0]['from'][0], tempData[day][0]['from'][1]];
                var range1_to = [tempData[day][0]['to'][0], tempData[day][0]['to'][1]];
                var range2_from = [tempData[day][1]['from'][0], tempData[day][1]['from'][1]];
                var range2_to = [tempData[day][1]['to'][0], tempData[day][1]['to'][1]];

                if(range1_from[0] == 0 && range1_to[0] == 0) {
                    continue;
                }

                var controlData = {
                    time: '',
                    work_from: [range1_from[0], range1_from[1]],
                    work_to: [range1_to[0], range1_to[1]],
                    timeout: false,
                    timeout_from: [0, 0],
                    timeout_to: [0, 0],
                    days: [day]
                };

                if(range2_from[0] == 0 && range2_to[0] == 0) {
                    var arr = Array.prototype.concat(range1_from, range1_to, range2_from, range2_to);
                    controlData.time = arr.join('-');
                } else {
                    var arr = Array.prototype.concat(range1_from, range2_to, range1_to, range2_from);
                    controlData.time = arr.join('-');
                    controlData.work_from = [range1_from[0], range1_from[1]];
                    controlData.work_to = [range2_to[0], range2_to[1]];
                    controlData.timeout = true;
                    controlData.timeout_from = [range1_to[0], range1_to[1]];
                    controlData.timeout_to = [range2_from[0], range2_from[1]];
                }

                if(displayData.length == 0) {
                    displayData.push(controlData);
                    continue;
                }

                var same = false;
                for(var i = 0; i < displayData.length; i++) {
                    if(displayData[i].time == controlData.time) {
                        displayData[i]['days'].push(day);
                        same = true;
                        break;
                    }
                }

                if(!same) {
                    displayData.push(controlData);
                }
            }

            for(var i = 0; i < displayData.length; i++) {
                var control = element.find('.control:eq('+i+')');
                if(!control.length) {
                    control = this.createControl();
                }

                var days = displayData[i]['days'];
                for(var j = 0; j < days.length; j++) {
                    control.find('.btn[data-day-of-week="'+displayData[i]['days'][j]+'"]').addClass('btn-info');
                }

                control.find('.work-from-hours').val(displayData[i]['work_from'][0]);
                control.find('.work-from-minutes').val(displayData[i]['work_from'][1]);
                control.find('.work-to-hours').val(displayData[i]['work_to'][0]);
                control.find('.work-to-minutes').val(displayData[i]['work_to'][1]);

                control.find('.timeout-from-hours').val(displayData[i]['timeout_from'][0]);
                control.find('.timeout-from-minutes').val(displayData[i]['timeout_from'][1]);
                control.find('.timeout-to-hours').val(displayData[i]['timeout_to'][0]);
                control.find('.timeout-to-minutes').val(displayData[i]['timeout_to'][1]);

                if(displayData[i]['timeout']) {
                    control.find('.timeout-block').show();
                    control.find('.timeout-btn').text('без перерыва')
                }
            }

            plugin.checkAvailableTimeControls();
        },

        /**
         * Если ни один день недели не выбран, убирает возможность выбрать время. И наоборот
         */
        checkAvailableTimeControls: function(){
            $.each(this.element.find('.control'), function(){
                var shirma = $(this).find('.shirma');
                if($(this).find('.btn-info').length){
                    shirma.hide();
                } else {
                    shirma.show();
                }
            });

            this.fillHiddenInputs();
        },

        createControl: function() {
            var control = this.control.clone();
            $('<a href="#" class="link remove-control-btn"><span class="glyphicon glyphicon-remove-circle"></span></a>').insertAfter(control.find('.opening-hours-block.time'));

            control.find('.shirma').show();

            this.element.append(control);

            return control;
        }
    });

    $.fn[ pluginName ] = function ( options ) {
        return this.each(function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
            }
        });
    };

})( jQuery, window, document );