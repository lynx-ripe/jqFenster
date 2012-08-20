/**
 * Licensed under the MIT License
 * Redistributions of files must retain the copyright notice below.
 *
 * @category ThirdParty
 * @author   Kanstantsin A Kamkou (2ka.by)
 * @license  http://www.opensource.org/licenses/mit-license.php The MIT License
 * @link     https://github.com/kkamkou/jqFenster
 */

/**
 * Depends:
 *  jquery.fenster-helper.js
 *
 *  Link selectors (if we have information about link only)
 *      jQuery('.myElement').fenster().open();
 *      jQuery('.myElement').fenster().close();
 *      jQuery('.myElement').fenster({'href': 'newUri'}).reInit();
 *
 *  Owners (working in the opened popup)
 *      jQuery.fensterFinder(this).setOptions({'href': 'newUri'}).reInit();
 *
 *  Anonymous (creates popup on the fly)
 *      jQuery.fenster({'href': 'uri'}).open();
 *      jQuery.fenster('#myPopup').open();
 *      jQuery.fenster(jQuery('#myPopup')).open();
 */
(function ($) {
    "use strict";

    // the main object
    var JqFensterApi = function ($elem, options) {
        this.holder = $elem.data('jqFensterHolder') || null;
        this.element = $elem;

        // options merge
        this.setOptions(options);

        // default options correction
        if (!this.options.selector && this.element.selector) {
            this.options.selector = this.element.selector;
        }

        // dynamic object requires custom init
        if (!this.element.hasClass('jqFenster')) {
            this.element.addClass('jqFenster');
            this._init();
        }
    };

    // overloaded functions
    JqFensterApi.prototype = {
        close: function () {
            if (this.getHolder()) {
                this.getHolder().trigger('jqFensterClose');
                this.setHolder(null);
            }
            return this;
        },

        open: function () {
            return this.getHolder() ? this : this.setHolder(
                this.element.trigger('click').data('jqFensterHolder')
            );
        },

        reInit: function () {
            this.close();

            var that = this;
            setTimeout(function () {
                that._init().open();
            }, 100);

            return this;
        },

        getHolder: function () {
            return this.holder;
        },

        getAncestor: function () {
            return this.getHolder()
                ? this.getHolder().data('jqFensterAncestor') : null;
        },

        setHolder: function (obj) {
            this.holder = obj;
            return this;
        },

        setOptions: function (options) {
            this.options = $.extend(
                {'href': null, 'selector': null, 'options': null},
                options || {}
            );
            return this;
        },

        _init: function () {
            // href
            if (this.options.href !== null) {
                this.element.data('href', this.options.href);
            }

            // selector
            if (this.options.selector !== null) {
                this.element.data('selector', this.options.selector);
            }

            // data-options
            if (this.options.options) {
                this.element.data('options', this.options.options);
            }

            return this;
        }
    };

    // jQuery plugin
    $.fn.fenster = function (options) {
        return new JqFensterApi(this, options);
    };

    // helps to find/creatre the jqFenster object
    $.extend({
        // working inside opened window
        fensterFinder: function (target) {
            var $target = $(target),
                $elem = null;

            // target is link already
            if ($target.data('jqFensterHolder')) {
                return $target.fenster($target.data('options'));
            }

            // trying to find the link holder
            $elem = $target.closest('.jqFensterHolder');
            if ($elem.length) {
                return $($elem.data('jqFensterAncestor')).fenster();
            }

            return null;
        },

        // quick helper
        fenster: function (options) {
            var $elem = $('<a />', {css: {display: 'none'}}).appendTo('body');

            // quick helper for the jQuery selector
            if ($.type(options) === 'string') {
                options = {'selector': options};
            }

            // quick helper for the jQuery object
            if ($.type(options) === 'object' && options.selector) {
                options = {'selector': options.selector};
            }

            return $($elem).fenster(options);
        }
    });
}(jQuery));
