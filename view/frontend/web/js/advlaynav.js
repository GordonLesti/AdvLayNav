/**
 * Copyright © PART <info@part-online.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

define( [ "jquery", "mage/apply/main" , "jquery/ui" ], function( $, mage ) {
    "use strict";

    var ajaxCall = function( url ) {
        var productListBlockName = $( "#advlaynav_product_list_before" ).attr( "data-block-name" );
        var navigationBlockName = $( "#advlaynav_navigation_before" ).attr( "data-block-name" );
        var blockNameParameters = "&productListBlockName=" + productListBlockName +
            "&navigationBlockName=" + navigationBlockName;
        var ajaxUrl = url;
        if ( ajaxUrl.indexOf( "?" ) > -1 ) {
            ajaxUrl += "&advLayNavAjax=1" + blockNameParameters;
        } else {
            ajaxUrl += "?advLayNavAjax=1" + blockNameParameters;
        }
        $.ajax( {
            "url": ajaxUrl,
            dataType: "json",
            showLoader: true
        } ).done( function( data ) {
            history.pushState( {}, "", url );
            var productListContent = data[ 0 ];
            var leftNavContent = data[ 1 ];

            $( "#advlaynav_product_list_before" )
                .nextUntil( "#advlaynav_product_list_after" )
                .remove();
            $( productListContent ).insertAfter( $( "#advlaynav_product_list_before" ) );

            $( "#advlaynav_navigation_before" )
                .nextUntil( "#advlaynav_navigation_after" )
                .remove();
            $( leftNavContent ).insertAfter( $( "#advlaynav_navigation_before" ) );

            $( mage.apply );
            initAjaxNavigation();
        } );
    };

    var initAjaxNavigation = function() {
        $( "#advlaynav_navigation_before" )
            .nextUntil( "#advlaynav_navigation_after" )
            .find( "a" ).each( function() {
                var link = $( this );
                if ( link.attr( "href" ) !== "#" ) {
                    link.attr( "onclick", "return false;" );
                    var url = link.attr( "href" );
                    link.click( function() {
                        ajaxCall( url );
                    } );
                }
            } );
    }

    $.widget('part.advlaynav', {
        _create: initAjaxNavigation
    });

    return {
        "advlaynav": $.part.advlaynav,
        "ajaxCall": ajaxCall
    };
} );
