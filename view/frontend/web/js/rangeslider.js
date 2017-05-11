/**
 * Copyright © PART <info@part-online.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

define( [ "jquery", "advlaynav", "jquery/ui" ], function( $, advlaynav ) {
    "use strict";

    var createRangeSlider = function(
            minValue,
            maxValue,
            leftValue,
            rightValue,
            sliderId,
            amountId,
            valueUrl,
            removeUrl
        ) {
        $( "#" + sliderId ).slider( {
            range: true,
            min: minValue,
            max: maxValue,
            values: [ leftValue, rightValue ],
            slide: function( event, ui ) {

                $("#" + sliderId+'-input-min').val(ui.values[ 0 ]);
                $("#" + sliderId+'-input-max').val(ui.values[ 1 ]);

            },
            change: function( event, ui ) {
                var ajaxUrl;
                if ( ui.values[ 0 ] === minValue && ui.values[ 1 ] === maxValue ) {
                    ajaxUrl = removeUrl;
                } else {
                    var replace;
                    if ( ui.values[ 1 ] === maxValue ) {
                        replace = ui.values[ 0 ] + "-";
                    } else {
                        replace = ui.values[ 0 ] + "-" + ui.values[ 1 ];
                    }
                    ajaxUrl = valueUrl.replace( "option_id_placeholder", replace );
                }
                advlaynav.ajaxCall( ajaxUrl );
            }
        } );

        var fromValue = $( "#" + sliderId ).slider("values", 0 );
        var toValue = $( "#" + sliderId ).slider("values", 1);

        $("input.sliderValue").change(function() {
            $("#slider").slider("values", $this.data("index"), $this.val());
        });


        var $inputSliderFieldMin = $("#" + sliderId+'-input-min');
        var $inputSliderFieldMax = $("#" + sliderId+'-input-max');

        $inputSliderFieldMin.val(fromValue);
        $inputSliderFieldMax.val(toValue);

        $inputSliderFieldMin.change(function () {
            $( "#" + sliderId ).slider("values", 0, $(this).val());
        });

        $inputSliderFieldMax.change(function () {
            $( "#" + sliderId ).slider("values", 1, $(this).val());
        });


    };

    return createRangeSlider;
} );
